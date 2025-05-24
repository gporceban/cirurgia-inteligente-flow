
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock, Play, Pause, Settings } from 'lucide-react';
import { OpenAIService, SurgicalWorkflowPayload } from '@/services/openai';
import { toast } from '@/hooks/use-toast';

interface WorkflowStep {
  id: string;
  agent: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'paused';
  result?: any;
  error?: string;
  duration?: number;
}

interface WorkflowExecution {
  id: string;
  patientName: string;
  procedure: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'error';
  progress: number;
  steps: WorkflowStep[];
  startTime: Date;
  endTime?: Date;
  payload: SurgicalWorkflowPayload;
}

export const AIWorkflowOrchestrator: React.FC = () => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);

  const defaultSteps: Omit<WorkflowStep, 'id'>[] = [
    { agent: 'ClinicalAnalyst', name: 'Análise Clínica', status: 'pending' },
    { agent: 'ANSSubmissionAgent', name: 'Preparação ANS', status: 'pending' },
    { agent: 'SchedulingAgent', name: 'Agendamento', status: 'pending' },
    { agent: 'PatientCommunicationAgent', name: 'Comunicação Paciente', status: 'pending' },
  ];

  const startWorkflow = async (patientData: any) => {
    if (!isConfigured) {
      toast({
        title: 'Configuração Necessária',
        description: 'Configure a chave da API OpenAI primeiro.',
        variant: 'destructive',
      });
      return;
    }

    const executionId = `WF-${Date.now()}`;
    const steps: WorkflowStep[] = defaultSteps.map((step, index) => ({
      ...step,
      id: `${executionId}-${index}`,
    }));

    const payload: SurgicalWorkflowPayload = {
      prompt: `Processar solicitação cirúrgica para ${patientData.name}`,
      patientData: patientData,
      template: {
        language: 'pt-BR',
        format: 'medical_report',
      },
      scratch: {},
    };

    const execution: WorkflowExecution = {
      id: executionId,
      patientName: patientData.name,
      procedure: patientData.procedure,
      status: 'running',
      progress: 0,
      steps,
      startTime: new Date(),
      payload,
    };

    setExecutions(prev => [...prev, execution]);

    // Execute workflow
    await executeWorkflowSteps(execution);
  };

  const executeWorkflowSteps = async (execution: WorkflowExecution) => {
    const openaiService = new OpenAIService(openaiApiKey);
    let previousResponseId: string | undefined;
    let currentPayload = { ...execution.payload };

    for (let i = 0; i < execution.steps.length; i++) {
      const step = execution.steps[i];
      
      // Update step status to running
      updateStepStatus(execution.id, step.id, 'running');
      
      try {
        const startTime = Date.now();
        
        const response = await openaiService.executeSurgicalAgent(
          step.agent,
          currentPayload,
          previousResponseId
        );

        const duration = Date.now() - startTime;
        
        // Update payload with agent results
        if (response.output_text) {
          try {
            const agentResult = JSON.parse(response.output_text);
            currentPayload = agentResult;
          } catch (e) {
            console.warn('Failed to parse agent response as JSON:', e);
          }
        }

        updateStepStatus(execution.id, step.id, 'completed', {
          result: response,
          duration,
        });

        previousResponseId = response.id;
        
        // Update overall progress
        const progress = ((i + 1) / execution.steps.length) * 100;
        updateExecutionProgress(execution.id, progress);

        // Small delay between steps for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error in step ${step.name}:`, error);
        updateStepStatus(execution.id, step.id, 'error', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        updateExecutionStatus(execution.id, 'error');
        break;
      }
    }

    // Mark workflow as completed if all steps succeeded
    const completedSteps = execution.steps.filter(s => s.status === 'completed').length;
    if (completedSteps === execution.steps.length) {
      updateExecutionStatus(execution.id, 'completed');
      
      toast({
        title: 'Workflow Concluído',
        description: `Processamento para ${execution.patientName} finalizado com sucesso.`,
      });
    }
  };

  const updateStepStatus = (
    executionId: string, 
    stepId: string, 
    status: WorkflowStep['status'],
    extra?: { result?: any; error?: string; duration?: number }
  ) => {
    setExecutions(prev => prev.map(exec => {
      if (exec.id === executionId) {
        return {
          ...exec,
          steps: exec.steps.map(step => {
            if (step.id === stepId) {
              return { ...step, status, ...extra };
            }
            return step;
          }),
        };
      }
      return exec;
    }));
  };

  const updateExecutionProgress = (executionId: string, progress: number) => {
    setExecutions(prev => prev.map(exec => 
      exec.id === executionId ? { ...exec, progress } : exec
    ));
  };

  const updateExecutionStatus = (executionId: string, status: WorkflowExecution['status']) => {
    setExecutions(prev => prev.map(exec => 
      exec.id === executionId 
        ? { ...exec, status, endTime: status === 'completed' ? new Date() : undefined } 
        : exec
    ));
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running':
        return <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: WorkflowExecution['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Demo data for testing
  const demoPatientData = {
    name: 'Maria Santos',
    procedure: 'Artrodese L4-L5',
    clinicalNotes: 'Dor lombar crônica, estenose foraminal bilateral L4-L5, falha no tratamento conservador.',
    demographics: {
      age: 65,
      gender: 'F',
      insurance: 'Unimed',
      phone: '(11) 99999-9999'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Workflow Orchestrator</h2>
          <p className="text-gray-600">Orquestração automática com agentes OpenAI</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isConfigured && (
            <div className="flex items-center space-x-2">
              <input
                type="password"
                placeholder="OpenAI API Key"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              />
              <Button
                onClick={() => setIsConfigured(!!openaiApiKey)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>
            </div>
          )}
          
          <Button
            onClick={() => startWorkflow(demoPatientData)}
            disabled={!isConfigured}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Workflow Demo
          </Button>
        </div>
      </div>

      {executions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum workflow ativo. Configure a API OpenAI e inicie um workflow de demonstração.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {executions.map((execution) => (
        <Card key={execution.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-lg">{execution.patientName}</CardTitle>
                <Badge variant="outline">{execution.id}</Badge>
                <Badge className={getStatusColor(execution.status)}>
                  {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                Iniciado: {execution.startTime.toLocaleTimeString('pt-BR')}
              </div>
            </div>
            <CardDescription>
              {execution.procedure}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progresso Geral</span>
                  <span>{Math.round(execution.progress)}%</span>
                </div>
                <Progress value={execution.progress} className="h-2" />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Etapas do Workflow</h4>
                {execution.steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      step.status === 'running' ? 'bg-blue-50 border-blue-200' : 
                      step.status === 'error' ? 'bg-red-50 border-red-200' :
                      step.status === 'completed' ? 'bg-green-50 border-green-200' :
                      'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getStepIcon(step.status)}
                      <div>
                        <span className="font-medium">{step.name}</span>
                        <div className="text-xs text-gray-500">{step.agent}</div>
                      </div>
                      {step.error && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {step.duration ? `${step.duration}ms` : 
                       step.status === 'running' ? 'Executando...' :
                       step.status === 'error' ? 'Erro' : 'Pendente'}
                    </div>
                  </div>
                ))}
              </div>

              {execution.status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Erro no Workflow</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    Verifique as configurações da API e tente novamente.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
