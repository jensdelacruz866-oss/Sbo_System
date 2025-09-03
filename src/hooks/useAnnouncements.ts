import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        toast.error('Failed to fetch announcements');
        return;
      }

      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!hasRole('President') && !hasRole('Secretary')) {
      toast.error('Only Presidents and Secretaries can add announcements');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          ...announcement,
          user_id: user?.id,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding announcement:', error);
        toast.error('Failed to add announcement: ' + error.message);
        return;
      }

      setAnnouncements(prev => [data, ...prev]);
      toast.success('Announcement added successfully');
    } catch (error) {
      console.error('Error adding announcement:', error);
      toast.error('Failed to add announcement');
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    if (!hasRole('President') && !hasRole('Secretary')) {
      toast.error('Only Presidents and Secretaries can update announcements');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating announcement:', error);
        toast.error('Failed to update announcement');
        return;
      }

      setAnnouncements(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Announcement updated successfully');
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!hasRole('President') && !hasRole('Secretary')) {
      toast.error('Only Presidents and Secretaries can delete announcements');
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting announcement:', error);
        toast.error('Failed to delete announcement');
        return;
      }

      setAnnouncements(prev => prev.filter(item => item.id !== id));
      toast.success('Announcement deleted successfully');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  return {
    announcements,
    loading,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements,
    canManage: hasRole('President') || hasRole('Secretary')
  };
}