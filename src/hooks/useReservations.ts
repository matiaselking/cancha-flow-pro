import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Reservation, CourtBlock, PaymentProof, PaymentMode, PaymentProvider, ReservationStatus } from '@/types/database';

export function useReservations(filters?: {
  venueId?: string;
  courtId?: string;
  date?: string;
  status?: ReservationStatus;
}) {
  return useQuery({
    queryKey: ['reservations', filters],
    queryFn: async () => {
      let query = supabase
        .from('reservations')
        .select('*, venue:venues(*), court:courts(*)')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });
      
      if (filters?.venueId) {
        query = query.eq('venue_id', filters.venueId);
      }
      if (filters?.courtId) {
        query = query.eq('court_id', filters.courtId);
      }
      if (filters?.date) {
        query = query.eq('date', filters.date);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Reservation[];
    },
  });
}

export function useCourtBlocks(courtId?: string, date?: string) {
  return useQuery({
    queryKey: ['court-blocks', courtId, date],
    queryFn: async () => {
      let query = supabase
        .from('court_blocks')
        .select('*');
      
      if (courtId) {
        query = query.eq('court_id', courtId);
      }
      if (date) {
        query = query.eq('date', date);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CourtBlock[];
    },
  });
}

interface CreateReservationInput {
  venue_id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  phone: string;
  email: string;
  payment_mode: PaymentMode;
  payment_provider?: PaymentProvider;
  amount: number;
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateReservationInput) => {
      // First create a HOLD
      const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
      
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          ...input,
          status: 'PENDING' as ReservationStatus,
          hold_expires_at: holdExpiresAt,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReservationStatus }) => {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useAddPaymentProof() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: { reservation_id: string; proof_type: 'TXID' | 'IMAGE'; value: string }) => {
      const { data, error } = await supabase
        .from('payment_proofs')
        .insert(input)
        .select()
        .single();
      
      if (error) throw error;
      return data as PaymentProof;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-proofs'] });
    },
  });
}

export function usePaymentProofs(reservationId?: string) {
  return useQuery({
    queryKey: ['payment-proofs', reservationId],
    queryFn: async () => {
      let query = supabase
        .from('payment_proofs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (reservationId) {
        query = query.eq('reservation_id', reservationId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as PaymentProof[];
    },
    enabled: !!reservationId,
  });
}
