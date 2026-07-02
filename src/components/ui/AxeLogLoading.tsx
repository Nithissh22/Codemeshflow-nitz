"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

interface AxeLogLoadingProps {
  redirectUrl: string;
  onComplete?: () => void;
}

function AxeAndLog() {
  const axeGroupRef = useRef<THREE.Group>(null);
  const logLeftRef = useRef<THREE.Group>(null);
  const logRightRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!axeGroupRef.current || !logLeftRef.current || !logRightRef.current) return;

    const tl = gsap.timeline();

    // 1. Initial State
    gsap.set(axeGroupRef.current.position, { y: 8, z: 2 });
    gsap.set(axeGroupRef.current.rotation, { x: Math.PI / 4 }); // Axe pulled back

    // 2. Axe swings down
    tl.to(axeGroupRef.current.position, {
      y: 0.5,
      z: 0,
      duration: 0.6,
      ease: "power4.in"
    });
    tl.to(axeGroupRef.current.rotation, {
      x: -Math.PI / 8, // Axe embedded in log
      duration: 0.6,
      ease: "power4.in"
    }, "<");

    // 3. Log splits precisely at impact
    tl.add(() => {
      // Left half flies away
      gsap.to(logLeftRef.current!.position, {
        x: -3,
        y: 1,
        z: -2,
        duration: 0.8,
        ease: "power2.out"
      });
      gsap.to(logLeftRef.current!.rotation, {
        x: Math.PI / 2,
        z: Math.PI / 4,
        duration: 0.8,
        ease: "power2.out"
      });

      // Right half flies away
      gsap.to(logRightRef.current!.position, {
        x: 3,
        y: 1,
        z: -2,
        duration: 0.8,
        ease: "power2.out"
      });
      gsap.to(logRightRef.current!.rotation, {
        x: Math.PI / 2,
        z: -Math.PI / 4,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    // 4. Axe follows through slightly
    tl.to(axeGroupRef.current.rotation, {
      x: -Math.PI / 4,
      duration: 0.3,
      ease: "power2.out"
    });
    tl.to(axeGroupRef.current.position, {
      y: -1,
      duration: 0.3,
      ease: "power2.out"
    }, "<");

  }, []);

  return (
    <group position={[0, -2, 0]}>
      {/* --- THE LOG (Split into two halves) --- */}
      {/* Left Half */}
      <group ref={logLeftRef}>
        <mesh position={[-0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Cylinder geometry: radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength */}
          <cylinderGeometry args={[1, 1, 4, 16, 1, false, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        {/* Inner wood face */}
        <mesh position={[-0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[2, 4]} />
          <meshStandardMaterial color="#DEB887" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Right Half */}
      <group ref={logRightRef}>
        <mesh position={[0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1, 1, 4, 16, 1, false, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.9} />
        </mesh>
        {/* Inner wood face */}
        <mesh position={[0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[2, 4]} />
          <meshStandardMaterial color="#DEB887" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* --- THE AXE --- */}
      <group ref={axeGroupRef}>
        {/* Axe Handle */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
          <meshStandardMaterial color="#5C4033" roughness={0.8} />
        </mesh>
        {/* Axe Head */}
        <mesh position={[0, 0.5, 0.8]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.01, 0.6, 1.6, 3]} />
          <meshStandardMaterial color="#C9A84C" metalness={0.9} roughness={0.2} flatShading={true} />
        </mesh>
      </group>
    </group>
  );
}

export default function AxeLogLoading({ redirectUrl, onComplete }: AxeLogLoadingProps) {
  const [showFlash, setShowFlash] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Fade in overlay
    tl.to(containerRef.current, { opacity: 1, duration: 0.3 });
    
    // Wait for the axe to swing and hit the log
    tl.to({}, { duration: 1.2 });
    
    // Trigger flash screen after log split
    tl.call(() => {
      setShowFlash(true);
    });
    
    tl.to(flashRef.current, { opacity: 1, duration: 0.1 });
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

  }, [redirectUrl, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#080808] opacity-0 flex items-center justify-center pointer-events-auto"
    >
      <div className="absolute inset-0 w-full h-full">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />
          <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#C9A84C" />
          
          <AxeAndLog />
          
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.85) 100%)'
      }} />

      {/* Loading Text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-cmf-gold font-display text-xl tracking-[0.2em] uppercase animate-pulse">
        Loading...
      </div>

      {/* White Flash Screen */}
      <div 
        ref={flashRef}
        className={`absolute inset-0 bg-white pointer-events-none transition-opacity ${showFlash ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
