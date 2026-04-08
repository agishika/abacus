import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Fluffy Clouds ──────────────────────────────────────────────
function Cloud({ position, scale = 1, speed = 0.5 }: { position: [number, number, number], scale?: number, speed?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const initialY = position[1];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle floating
    groupRef.current.position.y = initialY + Math.sin(t * speed) * 0.5;
    // Slow drift
    groupRef.current.position.x += Math.sin(t * speed * 0.2) * 0.005;
  });

  // Randomize cloud puffs
  const puffs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 1.5,
        ] as [number, number, number],
        scale: 0.8 + Math.random() * 0.7,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {puffs.map((puff, i) => (
        <mesh key={i} position={puff.position} scale={puff.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshLambertMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Toy Abacus ─────────────────────────────────────────────────
function ToyAbacus({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle bob and spin
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3;
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.2;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
  });

  const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#eab308', '#f97316'];

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0.2, -0.4, 0]}>
      {/* Outer Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 4, 0.4]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.3} />
      </mesh>
      {/* Frame cutout */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[5.2, 3.2, 0.5]} />
        <meshStandardMaterial color="#2d3748" /> {/* Dark background behind beads */}
      </mesh>

      {/* Rods and Beads */}
      {[-2, -1, 0, 1, 2].map((x, i) => (
        <group key={`rod-${i}`} position={[x, 0, 0]}>
          {/* Rod */}
          <mesh position={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.05, 0.05, 3.2, 16]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.8} />
          </mesh>
          {/* Beads */}
          {[-1, -0.3, 0.4, 1.1].map((y, j) => (
            <mesh key={`bead-${i}-${j}`} position={[0, y, 0.2]}>
              {/* Torus mimicking a chunky bead */}
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshPhysicalMaterial 
                color={colors[(i + j) % colors.length]} 
                roughness={0.1}
                clearcoat={1}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── Math Champ Astronaut ───────────────────────────────────────
function Astronaut({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.4;
    groupRef.current.position.x = position[0] + Math.cos(t * 0.8) * 0.2;
    
    // Waving animation
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(t * 4) * 0.5 - 2.5; 
      // -2.5 is the base raised angle, plus the wave oscillation
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, -0.5, 0.2]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 0.8, 16, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      
      {/* Helmet Base */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>
      
      {/* Visor */}
      <mesh position={[0, 0.85, 0.4]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhysicalMaterial 
          color="#38bdf8" 
          metalness={0.9} 
          roughness={0.1} 
          transparent 
          opacity={0.9}
        />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0.2, -0.6]}>
        <boxGeometry args={[0.8, 1, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* Left Arm (Waving) */}
      <group ref={armRef} position={[-0.6, 0.3, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.15, 0.6, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Right Arm */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.15, 0.6, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.25, -0.8, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.18, 0.6, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.25, -0.7, 0]} rotation={[-0.2, 0, 0]}>
        <capsuleGeometry args={[0.18, 0.6, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// ─── Scene Assembly ─────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#bae6fd" />

      {/* Clouds */}
      <Cloud position={[-8, 4, -5]} scale={1.2} speed={0.4} />
      <Cloud position={[7, 5, -8]} scale={1.5} speed={0.3} />
      <Cloud position={[-6, -3, -4]} scale={0.9} speed={0.5} />
      <Cloud position={[8, -2, -6]} scale={1.1} speed={0.6} />

      {/* Main Elements */}
      <ToyAbacus position={[5, 1, -2]} scale={1.2} />
      <Astronaut position={[-4, 1, -1]} scale={2} />
    </>
  );
}

// ─── Exported Component ─────────────────────────────────────────
export default function DaylightSpaceScene() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, #38bdf8 0%, #e0f2fe 100%)'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
