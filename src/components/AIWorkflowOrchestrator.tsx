
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RefreshCw, CheckCircle, AlertCircle, Clock, Brain } from 'lucide-react';

export const AIWorkflowOrchestrator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const workflowSteps = [
    {
      id: 1,
      name: 'Análise Inicial',
      status: 'completed',
      description: 'Avaliação dos dados do paciente'
    },
    {
      id: 2,
      name: 'Validação Clínica',
      status: 'running',
      description: 'Verificação dos protocolos médicos'
    },
    {
      id: 3,
      name: 'Geração de Relatório',
      status: 'pending',
      description: 'Criação do relatório cirúrgico'
    },
    {
      id: 4,
      name: 'Aprovação Final',
      status: 'pending',
      description: 'Revisão e aprovação do documento'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    // Simulate workflow progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleStop = () => {
    setIsRunning(false);
    setProgress(0);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-light text-gray-900">Orquestrador de IA</h1>
        <p className="text-gray-500">Automação inteligente de processos cirúrgicos</p>
      </div>

      {/* Control Panel */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span>Controle do Workflow</span>
          </CardTitle>
          <CardDescription>
            Gerencie a execução automatizada dos processos de análise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-medium">Status do Sistema</h3>
              <div className="flex items-center space-x-2">
                {isRunning ? (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Executando
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                    Parado
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  {progress}% completo
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleStart}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar
              </Button>
              <Button
                onClick={handleStop}
                variant="outline"
                disabled={!isRunning}
              >
                <Pause className="w-4 h-4 mr-2" />
                Parar
              </Button>
            </div>
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Etapas do Workflow</CardTitle>
          <CardDescription>
            Acompanhe o progresso de cada etapa do processo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(step.status)}
                </div>
                
                <div className="flex-grow space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {step.id}. {step.name}
                    </h3>
                    <Badge className={getStatusColor(step.status)}>
                      {step.status === 'completed' && 'Concluído'}
                      {step.status === 'running' && 'Executando'}
                      {step.status === 'pending' && 'Pendente'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Agents Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Agente Demográfico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Ativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Última execução</span>
                <span className="text-sm text-gray-500">2 min atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Agente Clínico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Executando
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Última execução</span>
                <span className="text-sm text-gray-500">agora</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Agente Final</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                  Aguardando
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Última execução</span>
                <span className="text-sm text-gray-500">5 min atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
