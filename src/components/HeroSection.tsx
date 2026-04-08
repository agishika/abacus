import { motion } from 'framer-motion';
import DaylightSpaceScene from './DaylightSpaceScene';
import './HeroSection.css';

// ─── Stagger animation variants ────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

// ─── Hero Section Component ─────────────────────────────────────
export default function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      {/* Daylight Space 3D Background */}
      <DaylightSpaceScene />

      {/* Content */}
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Tagline */}
        <motion.p className="hero-tagline" variants={itemVariants}>
          Where Numbers Meet Intuition
        </motion.p>

        {/* Main headline */}
        <motion.h1 className="hero-headline" variants={itemVariants}>
          Turn Math into Your
          <br />
          <span className="hero-headline-accent">Superpower!</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p className="hero-description" variants={itemVariants}>
          We don't just teach math — we forge a <strong>Champion Mindset</strong>.
          Our globally recognized abacus program unlocks extraordinary
          mental agility, unshakeable focus, and the confidence to dominate
          any intellectual arena.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="hero-actions" variants={itemVariants}>
          <motion.button
            className="hero-btn hero-btn-primary"
            id="cta-enroll"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Enroll
            <span className="btn-arrow">→</span>
          </motion.button>
          <motion.button
            className="hero-btn hero-btn-secondary"
            id="cta-learn-more"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Programs
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div className="hero-trust" variants={itemVariants}>
          <div className="trust-item">
            <span className="trust-number">12K+</span>
            <span className="trust-label">Champions Trained</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-number">98%</span>
            <span className="trust-label">Success Rate</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-number">45+</span>
            <span className="trust-label">Countries</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
