import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Mail, Phone, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useVenues, useCourts, usePriceRules, useOperatingHours } from '@/hooks/useVenues';
import { useReservations, useCreateReservation } from '@/hooks/useReservations';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { useToast } from '@/hooks/use-toast';
import type { Court, TimeSlot, PaymentMode } from '@/types/database';

const SLOT_DURATION = 60; // minutes

export default function ReservarPage() {
  const { toast } = useToast();
  const { data: venues, isLoading: venuesLoading } = useVenues();
  const { data: courts } = useCourts();
  const { data: priceRules } = usePriceRules();
  const { data: operatingHours } = useOperatingHours();
  const { data: settings } = useBusinessSettings();
  const createReservation = useCreateReservation();
  
  // State
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [selectedCourtType, setSelectedCourtType] = useState<'FUTBOL' | 'PADEL'>('FUTBOL');
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [step, setStep] = useState<'select' | 'form' | 'payment' | 'confirm'>('select');
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('DEPOSIT');

  // Get reservations for the selected court and week
  const { data: reservations } = useReservations({
    courtId: selectedCourt,
  });

  // Filter courts by venue and type
  const filteredCourts = useMemo(() => {
    if (!courts || !selectedVenue) return [];
    return courts.filter(c => c.venue_id === selectedVenue && c.court_type === selectedCourtType);
  }, [courts, selectedVenue, selectedCourtType]);

  // Auto-select first venue
  useMemo(() => {
    if (venues?.length && !selectedVenue) {
      setSelectedVenue(venues[0].id);
    }
  }, [venues, selectedVenue]);

  // Auto-select first court
  useMemo(() => {
    if (filteredCourts.length && !selectedCourt) {
      setSelectedCourt(filteredCourts[0].id);
    }
  }, [filteredCourts, selectedCourt]);

  // Generate week days
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  // Generate time slots for a day
  const getTimeSlotsForDay = (date: Date): TimeSlot[] => {
    const dayOfWeek = date.getDay();
    const hours = operatingHours?.find(h => h.venue_id === selectedVenue && h.day_of_week === dayOfWeek);
    
    if (!hours || hours.is_closed) return [];

    const slots: TimeSlot[] = [];
    const openHour = parseInt(hours.open_time.split(':')[0]);
    const closeHour = parseInt(hours.close_time.split(':')[0]);

    for (let hour = openHour; hour < closeHour; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      
      // Check if slot is booked
      const isBooked = reservations?.some(r => {
        const resDate = parseISO(r.date);
        return isSameDay(resDate, date) && 
               r.start_time.startsWith(timeStr) && 
               (r.status === 'PAID' || r.status === 'PENDING');
      });

      // Check if slot is on hold
      const isHold = reservations?.some(r => {
        const resDate = parseISO(r.date);
        return isSameDay(resDate, date) && 
               r.start_time.startsWith(timeStr) && 
               r.status === 'HOLD' &&
               new Date(r.hold_expires_at!) > new Date();
      });

      // Get price
      const rule = priceRules?.find(p => 
        p.venue_id === selectedVenue && 
        p.court_type === selectedCourtType &&
        p.day_of_week === dayOfWeek &&
        hour >= parseInt(p.start_time.split(':')[0]) &&
        hour < parseInt(p.end_time.split(':')[0])
      );

      slots.push({
        time: timeStr,
        available: !isBooked && !isHold && date >= new Date(),
        status: isBooked ? 'booked' : isHold ? 'hold' : 'available',
        price: rule?.amount_total,
        isPeak: rule?.is_peak || false,
      });
    }

    return slots;
  };

  const handleSlotSelect = (date: Date, time: string) => {
    setSelectedSlot({ date, time });
    setStep('form');
  };

  const getSelectedPrice = () => {
    if (!selectedSlot) return { total: 0, deposit: 0 };
    
    const dayOfWeek = selectedSlot.date.getDay();
    const hour = parseInt(selectedSlot.time.split(':')[0]);
    
    const rule = priceRules?.find(p => 
      p.venue_id === selectedVenue && 
      p.court_type === selectedCourtType &&
      p.day_of_week === dayOfWeek &&
      hour >= parseInt(p.start_time.split(':')[0]) &&
      hour < parseInt(p.end_time.split(':')[0])
    );

    return {
      total: rule?.amount_total || 0,
      deposit: rule?.amount_deposit || 0,
    };
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedCourt) return;

    const price = getSelectedPrice();
    const amount = paymentMode === 'DEPOSIT' ? price.deposit : price.total;
    const endHour = parseInt(selectedSlot.time.split(':')[0]) + 1;

    try {
      const reservation = await createReservation.mutateAsync({
        venue_id: selectedVenue,
        court_id: selectedCourt,
        date: format(selectedSlot.date, 'yyyy-MM-dd'),
        start_time: selectedSlot.time,
        end_time: `${endHour.toString().padStart(2, '0')}:00`,
        customer_name: customerName,
        phone,
        email,
        payment_mode: paymentMode,
        payment_provider: 'WEBPAY_LINK',
        amount,
      });

      toast({
        title: '¡Reserva creada!',
        description: 'Tu reserva ha sido creada. Procede al pago para confirmarla.',
      });

      setStep('payment');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la reserva. Intenta nuevamente.',
        variant: 'destructive',
      });
    }
  };

  const selectedCourtData = courts?.find(c => c.id === selectedCourt);
  const selectedVenueData = venues?.find(v => v.id === selectedVenue);
  const price = getSelectedPrice();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Reserva tu <span className="text-gradient">cancha</span>
            </h1>
            <p className="text-muted-foreground">
              Selecciona fecha, hora y confirma tu reserva en minutos
            </p>
          </motion.div>

          {/* Step indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {['select', 'form', 'payment', 'confirm'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === s ? 'bg-primary text-primary-foreground' : 
                    ['select', 'form', 'payment', 'confirm'].indexOf(step) > i ? 'bg-primary/50 text-primary-foreground' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  {i < 3 && <div className="w-8 h-0.5 bg-border" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {step === 'select' && (
                <>
                  {/* Filters */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="mb-2 block">Sede</Label>
                          <Select value={selectedVenue} onValueChange={(v) => {
                            setSelectedVenue(v);
                            setSelectedCourt('');
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar sede" />
                            </SelectTrigger>
                            <SelectContent>
                              {venues?.map(venue => (
                                <SelectItem key={venue.id} value={venue.id}>
                                  {venue.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="mb-2 block">Tipo</Label>
                          <Select value={selectedCourtType} onValueChange={(v: 'FUTBOL' | 'PADEL') => {
                            setSelectedCourtType(v);
                            setSelectedCourt('');
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FUTBOL">⚽ Fútbol</SelectItem>
                              <SelectItem value="PADEL">🎾 Pádel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="mb-2 block">Cancha</Label>
                          <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cancha" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredCourts.map(court => (
                                <SelectItem key={court.id} value={court.id}>
                                  {court.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Calendar */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Disponibilidad</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setWeekStart(addDays(weekStart, -7))}
                          >
                            <ChevronLeft size={20} />
                          </Button>
                          <span className="text-sm font-medium min-w-[200px] text-center">
                            {format(weekStart, "d MMM", { locale: es })} - {format(addDays(weekStart, 6), "d MMM yyyy", { locale: es })}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setWeekStart(addDays(weekStart, 7))}
                          >
                            <ChevronRight size={20} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <div className="min-w-[700px]">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                          {weekDays.map(day => (
                            <div key={day.toISOString()} className="text-center">
                              <div className="text-xs text-muted-foreground uppercase">
                                {format(day, 'EEE', { locale: es })}
                              </div>
                              <div className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
                                {format(day, 'd')}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Time slots */}
                        <div className="grid grid-cols-7 gap-2">
                          {weekDays.map(day => (
                            <div key={day.toISOString()} className="space-y-1">
                              {getTimeSlotsForDay(day).map(slot => (
                                <button
                                  key={`${day.toISOString()}-${slot.time}`}
                                  disabled={!slot.available}
                                  onClick={() => slot.available && handleSlotSelect(day, slot.time)}
                                  className={`w-full py-2 px-1 text-xs rounded border transition-all ${
                                    slot.status === 'available' 
                                      ? 'slot-available hover:scale-105' 
                                      : slot.status === 'hold'
                                      ? 'slot-hold'
                                      : 'slot-booked'
                                  }`}
                                >
                                  <div className="font-medium">{slot.time}</div>
                                  {slot.available && slot.price && (
                                    <div className={`text-[10px] ${slot.isPeak ? 'text-accent' : 'text-primary'}`}>
                                      ${(slot.price / 1000).toFixed(0)}k
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded slot-available border" />
                            <span>Disponible</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded slot-hold border" />
                            <span>En espera</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded slot-booked border" />
                            <span>Reservado</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {step === 'form' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Datos de reserva</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre completo</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input 
                            id="name" 
                            className="pl-10"
                            placeholder="Juan Pérez"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input 
                            id="phone" 
                            className="pl-10"
                            placeholder="+56 9 1234 5678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input 
                          id="email" 
                          type="email"
                          className="pl-10"
                          placeholder="juan@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Modo de pago</Label>
                      <RadioGroup 
                        value={paymentMode} 
                        onValueChange={(v) => setPaymentMode(v as PaymentMode)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                          <RadioGroupItem value="DEPOSIT" id="deposit" />
                          <Label htmlFor="deposit" className="flex-1 cursor-pointer">
                            <span className="font-medium">Abono (50%)</span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ${price.deposit.toLocaleString('es-CL')} ahora, resto al llegar
                            </span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                          <RadioGroupItem value="FULL" id="full" />
                          <Label htmlFor="full" className="flex-1 cursor-pointer">
                            <span className="font-medium">Pago Total</span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ${price.total.toLocaleString('es-CL')}
                            </span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep('select')}>
                        Volver
                      </Button>
                      <Button 
                        variant="hero" 
                        className="flex-1"
                        onClick={handleSubmit}
                        disabled={!customerName || !phone || !email || createReservation.isPending}
                      >
                        {createReservation.isPending ? 'Procesando...' : 'Continuar al pago'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="text-primary" />
                      Pagar con Webpay
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Tu reserva está creada y pendiente de pago. Tienes 10 minutos para completar el pago antes de que se libere el horario.
                    </p>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Monto a pagar:</h4>
                      <div className="text-3xl font-display font-bold text-primary">
                        ${(paymentMode === 'DEPOSIT' ? price.deposit : price.total).toLocaleString('es-CL')}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={settings?.webpay_link_deposit || 'https://webpay.cl'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="hero" className="w-full" size="lg">
                          Pagar con Webpay
                        </Button>
                      </a>

                      <p className="text-sm text-muted-foreground text-center">
                        Al hacer click serás redirigido a Webpay. Una vez completado el pago, vuelve aquí y sube tu comprobante.
                      </p>
                    </div>

                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-semibold mb-3">¿Ya pagaste? Sube tu comprobante:</h4>
                      <div className="space-y-3">
                        <Input placeholder="Código de transacción Webpay" />
                        <Button variant="outline" className="w-full">
                          Enviar comprobante
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Resumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedVenueData && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="text-primary shrink-0 mt-0.5" size={16} />
                      <div>
                        <div className="font-medium">{selectedVenueData.name}</div>
                        <div className="text-muted-foreground">{selectedVenueData.address}</div>
                      </div>
                    </div>
                  )}

                  {selectedCourtData && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center text-[10px]">
                        {selectedCourtType === 'FUTBOL' ? '⚽' : '🎾'}
                      </div>
                      <span>{selectedCourtData.name}</span>
                    </div>
                  )}

                  {selectedSlot && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="text-primary" size={16} />
                      <div>
                        <div className="font-medium">
                          {format(selectedSlot.date, "EEEE d 'de' MMMM", { locale: es })}
                        </div>
                        <div className="text-muted-foreground">
                          {selectedSlot.time} - {(parseInt(selectedSlot.time) + 1).toString().padStart(2, '0')}:00
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSlot && (
                    <>
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Valor hora</span>
                          <span>${price.total.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Abono mínimo</span>
                          <span>${price.deposit.toLocaleString('es-CL')}</span>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between font-semibold">
                          <span>Total a pagar</span>
                          <span className="text-primary">
                            ${(paymentMode === 'DEPOSIT' ? price.deposit : price.total).toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
