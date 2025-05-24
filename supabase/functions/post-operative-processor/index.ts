
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PostOperativeAnalysis {
  surgery_summary: string;
  recommendations: string;
  technical_details: {
    procedure_type: string;
    duration: string;
    complications: string[];
    anesthesia_type: string;
    surgeon: string;
    assistant_surgeon?: string;
    instruments_used: string[];
    blood_loss: string;
    closure_method: string;
  };
  reminders: Array<{
    title: string;
    description: string;
    category: 'medication' | 'activity' | 'diet' | 'wound_care' | 'warning_signs';
  }>;
  follow_up_schedule: Array<{
    days_after_surgery: number;
    follow_up_type: 'phone_call' | 'video_call' | 'in_person' | 'message';
    notes: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { reportText, surgicalRequestId, reportUrl } = await req.json()
    console.log('Processing post-operative report for request:', surgicalRequestId)

    // Get surgical request details
    const { data: surgicalRequest, error: requestError } = await supabaseClient
      .from('surgical_requests')
      .select('*')
      .eq('id', surgicalRequestId)
      .single()

    if (requestError) {
      throw new Error(`Failed to fetch surgical request: ${requestError.message}`)
    }

    // Call OpenAI to analyze the surgery report
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de relatórios cirúrgicos pós-operatórios. 
            Analise o relatório cirúrgico fornecido e extraia:
            1. Resumo da cirurgia (máximo 300 palavras)
            2. Recomendações pós-operatórias detalhadas
            3. Detalhes técnicos estruturados
            4. Lista de lembretes/orientações para o paciente
            5. Cronograma de acompanhamento para o médico
            
            Responda APENAS em formato JSON válido seguindo a estrutura especificada.`
          },
          {
            role: 'user',
            content: `Analise este relatório cirúrgico:
            
            Paciente: ${surgicalRequest.patient_name}
            Procedimento: ${surgicalRequest.procedure_name}
            
            Relatório:
            ${reportText}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiResult = await openaiResponse.json()
    const analysis: PostOperativeAnalysis = JSON.parse(openaiResult.choices[0].message.content)

    console.log('OpenAI analysis completed')

    // Create post-operative report
    const { data: postOpReport, error: reportCreateError } = await supabaseClient
      .from('post_operative_reports')
      .insert({
        surgical_request_id: surgicalRequestId,
        doctor_id: surgicalRequest.doctor_id,
        patient_id: surgicalRequest.patient_id,
        original_report_url: reportUrl,
        surgery_summary: analysis.surgery_summary,
        recommendations: analysis.recommendations,
        technical_details: analysis.technical_details,
      })
      .select()
      .single()

    if (reportCreateError) {
      throw new Error(`Failed to create post-operative report: ${reportCreateError.message}`)
    }

    // Create reminders
    const remindersToInsert = analysis.reminders.map(reminder => ({
      report_id: postOpReport.id,
      title: reminder.title,
      description: reminder.description,
      category: reminder.category,
    }))

    const { error: remindersError } = await supabaseClient
      .from('post_operative_reminders')
      .insert(remindersToInsert)

    if (remindersError) {
      console.error('Error creating reminders:', remindersError)
    }

    // Create follow-up schedule
    const surgeryDate = new Date(surgicalRequest.surgery_completed_at || surgicalRequest.created_at)
    const followUpSchedule = analysis.follow_up_schedule.map(followUp => {
      const scheduledDate = new Date(surgeryDate)
      scheduledDate.setDate(scheduledDate.getDate() + followUp.days_after_surgery)
      
      return {
        report_id: postOpReport.id,
        doctor_id: surgicalRequest.doctor_id,
        patient_id: surgicalRequest.patient_id,
        scheduled_date: scheduledDate.toISOString().split('T')[0],
        follow_up_type: followUp.follow_up_type,
        notes: followUp.notes,
      }
    })

    const { error: scheduleError } = await supabaseClient
      .from('doctor_follow_up_schedule')
      .insert(followUpSchedule)

    if (scheduleError) {
      console.error('Error creating follow-up schedule:', scheduleError)
    }

    // Update surgical request status
    await supabaseClient
      .from('surgical_requests')
      .update({ status: 'pos_operatorio' })
      .eq('id', surgicalRequestId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        reportId: postOpReport.id,
        message: 'Relatório pós-operatório processado com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in post-operative processor:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
