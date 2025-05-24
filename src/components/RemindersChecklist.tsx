
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Clock, Pill, Activity, Utensils, Bandage, AlertTriangle } from 'lucide-react';
import { usePostOperative } from '@/hooks/usePostOperative';

interface RemindersChecklistProps {
  reportId: string;
}

export const RemindersChecklist = ({ reportId }: RemindersChecklistProps) => {
  const { getReminders, toggleReminder } = usePostOperative();
  const { data: reminders = [], isLoading } = getReminders(reportId);

  const getCategoryIcon = (category: string) => {
    const icons = {
      'medication': Pill,
      'activity': Activity,
      'diet': Utensils,
      'wound_care': Bandage,
      'warning_signs': AlertTriangle,
    };
    const Icon = icons[category as keyof typeof icons] || CheckCircle2;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'medication': 'bg-blue-100 text-blue-800 border-blue-200',
      'activity': 'bg-green-100 text-green-800 border-green-200',
      'diet': 'bg-orange-100 text-orange-800 border-orange-200',
      'wound_care': 'bg-purple-100 text-purple-800 border-purple-200',
      'warning_signs': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'medication': 'Medicação',
      'activity': 'Atividades',
      'diet': 'Dieta',
      'wound_care': 'Cuidados com Ferida',
      'warning_signs': 'Sinais de Alerta',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const completedCount = reminders.filter(r => r.is_completed).length;
  const progressPercentage = reminders.length > 0 ? (completedCount / reminders.length) * 100 : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Clock className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-500">Carregando orientações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Orientações Pós-Operatórias</span>
          </div>
          <Badge variant="outline">
            {completedCount}/{reminders.length} completas
          </Badge>
        </CardTitle>
        <CardDescription>
          Lista interativa de cuidados e orientações para o paciente
        </CardDescription>
        {reminders.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma orientação encontrada</p>
            <p className="text-sm">As orientações serão geradas automaticamente após o processamento do relatório</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div 
              key={reminder.id}
              className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                reminder.is_completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <Checkbox
                checked={reminder.is_completed}
                onCheckedChange={(checked) => {
                  toggleReminder.mutate({ 
                    reminderId: reminder.id, 
                    isCompleted: checked as boolean 
                  });
                }}
                className="mt-1"
              />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${
                    reminder.is_completed ? 'text-green-800 line-through' : 'text-gray-900'
                  }`}>
                    {reminder.title}
                  </h4>
                  <Badge className={getCategoryColor(reminder.category)}>
                    <span className="flex items-center space-x-1">
                      {getCategoryIcon(reminder.category)}
                      <span>{getCategoryLabel(reminder.category)}</span>
                    </span>
                  </Badge>
                </div>
                
                <p className={`text-sm ${
                  reminder.is_completed ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {reminder.description}
                </p>
                
                {reminder.completed_at && (
                  <p className="text-xs text-green-600">
                    Concluído em {new Date(reminder.completed_at).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
