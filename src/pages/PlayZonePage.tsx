import { useEffect } from 'react';
import AbacusSection from '../components/AbacusSection';

export default function PlayZonePage() {
  useEffect(() => {
    // Ensure we start at top of window when loading this separate page
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '80px' }}>
      <AbacusSection />
    </div>
  );
}
