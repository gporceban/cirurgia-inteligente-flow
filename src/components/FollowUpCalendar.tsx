
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Phone, Video, User, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { usePostOperative } from '@/hooks/usePostOperative';
import { useState } from 'react';

interface FollowUpCalendarProps {
  reportId: string;
}

export const FollowUpCalendar = ({ reportId }: FollowUpCalendarProps) => {
  const { getFollowUpSchedule, updateFollowUpStatus } = usePostOperative();
  const { data: schedule = [], isLoading } = getFollowUpSchedule(reportId);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');

  const getFollowUpIcon = (type: string) => {
    const icons = {
      'phone_call': Phone,
      'video_call': Video,
      'in_person': User,
      'message': MessageSquare,
    };
    const Icon = icons[type as keyof typeof icons] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'missed': 'bg-red-100 text-red-800 border-red-200',
      'rescheduled': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pending': 'Pendente',
      'completed': 'Concluído',
      'missed': 'Perdido',
      'rescheduled': 'Reagendado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getFollowUpLabel = (type: string) => {
    const labels = {
      'phone_call': 'Ligação',
      'video_call': 'Videochamada',
      'in_person': 'Presencial',
      'message': 'Mensagem'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleStatusUpdate = (followUpId: string, newStatus: string) => {
    updateFollowUpStatus.mutate({ 
      followUpId, 
      status: newStatus, 
      notes: notes || undefined 
    });
    setExpandedItem(null);
    setNotes('');
  };

  const isOverdue = (scheduledDate: string) => {
    return new Date(scheduledDate) < new Date() && schedule.find(s => s.scheduled_date === scheduledDate)?.status === 'pending';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Clock className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-500">Carregando cronograma...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Cronograma de Acompanhamento</span>
        </CardTitle>
        <CardDescription>
          Agenda de contatos com o paciente para acompanhamento pós-operatório
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedule.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum agendamento encontrado</p>
            <p className="text-sm">O cronograma será gerado automaticamente após o processamento do relatório</p>
          </div>
        ) : (
          schedule.map((item) => (
            <div 
              key={item.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                item.status === 'completed' 
                  ? 'bg-green-50 border-green-200' 
                  : isOverdue(item.scheduled_date)
                  ? 'bg-red-50 border-red-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getFollowUpIcon(item.follow_up_type)}
                      <span className="font-medium text-gray-900">
                        {getFollowUpLabel(item.follow_up_type)}
                      </span>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                    {isOverdue(item.scheduled_date) && item.status === 'pending' && (
                      <Badge variant="destructive">
                        Atrasado
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    <strong>Data:</strong> {new Date(item.scheduled_date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  
                  {item.notes && (
                    <p className="text-sm text-gray-600">
                      <strong>Observações:</strong> {item.notes}
                    </p>
                  )}
                  
                  {item.completed_at && (
                    <p className="text-xs text-green-600">
                      Concluído em {new Date(item.completed_at).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.status === 'pending' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    >
                      Atualizar
                    </Button>
                  )}
                  
                  {item.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
              
              {expandedItem === item.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações do contato
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Adicione observações sobre o contato..."
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(item.id, 'completed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Marcar como Concluído
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(item.id, 'missed')}
                    >
                      Marcar como Perdido
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(item.id, 'rescheduled')}
                    >
                      Reagendar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setExpandedItem(null);
                        setNotes('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
