import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BusinessSettings } from '@/types/database';

export function useBusinessSettings() {
  return useQuery({
    queryKey: ['business-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as BusinessSettings;
    },
  });
}

export function useUpdateBusinessSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<BusinessSettings>) => {
      const { data: existing } = await supabase
        .from('business_settings')
        .select('id')
        .limit(1)
        .single();
      
      if (existing) {
        const { data, error } = await supabase
          .from('business_settings')
          .update(updates)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('business_settings')
          .insert(updates)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-settings'] });
    },
  });
}
