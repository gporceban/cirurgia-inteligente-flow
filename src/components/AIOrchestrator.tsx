
import React from 'react';
import { AIWorkflowOrchestrator } from './AIWorkflowOrchestrator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const AIOrchestrator = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">IA Orquestrador</h1>
        <p className="text-gray-600 mt-1">Automação inteligente com OpenAI Response API</p>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflows Ativos</TabsTrigger>
          <TabsTrigger value="templates">Templates de Agentes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <AIWorkflowOrchestrator />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Clinical Analyst Agent',
                description: 'Analisa dados clínicos e gera relatórios médicos estruturados',
                tools: ['validate_clinical_criteria', 'calculate_timeline'],
                model: 'gpt-4.1',
                temperature: 0.3
              },
              {
                name: 'ANS Submission Agent',
                description: 'Prepara documentação para submissão ANS com códigos TUSS',
                tools: ['generate_ans_code', 'calculate_timeline'],
                model: 'gpt-4.1',
                temperature: 0.1
              },
              {
                name: 'Scheduling Agent',
                description: 'Coordena agendamento de salas e recursos cirúrgicos',
                tools: ['calculate_timeline', 'check_availability'],
                model: 'gpt-4.1',
                temperature: 0.2
              },
              {
                name: 'Patient Communication Agent',
                description: 'Gera comunicações personalizadas para pacientes',
                tools: ['generate_message', 'format_instructions'],
                model: 'gpt-4.1',
                temperature: 0.7
              }
            ].map((agent, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{agent.name}</span>
                    <Badge variant="outline">{agent.model}</Badge>
                  </CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Tools:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.tools.map((tool) => (
                          <Badge key={tool} variant="secondary" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Temperature: {agent.temperature}</span>
                      <span>JSON Mode: ✓</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Editar Configuração
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
                <CardTitle>Performance dos Agentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Taxa de Sucesso</span>
                    <span className="font-bold text-green-600">98.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tempo Médio por Agente</span>
                    <span className="font-bold">2.3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tokens Utilizados (hoje)</span>
                    <span className="font-bold text-blue-600">45.2K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Workflows Concluídos</span>
                    <span className="font-bold">127</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>OpenAI Response API</span>
                    </span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Agent Orchestrator</span>
                    </span>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span>Workflow Queue</span>
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">3 na fila</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span>Rate Limiting</span>
                    </span>
                    <Badge className="bg-orange-100 text-orange-800">45/min</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Logs Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                <div className="text-green-600">[2024-01-24 14:32:15] ✓ ClinicalAnalyst completed for Maria Santos (1.2s)</div>
                <div className="text-blue-600">[2024-01-24 14:32:14] → ANSSubmissionAgent started for Maria Santos</div>
                <div className="text-green-600">[2024-01-24 14:32:12] ✓ Workflow WF-001 initiated successfully</div>
                <div className="text-yellow-600">[2024-01-24 14:31:58] ⚠ Rate limit warning: 85% of quota used</div>
                <div className="text-gray-600">[2024-01-24 14:31:45] ℹ OpenAI connection established</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
