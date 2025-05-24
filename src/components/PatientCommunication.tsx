
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Phone, Calendar, CheckCircle, Clock, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const PatientCommunication = () => {
  const [messages] = useState([
    {
      id: 1,
      patient: 'Maria Santos',
      type: 'whatsapp',
      status: 'enviado',
      content: 'Olá Maria! Sua cirurgia de artrodese L4-L5 foi aprovada pela ANS. Data agendada: 15/06/2024 às 08:00.',
      timestamp: '2024-05-24 14:30',
      template: 'aprovacao-cirurgia'
    },
    {
      id: 2,
      patient: 'Carlos Oliveira',
      type: 'email',
      status: 'pendente',
      content: 'Instruções pré-operatórias para sua descompressão cervical...',
      timestamp: '2024-05-24 15:45',
      template: 'pre-operatorio'
    },
    {
      id: 3,
      patient: 'Ana Costa',
      type: 'whatsapp',
      status: 'entregue',
      content: 'Lembrete: consulta pós-operatória agendada para amanhã às 14h.',
      timestamp: '2024-05-24 16:20',
      template: 'lembrete-consulta'
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    patient: '',
    type: '',
    template: '',
    customContent: ''
  });

  const handleSendMessage = () => {
    toast({
      title: "Mensagem Enviada",
      description: "Comunicação enviada com sucesso para o paciente.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'entregue':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'falhou':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'email':
        return <span className="text-blue-600 text-sm">@</span>;
      case 'sms':
        return <Phone className="w-4 h-4 text-purple-600" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Comunicação com Pacientes</h1>
        <p className="text-gray-600 mt-1">Gerencie comunicações automatizadas e personalizadas</p>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="new">Nova Comunicação</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Comunicações</CardTitle>
              <CardDescription>
                Acompanhe todas as comunicações enviadas aos pacientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(message.type)}
                        <span className="font-medium">{message.patient}</span>
                        <Badge variant="outline">{message.template}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{message.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-3">
                      <Button variant="outline" size="sm">
                        Reenviar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Aprovação de Cirurgia',
                description: 'Notifica aprovação pela ANS e data agendada',
                category: 'Administrativo',
                usage: 45
              },
              {
                name: 'Instruções Pré-operatórias',
                description: 'Orientações detalhadas antes da cirurgia',
                category: 'Médico',
                usage: 38
              },
              {
                name: 'Lembrete de Consulta',
                description: 'Lembretes automáticos de agendamentos',
                category: 'Agendamento',
                usage: 62
              },
              {
                name: 'Resultado de Exames',
                description: 'Notificação sobre disponibilidade de resultados',
                category: 'Exames',
                usage: 29
              },
              {
                name: 'Cuidados Pós-operatórios',
                description: 'Instruções de recuperação e follow-up',
                category: 'Médico',
                usage: 33
              },
              {
                name: 'Termo de Consentimento',
                description: 'Envio e solicitação de assinatura digital',
                category: 'Legal',
                usage: 21
              }
            ].map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Uso mensal:</span>
                    <span className="font-medium">{template.usage} mensagens</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Editar
                    </Button>
                    <Button size="sm" className="flex-1">
                      Usar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nova Comunicação</CardTitle>
              <CardDescription>
                Envie mensagens personalizadas ou use templates existentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Paciente</label>
                    <Select onValueChange={(value) => setNewMessage({...newMessage, patient: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maria-santos">Maria Santos</SelectItem>
                        <SelectItem value="carlos-oliveira">Carlos Oliveira</SelectItem>
                        <SelectItem value="ana-costa">Ana Costa</SelectItem>
                        <SelectItem value="roberto-lima">Roberto Lima</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Canal de Comunicação</label>
                    <Select onValueChange={(value) => setNewMessage({...newMessage, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o canal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Template (Opcional)</label>
                  <Select onValueChange={(value) => setNewMessage({...newMessage, template: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Usar template ou criar mensagem personalizada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aprovacao">Aprovação de Cirurgia</SelectItem>
                      <SelectItem value="pre-op">Instruções Pré-operatórias</SelectItem>
                      <SelectItem value="lembrete">Lembrete de Consulta</SelectItem>
                      <SelectItem value="pos-op">Cuidados Pós-operatórios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Mensagem</label>
                  <Textarea
                    value={newMessage.customContent}
                    onChange={(e) => setNewMessage({...newMessage, customContent: e.target.value})}
                    placeholder="Digite sua mensagem ou ela será gerada automaticamente baseada no template selecionado..."
                    className="h-32"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Pré-visualização da IA</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    "Olá [Nome do Paciente]! Sua cirurgia foi aprovada e agendada para [Data] às [Hora]. 
                    Em breve você receberá as instruções pré-operatórias. Em caso de dúvidas, entre em contato conosco."
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700 flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Agora
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Envio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
