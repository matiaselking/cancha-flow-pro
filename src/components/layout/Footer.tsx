import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">RC</span>
              </div>
              <span className="font-display font-bold text-lg">
                ReservaCanchas <span className="text-primary">Pro</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Tu plataforma de reservas deportivas en Chile. Fútbol y pádel a un click.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Enlaces</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Inicio</Link>
              <Link to="/reservar" className="text-muted-foreground hover:text-primary transition-colors text-sm">Reservar</Link>
              <Link to="/#sedes" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sedes</Link>
              <Link to="/#precios" className="text-muted-foreground hover:text-primary transition-colors text-sm">Precios</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin size={16} className="text-primary" />
                <span>Puente Alto, Santiago</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone size={16} className="text-primary" />
                <span>+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail size={16} className="text-primary" />
                <span>contacto@reservacanchas.cl</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Horarios</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>Lunes a Domingo</span>
              </div>
              <p className="pl-6">09:00 - 23:00 hrs</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} ReservaCanchas Pro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
