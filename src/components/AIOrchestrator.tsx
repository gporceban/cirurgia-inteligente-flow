
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AIOrchestrator = () => {
  const [activeWorkflows] = useState([
    {
      id: 'WF-001',
      patient: 'Maria Santos',
      procedure: 'Artrodese L4-L5',
      status: 'executando',
      progress: 65,
      currentStep: 'Aguardando Autorização ANS',
      steps: [
        { name: 'Geração de Relatório', status: 'concluido', duration: '2 min' },
        { name: 'Submissão ANS', status: 'executando', duration: '45 min' },
        { name: 'Reserva de Sala', status: 'pendente', duration: 'Est. 15 min' },
        { name: 'Exames Pré-op', status: 'pendente', duration: 'Est. 3 dias' },
        { name: 'Comunicação Paciente', status: 'pendente', duration: 'Est. 5 min' }
      ]
    },
    {
      id: 'WF-002',
      patient: 'Carlos Oliveira',
      procedure: 'Descompressão Cervical',
      status: 'pausado',
      progress: 30,
      currentStep: 'Aguardando Aprovação Médica',
      steps: [
        { name: 'Geração de Relatório', status: 'concluido', duration: '3 min' },
        { name: 'Análise de Risco', status: 'pausado', duration: 'Pausado' },
        { name: 'Submissão ANS', status: 'pendente', duration: 'Est. 45 min' },
        { name: 'Reserva de Sala', status: 'pendente', duration: 'Est. 15 min' },
        { name: 'Comunicação Paciente', status: 'pendente', duration: 'Est. 5 min' }
      ]
    }
  ]);

  const handleWorkflowAction = (action: string, workflowId: string) => {
    toast({
      title: `Workflow ${action}`,
      description: `Ação executada para workflow ${workflowId}`,
    });
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'executando':
        return <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />;
      case 'pausado':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executando':
        return 'bg-blue-100 text-blue-800';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">IA Orquestrador</h1>
        <p className="text-gray-600 mt-1">Gerencie workflows automatizados com supervisão humana</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Workflows Ativos</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeWorkflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg">{workflow.patient}</CardTitle>
                    <Badge variant="outline">{workflow.id}</Badge>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWorkflowAction('pausar', workflow.id)}
                    >
                      <Pause className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWorkflowAction('reiniciar', workflow.id)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleWorkflowAction('executar', workflow.id)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {workflow.procedure} - {workflow.currentStep}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progresso Geral</span>
                      <span>{workflow.progress}%</span>
                    </div>
                    <Progress value={workflow.progress} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Etapas do Workflow</h4>
                    {workflow.steps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          step.status === 'executando' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {getStepIcon(step.status)}
                          <span className="font-medium">{step.name}</span>
                          {step.status === 'pausado' && (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {step.duration}
                        </div>
                      </div>
                    ))}
                  </div>

                  {workflow.status === 'pausado' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Ação Necessária</span>
                      </div>
                      <p className="text-yellow-700 text-sm mt-1">
                        Workflow pausado: aguardando aprovação médica para procedimento de alto risco.
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Aprovar
                        </Button>
                        <Button size="sm" variant="outline">
                          Solicitar Revisão
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Cirurgia Eletiva Padrão',
                description: 'Workflow completo para procedimentos eletivos',
                steps: 7,
                avgTime: '5-8 dias'
              },
              {
                name: 'Procedimento de Urgência',
                description: 'Fluxo acelerado para casos urgentes',
                steps: 5,
                avgTime: '6-12 horas'
              },
              {
                name: 'Cirurgia Ambulatorial',
                description: 'Fluxo simplificado para day-hospital',
                steps: 4,
                avgTime: '1-2 dias'
              }
            ].map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Etapas:</span>
                      <span className="font-medium">{template.steps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo médio:</span>
                      <span className="font-medium">{template.avgTime}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Usar Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Taxa de Conclusão</span>
                    <span className="font-bold text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tempo Médio</span>
                    <span className="font-bold">6.2 dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Intervenções Manuais</span>
                    <span className="font-bold text-yellow-600">12.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Economia de Tempo</span>
                    <span className="font-bold text-blue-600">73%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gargalos Identificados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-900">Autorização ANS</p>
                    <p className="text-sm text-red-700">Média: 3.2 dias (acima do esperado)</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-900">Agendamento de Sala</p>
                    <p className="text-sm text-yellow-700">Disponibilidade limitada às sextas</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Exames Pré-op</p>
                    <p className="text-sm text-blue-700">Potencial para paralelização</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
