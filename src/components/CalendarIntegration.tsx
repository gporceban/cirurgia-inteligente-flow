
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const CalendarIntegration = () => {
  const [events] = useState([
    {
      id: 1,
      title: 'Artrodese L4-L5 - Maria Santos',
      date: '2024-06-15',
      time: '08:00',
      duration: '3h',
      location: 'Sala Cirúrgica 2',
      surgeon: 'Dr. João Silva',
      status: 'confirmado',
      type: 'cirurgia'
    },
    {
      id: 2,
      title: 'Consulta Pré-op - Carlos Oliveira',
      date: '2024-06-10',
      time: '14:30',
      duration: '30min',
      location: 'Consultório 5',
      surgeon: 'Dr. Ana Costa',
      status: 'agendado',
      type: 'consulta'
    },
    {
      id: 3,
      title: 'Follow-up - Roberto Lima',
      date: '2024-06-12',
      time: '10:00',
      duration: '20min',
      location: 'Consultório 3',
      surgeon: 'Dr. João Silva',
      status: 'pendente',
      type: 'followup'
    },
    {
      id: 4,
      title: 'Descompressão Cervical - Ana Costa',
      date: '2024-06-20',
      time: '13:00',
      duration: '2h30min',
      location: 'Sala Cirúrgica 1',
      surgeon: 'Dr. Ana Costa',
      status: 'confirmado',
      type: 'cirurgia'
    }
  ]);

  const handleSyncCalendar = () => {
    toast({
      title: "Sincronização Concluída",
      description: "Agenda sincronizada com Google Calendar e PatientHub.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'agendado':
        return 'bg-blue-100 text-blue-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cirurgia':
        return 'bg-red-100 text-red-800';
      case 'consulta':
        return 'bg-blue-100 text-blue-800';
      case 'followup':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cirurgia':
        return 'Cirurgia';
      case 'consulta':
        return 'Consulta';
      case 'followup':
        return 'Follow-up';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integração de Agenda</h1>
          <p className="text-gray-600 mt-1">Sincronize eventos com calendários externos</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleSyncCalendar} variant="outline">
            <CheckCircle className="w-4 h-4 mr-2" />
            Sincronizar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Google Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Conectado
              </Badge>
              <span className="text-sm text-gray-600">Última sync: 14:32</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">PatientHub</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Conectado
              </Badge>
              <span className="text-sm text-gray-600">Tempo real</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Outlook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="bg-yellow-100 text-yellow-800">
                Configurar
              </Badge>
              <Button variant="outline" size="sm">
                Conectar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Events */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>
            Eventos automaticamente criados pelo sistema de workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{event.title}</span>
                    <Badge className={getTypeColor(event.type)}>
                      {getTypeLabel(event.type)}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{event.time} ({event.duration})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{event.surgeon}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-3">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Enviar Convite
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Consulta de Emergência
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Verificar Disponibilidade de Sala
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Convocar Equipe Cirúrgica
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas da Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Cirurgias esta semana:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Consultas agendadas:</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Taxa de ocupação:</span>
                <span className="font-medium text-green-600">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Follow-ups pendentes:</span>
                <span className="font-medium text-yellow-600">5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
