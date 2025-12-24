import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Venue, Court, PriceRule, OperatingHours } from '@/types/database';

export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data as Venue[];
    },
  });
}

export function useVenue(id: string) {
  return useQuery({
    queryKey: ['venue', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Venue;
    },
    enabled: !!id,
  });
}

export function useCourts(venueId?: string) {
  return useQuery({
    queryKey: ['courts', venueId],
    queryFn: async () => {
      let query = supabase
        .from('courts')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (venueId) {
        query = query.eq('venue_id', venueId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Court[];
    },
  });
}

export function usePriceRules(venueId?: string) {
  return useQuery({
    queryKey: ['price-rules', venueId],
    queryFn: async () => {
      let query = supabase
        .from('price_rules')
        .select('*')
        .order('day_of_week')
        .order('start_time');
      
      if (venueId) {
        query = query.eq('venue_id', venueId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as PriceRule[];
    },
  });
}

export function useOperatingHours(venueId?: string) {
  return useQuery({
    queryKey: ['operating-hours', venueId],
    queryFn: async () => {
      let query = supabase
        .from('operating_hours')
        .select('*')
        .order('day_of_week');
      
      if (venueId) {
        query = query.eq('venue_id', venueId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as OperatingHours[];
    },
  });
}
