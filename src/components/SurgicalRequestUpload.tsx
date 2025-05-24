
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, Camera } from 'lucide-react';
import { useSurgicalRequests } from '@/hooks/useSurgicalRequests';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SurgicalRequestUpload = () => {
  const [reportText, setReportText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { createSurgicalRequest } = useSurgicalRequests();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // Here you would typically use Vision API to extract text from image
      // For now, we'll simulate the extraction
      toast({
        title: "Processando imagem",
        description: "Extraindo dados do paciente com IA...",
      });

      // Simulate AI processing - in real implementation, this would call Vision API
      setTimeout(() => {
        const extractedText = `
Informações do Paciente:
Nome: Heitor Tonheiro Torres
Prontuário: 6217150
E-mail: heitortonheiro@gmail.com
Identidade: 47817438
Telefone: (11) 9 8571-5149
Estado civil: Solteiro
CPF: 414.416.738-06
Endereço: Rua Carlos Mauser - 05175140 - São Paulo - SP
Convênio: Care Plus Medicina Assistencial Ltda.
Plano: Especial III
Médico responsável: Guilherme Henrique Porceban
        `;
        setReportText(extractedText);
        setIsProcessing(false);
        
        toast({
          title: "Dados extraídos",
          description: "Informações do paciente extraídas com sucesso. Revise antes de processar.",
        });
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Erro",
        description: "Erro ao processar imagem",
        variant: "destructive",
      });
    }
  };

  const processSurgicalRequest = async () => {
    if (!reportText.trim()) {
      toast({
        title: "Erro",
        description: "Adicione as informações do paciente antes de processar",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call the surgical request processor
      const { data, error } = await supabase.functions.invoke('surgical-request-processor', {
        body: { 
          patientText: reportText.trim(),
          requestType: 'create_from_screenshot'
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Solicitação cirúrgica criada com sucesso",
      });

      // Clear form
      setReportText('');
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar solicitação cirúrgica",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Nova Solicitação Cirúrgica</span>
        </CardTitle>
        <CardDescription>
          Faça upload da ficha do paciente ou insira as informações manualmente para criar uma solicitação cirúrgica
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Arraste a ficha do paciente aqui ou clique para fazer upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Suporta PNG, JPG (máx. 10MB)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="patient-file-upload"
              disabled={isProcessing}
            />
            <label htmlFor="patient-file-upload">
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                asChild
                disabled={isProcessing}
              >
                <span>
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Selecionar Arquivo
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>

          {/* Manual Input Section */}
          <div className="space-y-2">
            <Label htmlFor="patient-info">Informações do Paciente</Label>
            <Textarea
              id="patient-info"
              placeholder="Cole ou digite as informações do paciente (nome, prontuário, email, procedimento indicado, etc.)..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-sm text-gray-500">
              A IA irá processar as informações e criar automaticamente a solicitação cirúrgica 
              vinculando ao prontuário existente.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              {reportText.length} caracteres
            </div>
            <Button 
              onClick={processSurgicalRequest}
              disabled={!reportText.trim() || isProcessing}
              className="min-w-[160px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Criar Solicitação
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
