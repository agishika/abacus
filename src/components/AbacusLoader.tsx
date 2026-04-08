import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AbacusLoader.css';

// ─── Constants ─────────────────────────────────────────────────
const ROD_COUNT = 5;
const BEADS_PER_ROD = 5; // 1 heaven, 4 earth
const TOTAL_BEADS = ROD_COUNT * BEADS_PER_ROD;
const ROD_SPACING = 44;
const BEAD_SPACING = 20;

// ─── Bead Component ────────────────────────────────────────────
interface BeadProps {
  index: number;
  isStacking: boolean;
  initialPos: { x: number; y: number };
  stackedPos: { x: number; y: number };
}

function Bead({ index, isStacking, initialPos, stackedPos }: BeadProps) {
  // Generate stable bob keyframes for this bead
  const bobKeyframes = useMemo(() => {
    const amp = 12 + Math.random() * 10;
    const xDrift = 6 + Math.random() * 8;
    return {
      y: [
        initialPos.y,
        initialPos.y - amp,
        initialPos.y + amp * 0.6,
        initialPos.y - amp * 0.4,
        initialPos.y + amp * 0.8,
        initialPos.y - amp * 0.7,
        initialPos.y,
      ],
      x: [
        initialPos.x,
        initialPos.x + xDrift,
        initialPos.x - xDrift * 0.7,
        initialPos.x + xDrift * 0.5,
        initialPos.x - xDrift * 0.3,
        initialPos.x + xDrift * 0.6,
        initialPos.x,
      ],
    };
  }, [initialPos]);

  return (
    <motion.div
      className="abacus-bead"
      initial={{ x: initialPos.x, y: initialPos.y, scale: 0, opacity: 0 }}
      animate={
        isStacking
          ? { x: stackedPos.x, y: stackedPos.y, scale: 1, opacity: 1 }
          : { ...bobKeyframes, scale: 1, opacity: 1 }
      }
      transition={
        isStacking
          ? {
              type: 'spring',
              stiffness: 250,
              damping: 18,
              mass: 0.8,
              delay: index * 0.03, // faster stagger for more beads
            }
          : {
              y: { duration: 3 + (index % 3) * 0.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
              x: { duration: 4 + (index % 4) * 0.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
              scale: { duration: 0.6, delay: (index % 10) * 0.05, ease: 'backOut' },
              opacity: { duration: 0.4, delay: (index % 10) * 0.05 },
            }
      }
    >
      <div className="bead-highlight" />
      <div className="bead-highlight-secondary" />
      <motion.div
         className="bead-shadow"
         animate={
           isStacking
             ? { opacity: 0.25, scale: 0.7 }
             : { opacity: [0.12, 0.2, 0.12], scale: [0.8, 1, 0.8] }
         }
         transition={
           isStacking
             ? { duration: 0.4, delay: index * 0.03 }
             : { duration: 2 + (index % 3) * 0.3, repeat: Infinity, ease: 'easeInOut' }
         }
      />
      <motion.div
         className="bead-glow"
         animate={
           isStacking
             ? { opacity: [0.5, 0.15], scale: [1.4, 1.1] }
             : { opacity: [0.05, 0.2, 0.05], scale: [1.0, 1.2, 1.0] }
         }
         transition={{
           duration: isStacking ? 0.5 : 2 + (index % 3) * 0.2,
           repeat: isStacking ? 0 : Infinity,
           ease: 'easeInOut',
           delay: isStacking ? index * 0.03 : 0,
         }}
       />
    </motion.div>
  );
}

// ─── Abacus Frame Component ────────────────────────────────────
function AbacusFrame({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="abacus-structure"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="abacus-outer-frame" />
      <div className="abacus-beam" />
      
      {/* Vertical Rods */}
      {Array.from({ length: ROD_COUNT }).map((_, i) => (
        <div 
          key={i} 
          className="abacus-rod-vertical"
          style={{ left: `calc(50% + ${(i - (ROD_COUNT - 1) / 2) * ROD_SPACING}px)` }}
        >
           <div className="rod-inner-glow" />
        </div>
      ))}
    </motion.div>
  );
}

// ─── Main Loader Component ─────────────────────────────────────
interface AbacusLoaderProps {
  onComplete?: () => void;
}

export default function AbacusLoader({ onComplete }: AbacusLoaderProps) {
  const [phase, setPhase] = useState<'floating' | 'stacking' | 'complete'>('floating');
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Generate bead coordinates once
  const { initialPositions, stackedPositions } = useMemo(() => {
    const initials = [];
    const stackeds = [];
    
    for (let i = 0; i < TOTAL_BEADS; i++) {
       // Random float pos
       initials.push({
         x: (Math.random() - 0.5) * 280,
         y: (Math.random() - 0.5) * 200,
       });

       // Final structured pos
       const rodIndex = Math.floor(i / BEADS_PER_ROD);
       const beadOnRod = i % BEADS_PER_ROD;
       const x = +(rodIndex - (ROD_COUNT - 1) / 2) * ROD_SPACING;
       
       // 0 is heaven bead (above beam), 1-4 are earth beads (below)
       // beam is around y = -20
       let y = 0;
       if (beadOnRod === 0) {
          y = -56;
       } else {
          y = 10 + (beadOnRod - 1) * BEAD_SPACING;
       }
       stackeds.push({ x, y });
    }
    return { initialPositions: initials, stackedPositions: stackeds };
  }, []);

  // Simulate page hydration progress
  useEffect(() => {
    startTimeRef.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;

      // Ease-in-out loading simulation (~4s total)
      let t = Math.min(elapsed / 4000, 1);
      // Smooth ease: slow start, fast middle, slow end
      t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const pct = Math.min(Math.floor(t * 100), 100);

      if (pct !== progressRef.current) {
        progressRef.current = pct;
        setProgress(pct);

        if (pct >= 75 && phase === 'floating') {
          setPhase('stacking');
        }
        if (pct >= 100) {
          setPhase('complete');
          // Fade out loader after completion hold
          setTimeout(() => {
            setShowLoader(false);
            onComplete?.();
          }, 1200);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, onComplete]);

  const isStacking = phase === 'stacking' || phase === 'complete';

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="abacus-loader"
          id="abacus-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Background subtle gradient */}
          <div className="loader-bg" />

          {/* Central assembly */}
          <div className="abacus-assembly" style={{ width: '400px', height: '320px' }}>
            
            {/* The structural frame of the abacus */}
            <AbacusFrame visible={isStacking} />

            {/* All beads */}
            {Array.from({ length: TOTAL_BEADS }).map((_, i) => (
              <Bead 
                key={i} 
                index={i} 
                isStacking={isStacking}
                initialPos={initialPositions[i]}
                stackedPos={stackedPositions[i]}
              />
            ))}

            {/* Magnetic snap flash on completion */}
            <AnimatePresence>
              {phase === 'complete' && (
                <motion.div
                  className="snap-flash"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 2] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Progress UI */}
          <div className="loader-progress">
            <motion.span
              className="loader-label"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {phase === 'complete' ? 'Ready' : 'Loading'}
            </motion.span>

            <motion.span
              className="loader-percent"
              key={progress}
              initial={{ opacity: 0.7, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
            >
              {progress}%
            </motion.span>

            <div className="loader-bar-track">
              <motion.div
                className="loader-bar-fill"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
