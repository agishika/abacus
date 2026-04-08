import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './KidLoader.css';

// ─── Constants ─────────────────────────────────────────────────
const BEAD_COLORS = [
  '#3b82f6', // Champs Blue
  '#facc15', // Sunny Yellow
  '#ef4444', // Apple Red
  '#3b82f6', // Champs Blue
  '#facc15', // Sunny Yellow
];

// Simple physics and rendering logic
interface BeadState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isPopping: number; // >0 means it's animating a pop
}

interface KidLoaderProps {
  onComplete?: () => void;
}

export default function KidLoader({ onComplete }: KidLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const beadsRef = useRef<BeadState[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first interaction or mount (some browsers require user interaction, but since it's a loader it might work if we just instantiate it)
  useEffect(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    } catch(e) {
      console.warn("AudioContext init failed", e);
    }
    return () => {
       if (audioCtxRef.current) {
          audioCtxRef.current.close().catch(console.error);
       }
    };
  }, []);

  const playPopSound = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    // Resume context if suspended
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Cute high-pitched pop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

    // Envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  // Initialize beads
  useEffect(() => {
    const w = window.innerWidth;
    const h = Math.min(window.innerHeight, 500); // constrain bounce area
    
    beadsRef.current = Array.from({ length: 5 }).map((_, i) => ({
      x: Math.random() * (w - 100) + 50,
      y: Math.random() * (h - 100) + 50,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      radius: 40,
      color: BEAD_COLORS[i],
      isPopping: 0,
    }));
  }, []);

  // Physics loop
  useEffect(() => {
    startTimeRef.current = performance.now();
    const w = window.innerWidth;
    const h = window.innerHeight;

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const beads = beadsRef.current;

      // Update positions
      for (const b of beads) {
        b.x += b.vx;
        b.y += b.vy;
        
        if (b.isPopping > 0) {
          b.isPopping -= 0.05;
        }

        // Wall collisions
        if (b.x < b.radius || b.x > w - b.radius) {
          b.vx *= -1;
          b.x = Math.max(b.radius, Math.min(b.x, w - b.radius));
        }
        if (b.y < b.radius || b.y > h - b.radius) {
          b.vy *= -1;
          b.y = Math.max(b.radius, Math.min(b.y, h - b.radius));
        }
      }

      // Ball-to-ball collisions
      for (let i = 0; i < beads.length; i++) {
        for (let j = i + 1; j < beads.length; j++) {
          const b1 = beads[i];
          const b2 = beads[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist) {
            // Collision!
            b1.isPopping = 1;
            b2.isPopping = 1;

            // Play cute pop sound
            playPopSound();

            // Simple elastic push
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            
            b1.x -= nx * overlap * 0.5;
            b1.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            // Swap velocities (simplified equal mass)
            const p = 2 * (b1.vx * nx + b1.vy * ny - b2.vx * nx - b2.vy * ny) / 2;
            b1.vx = b1.vx - p * nx;
            b1.vy = b1.vy - p * ny;
            b2.vx = b2.vx + p * nx;
            b2.vy = b2.vy + p * ny;
          }
        }
      }

      // Render manually via direct DOM manipulation for 60fps
      if (canvasRef.current) {
        const domBeads = canvasRef.current.children;
        for (let i = 0; i < domBeads.length; i++) {
          const b = beads[i];
          const scale = b.isPopping > 0 ? 1 + (b.isPopping * 0.3) : 1;
          (domBeads[i] as HTMLElement).style.transform = `translate(${b.x - b.radius}px, ${b.y - b.radius}px) scale(${scale})`;
          
          if (b.isPopping > 0.95) {
             (domBeads[i] as HTMLElement).classList.add('pop-flash');
          } else {
             (domBeads[i] as HTMLElement).classList.remove('pop-flash');
          }
        }
      }

      // Loading Progress Simulation
      let t = Math.min(elapsed / 4500, 1);
      const pct = Math.floor(t * 100);
      setProgress(pct);

      if (pct >= 100) {
        setTimeout(() => {
          setShowLoader(false);
          onComplete?.();
        }, 800);
        return; // end loop
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="kid-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          <div className="kid-loader-bg" />

          {/* Canvas for beads */}
          <div className="kid-beads-canvas" ref={canvasRef}>
            {BEAD_COLORS.map((color, i) => (
              <div
                key={i}
                className="kid-bead"
                style={{ backgroundColor: color }}
              >
                <div className="kid-bead-highlight" />
                <div className="kid-bead-shadow" />
              </div>
            ))}
          </div>

          {/* Progress Bar Header for Parents */}
          <div className="kid-progress-container">
            <div className="kid-progress-text">
              <span className="kid-loader-title">Champs World Abacus</span>
              <span className="kid-loader-percent">{progress}%</span>
            </div>
            <div className="kid-progress-track">
              <div
                className="kid-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
