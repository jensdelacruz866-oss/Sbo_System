import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description?: string;
  expense_date: string;
  receipt_url?: string;
  event_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        toast.error('Failed to fetch expenses');
        return;
      }

      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!hasRole('President') && !hasRole('Secretary')) {
      toast.error('Only Presidents and Secretaries can add expenses');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expense,
          user_id: user?.id,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding expense:', error);
        toast.error('Failed to add expense');
        return;
      }

      setExpenses(prev => [data, ...prev]);
      toast.success('Expense added successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'INSERT',
        p_table_name: 'expenses',
        p_record_id: data.id,
        p_new_values: data as any
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!hasRole('President')) {
      toast.error('Only Presidents can update expenses');
      return;
    }

    try {
      const oldExpense = expenses.find(e => e.id === id);
      
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense:', error);
        toast.error('Failed to update expense');
        return;
      }

      setExpenses(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Expense updated successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'UPDATE',
        p_table_name: 'expenses',
        p_record_id: id,
        p_old_values: oldExpense as any,
        p_new_values: data as any
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  };

  const deleteExpense = async (id: string) => {
    if (!hasRole('President')) {
      toast.error('Only Presidents can delete expenses');
      return;
    }

    try {
      const oldExpense = expenses.find(e => e.id === id);
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
        return;
      }

      setExpenses(prev => prev.filter(item => item.id !== id));
      toast.success('Expense deleted successfully');
      
      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_action: 'DELETE',
        p_table_name: 'expenses',
        p_record_id: id,
        p_old_values: oldExpense as any
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const uploadReceipt = async (file: File, expenseId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${expenseId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading receipt:', uploadError);
        toast.error('Failed to upload receipt');
        return null;
      }

      const { data } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading receipt:', error);
      toast.error('Failed to upload receipt');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    uploadReceipt,
    refetch: fetchExpenses,
    canAdd: hasRole('President') || hasRole('Secretary'),
    canEdit: hasRole('President'),
    canDelete: hasRole('President')
  };
}