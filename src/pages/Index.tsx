import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { HeroSection } from '@/components/landing/HeroSection';
import { VenuesSection } from '@/components/landing/VenuesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { GallerySection } from '@/components/landing/GallerySection';
import { FAQSection } from '@/components/landing/FAQSection';
import { ContactSection } from '@/components/landing/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <VenuesSection />
        <PricingSection />
        <GallerySection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
