import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Document {
  id: string;
  title: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  category?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to fetch documents');
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, title: string, category?: string, isPublic: boolean = false) => {
    if (!hasRole('President') && !hasRole('Secretary') && !hasRole('Auditor')) {
      toast.error('You do not have permission to upload documents');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Failed to upload file');
        return;
      }

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const { data: document, error } = await supabase
        .from('documents')
        .insert([{
          title,
          file_url: data.publicUrl,
          file_type: file.type,
          file_size: file.size,
          category,
          is_public: isPublic,
          user_id: user?.id,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating document record:', error);
        toast.error('Failed to create document record');
        return;
      }

      setDocuments(prev => [document, ...prev]);
      toast.success('Document uploaded successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'INSERT',
        p_table_name: 'documents',
        p_record_id: document.id,
        p_new_values: document as any
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    if (!hasRole('President') && !hasRole('Secretary') && !hasRole('Auditor')) {
      toast.error('You do not have permission to update documents');
      return;
    }

    try {
      const oldDocument = documents.find(d => d.id === id);
      
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating document:', error);
        toast.error('Failed to update document');
        return;
      }

      setDocuments(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Document updated successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'UPDATE',
        p_table_name: 'documents',
        p_record_id: id,
        p_old_values: oldDocument as any,
        p_new_values: data as any
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  const deleteDocument = async (id: string) => {
    if (!hasRole('President') && !hasRole('Secretary') && !hasRole('Auditor')) {
      toast.error('You do not have permission to delete documents');
      return;
    }

    try {
      const oldDocument = documents.find(d => d.id === id);
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting document:', error);
        toast.error('Failed to delete document');
        return;
      }

      setDocuments(prev => prev.filter(item => item.id !== id));
      toast.success('Document deleted successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'DELETE',
        p_table_name: 'documents',
        p_record_id: id,
        p_old_values: oldDocument as any
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  return {
    documents,
    loading,
    uploadDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments,
    canManage: hasRole('President') || hasRole('Secretary') || hasRole('Auditor')
  };
}