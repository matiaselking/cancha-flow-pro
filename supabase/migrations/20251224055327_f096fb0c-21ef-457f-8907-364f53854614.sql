-- Create enums for reservation status and payment
CREATE TYPE public.reservation_status AS ENUM ('HOLD', 'PENDING', 'PAID', 'CANCELLED');
CREATE TYPE public.payment_mode AS ENUM ('DEPOSIT', 'FULL');
CREATE TYPE public.payment_provider AS ENUM ('WEBPAY_LINK', 'WEBPAY_PLUS');
CREATE TYPE public.court_type AS ENUM ('FUTBOL', 'PADEL');
CREATE TYPE public.proof_type AS ENUM ('TXID', 'IMAGE');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Venues (Sedes)
CREATE TABLE public.venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  comuna TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  whatsapp TEXT,
  photos TEXT[] DEFAULT '{}',
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Courts (Canchas)
CREATE TABLE public.courts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  court_type public.court_type NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Price Rules (Tarifas)
CREATE TABLE public.price_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  court_type public.court_type NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  amount_total INTEGER NOT NULL,
  amount_deposit INTEGER NOT NULL,
  is_peak BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reservations
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status public.reservation_status NOT NULL DEFAULT 'HOLD',
  payment_mode public.payment_mode,
  payment_provider public.payment_provider,
  payment_ref TEXT,
  hold_expires_at TIMESTAMP WITH TIME ZONE,
  amount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment Proofs (Comprobantes)
CREATE TABLE public.payment_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  proof_type public.proof_type NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Court Blocks (Bloqueos por mantención/eventos)
CREATE TABLE public.court_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Business Settings (Configuración del negocio)
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT 'ReservaCanchas Pro',
  whatsapp TEXT,
  webpay_link_deposit TEXT,
  webpay_link_full TEXT,
  webpay_plus_commerce_code TEXT,
  webpay_plus_api_key TEXT,
  webpay_plus_environment TEXT DEFAULT 'integration',
  cancellation_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Operating Hours (Horarios de atención)
CREATE TABLE public.operating_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Roles (for admin access)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read policies for venues, courts, price_rules, operating_hours
CREATE POLICY "Public can view active venues" ON public.venues FOR SELECT USING (active = true);
CREATE POLICY "Public can view active courts" ON public.courts FOR SELECT USING (active = true);
CREATE POLICY "Public can view price rules" ON public.price_rules FOR SELECT USING (true);
CREATE POLICY "Public can view operating hours" ON public.operating_hours FOR SELECT USING (true);
CREATE POLICY "Public can view business settings" ON public.business_settings FOR SELECT USING (true);

-- Reservation policies
CREATE POLICY "Anyone can create reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their reservations by email" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Admins can update reservations" ON public.reservations FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reservations" ON public.reservations FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Payment proofs policies
CREATE POLICY "Anyone can insert payment proofs" ON public.payment_proofs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view payment proofs" ON public.payment_proofs FOR SELECT USING (true);

-- Court blocks policies
CREATE POLICY "Public can view court blocks" ON public.court_blocks FOR SELECT USING (true);
CREATE POLICY "Admins can manage court blocks" ON public.court_blocks FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for managing data
CREATE POLICY "Admins can manage venues" ON public.venues FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage courts" ON public.courts FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage price rules" ON public.price_rules FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage operating hours" ON public.operating_hours FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage business settings" ON public.business_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Admins can view user roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON public.courts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_settings_updated_at BEFORE UPDATE ON public.business_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_reservations_date ON public.reservations(date);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_reservations_court_date ON public.reservations(court_id, date);
CREATE INDEX idx_courts_venue ON public.courts(venue_id);
CREATE INDEX idx_price_rules_venue ON public.price_rules(venue_id);
CREATE INDEX idx_operating_hours_venue ON public.operating_hours(venue_id);
CREATE INDEX idx_court_blocks_court_date ON public.court_blocks(court_id, date);