import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Mathematical symbols as 3D floating text shapes ────────────
const SYMBOLS = [
  '+', '−', '×', '÷', '=', '∑', 'π', '∞', '√', '%',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '+', '−', '×', '÷', '∑', '√', 'π', '=', '∞', '%',
];

// SymbolSprite is used instead of FloatingSymbol to handle custom textures

// ─── Particle field (small dots for depth) ──────────────────────
function ParticleField() {
  const count = 120;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(t * 0.15 + i * 0.5) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#3b82f6"
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

// ─── Symbol sprites using Canvas textures ───────────────────────
function SymbolSprite({
  position,
  symbol,
  speed,
  amplitude,
  phase,
  rotSpeed,
  opacity,
  scale,
}: FloatingSymbolProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  const initialX = position[0];

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 128, 128);
    ctx.font = 'bold 80px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText(symbol, 64, 68);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [symbol]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = initialY + Math.sin(t * speed + phase) * amplitude;
    meshRef.current.position.x = initialX + Math.sin(t * speed * 0.4 + phase * 1.3) * 0.4;
    meshRef.current.rotation.z = Math.sin(t * rotSpeed + phase) * 0.25;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

// ─── Shared Props for SymbolSprite ───────────────────────────
interface FloatingSymbolProps {
  position: [number, number, number];
  symbol: string;
  speed: number;
  amplitude: number;
  phase: number;
  rotSpeed: number;
  opacity: number;
  scale: number;
}

// ─── Main 3D Background Scene ───────────────────────────────────
function Scene() {
  const symbols = useMemo(() => {
    return SYMBOLS.map((sym) => ({
      symbol: sym,
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        -2 - Math.random() * 5,
      ] as [number, number, number],
      speed: 0.15 + Math.random() * 0.25,
      amplitude: 0.3 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: 0.1 + Math.random() * 0.15,
      opacity: 0.08 + Math.random() * 0.1,
      scale: 0.5 + Math.random() * 0.8,
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <ParticleField />
      {symbols.map((props, i) => (
        <SymbolSprite key={i} {...props} />
      ))}
    </>
  );
}

// ─── Exported Component ─────────────────────────────────────────
export default function MathBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
