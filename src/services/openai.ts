
export interface OpenAIMessage {
  role: 'developer' | 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; image_url?: string }>;
}

export interface OpenAITool {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
    additionalProperties: boolean;
  };
  strict?: boolean;
}

export interface OpenAIResponsePayload {
  model: string;
  input: string | OpenAIMessage[];
  instructions?: string;
  tools?: OpenAITool[];
  tool_choice?: string | object;
  response_format?: { type: 'text' | 'json_object' | 'json_schema'; schema?: any };
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  previous_response_id?: string;
  metadata?: Record<string, any>;
}

export interface SurgicalWorkflowPayload {
  prompt: string;
  patientData: {
    name: string;
    procedure: string;
    clinicalNotes: string;
    demographics: Record<string, any>;
  };
  template: {
    language: 'pt-BR';
    format: 'medical_report' | 'ans_submission' | 'patient_communication';
  };
  scratch: Record<string, any>;
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createResponse(payload: OpenAIResponsePayload): Promise<any> {
    console.log('OpenAI Request:', payload);
    
    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('OpenAI Response:', result);
    return result;
  }

  async executeSurgicalAgent(
    agentRole: string,
    workflowData: SurgicalWorkflowPayload,
    previousResponseId?: string
  ): Promise<any> {
    const systemInstructions = this.getAgentInstructions(agentRole);
    
    // Format the workflow data as proper input messages
    const inputMessages: OpenAIMessage[] = [
      {
        role: 'user',
        content: JSON.stringify(workflowData)
      }
    ];
    
    const payload: OpenAIResponsePayload = {
      model: 'gpt-4.1',
      instructions: systemInstructions,
      input: inputMessages,
      response_format: { type: 'json_object' },
      temperature: 0.3,
      tools: this.getAgentTools(agentRole),
      previous_response_id: previousResponseId,
    };

    return this.createResponse(payload);
  }

  private getAgentInstructions(agentRole: string): string {
    const baseInstructions = `
Você é ${agentRole} no sistema de automação cirúrgica. 
Leia input.patientData e input.template. 
Grave APENAS em input.scratch.${agentRole}.
Não altere dados de outros agentes.
Retorne o JSON COMPLETO de input.
Responda sempre em português brasileiro.
`;

    switch (agentRole) {
      case 'ClinicalAnalyst':
        return baseInstructions + `
Analise dados clínicos e gere relatório médico estruturado.
Identifique indicações cirúrgicas, contraindicações e riscos.
Formate conforme padrões ANS/CFM.
`;
      
      case 'ANSSubmissionAgent':
        return baseInstructions + `
Prepare documentação para submissão ANS.
Valide campos obrigatórios, códigos TUSS, justificativas técnicas.
Gere formulários preenchidos e timeline de aprovação.
`;
      
      case 'SchedulingAgent':
        return baseInstructions + `
Coordene agendamento de sala cirúrgica e recursos.
Considere disponibilidade, urgência, duração estimada.
Gere eventos de calendário e notificações.
`;
      
      case 'PatientCommunicationAgent':
        return baseInstructions + `
Gere comunicações personalizadas para pacientes.
Inclua orientações pré/pós-operatórias, consentimentos, lembretes.
Adapte linguagem para nível de compreensão do paciente.
`;
      
      default:
        return baseInstructions;
    }
  }

  private getAgentTools(agentRole: string): OpenAITool[] {
    const commonTools: OpenAITool[] = [
      {
        type: 'function',
        name: 'calculate_timeline',
        description: 'Calcula timeline de procedimento cirúrgico',
        parameters: {
          type: 'object',
          properties: {
            procedure_type: { type: 'string' },
            urgency_level: { type: 'string', enum: ['baixa', 'media', 'alta', 'emergencia'] },
            estimated_duration: { type: 'number' }
          },
          required: ['procedure_type', 'urgency_level'],
          additionalProperties: false
        },
        strict: true
      }
    ];

    switch (agentRole) {
      case 'ClinicalAnalyst':
        return [
          ...commonTools,
          {
            type: 'function',
            name: 'validate_clinical_criteria',
            description: 'Valida critérios clínicos para indicação cirúrgica',
            parameters: {
              type: 'object',
              properties: {
                symptoms: { type: 'array', items: { type: 'string' } },
                exam_results: { type: 'object' },
                contraindications: { type: 'array', items: { type: 'string' } }
              },
              required: ['symptoms'],
              additionalProperties: false
            },
            strict: true
          }
        ];
      
      case 'ANSSubmissionAgent':
        return [
          ...commonTools,
          {
            type: 'function',
            name: 'generate_ans_code',
            description: 'Gera código TUSS apropriado para procedimento',
            parameters: {
              type: 'object',
              properties: {
                procedure_name: { type: 'string' },
                body_region: { type: 'string' },
                complexity: { type: 'string', enum: ['baixa', 'media', 'alta'] }
              },
              required: ['procedure_name'],
              additionalProperties: false
            },
            strict: true
          }
        ];
      
      default:
        return commonTools;
    }
  }
}
