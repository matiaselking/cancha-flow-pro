import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { useVenues, useOperatingHours } from '@/hooks/useVenues';

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function ContactSection() {
  const { data: settings } = useBusinessSettings();
  const { data: venues } = useVenues();
  const { data: operatingHours } = useOperatingHours();

  const venue = venues?.[0];
  const whatsappNumber = settings?.whatsapp || venue?.whatsapp || '+56912345678';
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const message = encodeURIComponent('Hola! Tengo una consulta sobre sus canchas.');

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Contacto</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            <span className="text-gradient">Ubicación</span> y horarios
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="bg-gradient-card border-primary/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-display font-semibold text-lg">{venue?.name || 'Espacio Deportivo Puente Alto'}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary shrink-0 mt-1" size={18} />
                    <div>
                      <p className="font-medium">{venue?.address || 'Av. Concha y Toro 2350'}</p>
                      <p className="text-muted-foreground text-sm">{venue?.comuna || 'Puente Alto'}, Santiago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-primary shrink-0" size={18} />
                    <p>{whatsappNumber}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="text-primary shrink-0" size={18} />
                    <p>contacto@reservacanchas.cl</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${cleanNumber}?text=${message}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="whatsapp" className="w-full mt-4">
                    <MessageCircle size={18} />
                    Escribir por WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-primary" size={20} />
                  <h3 className="font-display font-semibold text-lg">Horarios de Atención</h3>
                </div>
                
                <div className="space-y-2">
                  {operatingHours?.map((hours) => (
                    <div key={hours.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{dayNames[hours.day_of_week]}</span>
                      <span className="font-medium">
                        {hours.is_closed ? 'Cerrado' : `${hours.open_time.slice(0, 5)} - ${hours.close_time.slice(0, 5)}`}
                      </span>
                    </div>
                  )) || (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lunes a Domingo</span>
                        <span className="font-medium">09:00 - 23:00</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full min-h-[400px] overflow-hidden">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.6745123456789!2d-70.5666!3d-33.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM2JzAwLjAiUyA3MMKwMzQnMDAuMCJX!5e0!3m2!1ses!2scl!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
