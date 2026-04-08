import { Suspense, lazy } from 'react';
import './AbacusSection.css';

// Lazy load the heavy 3D canvas component to improve initial page load speed
const InteractiveAbacus = lazy(() => import('./InteractiveAbacus'));

export default function AbacusSection() {
  return (
    <section className="abacus-section" id="interactive-abacus">
      <div className="abacus-header">
        <h2 className="abacus-title">
          Play <span className="abacus-title-accent">Zone</span>
        </h2>
        <p className="abacus-subtitle">
          <strong>Try it Yourself!</strong> Toggle the heavenly and earthly beads below to see instant calculations.
        </p>
      </div>

      <div className="abacus-canvas-container">
        <Suspense fallback={<div style={{ color: '#3b82f6', display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 600 }}>Loading 3D Abacus...</div>}>
          <InteractiveAbacus />
        </Suspense>
      </div>
    </section>
  );
}
