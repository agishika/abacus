import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import KidLoader from './components/KidLoader';
import HeroSection from './components/HeroSection';
import Gallery from './components/Gallery';
import ChampsInAction from './components/ChampsInAction';
import ContactSection from './components/ContactSection';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Loader — fades out when done */}
      {!isLoaded && (
        <KidLoader onComplete={() => setIsLoaded(true)} />
      )}

      {/* Main site content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <HeroSection />
            <ChampsInAction />
            <Gallery />
            <ContactSection />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
