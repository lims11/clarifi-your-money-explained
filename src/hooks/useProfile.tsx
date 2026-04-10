import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useDemoMode } from './useDemoMode';
import { sampleProfile } from '@/data/sample-data';

export function useProfile() {
  const { user } = useAuth();
  const demo = useDemoMode();

  const demoResult = useQuery({
    queryKey: ['demo', 'profile'],
    queryFn: () => sampleProfile,
    staleTime: Infinity,
  });

  const liveResult = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !demo,
  });

  return demo ? demoResult : liveResult;
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: { full_name?: string; currency?: string; onboarding_complete?: boolean; onboarding_step?: number }) => {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}
