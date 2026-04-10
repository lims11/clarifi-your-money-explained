import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useAccounts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAllAccounts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['accounts', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useTransactions(filters?: { startDate?: string; accountId?: string }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let q = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      if (filters?.startDate) q = q.gte('date', filters.startDate);
      if (filters?.accountId) q = q.eq('account_id', filters.accountId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useMonthTransactions() {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split('T')[0];
  return useTransactions({ startDate: startOfMonth });
}

export function useBudgets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useGoals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useScheduledTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['scheduled_transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_transactions')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .order('next_date');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function usePulseAlerts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['pulse_alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pulse_alerts')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUnreadAlertCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['pulse_alerts', 'unread_count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('pulse_alerts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('is_read', false);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });
}

export function useChatMessages() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['chat_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Mutations
export function useAddAccount() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (account: {
      name: string; type: string; balance?: number; institution?: string; colour?: string;
    }) => {
      const { data, error } = await supabase.from('accounts').insert({
        ...account,
        user_id: user!.id,
        balance: account.balance ?? 0,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; type?: string; balance?: number; institution?: string; colour?: string; is_active?: boolean }) => {
      const { error } = await supabase.from('accounts').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('accounts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useAddTransaction() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (txn: {
      account_id: string; amount: number; type: string; category: string;
      subcategory?: string; payee?: string; description?: string; date: string;
      is_recurring?: boolean;
    }) => {
      const { data, error } = await supabase.from('transactions').insert({
        ...txn,
        user_id: user!.id,
      }).select().single();
      if (error) throw error;

      // Update account balance
      const balanceChange = txn.type === 'income' ? txn.amount : txn.type === 'expense' ? txn.amount : 0;
      if (balanceChange !== 0) {
        const { data: account } = await supabase.from('accounts').select('balance').eq('id', txn.account_id).single();
        if (account) {
          await supabase.from('accounts').update({
            balance: Number(account.balance) + balanceChange
          }).eq('id', txn.account_id);
        }
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useAddBudget() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (budget: { name: string; category: string; amount: number; period: string; colour?: string }) => {
      const { error } = await supabase.from('budgets').insert({ ...budget, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; category?: string; amount?: number; period?: string; colour?: string }) => {
      const { error } = await supabase.from('budgets').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useAddGoal() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goal: {
      name: string; target_amount: number; current_amount?: number;
      target_date?: string; colour?: string; icon?: string;
    }) => {
      const { error } = await supabase.from('goals').insert({ ...goal, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; target_amount?: number; current_amount?: number; target_date?: string; colour?: string; icon?: string }) => {
      const { error } = await supabase.from('goals').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
}

export function useMarkAlertRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pulse_alerts').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pulse_alerts'] });
    },
  });
}

export function useMarkAllAlertsRead() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('pulse_alerts').update({ is_read: true }).eq('user_id', user!.id).eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pulse_alerts'] }),
  });
}

export function useAddScheduledTransaction() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (st: {
      account_id: string; name: string; amount: number; type: string;
      category: string; frequency: string; next_date: string; payee?: string;
    }) => {
      const { error } = await supabase.from('scheduled_transactions').insert({ ...st, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduled_transactions'] }),
  });
}
