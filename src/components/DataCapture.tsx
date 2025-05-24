
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, FileText, Zap, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const DataCapture = () => {
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    procedure: '',
    indication: '',
    urgency: '',
    notes: ''
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setExtractedData({
        patientName: 'Maria dos Santos Silva',
        patientId: 'PH-2024-0342',
        age: '58 anos',
        procedure: 'Artrodese Lombar L4-L5',
        indication: 'Espondilolistese degenerativa com claudicação neurogênica',
        urgency: 'Eletiva',
        diagnosis: 'CID M43.1 - Espondilolistese',
        comorbidities: ['Diabetes Mellitus Tipo 2', 'Hipertensão Arterial'],
        confidence: 94
      });
      setIsProcessing(false);
      toast({
        title: "Extração Concluída",
        description: "Dados extraídos com 94% de confiança. Revise antes de prosseguir.",
      });
    }, 3000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Dados Enviados",
      description: "Solicitação cirúrgica criada com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Captura de Dados</h1>
        <p className="text-gray-600 mt-1">Automatize a extração de dados ou insira manualmente</p>
      </div>

      <Tabs defaultValue="auto" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="auto" className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Modo Automático</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Modo Manual</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Extração Automática com IA</span>
              </CardTitle>
              <CardDescription>
                Faça upload de screenshots, PDFs ou imagens de prontuários para extração automática
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Arraste arquivos aqui ou clique para fazer upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Suporta PNG, JPG, PDF (máx. 10MB)
                </p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                </label>
              </div>

              {isProcessing && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700">Processando com Vision AI...</span>
                  </div>
                </div>
              )}

              {extractedData && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Dados Extraídos</h3>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {extractedData.confidence}% de confiança
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-gray-600">Paciente</Label>
                        <Input value={extractedData.patientName} readOnly className="bg-gray-50" />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">ID PatientHub</Label>
                        <Input value={extractedData.patientId} readOnly className="bg-gray-50" />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Idade</Label>
                        <Input value={extractedData.age} readOnly className="bg-gray-50" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-gray-600">Procedimento</Label>
                        <Input value={extractedData.procedure} readOnly className="bg-gray-50" />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Urgência</Label>
                        <Input value={extractedData.urgency} readOnly className="bg-gray-50" />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">CID</Label>
                        <Input value={extractedData.diagnosis} readOnly className="bg-gray-50" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-600">Indicação Cirúrgica</Label>
                    <Textarea value={extractedData.indication} readOnly className="bg-gray-50 h-20" />
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-600">Comorbidades</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {extractedData.comorbidities.map((comorbidity: string, index: number) => (
                        <Badge key={index} variant="outline">{comorbidity}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button className="bg-green-600 hover:bg-green-700 flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirmar e Processar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Editar Dados
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entrada Manual de Dados</CardTitle>
              <CardDescription>
                Preencha o formulário estruturado para nova solicitação cirúrgica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Nome do Paciente</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientId">ID PatientHub</Label>
                    <Input
                      id="patientId"
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      placeholder="PH-2024-XXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="procedure">Procedimento Cirúrgico</Label>
                    <Select onValueChange={(value) => setFormData({...formData, procedure: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o procedimento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="artrodese-lombar">Artrodese Lombar</SelectItem>
                        <SelectItem value="descompressao-cervical">Descompressão Cervical</SelectItem>
                        <SelectItem value="correcao-escoliose">Correção de Escoliose</SelectItem>
                        <SelectItem value="microdiscectomia">Microdiscectomia</SelectItem>
                        <SelectItem value="laminectomia">Laminectomia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="urgency">Urgência</Label>
                    <Select onValueChange={(value) => setFormData({...formData, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a urgência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergencia">Emergência</SelectItem>
                        <SelectItem value="urgencia">Urgência</SelectItem>
                        <SelectItem value="eletiva">Eletiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="indication">Indicação Cirúrgica</Label>
                  <Textarea
                    id="indication"
                    value={formData.indication}
                    onChange={(e) => setFormData({...formData, indication: e.target.value})}
                    placeholder="Descreva a indicação clínica para o procedimento..."
                    className="h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Observações Adicionais</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Informações complementares, alergias, restrições..."
                    className="h-20"
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Criar Solicitação Cirúrgica
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
