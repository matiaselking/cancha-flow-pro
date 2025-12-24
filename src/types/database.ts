export type ReservationStatus = 'HOLD' | 'PENDING' | 'PAID' | 'CANCELLED';
export type PaymentMode = 'DEPOSIT' | 'FULL';
export type PaymentProvider = 'WEBPAY_LINK' | 'WEBPAY_PLUS';
export type CourtType = 'FUTBOL' | 'PADEL';
export type ProofType = 'TXID' | 'IMAGE';

export interface Venue {
  id: string;
  name: string;
  address: string;
  comuna: string;
  lat?: number;
  lng?: number;
  whatsapp?: string;
  photos: string[];
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Court {
  id: string;
  venue_id: string;
  name: string;
  court_type: CourtType;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceRule {
  id: string;
  venue_id: string;
  court_type: CourtType;
  day_of_week: number;
  start_time: string;
  end_time: string;
  amount_total: number;
  amount_deposit: number;
  is_peak: boolean;
  created_at: string;
}

export interface Reservation {
  id: string;
  venue_id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  phone: string;
  email: string;
  status: ReservationStatus;
  payment_mode?: PaymentMode;
  payment_provider?: PaymentProvider;
  payment_ref?: string;
  hold_expires_at?: string;
  amount?: number;
  created_at: string;
  updated_at: string;
  // Joined
  venue?: Venue;
  court?: Court;
}

export interface PaymentProof {
  id: string;
  reservation_id: string;
  proof_type: ProofType;
  value: string;
  created_at: string;
}

export interface CourtBlock {
  id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  whatsapp?: string;
  webpay_link_deposit?: string;
  webpay_link_full?: string;
  webpay_plus_commerce_code?: string;
  webpay_plus_api_key?: string;
  webpay_plus_environment: string;
  cancellation_policy?: string;
  created_at: string;
  updated_at: string;
}

export interface OperatingHours {
  id: string;
  venue_id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  status: 'available' | 'hold' | 'booked' | 'blocked';
  price?: number;
  isPeak?: boolean;
}
