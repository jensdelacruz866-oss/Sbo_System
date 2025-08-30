import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  location?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to fetch events');
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!hasRole('President') && !hasRole('Secretary')) {
      toast.error('Only Presidents and Secretaries can add events');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...event,
          user_id: user?.id,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding event:', error);
        toast.error('Failed to add event');
        return;
      }

      setEvents(prev => [...prev, data].sort((a, b) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ));
      toast.success('Event added successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'INSERT',
        p_table_name: 'events',
        p_record_id: data.id,
        p_new_values: data as any
      });
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    if (!hasRole('President') && !hasRole('Secretary')) {
      toast.error('Only Presidents and Secretaries can update events');
      return;
    }

    try {
      const oldEvent = events.find(e => e.id === id);
      
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        toast.error('Failed to update event');
        return;
      }

      setEvents(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Event updated successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'UPDATE',
        p_table_name: 'events',
        p_record_id: id,
        p_old_values: oldEvent as any,
        p_new_values: data as any
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!hasRole('President') && !hasRole('Secretary')) {
      toast.error('Only Presidents and Secretaries can delete events');
      return;
    }

    try {
      const oldEvent = events.find(e => e.id === id);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
        return;
      }

      setEvents(prev => prev.filter(item => item.id !== id));
      toast.success('Event deleted successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'DELETE',
        p_table_name: 'events',
        p_record_id: id,
        p_old_values: oldEvent as any
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
    canManage: hasRole('President') || hasRole('Secretary')
  };
}