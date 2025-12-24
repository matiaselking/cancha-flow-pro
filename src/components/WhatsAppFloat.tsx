import { MessageCircle } from 'lucide-react';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

export function WhatsAppFloat() {
  const { data: settings } = useBusinessSettings();
  
  const whatsappNumber = settings?.whatsapp || '+56912345678';
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const message = encodeURIComponent('Hola! Me gustaría hacer una reserva en su cancha.');
  
  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float animate-pulse-glow"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  );
}
