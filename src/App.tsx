import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import KidLoader from './components/KidLoader';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlayZonePage from './pages/PlayZonePage';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <BrowserRouter>
      <Navbar />

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
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/play" element={<PlayZonePage />} />
            </Routes>
          </motion.main>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
