
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SurgicalRequest {
  id: string;
  procedure_name: string;
  patient_name: string;
  status: string;
  urgency_level: string;
  created_at: string;
  scheduled_date?: string;
  is_doctor_view: boolean;
}

export interface CreateSurgicalRequestData {
  assessmentId: string;
  procedureName: string;
  procedureCodes: string[];
  icd10Code: string;
  urgencyLevel: 'eletiva' | 'urgente' | 'emergencia';
  opmeMaterials?: any[];
  opmeCompanies?: string[];
}

export interface SurgicalAgentData {
  assessmentData: {
    patient_name: string;
    patient_cpf?: string;
    patient_health_plan?: string;
    clinical_note: string;
    patient_email?: string;
  };
  procedureData: {
    procedure_name: string;
    urgency_level: string;
    icd10_code?: string;
    procedure_codes?: string[];
  };
  doctorData: {
    doctor_name: string;
    specialty: string;
    crm: string;
    clinic_address?: string;
    clinic_phone?: string;
    clinic_email?: string;
  };
}

export const useSurgicalRequests = () => {
  const queryClient = useQueryClient();

  const surgicalRequestsQuery = useQuery({
    queryKey: ['surgical-requests-dashboard'],
    queryFn: async () => {
      console.log('Fetching surgical requests for dashboard');
      const { data, error } = await supabase.functions.invoke('surgical-requests', {
        method: 'GET',
        body: new URLSearchParams({ action: 'dashboard' })
      });

      if (error) {
        console.error('Error fetching surgical requests:', error);
        throw error;
      }

      return data.data as SurgicalRequest[];
    }
  });

  const generateSurgicalReport = useMutation({
    mutationFn: async (agentData: SurgicalAgentData) => {
      console.log('Generating surgical report with AI agent:', agentData);
      const { data, error } = await supabase.functions.invoke('openai-surgical-agent', {
        body: agentData
      });

      if (error) {
        console.error('Error generating surgical report:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: "Relatório cirúrgico gerado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error in generateSurgicalReport:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao gerar relatório cirúrgico",
        variant: "destructive",
      });
    }
  });

  const createSurgicalRequest = useMutation({
    mutationFn: async (requestData: CreateSurgicalRequestData) => {
      console.log('Creating surgical request:', requestData);
      const { data, error } = await supabase.functions.invoke('surgical-requests', {
        method: 'POST',
        body: { action: 'create', ...requestData }
      });

      if (error) {
        console.error('Error creating surgical request:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message || "Solicitação cirúrgica criada com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['surgical-requests-dashboard'] });
    },
    onError: (error: any) => {
      console.error('Error in createSurgicalRequest:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar solicitação cirúrgica",
        variant: "destructive",
      });
    }
  });

  const updateSurgicalRequestStatus = useMutation({
    mutationFn: async ({ requestId, status, rejectionReason }: { 
      requestId: string; 
      status: string; 
      rejectionReason?: string 
    }) => {
      console.log('Updating surgical request status:', { requestId, status });
      const { data, error } = await supabase.functions.invoke('surgical-requests', {
        method: 'PUT',
        body: { action: 'update-status', requestId, status, rejectionReason }
      });

      if (error) {
        console.error('Error updating surgical request status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message || "Status atualizado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['surgical-requests-dashboard'] });
    },
    onError: (error: any) => {
      console.error('Error in updateSurgicalRequestStatus:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  });

  return {
    surgicalRequests: surgicalRequestsQuery.data || [],
    isLoading: surgicalRequestsQuery.isLoading,
    error: surgicalRequestsQuery.error,
    createSurgicalRequest,
    updateSurgicalRequestStatus,
    generateSurgicalReport,
    refetch: surgicalRequestsQuery.refetch
  };
};
