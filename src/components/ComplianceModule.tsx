
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Clock, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ComplianceModule = () => {
  const [auditLogs] = useState([
    {
      id: 1,
      action: 'Acesso a dados do paciente',
      user: 'Dr. João Silva',
      patient: 'Maria Santos',
      timestamp: '2024-05-24 14:30:22',
      ip: '192.168.1.45',
      status: 'autorizado'
    },
    {
      id: 2,
      action: 'Modificação de workflow',
      user: 'Admin Sistema',
      details: 'Workflow SR-2024-001 pausado',
      timestamp: '2024-05-24 14:25:15',
      ip: '192.168.1.10',
      status: 'autorizado'
    },
    {
      id: 3,
      action: 'Tentativa de acesso não autorizado',
      user: 'Usuário Desconhecido',
      details: 'Tentativa de acesso a dados sem permissão',
      timestamp: '2024-05-24 13:45:33',
      ip: '203.45.67.89',
      status: 'bloqueado'
    }
  ]);

  const handleGenerateReport = () => {
    toast({
      title: "Relatório Gerado",
      description: "Relatório de conformidade LGPD gerado com sucesso.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'autorizado':
        return 'bg-green-100 text-green-800';
      case 'bloqueado':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Módulo de Conformidade</h1>
        <p className="text-gray-600 mt-1">Gestão de compliance LGPD, ANS e auditoria</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
          <TabsTrigger value="lgpd">LGPD</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Compliance Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status LGPD</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Conforme
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">Última auditoria: 20/05/2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Criptografia</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TLS 1.3</div>
                <p className="text-xs text-muted-foreground">AES-256 em repouso</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos Auditados</CardTitle>
                <FileText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">Últimas 24h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">SLA cumprido</p>
              </CardContent>
            </Card>
          </div>

          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Proteção de Dados</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Autenticação MFA</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Logs de Auditoria</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Backup Automatizado</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas de Conformidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Backup Concluído</p>
                      <p className="text-sm text-green-700">Backup automático realizado às 02:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Certificado Renovado</p>
                      <p className="text-sm text-blue-700">SSL válido até 2025-05-24</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Revisão Programada</p>
                      <p className="text-sm text-yellow-700">Auditoria LGPD em 15 dias</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>
                Registro completo de todas as ações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{log.action}</span>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{log.timestamp}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Usuário:</strong> {log.user}</p>
                      {log.patient && <p><strong>Paciente:</strong> {log.patient}</p>}
                      {log.details && <p><strong>Detalhes:</strong> {log.details}</p>}
                      <p><strong>IP:</strong> {log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button variant="outline">
                  Carregar Mais Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lgpd" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Direitos dos Titulares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Solicitações de Acesso</span>
                    <Badge variant="outline">3 pendentes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Pedidos de Exclusão</span>
                    <Badge variant="outline">1 em análise</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Correções de Dados</span>
                    <Badge className="bg-green-100 text-green-800">0 pendentes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Portabilidade</span>
                    <Badge className="bg-green-100 text-green-800">Em dia</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Políticas de Retenção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dados Clínicos</span>
                      <span>20 anos (CFM)</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Logs de Sistema</span>
                      <span>2 anos</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dados de Comunicação</span>
                      <span>5 anos</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dados Administrativos</span>
                      <span>10 anos</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Termos de Consentimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <p className="text-sm text-gray-600">Taxa de Aceitação</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <p className="text-sm text-gray-600">Consentimentos Ativos</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <p className="text-sm text-gray-600">Revogações Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Relatório LGPD Mensal', size: '2.3 MB', date: '24/05/2024' },
                    { name: 'Auditoria de Segurança', size: '1.8 MB', date: '20/05/2024' },
                    { name: 'Conformidade ANS', size: '956 KB', date: '15/05/2024' },
                    { name: 'Logs de Sistema', size: '4.2 MB', date: '10/05/2024' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.size} • {report.date}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gerar Novo Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={handleGenerateReport} className="w-full bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Relatório de Conformidade LGPD
                  </Button>
                  <Button onClick={handleGenerateReport} className="w-full" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Auditoria de Segurança
                  </Button>
                  <Button onClick={handleGenerateReport} className="w-full" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Relatório de Performance
                  </Button>
                  <Button onClick={handleGenerateReport} className="w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Logs Detalhados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
