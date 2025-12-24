import { motion } from 'framer-motion';
import { Check, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PricingSection() {
  const plans = [
    {
      title: 'Fútbol Normal',
      subtitle: 'Lunes a Viernes 09:00 - 18:00',
      price: 18000,
      deposit: 9000,
      features: [
        '1 hora de juego',
        'Iluminación incluida',
        'Balón disponible',
        'Estacionamiento gratis',
      ],
      isPeak: false,
    },
    {
      title: 'Fútbol Peak',
      subtitle: 'Lunes a Viernes 18:00 - 23:00',
      price: 25000,
      deposit: 12500,
      features: [
        '1 hora de juego',
        'Iluminación LED premium',
        'Balón disponible',
        'Estacionamiento gratis',
        'Vestuarios disponibles',
      ],
      isPeak: true,
      popular: true,
    },
    {
      title: 'Fútbol Fin de Semana',
      subtitle: 'Sábado y Domingo todo el día',
      price: 28000,
      deposit: 14000,
      features: [
        '1 hora de juego',
        'Iluminación LED premium',
        'Balón disponible',
        'Estacionamiento gratis',
        'Vestuarios disponibles',
        'Snack bar abierto',
      ],
      isPeak: true,
    },
  ];

  return (
    <section id="precios" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Precios</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            Tarifas <span className="text-gradient">transparentes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Precios claros sin sorpresas. Reserva con abono del 50% o pago total.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden h-full ${plan.popular ? 'border-primary shadow-glow' : 'border-border/50'}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MÁS POPULAR
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.isPeak ? (
                      <Zap size={20} className="text-accent" />
                    ) : (
                      <Clock size={20} className="text-primary" />
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${plan.isPeak ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                      {plan.isPeak ? 'HORARIO PEAK' : 'HORARIO NORMAL'}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl">{plan.title}</h3>
                  <p className="text-muted-foreground text-sm">{plan.subtitle}</p>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold">${plan.price.toLocaleString('es-CL')}</span>
                      <span className="text-muted-foreground">/hora</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Abono desde ${plan.deposit.toLocaleString('es-CL')}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check size={16} className="text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/reservar">
                    <Button 
                      variant={plan.popular ? 'hero' : 'outline'} 
                      className="w-full"
                    >
                      Reservar Ahora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Padel section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-card border-primary/30">
            <CardContent className="py-8 px-6">
              <h3 className="font-display font-bold text-xl mb-2">🎾 Canchas de Pádel</h3>
              <p className="text-muted-foreground mb-4">
                Desde <span className="text-primary font-bold">$15.000</span> normal / <span className="text-accent font-bold">$22.000</span> fin de semana
              </p>
              <Link to="/reservar">
                <Button variant="heroOutline">Ver disponibilidad</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
