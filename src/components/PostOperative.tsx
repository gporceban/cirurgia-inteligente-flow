
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Calendar, CheckCircle2, Clock, Phone, Video, User, MessageSquare } from 'lucide-react';
import { usePostOperative } from '@/hooks/usePostOperative';
import { ReportUpload } from '@/components/ReportUpload';
import { RemindersChecklist } from '@/components/RemindersChecklist';
import { FollowUpCalendar } from '@/components/FollowUpCalendar';

export const PostOperative = () => {
  const { postOperativeReports, isLoading } = usePostOperative();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'missed': 'bg-red-100 text-red-800 border-red-200',
      'rescheduled': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light text-gray-900">Gestão Pós-Operatória</h1>
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-light text-gray-900">Gestão Pós-Operatória</h1>
        <p className="text-gray-500">Acompanhamento inteligente do pós-operatório</p>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="reminders">Orientações</TabsTrigger>
          <TabsTrigger value="schedule">Cronograma</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Relatórios Pós-Operatórios</span>
              </CardTitle>
              <CardDescription>
                {postOperativeReports.length} relatórios processados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {postOperativeReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum relatório pós-operatório encontrado</p>
                  <p className="text-sm">Faça upload de um relatório para começar</p>
                </div>
              ) : (
                postOperativeReports.map((report) => (
                  <div 
                    key={report.id} 
                    className={`group bg-white border rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer ${
                      selectedReportId === report.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100'
                    }`}
                    onClick={() => setSelectedReportId(report.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {report.surgical_requests?.patient_name}
                        </h3>
                        <p className="text-gray-600">{report.surgical_requests?.procedure_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(report.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(report.surgical_requests?.status || 'pending')}>
                        Pós-operatório
                      </Badge>
                    </div>
                    
                    {report.surgery_summary && (
                      <div className="bg-gray-50 rounded-lg p-4 mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Resumo da Cirurgia</h4>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {report.surgery_summary}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <ReportUpload />
        </TabsContent>

        <TabsContent value="reminders">
          {selectedReportId ? (
            <RemindersChecklist reportId={selectedReportId} />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Selecione um relatório para ver as orientações</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          {selectedReportId ? (
            <FollowUpCalendar reportId={selectedReportId} />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Selecione um relatório para ver o cronograma</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
