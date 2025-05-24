
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SurgicalAgentRequest {
  assessmentData: {
    patient_name: string;
    patient_cpf?: string;
    patient_health_plan?: string;
    clinical_note: string;
    patient_email?: string;
  };
  procedureData: {
    procedure_name: string;
    urgency_level: string;
    icd10_code?: string;
    procedure_codes?: string[];
  };
  doctorData: {
    doctor_name: string;
    specialty: string;
    crm: string;
    clinic_address?: string;
    clinic_phone?: string;
    clinic_email?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const requestData: SurgicalAgentRequest = await req.json();
    console.log('Processing surgical agent request:', requestData);

    const systemPrompt = `Você é um agente especializado em gerar relatórios médicos cirúrgicos formatados conforme padrões brasileiros.

FUNÇÃO: Você é a etapa final do processo e deve refinar e montar o que recebeu dos outros agentes, revisando e adicionando códigos como TUSS, OPME e CID-10.

FORMATO DE SAÍDA OBRIGATÓRIO:
- RELATÓRIO MÉDICO com cabeçalho do médico
- Dados do paciente (nome, convênio, carteirinha, CPF)
- Descrição clínica detalhada do caso
- CID-10 apropriado
- PROCEDIMENTOS com códigos TUSS corretos
- MATERIAL OPME (se aplicável)
- EMPRESAS fornecedoras (BIOIMPORTS, QUALIMEDIC, UP SURGICAL, etc.)
- Data e assinatura do médico

INSTRUÇÕES:
1. Use dados reais fornecidos no input
2. Gere códigos TUSS precisos para os procedimentos
3. Identifique materiais OPME necessários
4. Formate como documento médico profissional
5. Mantenha linguagem técnica médica apropriada
6. Inclua justificativa clínica detalhada

Retorne APENAS um JSON com a estrutura:
{
  "medical_report": "texto completo do relatório formatado",
  "procedure_codes": ["código1", "código2"],
  "icd10_code": "M50.1",
  "opme_materials": [{"name": "material", "quantity": 1}],
  "opme_companies": ["empresa1", "empresa2"],
  "clinical_summary": "resumo clínico"
}`;

    const assistantContent = `Dados coletados:

DADOS DEMOGRÁFICOS E PESSOAIS:
- Paciente: ${requestData.assessmentData.patient_name}
- CPF: ${requestData.assessmentData.patient_cpf || 'Não informado'}
- Convênio: ${requestData.assessmentData.patient_health_plan || 'Não informado'}
- Email: ${requestData.assessmentData.patient_email || 'Não informado'}

DADOS CLÍNICOS:
${requestData.assessmentData.clinical_note}

PROCEDIMENTO INDICADO:
- Procedimento: ${requestData.procedureData.procedure_name}
- Urgência: ${requestData.procedureData.urgency_level}
- CID-10: ${requestData.procedureData.icd10_code || 'A ser determinado'}

DADOS DO MÉDICO:
- Dr. ${requestData.doctorData.doctor_name}
- Especialidade: ${requestData.doctorData.specialty}
- CRM: ${requestData.doctorData.crm}
- Endereço: ${requestData.doctorData.clinic_address || 'Não informado'}
- Telefone: ${requestData.doctorData.clinic_phone || 'Não informado'}
- Email: ${requestData.doctorData.clinic_email || 'Não informado'}

RELATÓRIO CLÍNICO GERADO:
Com base nos dados de avaliação e imagens, foi identificada a necessidade de intervenção cirúrgica conforme indicação médica. O paciente apresenta quadro clínico que justifica o procedimento proposto, considerando os fatores de risco e benefícios da intervenção.`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            "role": "system",
            "content": [
              {
                "type": "input_text",
                "text": systemPrompt
              }
            ]
          },
          {
            "role": "assistant",
            "content": [
              {
                "type": "output_text",
                "text": assistantContent
              }
            ]
          }
        ],
        response_format: {
          "type": "json_object"
        },
        tools: [
          {
            "type": "file_search",
            "vector_store_ids": [
              "vs_t0O3XMC4hseWMaauqFM4H3oW"
            ]
          },
          {
            "type": "web_search_preview",
            "user_location": {
              "city": "São Paulo",
              "type": "approximate",
              "region": "São Paulo",
              "country": "BR"
            },
            "search_context_size": "high"
          }
        ],
        tool_choice: "required",
        temperature: 0.2,
        max_output_tokens: 15806,
        top_p: 1,
        store: true
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('OpenAI Response:', result);

    // Extract the generated content
    let generatedContent;
    try {
      if (result.output && result.output.content) {
        generatedContent = JSON.parse(result.output.content);
      } else if (result.choices && result.choices[0] && result.choices[0].message) {
        generatedContent = JSON.parse(result.choices[0].message.content);
      } else {
        throw new Error('Unexpected response format from OpenAI');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse OpenAI response');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: generatedContent
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in OpenAI surgical agent:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
