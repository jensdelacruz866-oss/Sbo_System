import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  created_at: string;
}

export function useAuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  const fetchAuditLogs = async () => {
    if (!hasRole('President') && !hasRole('Auditor')) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching audit logs:', error);
        toast.error('Failed to fetch audit logs');
        return;
      }

      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogsByTable = async (tableName: string) => {
    if (!hasRole('President') && !hasRole('Auditor')) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', tableName)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching audit logs for table:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching audit logs for table:', error);
      return [];
    }
  };

  const fetchAuditLogsByRecord = async (tableName: string, recordId: string) => {
    if (!hasRole('President') && !hasRole('Auditor')) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', tableName)
        .eq('record_id', recordId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching audit logs for record:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching audit logs for record:', error);
      return [];
    }
  };

  const generateAuditReport = async (startDate: string, endDate: string) => {
    if (!hasRole('President') && !hasRole('Auditor')) {
      toast.error('You do not have permission to generate audit reports');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error generating audit report:', error);
        toast.error('Failed to generate audit report');
        return null;
      }

      return data || [];
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast.error('Failed to generate audit report');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAuditLogs();
    }
  }, [user]);

  return {
    auditLogs,
    loading,
    fetchAuditLogsByTable,
    fetchAuditLogsByRecord,
    generateAuditReport,
    refetch: fetchAuditLogs,
    canView: hasRole('President') || hasRole('Auditor')
  };
}