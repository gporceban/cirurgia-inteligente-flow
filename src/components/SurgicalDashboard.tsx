
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, Users, ArrowRight, Plus } from 'lucide-react';
import { useSurgicalRequests } from '@/hooks/useSurgicalRequests';

export const SurgicalDashboard = () => {
  const { surgicalRequests, isLoading, createSurgicalRequest } = useSurgicalRequests();

  const getStatusColor = (status: string) => {
    const statusColors = {
      'rascunho': 'bg-gray-100 text-gray-700 border-gray-200',
      'enviada': 'bg-blue-100 text-blue-700 border-blue-200',
      'em_analise': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'aprovada': 'bg-green-100 text-green-700 border-green-200',
      'rejeitada': 'bg-red-100 text-red-700 border-red-200',
      'agendada': 'bg-purple-100 text-purple-700 border-purple-200',
      'realizada': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'pos_operatorio': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getUrgencyColor = (urgency: string) => {
    const urgencyColors = {
      'eletiva': 'bg-gray-50 text-gray-700',
      'urgente': 'bg-orange-50 text-orange-700',
      'emergencia': 'bg-red-50 text-red-700'
    };
    return urgencyColors[urgency as keyof typeof urgencyColors] || 'bg-gray-50 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      'rascunho': 'Rascunho',
      'enviada': 'Enviada',
      'em_analise': 'Em Análise',
      'aprovada': 'Aprovada',
      'rejeitada': 'Rejeitada',
      'agendada': 'Agendada',
      'realizada': 'Realizada',
      'pos_operatorio': 'Pós-operatório'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getUrgencyLabel = (urgency: string) => {
    const urgencyLabels = {
      'eletiva': 'Eletiva',
      'urgente': 'Urgente',
      'emergencia': 'Emergência'
    };
    return urgencyLabels[urgency as keyof typeof urgencyLabels] || urgency;
  };

  // Calculate metrics from real data
  const totalRequests = surgicalRequests.length;
  const scheduledRequests = surgicalRequests.filter(req => req.status === 'agendada').length;
  const approvedRequests = surgicalRequests.filter(req => req.status === 'aprovada').length;
  const approvalRate = totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light text-gray-900">Dashboard Cirúrgico</h1>
          <p className="text-gray-500">Carregando seus processos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-light text-gray-900">Dashboard Cirúrgico</h1>
        <p className="text-gray-500">Acompanhe seus processos de forma inteligente</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-light text-blue-700 mb-1">{totalRequests}</div>
            <div className="text-sm text-blue-600">Solicitações Ativas</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-light text-green-700 mb-1">{scheduledRequests}</div>
            <div className="text-sm text-green-600">Agendadas</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-light text-purple-700 mb-1">{approvalRate}%</div>
            <div className="text-sm text-purple-600">Taxa Aprovação</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-light text-orange-700 mb-1">7.2</div>
            <div className="text-sm text-orange-600">Dias Médios</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Requests */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-medium text-gray-900">Solicitações em Andamento</CardTitle>
              <CardDescription className="text-gray-500">{totalRequests} processos ativos</CardDescription>
            </div>
            <Button variant="outline" className="border-gray-200">
              <Plus className="w-4 h-4 mr-2" />
              Nova Solicitação
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {surgicalRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma solicitação cirúrgica encontrada</p>
              <p className="text-sm">Crie sua primeira solicitação para começar</p>
            </div>
          ) : (
            surgicalRequests.map((request) => (
              <div key={request.id} className="group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono text-gray-500">{request.id.substring(0, 8)}</span>
                      <Badge variant="outline" className={getUrgencyColor(request.urgency_level)}>
                        {getUrgencyLabel(request.urgency_level)}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{request.patient_name}</h3>
                    <p className="text-gray-600">{request.procedure_name}</p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {request.scheduled_date && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Agendada: {new Date(request.scheduled_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Ver Detalhes
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Simplified Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span>Insights da IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-900 mb-1">Recomendação</p>
              <p className="text-xs text-blue-700">
                3 pacientes necessitam exames adicionais
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm font-medium text-green-900 mb-1">Otimização</p>
              <p className="text-xs text-green-700">
                Redução de 2 dias no tempo de aprovação possível
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">OpenAI API</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Orquestrador</span>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Fila de Processos</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">3 na fila</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
