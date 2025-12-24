import { motion } from 'framer-motion';
import { useState } from 'react';

const images = [
  { src: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800', alt: 'Cancha de fútbol iluminada' },
  { src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', alt: 'Partido de fútbol' },
  { src: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800', alt: 'Cancha sintética' },
  { src: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', alt: 'Cancha de pádel' },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Iluminación nocturna' },
  { src: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', alt: 'Jugadores celebrando' },
];

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Galería</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            Conoce nuestras <span className="text-gradient">instalaciones</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                  index === 0 ? 'h-full min-h-[300px] md:min-h-[400px]' : 'h-48 md:h-56'
                }`}
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}
