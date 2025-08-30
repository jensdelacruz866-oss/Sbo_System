import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface BudgetAllocation {
  id: string;
  category: string;
  allocated_amount: number;
  fiscal_year: number;
  created_at: string;
  updated_at: string;
}

export function useBudget() {
  const [budget, setBudget] = useState<BudgetAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();

  const fetchBudget = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_allocations')
        .select('*')
        .order('category');

      if (error) {
        console.error('Error fetching budget:', error);
        toast.error('Failed to fetch budget data');
        return;
      }

      setBudget(data || []);
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast.error('Failed to fetch budget data');
    } finally {
      setLoading(false);
    }
  };

  const addBudgetAllocation = async (allocation: Omit<BudgetAllocation, 'id' | 'created_at' | 'updated_at'>) => {
    if (!hasRole('President')) {
      toast.error('Only Presidents can manage budget allocations');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('budget_allocations')
        .insert([{
          ...allocation,
          user_id: user?.id,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding budget allocation:', error);
        toast.error('Failed to add budget allocation');
        return;
      }

      setBudget(prev => [...prev, data]);
      toast.success('Budget allocation added successfully');
    } catch (error) {
      console.error('Error adding budget allocation:', error);
      toast.error('Failed to add budget allocation');
    }
  };

  const updateBudgetAllocation = async (id: string, updates: Partial<BudgetAllocation>) => {
    if (!hasRole('President')) {
      toast.error('Only Presidents can manage budget allocations');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('budget_allocations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating budget allocation:', error);
        toast.error('Failed to update budget allocation');
        return;
      }

      setBudget(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Budget allocation updated successfully');
    } catch (error) {
      console.error('Error updating budget allocation:', error);
      toast.error('Failed to update budget allocation');
    }
  };

  const deleteBudgetAllocation = async (id: string) => {
    if (!hasRole('President')) {
      toast.error('Only Presidents can manage budget allocations');
      return;
    }

    try {
      const { error } = await supabase
        .from('budget_allocations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting budget allocation:', error);
        toast.error('Failed to delete budget allocation');
        return;
      }

      setBudget(prev => prev.filter(item => item.id !== id));
      toast.success('Budget allocation deleted successfully');
    } catch (error) {
      console.error('Error deleting budget allocation:', error);
      toast.error('Failed to delete budget allocation');
    }
  };

  useEffect(() => {
    if (user) {
      fetchBudget();
    }
  }, [user]);

  return {
    budget,
    loading,
    addBudgetAllocation,
    updateBudgetAllocation,
    deleteBudgetAllocation,
    refetch: fetchBudget,
    canManage: hasRole('President')
  };
}