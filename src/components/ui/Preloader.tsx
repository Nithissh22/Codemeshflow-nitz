"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "@/lib/gsap";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// --- HELPERS FOR GEOMETRY ---

// 1. ORIGAMI EGG GEOMETRY
const baseEggGeo = new THREE.IcosahedronGeometry(0.85, 1); // 80 triangles, origami style
baseEggGeo.scale(1, 1.25, 1);
const nonIndexedEgg = baseEggGeo.toNonIndexed();
const eggPos = nonIndexedEgg.getAttribute('position').array;
const eggFaces: { geo: THREE.BufferGeometry }[] = [];

for (let i = 0; i < eggPos.length; i += 9) {
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(9);
  for(let j=0; j<9; j++) arr[j] = eggPos[i+j];
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  geo.computeVertexNormals();
  eggFaces.push({ geo });
}

// 2. CRACK GEOMETRY (Upgraded to 3D Tube instead of 1px line)
const crackPoints = [];
for (let i = 0; i <= 32; i++) {
  const angle = (i / 32) * Math.PI * 2;
  const r = 0.94; // Match the egg's radius at y=0.1
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  const y = 0.1 + (Math.random() * 0.15 - 0.075); // Slightly more jagged
  crackPoints.push(new THREE.Vector3(x, y, z));
}
// Close the loop
crackPoints.push(crackPoints[0].clone());
const crackCurve = new THREE.CatmullRomCurve3(crackPoints, true, "chordal");
const crackGeo = new THREE.TubeGeometry(crackCurve, 128, 0.015, 8, true);

// 3. HUMMINGBIRD GEOMETRY
const birdFaces: { group: string, color: string, geo: THREE.BufferGeometry }[] = [];

function makeTri(v1: number[], v2: number[], v3: number[], group: string, color: string) {
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array([...v1, ...v2, ...v3]);
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  geo.computeVertexNormals();
  birdFaces.push({ group, color, geo });
}

// Body Core
makeTri([0, 0.8, 0.4], [0.2, 0.4, 0.2], [0, 0, -0.3], 'body', '#E8943A');
makeTri([0, 0.8, 0.4], [-0.2, 0.4, 0.2], [0, 0, -0.3], 'body', '#C9A84C');
makeTri([0, 0.8, 0.4], [0.2, 0.4, 0.2], [0, 0.5, 0.6], 'body', '#D4A830');
makeTri([0, 0.8, 0.4], [-0.2, 0.4, 0.2], [0, 0.5, 0.6], 'body', '#D4A830');
makeTri([0, 0.5, 0.6], [0.2, 0.4, 0.2], [0, 0, -0.3], 'body', '#C9A84C');
makeTri([0, 0.5, 0.6], [-0.2, 0.4, 0.2], [0, 0, -0.3], 'body', '#E8943A');

// Left Wing
makeTri([-0.2, 0.4, 0.2], [-0.8, 0.8, 0], [-0.4, 0.3, -0.1], 'wingLeft', '#E8C96A');
makeTri([-0.8, 0.8, 0], [-1.2, 1.0, -0.2], [-0.6, 0.6, -0.2], 'wingLeft', '#C9A84C');
makeTri([-0.2, 0.4, 0.2], [-0.8, 0.8, 0], [-0.2, 0.7, 0.1], 'wingLeft', '#D4A830');
makeTri([-0.2, 0.7, 0.1], [-0.8, 0.8, 0], [-0.5, 1.0, 0], 'wingLeft', '#E8C96A');
makeTri([-0.4, 0.3, -0.1], [-0.8, 0.8, 0], [-0.6, 0.6, -0.2], 'wingLeft', '#C9A84C');

// Right Wing
makeTri([0.2, 0.4, 0.2], [0.8, 0.8, 0], [0.4, 0.3, -0.1], 'wingRight', '#D4A830');
makeTri([0.8, 0.8, 0], [1.2, 1.0, -0.2], [0.6, 0.6, -0.2], 'wingRight', '#C9A84C');
makeTri([0.2, 0.4, 0.2], [0.8, 0.8, 0], [0.2, 0.7, 0.1], 'wingRight', '#D4A830');
makeTri([0.2, 0.7, 0.1], [0.8, 0.8, 0], [0.5, 1.0, 0], 'wingRight', '#E8C96A');
makeTri([0.4, 0.3, -0.1], [0.8, 0.8, 0], [0.6, 0.6, -0.2], 'wingRight', '#C9A84C');

// Head
makeTri([0, 0.8, 0.4], [0.1, 1.0, 0.5], [0, 1.1, 0.6], 'head', '#E8D080');
makeTri([0, 0.8, 0.4], [-0.1, 1.0, 0.5], [0, 1.1, 0.6], 'head', '#E8D080');
makeTri([0.1, 1.0, 0.5], [-0.1, 1.0, 0.5], [0, 1.1, 0.6], 'head', '#E8D080');

// Beak
makeTri([0, 1.1, 0.6], [0.05, 1.05, 0.65], [0, 1.3, 0.9], 'beak', '#C9A84C');
makeTri([0, 1.1, 0.6], [-0.05, 1.05, 0.65], [0, 1.3, 0.9], 'beak', '#A8883A');

// Tail
makeTri([0, 0, -0.3], [0.2, -0.2, -0.6], [0, -0.1, -0.8], 'tail', '#8B6914');
makeTri([0, 0, -0.3], [-0.2, -0.2, -0.6], [0, -0.1, -0.8], 'tail', '#8B6914');
makeTri([0, -0.1, -0.8], [0.1, 0.1, -1.0], [0.2, -0.2, -0.6], 'tail', '#8B6914');
makeTri([0, -0.1, -0.8], [-0.1, 0.1, -1.0], [-0.2, -0.2, -0.6], 'tail', '#8B6914');


// --- 3D SCENE COMPONENT ---
function MasterScene() {
  const eggGroup = useRef<THREE.Group>(null);
  const eggShardRefs = useRef<THREE.Mesh[]>([]);
  const crackMesh = useRef<THREE.Mesh>(null);
  const crackMat = useRef<THREE.MeshStandardMaterial>(null);
  const innerLight = useRef<THREE.PointLight>(null);
  const birdGroup = useRef<THREE.Group>(null);
  
  const allFaces = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    // Generate noise texture for egg bumpMap (optional for origami, but adds texture)
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      for (let x = 0; x < 256; x++) {
        for (let y = 0; y < 256; y++) {
          const v = Math.floor(Math.random() * 255);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    const bumpMap = new THREE.CanvasTexture(canvas);
    
    eggShardRefs.current.forEach(shard => {
      if (shard && shard.material) {
        (shard.material as THREE.MeshStandardMaterial).bumpMap = bumpMap;
        (shard.material as THREE.MeshStandardMaterial).bumpScale = 0.02;
      }
    });

    let gsapCtx = gsap.context(() => {
      const tl = gsap.timeline();

      // Reset initial states
      if (eggGroup.current) eggGroup.current.scale.set(0, 0, 0);
      if (birdGroup.current) birdGroup.current.position.set(0, 0, 0);

      eggShardRefs.current.forEach(shard => {
        if (!shard) return;
        shard.position.set(0, 0, 0);
        shard.rotation.set(0, 0, 0);
        if (shard.material) {
          (shard.material as THREE.MeshStandardMaterial).opacity = 1;
        }
      });
    
      allFaces.current.forEach(face => {
        if (!face) return;
        face.scale.set(0, 0, 0);
        // random outward position
        const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(0.5);
        face.position.copy(dir);
        face.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        if (face.material) {
          (face.material as THREE.MeshStandardMaterial).transparent = true;
          (face.material as THREE.MeshStandardMaterial).opacity = 0;
        }
      });

      // Group references dynamically to avoid stale refs
      const bodyFaces = allFaces.current.filter((_, i) => birdFaces[i]?.group === 'body');
      const wingLeftFaces = allFaces.current.filter((_, i) => birdFaces[i]?.group === 'wingLeft');
      const wingRightFaces = allFaces.current.filter((_, i) => birdFaces[i]?.group === 'wingRight');
      const headFaces = allFaces.current.filter((_, i) => birdFaces[i]?.group === 'head');
      const beakFaces = allFaces.current.filter((_, i) => birdFaces[i]?.group === 'beak');
      const tailFaces = allFaces.current.filter((_, i) => birdFaces[i]?.group === 'tail');

      // ----------------------------------------------------
      // ACT 1: THE EGG (0.0s - 0.8s)
      // ----------------------------------------------------
    tl.to(eggGroup.current!.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)"
    }, 0.1);

    tl.to(eggGroup.current!.rotation, {
      y: Math.PI * 2,
      duration: 0.8,
      ease: "power3.out"
    }, 0.1);

    // Idle float
    tl.to(eggGroup.current!.position, {
      y: -0.1,
      duration: 0.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 2
    }, 0.4);

    // ----------------------------------------------------
    // ACT 2: THE CRACK (0.8s - 1.4s)
    // ----------------------------------------------------
    // Micro-crack 1
    tl.to(eggGroup.current!.position, {
      x: 0.03, duration: 0.05, yoyo: true, repeat: 3, ease: "none"
    }, 0.8);

    // Crack line appears + inner light begins
    tl.to(crackMat.current, { emissiveIntensity: 4, opacity: 1, duration: 0.1 }, 0.85);
    tl.to(innerLight.current, { intensity: 2, duration: 0.2 }, 0.85);

    // Violent shaking
    tl.to(eggGroup.current!.position, {
      x: 0.06, duration: 0.04, yoyo: true, repeat: 5, ease: "none"
    }, 0.9);
    tl.to(eggGroup.current!.rotation, {
      z: 0.08, duration: 0.06, yoyo: true, repeat: 4, ease: "none"
    }, 0.9);

    // EGG SHATTERS INTO PIECES
    tl.to(innerLight.current, { intensity: 10, duration: 0.08 }, 1.0); // Massive flare for bloom
    tl.to(innerLight.current, { intensity: 0, duration: 0.4 }, 1.08);
    tl.to(crackMat.current, { emissiveIntensity: 0, opacity: 0, duration: 0.3 }, 1.05);

    // Explode shards outward
    tl.to(eggShardRefs.current.map(f => f.position), {
      x: () => (Math.random() - 0.5) * 4,
      y: () => (Math.random() - 0.5) * 4,
      z: () => (Math.random() - 0.5) * 4,
      duration: 0.7,
      ease: "power2.out"
    }, 1.0);
    
    tl.to(eggShardRefs.current.map(f => f.rotation), {
      x: () => Math.random() * Math.PI * 4,
      y: () => Math.random() * Math.PI * 4,
      duration: 0.7,
      ease: "power2.out"
    }, 1.0);
    
    // Fade shards quickly
    tl.to(eggShardRefs.current.map(f => f.material), {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    }, 1.15);

    // ----------------------------------------------------
    // ACT 3: HUMMINGBIRD ASSEMBLY (1.4s - 2.4s)
    // ----------------------------------------------------
      const assembleFaces = (faces: THREE.Mesh[], time: number, ease: string, stagger: number) => {
        tl.to(faces.map(f => f.scale), { x: 1, y: 1, z: 1, duration: 0.4, stagger, ease }, time);
        tl.to(faces.map(f => f.position), { x: 0, y: 0, z: 0, duration: 0.4, stagger, ease }, time);
        tl.to(faces.map(f => f.rotation), { x: 0, y: 0, z: 0, duration: 0.4, stagger, ease }, time);
        tl.to(faces.map(f => f.material), { opacity: 1, duration: 0.2, stagger }, time);
      };

      assembleFaces(bodyFaces, 1.4, "back.out(1.5)", 0.04);
      assembleFaces([...wingLeftFaces, ...wingRightFaces], 1.65, "back.out(2)", 0.05);
      assembleFaces([...headFaces, ...beakFaces], 1.9, "elastic.out(1, 0.5)", 0.06);
      assembleFaces(tailFaces, 2.1, "power3.out", 0.04);

    // Post-assembly hover & rotation
    tl.to(birdGroup.current!.scale, {
      x: 1.03, y: 1.03, z: 1.03, duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut"
    }, 2.3);
    tl.to(birdGroup.current!.rotation, {
      y: Math.PI * 0.15, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.inOut"
    }, 2.3);

    // ----------------------------------------------------
    // ACT 4: MATCH-CUT HOVER (2.4s - 3.5s)
    // ----------------------------------------------------
      // Keep wing flapping to match Hero SVG wings
      tl.to(wingLeftFaces.map(f => f.rotation), {
        z: -0.3, duration: 0.08, yoyo: true, repeat: 11, ease: "sine.inOut", stagger: 0.01
      }, 2.4);
      tl.to(wingRightFaces.map(f => f.rotation), {
        z: 0.3, duration: 0.08, yoyo: true, repeat: 11, ease: "sine.inOut", stagger: 0.01
      }, 2.4);

    // Re-center and match Hero Logo size
    tl.to(birdGroup.current!.position, {
      y: -0.2, duration: 0.6, ease: "power2.inOut" // Offset slightly to match SVG center
    }, 2.4);
    tl.to(birdGroup.current!.rotation, {
      x: 0, y: 0, z: 0, duration: 0.6, ease: "power2.inOut"
    }, 2.4);
    tl.to(birdGroup.current!.scale, {
      x: 0.85, y: 0.85, z: 0.85, duration: 0.6, ease: "power2.inOut"
    }, 2.4);
    });

    return () => gsapCtx.revert();
  }, []);

  const eggMaterialProps = {
    color: "#2a2216", // Rich dark obsidian/metallic base
    roughness: 0.6,
    metalness: 0.6, // Higher metalness for HDRI reflections
    transparent: true,
    side: THREE.DoubleSide, 
    flatShading: true, // Crucial for the origami/low-poly look!
  };

  return (
    <>
      <ambientLight intensity={0.8} color="#C9A84C" />
      <directionalLight position={[2, 3, 4]} intensity={2.5} color="#E8C96A" />
      <directionalLight position={[-2, -1, -3]} intensity={1.5} color="#C9A84C" />
      
      <group ref={eggGroup} position={[0, -0.2, 0]}>
        <pointLight ref={innerLight} color="#FFD700" intensity={0} distance={3} />
        
        {eggFaces.map((face, i) => (
          <mesh 
            key={`egg-${i}`} 
            geometry={face.geo} 
            ref={(el) => { if (el) eggShardRefs.current[i] = el; }}
          >
            <meshStandardMaterial {...eggMaterialProps} />
          </mesh>
        ))}
        
        <mesh ref={crackMesh} geometry={crackGeo}>
          <meshStandardMaterial ref={crackMat} color="#FFD700" emissive="#FFD700" emissiveIntensity={0} transparent opacity={0} />
        </mesh>
      </group>

      <group ref={birdGroup}>
        {birdFaces.map((face, i) => (
          <mesh 
            key={i} 
            geometry={face.geo} 
            ref={(el) => {
              if (el) {
                allFaces.current[i] = el;
              }
            }}
          >
            <meshStandardMaterial 
              color={face.color} 
              roughness={0.15} 
              metalness={1.0} // Hyper-reflective polished gold
              envMapIntensity={2.0} // Enhance reflections
              side={THREE.DoubleSide} 
              transparent 
            />
          </mesh>
        ))}
      </group>

      <Environment preset="studio" />
      <EffectComposer>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </>
  );
}

// --- MAIN PRELOADER COMPONENT ---
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";

    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Mock progress since we don't have real asset loading hook setup
      tl.to({ val: 0 }, {
        val: 100,
        duration: 2.8,
        ease: "power2.inOut",
        onUpdate: function() {
          setProgress(Math.round(this.targets()[0].val));
        }
      }, 0);

    // Brand text fades in
    tl.to('#loader-brand', {
      opacity: 1, y: 0, duration: 0.5, ease: "power2.out"
    }, 2.0);

    // Brand text fades out
    tl.to('#loader-brand', {
      opacity: 0, duration: 0.3
    }, 2.6);

    // Progress bar completes
    tl.set({ val: progress }, { val: 100, onUpdate: () => setProgress(100) }, 2.85);

    // Split curtain exit
    tl.to('#loader-overlay-top', { y: "-100%", duration: 0.7, ease: "power3.inOut" }, 3.0);
    tl.to('#loader-overlay-bottom', { y: "100%", duration: 0.7, ease: "power3.inOut" }, 3.0);
    
    tl.to('#loader-overlay-content', { opacity: 0, duration: 0.7 }, 3.0);

      tl.call(() => {
        document.body.style.overflow = "auto";
        setTimeout(() => setIsVisible(false), 100);
      }, [], 3.5);
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div id="loader-overlay" className="fixed inset-0 z-[99999] pointer-events-none">
      
      {/* Split Curtain Backgrounds */}
      <div id="loader-overlay-top" className="absolute top-0 left-0 w-full h-1/2 bg-[#080808] border-b border-cmf-gold/10 z-0"></div>
      <div id="loader-overlay-bottom" className="absolute bottom-0 left-0 w-full h-1/2 bg-[#080808] border-t border-cmf-gold/10 z-0"></div>

      <div id="loader-overlay-content" className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 w-full h-full">
          <Canvas id="loader-canvas" camera={{ position: [0, 0, 5], fov: 45 }} gl={{ localClippingEnabled: true, antialias: true, alpha: true }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
            <MasterScene />
          </Canvas>
        </div>

        <div id="loader-brand" className="relative z-20 text-center opacity-0 translate-y-4" style={{ marginTop: '320px' }}>
          <span id="loader-name" className="font-serif text-[28px] font-semibold text-cmf-text tracking-[0.05em] block mb-[6px]">
            CodeMeshFlow
          </span>
          <span id="loader-tagline" className="font-mono text-[9px] tracking-[0.3em] text-cmf-gold-muted uppercase block">
            Designing Your Digital Identity
          </span>
        </div>

        <div id="loader-progress" className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <div id="loader-bar" className="w-[120px] h-[1px] bg-cmf-gold/15 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-cmf-gold transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
          <span id="loader-percent" className="font-mono text-[10px] tracking-[0.2em] text-cmf-gold-muted w-8">
            {progress}%
          </span>
        </div>

      </div>
    </div>
  );
}
