
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { usePostOperative } from '@/hooks/usePostOperative';
import { useSurgicalRequests } from '@/hooks/useSurgicalRequests';

export const ReportUpload = () => {
  const [reportText, setReportText] = useState('');
  const [selectedSurgicalRequest, setSelectedSurgicalRequest] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  
  const { processReport } = usePostOperative();
  const { surgicalRequests } = useSurgicalRequests();

  // Filter surgical requests that are completed but not yet in post-operative
  const completedSurgeries = surgicalRequests.filter(
    req => req.status === 'realizada'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportText.trim() || !selectedSurgicalRequest) {
      return;
    }

    processReport.mutate({
      reportText: reportText.trim(),
      surgicalRequestId: selectedSurgicalRequest,
      reportUrl: reportUrl || `manual-upload-${Date.now()}`
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Upload de Relatório Cirúrgico</span>
        </CardTitle>
        <CardDescription>
          Faça upload do relatório cirúrgico para análise automática com IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="surgical-request">Cirurgia Realizada</Label>
            <Select value={selectedSurgicalRequest} onValueChange={setSelectedSurgicalRequest}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a cirurgia realizada" />
              </SelectTrigger>
              <SelectContent>
                {completedSurgeries.map((surgery) => (
                  <SelectItem key={surgery.id} value={surgery.id}>
                    {surgery.patient_name} - {surgery.procedure_name}
                    <span className="text-sm text-gray-500 ml-2">
                      ({new Date(surgery.created_at).toLocaleDateString('pt-BR')})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-url">URL do Relatório (Opcional)</Label>
            <input
              type="url"
              id="report-url"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://exemplo.com/relatorio.pdf"
              value={reportUrl}
              onChange={(e) => setReportUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-text">Texto do Relatório Cirúrgico</Label>
            <Textarea
              id="report-text"
              placeholder="Cole aqui o texto completo do relatório cirúrgico..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              required
            />
            <p className="text-sm text-gray-500">
              A IA irá extrair automaticamente: resumo, recomendações, detalhes técnicos, 
              orientações para o paciente e cronograma de acompanhamento.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              {reportText.length} caracteres
            </div>
            <Button 
              type="submit" 
              disabled={!reportText.trim() || !selectedSurgicalRequest || processReport.isPending}
              className="min-w-[120px]"
            >
              {processReport.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Processar Relatório
                </>
              )}
            </Button>
          </div>
        </form>

        {completedSurgeries.length === 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Aviso:</strong> Não há cirurgias realizadas disponíveis para processamento. 
              Certifique-se de que o status da cirurgia foi atualizado para "realizada".
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
