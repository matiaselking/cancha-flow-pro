import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: '¿Cómo puedo reservar una cancha?',
    answer: 'Puedes reservar online a través de nuestra plataforma las 24 horas del día. Selecciona la fecha, hora y cancha disponible, ingresa tus datos y confirma con un abono o pago total mediante Webpay.',
  },
  {
    question: '¿Cuánto tiempo de anticipación necesito para reservar?',
    answer: 'Puedes reservar con hasta 7 días de anticipación. Para horarios peak (18:00-23:00 y fines de semana), te recomendamos reservar con al menos 2-3 días de anticipación.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos pagos con Webpay (tarjetas de crédito y débito de cualquier banco chileno). Puedes pagar el abono (50%) para confirmar la reserva o el monto total.',
  },
  {
    question: '¿Puedo cancelar o modificar mi reserva?',
    answer: 'Sí, puedes cancelar hasta 24 horas antes de tu reserva para obtener un reembolso completo. Cancelaciones con menos de 24 horas tienen un cargo del 50%. Para modificaciones, contáctanos por WhatsApp.',
  },
  {
    question: '¿Qué incluye el arriendo de la cancha?',
    answer: 'El arriendo incluye uso de la cancha por 1 hora, iluminación, estacionamiento gratuito y acceso a baños. Los balones están disponibles sin costo adicional, sujeto a disponibilidad.',
  },
  {
    question: '¿Tienen vestuarios y duchas?',
    answer: 'Sí, contamos con vestuarios equipados con duchas de agua caliente, lockers y bancas. Están disponibles sin costo adicional para todos nuestros clientes.',
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            Preguntas <span className="text-gradient">frecuentes</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
