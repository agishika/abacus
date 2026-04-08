import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './Navbar.css';

// ─── 3D Logo Component ─────────────────────────────────────────
function SpinningCLogo() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle constant auto-rotation
      meshRef.current.rotation.y += delta * 1.2;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* 
        TorusGeometry args: [radius, tube, radialSegments, tubularSegments, arc]
        An arc of ~4.7 radians (about 270 degrees) makes a perfect 'C' shape!
      */}
      <torusGeometry args={[1.5, 0.6, 16, 32, Math.PI * 1.5]} />
      <meshStandardMaterial
        color="#3b82f6"
        roughness={0.2}
        metalness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Logo3D() {
  return (
    <div className="navbar-logo-3d-wrapper">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        {/* Rotate the Torus so the opening of the 'C' is on the right side */}
        <group rotation={[0, 0, Math.PI * 0.25]}>
          <SpinningCLogo />
        </group>
      </Canvas>
    </div>
  );
}

// ─── Main Navbar Component ─────────────────────────────────────
export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Smooth scroll handler
  const handleScrollTo = (id: string) => {
    setIsMobileOpen(false); // Close mobile menu if open
    
    // Slight delay to allow layout shifts or menu closing
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80; // Offset for the fixed 80px navbar height
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (id === 'hero-section') {
        // Fallback for Home
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const navLinks = [
    { label: 'Home', id: 'hero-section' },
    { label: 'About', id: 'champs-in-action' },
    { label: 'Gallery', id: 'student-gallery' },
    { label: 'Play Zone', id: 'interactive-abacus' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <nav className="navbar-container">
        {/* Left: 3D Logo & Brand Name */}
        <div 
          className="navbar-logo" 
          onClick={() => handleScrollTo('hero-section')}
        >
          <Logo3D />
          <span className="navbar-logo-text">
            Champs<span className="navbar-logo-accent">World</span>
          </span>
        </div>

        {/* Center/Right: Desktop Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <div
              key={link.id}
              className="navbar-link"
              onClick={() => handleScrollTo(link.id)}
            >
              {link.label}
            </div>
          ))}
        </div>

        {/* Mobile: Hamburger Button */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile: Sliding Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="navbar-mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            {navLinks.map((link) => (
              <div
                key={`mobile-${link.id}`}
                className="navbar-mobile-link"
                onClick={() => handleScrollTo(link.id)}
              >
                {link.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
