import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ChampsInAction from '../components/ChampsInAction';
import Gallery from '../components/Gallery';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  const location = useLocation();

  // Handle hash scrolling when mounting or changing location inside this page
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -80; // Offset for the fixed 80px navbar height
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <HeroSection />
      <ChampsInAction />
      <Gallery />
      <ContactSection />
    </>
  );
}
