
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { patientText, requestType } = await req.json()
    console.log('Processing surgical request:', { requestType, textLength: patientText?.length })

    if (!patientText) {
      throw new Error('Patient information text is required')
    }

    // Extract patient data and procedure information using OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente médico especializado em extrair informações de fichas de pacientes e criar solicitações cirúrgicas. 

Analise o texto fornecido e extraia as seguintes informações em formato JSON:
{
  "prontuario_id": "número do prontuário",
  "patient_name": "nome completo do paciente",
  "patient_email": "email do paciente se disponível",
  "patient_cpf": "CPF do paciente se disponível", 
  "patient_phone": "telefone do paciente se disponível",
  "patient_health_plan": "convênio/plano de saúde",
  "procedure_name": "nome do procedimento cirúrgico indicado (se mencionado)",
  "clinical_indication": "indicação clínica para cirurgia baseada nas informações disponíveis",
  "urgency_level": "eletiva, urgente ou emergencia - baseado no contexto",
  "icd10_code": "código CID-10 apropriado se possível determinar",
  "medical_report": "resumo médico formatado das informações do paciente"
}

Se alguma informação não estiver disponível, use null. Para procedure_name e clinical_indication, se não estiverem explícitos, sugira baseado no contexto médico.`
          },
          {
            role: 'user',
            content: patientText
          }
        ],
        temperature: 0.2
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`)
    }

    const aiResult = await openAIResponse.json()
    console.log('OpenAI response:', aiResult)

    let extractedData
    try {
      extractedData = JSON.parse(aiResult.choices[0].message.content)
    } catch (e) {
      throw new Error('Failed to parse AI response as JSON')
    }

    // Get current user (doctor)
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Authentication required')
    }

    // Try to find existing assessment by prontuario_id
    let assessmentId = null
    if (extractedData.prontuario_id) {
      const { data: assessment } = await supabaseClient
        .from('patient_assessments')
        .select('id')
        .eq('prontuario_id', extractedData.prontuario_id)
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (assessment) {
        assessmentId = assessment.id
      }
    }

    // If no assessment found by prontuario_id, try by email
    if (!assessmentId && extractedData.patient_email) {
      const { data: assessment } = await supabaseClient
        .from('patient_assessments')
        .select('id')
        .eq('patient_email', extractedData.patient_email)
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (assessment) {
        assessmentId = assessment.id
      }
    }

    // Create surgical request
    const { data: surgicalRequest, error: createError } = await supabaseClient
      .from('surgical_requests')
      .insert({
        assessment_id: assessmentId, // This can be null initially
        patient_id: user.id, // Using doctor_id as patient_id as per your schema
        doctor_id: user.id,
        procedure_name: extractedData.procedure_name || 'Procedimento a definir',
        clinical_indication: extractedData.clinical_indication || 'Indicação clínica a ser avaliada',
        patient_name: extractedData.patient_name,
        patient_email: extractedData.patient_email,
        patient_cpf: extractedData.patient_cpf,
        patient_phone: extractedData.patient_phone,
        patient_health_plan: extractedData.patient_health_plan,
        urgency_level: extractedData.urgency_level || 'eletiva',
        icd10_code: extractedData.icd10_code || '',
        medical_report: extractedData.medical_report,
        status: 'rascunho'
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating surgical request:', createError)
      throw createError
    }

    console.log('Surgical request created successfully:', surgicalRequest.id)

    return new Response(
      JSON.stringify({ 
        success: true,
        surgicalRequest,
        linkedAssessment: !!assessmentId,
        message: assessmentId ? 
          'Solicitação cirúrgica criada e vinculada ao prontuário existente' : 
          'Solicitação cirúrgica criada (prontuário não encontrado na base)'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    )

  } catch (error) {
    console.error('Error in surgical-request-processor:', error)
    
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
