
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PostOperativeReport {
  id: string;
  surgical_request_id: string;
  doctor_id: string;
  patient_id: string;
  original_report_url: string;
  surgery_summary: string;
  recommendations: string;
  technical_details: any;
  created_at: string;
  updated_at: string;
}

export interface PostOperativeReminder {
  id: string;
  report_id: string;
  title: string;
  description: string;
  category: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface FollowUpSchedule {
  id: string;
  report_id: string;
  doctor_id: string;
  patient_id: string;
  scheduled_date: string;
  follow_up_type: string;
  notes: string;
  status: string;
  completed_at?: string;
  created_at: string;
}

export const usePostOperative = () => {
  const queryClient = useQueryClient();

  const postOperativeReports = useQuery({
    queryKey: ['post-operative-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_operative_reports')
        .select(`
          *,
          surgical_requests!inner(
            patient_name,
            procedure_name,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (PostOperativeReport & { surgical_requests: any })[];
    }
  });

  const getReminders = (reportId: string) => {
    return useQuery({
      queryKey: ['post-operative-reminders', reportId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('post_operative_reminders')
          .select('*')
          .eq('report_id', reportId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return data as PostOperativeReminder[];
      },
      enabled: !!reportId
    });
  };

  const getFollowUpSchedule = (reportId: string) => {
    return useQuery({
      queryKey: ['follow-up-schedule', reportId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('doctor_follow_up_schedule')
          .select('*')
          .eq('report_id', reportId)
          .order('scheduled_date', { ascending: true });

        if (error) throw error;
        return data as FollowUpSchedule[];
      },
      enabled: !!reportId
    });
  };

  const processReport = useMutation({
    mutationFn: async ({ reportText, surgicalRequestId, reportUrl }: {
      reportText: string;
      surgicalRequestId: string;
      reportUrl: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('post-operative-processor', {
        body: { reportText, surgicalRequestId, reportUrl }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Relatório pós-operatório processado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ['post-operative-reports'] });
      queryClient.invalidateQueries({ queryKey: ['surgical-requests-dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar relatório",
        variant: "destructive",
      });
    }
  });

  const toggleReminder = useMutation({
    mutationFn: async ({ reminderId, isCompleted }: { reminderId: string; isCompleted: boolean }) => {
      const { data, error } = await supabase
        .from('post_operative_reminders')
        .update({ 
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', reminderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-operative-reminders'] });
    }
  });

  const updateFollowUpStatus = useMutation({
    mutationFn: async ({ followUpId, status, notes }: { 
      followUpId: string; 
      status: string; 
      notes?: string 
    }) => {
      const { data, error } = await supabase
        .from('doctor_follow_up_schedule')
        .update({ 
          status,
          notes: notes || null,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', followUpId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-up-schedule'] });
    }
  });

  return {
    postOperativeReports: postOperativeReports.data || [],
    isLoading: postOperativeReports.isLoading,
    error: postOperativeReports.error,
    processReport,
    getReminders,
    getFollowUpSchedule,
    toggleReminder,
    updateFollowUpStatus,
    refetch: postOperativeReports.refetch
  };
};
