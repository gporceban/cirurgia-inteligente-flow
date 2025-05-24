
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, Users } from 'lucide-react';

export const SurgicalDashboard = () => {
  const [activeRequests] = useState([
    {
      id: 'SR-2024-001',
      patient: 'Maria Santos',
      procedure: 'Artrodese L4-L5',
      status: 'Aguardando Autorização ANS',
      priority: 'Alta',
      progress: 65,
      scheduledDate: '2024-06-15',
      surgeon: 'Dr. João Silva'
    },
    {
      id: 'SR-2024-002',
      patient: 'Carlos Oliveira',
      procedure: 'Descompressão Cervical C5-C6',
      status: 'Pré-operatório em Andamento',
      priority: 'Média',
      progress: 80,
      scheduledDate: '2024-06-20',
      surgeon: 'Dr. Ana Costa'
    },
    {
      id: 'SR-2024-003',
      patient: 'Roberto Lima',
      procedure: 'Correção Escoliose T10-L2',
      status: 'Aguardando Sala Cirúrgica',
      priority: 'Alta',
      progress: 40,
      scheduledDate: '2024-06-25',
      surgeon: 'Dr. João Silva'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aguardando Autorização ANS': return 'bg-yellow-100 text-yellow-800';
      case 'Pré-operatório em Andamento': return 'bg-blue-100 text-blue-800';
      case 'Aguardando Sala Cirúrgica': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Cirúrgico</h1>
          <p className="text-gray-600 mt-1">Visão geral dos processos cirúrgicos automatizados</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="w-4 h-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Ativas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cirurgias Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Próximas 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+5% vs. mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2 dias</div>
            <p className="text-xs text-muted-foreground">Solicitação → Cirurgia</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Solicitações Cirúrgicas Ativas</span>
          </CardTitle>
          <CardDescription>
            Acompanhe o progresso das solicitações em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{request.id}</Badge>
                    <span className="font-medium">{request.patient}</span>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Procedimento</p>
                    <p className="font-medium">{request.procedure}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cirurgião</p>
                    <p className="font-medium">{request.surgeon}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data Agendada</p>
                    <p className="font-medium">{new Date(request.scheduledDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{request.progress}%</span>
                    </div>
                    <Progress value={request.progress} className="h-2" />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Gerenciar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span>Insights da IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Recomendação Urgente</p>
                <p className="text-xs text-blue-700 mt-1">
                  3 pacientes necessitam exames pré-operatórios adicionais baseado em histórico clínico
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Otimização Detectada</p>
                <p className="text-xs text-green-700 mt-1">
                  Possível redução de 2 dias no tempo de aprovação ANS com ajustes na documentação
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-900">Alerta de Capacidade</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Centro cirúrgico próximo da capacidade máxima na semana de 15/06
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conformidade LGPD/ANS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auditoria de Dados</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Conforme
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Criptografia</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  TLS 1.3 Ativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Retenção de Dados</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Políticas Ativas
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Logs de Auditoria</span>
                <Badge className="bg-blue-100 text-blue-800">
                  99.9% Uptime
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
