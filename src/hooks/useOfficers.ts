import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Officer {
  id: string;
  name: string;
  role: string; // Changed from enum to string to match database
  email: string;
  bio: string | null;
  avatar_url: string | null;
  term_start: string;
  created_at: string;
  updated_at: string;
}

export function useOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();

  const canManage = hasRole('President');

  const fetchOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .order('role', { ascending: true });

      if (error) throw error;
      setOfficers(data || []);
    } catch (error) {
      console.error('Error fetching officers:', error);
      toast.error('Failed to load officers');
    } finally {
      setLoading(false);
    }
  };

  const addOfficer = async (officer: Omit<Officer, 'id' | 'created_at' | 'updated_at'>) => {
    if (!canManage) {
      toast.error('Only presidents can manage officers');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('officers')
        .insert([officer])
        .select()
        .single();

      if (error) throw error;
      
      setOfficers(prev => [...prev, data]);
      toast.success('Officer added successfully');
      return data;
    } catch (error) {
      console.error('Error adding officer:', error);
      toast.error('Failed to add officer');
      throw error;
    }
  };

  const updateOfficer = async (id: string, updates: Partial<Officer>) => {
    if (!canManage) {
      toast.error('Only presidents can manage officers');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('officers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setOfficers(prev => prev.map(officer => 
        officer.id === id ? data : officer
      ));
      toast.success('Officer updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating officer:', error);
      toast.error('Failed to update officer');
      throw error;
    }
  };

  const deleteOfficer = async (id: string) => {
    if (!canManage) {
      toast.error('Only presidents can manage officers');
      return;
    }

    try {
      const { error } = await supabase
        .from('officers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setOfficers(prev => prev.filter(officer => officer.id !== id));
      toast.success('Officer removed successfully');
    } catch (error) {
      console.error('Error deleting officer:', error);
      toast.error('Failed to remove officer');
      throw error;
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!canManage) {
      toast.error('Only presidents can upload images');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('officer-avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('officer-avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  return {
    officers,
    loading,
    canManage,
    addOfficer,
    updateOfficer,
    deleteOfficer,
    uploadAvatar,
    refetch: fetchOfficers
  };
}