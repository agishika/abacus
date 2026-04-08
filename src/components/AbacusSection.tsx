import InteractiveAbacus from './InteractiveAbacus';
import './AbacusSection.css';

export default function AbacusSection() {
  return (
    <section className="abacus-section" id="interactive-abacus">
      <div className="abacus-header">
        <h2 className="abacus-title">
          Master the <span className="abacus-title-accent">Virtual Abacus</span>
        </h2>
        <p className="abacus-subtitle">
          Toggle the heavenly and earthly beads below to see instant calculations on the neon LED display. Try it yourself!
        </p>
      </div>

      <div className="abacus-canvas-container">
        <InteractiveAbacus />
      </div>
    </section>
  );
}
