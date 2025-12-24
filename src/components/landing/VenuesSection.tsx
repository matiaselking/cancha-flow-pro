import { motion } from 'framer-motion';
import { MapPin, Users, Star } from 'lucide-react';
import { useVenues, useCourts } from '@/hooks/useVenues';
import { Card, CardContent } from '@/components/ui/card';

export function VenuesSection() {
  const { data: venues, isLoading } = useVenues();
  const { data: courts } = useCourts();

  const getCourtCount = (venueId: string, type: 'FUTBOL' | 'PADEL') => {
    return courts?.filter(c => c.venue_id === venueId && c.court_type === type).length || 0;
  };

  if (isLoading) {
    return (
      <section id="sedes" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-64 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sedes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Nuestras Sedes</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            Canchas de <span className="text-gradient">primera calidad</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Instalaciones modernas con césped sintético de última generación, iluminación LED y todos los servicios para tu comodidad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues?.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden bg-card hover:shadow-glow transition-all duration-300 border-border/50 hover:border-primary/50">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={venue.photos?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-sm bg-primary/90 text-primary-foreground px-2 py-1 rounded">
                    <Star size={14} fill="currentColor" />
                    <span>4.9</span>
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {venue.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin size={14} className="text-primary" />
                    <span>{venue.address}, {venue.comuna}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={14} className="text-secondary" />
                      <span>{getCourtCount(venue.id, 'FUTBOL')} Fútbol</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={14} className="text-accent" />
                      <span>{getCourtCount(venue.id, 'PADEL')} Pádel</span>
                    </div>
                  </div>

                  {venue.description && (
                    <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                      {venue.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
