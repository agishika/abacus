import { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Environment, Center } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ─── Material Constants ─────────────────────────────────────
const frameMaterial = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  roughness: 0.3,
  metalness: 0.8,
});

const rodMaterial = new THREE.MeshStandardMaterial({
  color: '#94a3b8',
  roughness: 0.2,
  metalness: 0.9,
});

const beadMaterial = new THREE.MeshPhysicalMaterial({
  color: '#3b82f6',
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});

// ─── Bead Component ─────────────────────────────────────────
interface BeadProps {
  position: [number, number, number];
  targetY: number;
  onClick: () => void;
}

function Bead({ position, targetY, onClick }: BeadProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      // Smoothly animate to target Y position
      meshRef.current.position.y = THREE.MathUtils.damp(
        meshRef.current.position.y,
        targetY,
        15, // lambda (speed)
        delta
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      material={beadMaterial}
    >
      {/* A somewhat flattened torus makes a nice abacus bead shape */}
      <torusGeometry args={[0.35, 0.15, 16, 32]} />
      <meshPhysicalMaterial
        color="#38bdf8"
        roughness={0.1}
        metalness={0.2}
        clearcoat={1}
      />
    </mesh>
  );
}

// ─── Rod Component ──────────────────────────────────────────
interface RodState {
  upper: boolean;
  lower: number; // 0 to 4
}

interface RodProps {
  x: number;
  state: RodState;
  onChange: (newState: RodState) => void;
}

function Rod({ x, state, onChange }: RodProps) {
  // Upper bead active is true -> moved down to center beam
  const upperY = state.upper ? 2.0 : 3.5;

  // Function to get proper Y coordinates for a lower bead
  const getLowerY = (index: number) => {
    if (index < state.lower) {
      // Bead is active (part of the top cluster touching center beam)
      return 0.9 - index * 0.8;
    } else {
      // Bead is inactive (part of the bottom cluster)
      return -0.7 - index * 0.8;
    }
  };

  const handleUpperClick = () => {
    onChange({ ...state, upper: !state.upper });
  };

  const handleLowerClick = (index: number) => {
    let newLower = state.lower;
    if (index < state.lower) {
      // Clicked an active bead -> deactivate it and all below it
      newLower = index;
    } else {
      // Clicked an inactive bead -> activate it and all above it
      newLower = index + 1;
    }
    onChange({ ...state, lower: newLower });
  };

  return (
    <group position={[x, 0, 0]}>
      {/* Central Rod/Wire */}
      <mesh position={[0, 0.25, 0]} material={rodMaterial}>
        <cylinderGeometry args={[0.08, 0.08, 7.5, 16]} />
      </mesh>

      {/* Upper Bead */}
      <Bead
        position={[0, upperY, 0]}
        targetY={upperY}
        onClick={handleUpperClick}
      />

      {/* 4 Lower Beads */}
      {[0, 1, 2, 3].map((i) => (
        <Bead
          key={`lower-${i}`}
          position={[0, getLowerY(i), 0]}
          targetY={getLowerY(i)}
          onClick={() => handleLowerClick(i)}
        />
      ))}
    </group>
  );
}

// ─── Digital LED Screen Overlay ─────────────────────────────
interface LedScreenProps {
  value: number;
}

function LedScreen({ value }: LedScreenProps) {
  // Format to 7 digits with leading zeros
  const digits = value.toString().padStart(7, '0').split('');

  return (
    <div className="abacus-led-screen">
      <div className="led-digits-container">
        {digits.map((digit, i) => (
          <div key={i} className="led-digit-column">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`${i}-${digit}`}
                className="led-digit"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                  duration: 0.15,
                  ease: 'backOut',
                }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Interactive Abacus ────────────────────────────────
export default function InteractiveAbacus() {
  const NUM_RODS = 7;
  const ROD_SPACING = 1.8;

  // Initialize all 7 rods to zero state
  const [rods, setRods] = useState<RodState[]>(
    Array(NUM_RODS).fill({ upper: false, lower: 0 })
  );

  const handleRodChange = (index: number, newState: RodState) => {
    setRods((prev) => {
      const copy = [...prev];
      copy[index] = newState;
      return copy;
    });
  };

  // Calculate total value
  const totalValue = useMemo(() => {
    return rods.reduce((acc, rod, idx) => {
      const rodVal = (rod.upper ? 5 : 0) + rod.lower;
      const power = NUM_RODS - 1 - idx;
      return acc + rodVal * Math.pow(10, power);
    }, 0);
  }, [rods]);

  const frameWidth = NUM_RODS * ROD_SPACING + 1.5;

  return (
    <Canvas camera={{ position: [0, 1.5, 12], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="city" />

      <Center>
        <group>
          {/* Main Outer Frame Elements */}
          {/* Top Beam with LED Screen */}
          <mesh position={[0, 4.4, 0]} material={frameMaterial}>
            <boxGeometry args={[frameWidth, 1.2, 0.5]} />
          </mesh>

          {/* HTML Overlay mounted perfectly on the Top Beam */}
          <Html
            transform
            position={[0, 4.4, 0.26]}
            scale={0.4}
            zIndexRange={[100, 0]}
            occlude="blending"
          >
            <LedScreen value={totalValue} />
          </Html>

          {/* Center Dividing Beam */}
          <mesh position={[0, 1.5, 0]} material={frameMaterial}>
            <boxGeometry args={[frameWidth, 0.4, 0.5]} />
          </mesh>

          {/* Bottom Beam */}
          <mesh position={[0, -3.7, 0]} material={frameMaterial}>
            <boxGeometry args={[frameWidth, 0.6, 0.5]} />
          </mesh>

          {/* Left Border */}
          <mesh position={[-frameWidth / 2 + 0.25, 0.35, 0]} material={frameMaterial}>
            <boxGeometry args={[0.5, 8.7, 0.5]} />
          </mesh>

          {/* Right Border */}
          <mesh position={[frameWidth / 2 - 0.25, 0.35, 0]} material={frameMaterial}>
            <boxGeometry args={[0.5, 8.7, 0.5]} />
          </mesh>

          {/* Render Rods */}
          {rods.map((state, i) => {
            // Center the rods horizontally
            const x = (i - (NUM_RODS - 1) / 2) * ROD_SPACING;
            return (
              <Rod
                key={i}
                x={x}
                state={state}
                onChange={(newState) => handleRodChange(i, newState)}
              />
            );
          })}
        </group>
      </Center>
    </Canvas>
  );
}
