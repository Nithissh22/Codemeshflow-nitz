"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

interface OrigamiBulletLoadingProps {
  redirectUrl: string;
  onComplete?: () => void;
}

function BulletMesh({ isFiring }: { isFiring: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Default slow spin
    if (!isFiring) {
      groupRef.current.rotation.y -= delta * 2;
      groupRef.current.rotation.z += delta * 0.5;
    }
  });

  // Animate the bullet shooting when isFiring becomes true
  useEffect(() => {
    if (isFiring && groupRef.current) {
      const tl = gsap.timeline();
      
      // Pull back slightly (anticipation)
      tl.to(groupRef.current.position, {
        z: -2,
        duration: 0.5,
        ease: "power2.inOut"
      });
      
      // Blast forward past the camera
      tl.to(groupRef.current.position, {
        z: 20, // Fly past the camera (camera is at z=5)
        duration: 0.3,
        ease: "power4.in"
      });
      
      // Spin extremely fast
      tl.to(groupRef.current.rotation, {
        y: "+=20",
        duration: 0.8,
        ease: "power3.in"
      }, 0);
    }
  }, [isFiring]);

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]} scale={1.5}>
      {/* Bullet Body (Origami Low Poly) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
        <meshStandardMaterial 
          color="#C9A84C" 
          metalness={0.9} 
          roughness={0.2} 
          flatShading={true} 
        />
      </mesh>
      
      {/* Bullet Tip (Origami Low Poly) */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.01, 0.3, 1, 8]} />
        <meshStandardMaterial 
          color="#FFDF73" 
          emissive="#C9A84C"
          emissiveIntensity={0.5}
          metalness={0.8} 
          roughness={0.2} 
          flatShading={true} 
        />
      </mesh>
      
      {/* Bullet Casing Base */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 8]} />
        <meshStandardMaterial 
          color="#8c7335" 
          metalness={1} 
          roughness={0.1} 
          flatShading={true} 
        />
      </mesh>
    </group>
  );
}

export default function OrigamiBulletLoading({ redirectUrl, onComplete }: OrigamiBulletLoadingProps) {
  const [isFiring, setIsFiring] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sequence the animation
    const tl = gsap.timeline();
    
    // 1. Initial fade in (using from so default state is visible)
    tl.from(containerRef.current, { opacity: 0, duration: 0.5 });
    
    // 2. Wait for a moment to let the user see the spinning bullet
    tl.to({}, { duration: 1.5 });
    
    // 3. Trigger firing state in ThreeJS
    tl.call(() => setIsFiring(true));
    
    // 4. Wait for bullet to shoot forward (0.5s anticipation + 0.3s shoot)
    tl.to({}, { duration: 0.7 });
    
    // 5. Trigger the flash screen
    tl.call(() => {
      setShowFlash(true);
      gsap.to(flashRef.current, { opacity: 1, duration: 0.1 });
    });
    
    // 6. Redirect or fade out
    tl.to({}, { duration: 0.2, onComplete: () => {
      if (redirectUrl === "#" || redirectUrl === "") {
        gsap.to(containerRef.current, { 
          opacity: 0, 
          duration: 0.5, 
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      } else {
        window.location.href = redirectUrl;
      }
    }});

  }, [redirectUrl]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#080808] flex items-center justify-center pointer-events-auto"
    >
      <div className="absolute inset-0 w-full h-full">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#C9A84C" />
          
          <BulletMesh isFiring={isFiring} />
          
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* RDR2 Style Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)'
      }} />

      {/* Loading Text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-cmf-gold font-display text-xl tracking-[0.2em] uppercase animate-pulse">
        Loading...
      </div>

      {/* Gunshot Flash Screen */}
      <div 
        ref={flashRef}
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity ${showFlash ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
