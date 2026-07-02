"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import * as THREE from "three";
import Link from "next/link";
import Magnetic from "@/components/ui/Magnetic";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const svgGroupRef = useRef<SVGGElement>(null);

  // Background Canvas Refs
  const meshCanvasRef = useRef<HTMLCanvasElement>(null);
  const orbsCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !meshCanvasRef.current || !orbsCanvasRef.current || !trailCanvasRef.current) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    // --- SYSTEM STATE ---
    let rafId: number;
    let isPaused = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMoveTime = 0;

    const handleVisibilityChange = () => {
      isPaused = document.visibilityState === "hidden";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < 16) return;
      lastMoveTime = now;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    if (!isMobile && !isReducedMotion) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // --- LAYER 2: AMBIENT ORBS (Canvas 2D) ---
    const ctxOrbs = orbsCanvasRef.current.getContext("2d");
    const orbs = [
      { ox: 0.15, oy: 0.30, baseR: 250, px: Math.random()*Math.PI*2, py: Math.random()*Math.PI*2, sx: 0.0004, sy: 0.0003, dx: 100, dy: 120 },
      { ox: 0.80, oy: 0.20, baseR: 300, px: Math.random()*Math.PI*2, py: Math.random()*Math.PI*2, sx: 0.0005, sy: 0.0004, dx: 140, dy: 90 },
      { ox: 0.50, oy: 0.70, baseR: 200, px: Math.random()*Math.PI*2, py: Math.random()*Math.PI*2, sx: 0.0003, sy: 0.0005, dx: 80, dy: 130 },
      { ox: 0.25, oy: 0.80, baseR: 280, px: Math.random()*Math.PI*2, py: Math.random()*Math.PI*2, sx: 0.0006, sy: 0.0004, dx: 120, dy: 110 },
      { ox: 0.70, oy: 0.60, baseR: 220, px: Math.random()*Math.PI*2, py: Math.random()*Math.PI*2, sx: 0.0004, sy: 0.0006, dx: 110, dy: 140 },
      { ox: 0.90, oy: 0.50, baseR: 260, px: Math.random()*Math.PI*2, py: Math.random()*Math.PI*2, sx: 0.0005, sy: 0.0003, dx: 90, dy: 100 },
    ];

    const drawOrbs = (time: number) => {
      if (!ctxOrbs) return;
      ctxOrbs.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctxOrbs.globalCompositeOperation = "screen";

      orbs.forEach(orb => {
        const x = window.innerWidth * orb.ox + (!isReducedMotion ? Math.sin(time * orb.sx + orb.px) * orb.dx : 0);
        const y = window.innerHeight * orb.oy + (!isReducedMotion ? Math.cos(time * orb.sy + orb.py) * orb.dy : 0);
        const gradient = ctxOrbs.createRadialGradient(x, y, 0, x, y, orb.baseR);
        gradient.addColorStop(0, "rgba(201, 168, 76, 0.07)");
        gradient.addColorStop(0.5, "rgba(201, 168, 76, 0.03)");
        gradient.addColorStop(1, "rgba(201, 168, 76, 0)");
        
        ctxOrbs.fillStyle = gradient;
        ctxOrbs.beginPath();
        ctxOrbs.arc(x, y, orb.baseR, 0, Math.PI * 2);
        ctxOrbs.fill();
      });
    };

    // --- LAYER 3: FLIGHT TRAIL (Canvas 2D) ---
    const ctxTrail = trailCanvasRef.current.getContext("2d");
    const history: {x: number, y: number}[] = [];
    const maxHistory = 40;

    const drawTrail = () => {
      if (!ctxTrail || isMobile || isReducedMotion) return;
      ctxTrail.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      history.push({x: mouseX, y: mouseY});
      if (history.length > maxHistory) history.shift();
      if (history.length < 2) return;

      history.forEach((pt, i) => {
        const factor = i / maxHistory;
        const opacity = factor * 0.55;
        const radius = 0.5 + factor * 2.0;

        ctxTrail.beginPath();
        ctxTrail.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctxTrail.fillStyle = `rgba(201, 168, 76, ${opacity})`;
        ctxTrail.fill();
      });
    };

    // --- LAYER 1: MAGNETIC MESH GRID (Three.js) ---
    let renderer: THREE.WebGLRenderer | null = null;
    let scene = new THREE.Scene();
    let camera = new THREE.OrthographicCamera(
      window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2,
      1, 1000
    );
    camera.position.z = 100;

    const originalConsoleError = console.error;
    console.error = () => {};
    try {
      renderer = new THREE.WebGLRenderer({ canvas: meshCanvasRef.current, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } catch (e) {
      console.warn("WebGL failed");
    } finally {
      console.error = originalConsoleError;
    }

    const meshPoints: {x: number, y: number, ox: number, oy: number}[] = [];
    let instancedMesh: THREE.InstancedMesh | null = null;
    let linesGeometry: THREE.BufferGeometry | null = null;
    let linesMaterial: THREE.LineBasicMaterial | null = null;

    const initMesh = () => {
      if (!scene || !renderer) return;
      while(scene.children.length > 0) scene.remove(scene.children[0]);
      meshPoints.length = 0;

      const cols = isMobile ? 14 : 28;
      const rows = isMobile ? 8 : 16;
      const spaceX = window.innerWidth / cols;
      const spaceY = window.innerHeight / rows;

      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          const x = (j * spaceX) - window.innerWidth / 2;
          const y = -(i * spaceY) + window.innerHeight / 2;
          meshPoints.push({x, y, ox: x, oy: y});
        }
      }

      const dotGeo = new THREE.SphereGeometry(1.2, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.35 });
      instancedMesh = new THREE.InstancedMesh(dotGeo, dotMat, meshPoints.length);
      
      const dummy = new THREE.Object3D();
      meshPoints.forEach((p, i) => {
        dummy.position.set(p.x, p.y, 0);
        dummy.updateMatrix();
        instancedMesh!.setMatrixAt(i, dummy.matrix);
      });
      scene.add(instancedMesh);

      const lineIndices: number[] = [];
      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          const idx = i * (cols + 1) + j;
          if (j < cols) lineIndices.push(idx, idx + 1);
          if (i < rows) lineIndices.push(idx, idx + (cols + 1));
        }
      }

      const posArray = new Float32Array(meshPoints.length * 3);
      meshPoints.forEach((p, i) => {
        posArray[i*3] = p.x;
        posArray[i*3+1] = p.y;
        posArray[i*3+2] = 0;
      });

      linesGeometry = new THREE.BufferGeometry();
      linesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      linesGeometry.setIndex(lineIndices);

      linesMaterial = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.08, linewidth: 1 });
      const lineMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
      scene.add(lineMesh);
    };

    initMesh();

    const resizeCanvases = () => {
      orbsCanvasRef.current!.width = window.innerWidth;
      orbsCanvasRef.current!.height = window.innerHeight;
      trailCanvasRef.current!.width = window.innerWidth;
      trailCanvasRef.current!.height = window.innerHeight;
      
      camera.left = window.innerWidth / -2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = window.innerHeight / -2;
      camera.updateProjectionMatrix();
      
      if (renderer) renderer.setSize(window.innerWidth, window.innerHeight);
      initMesh();
    };
    window.addEventListener("resize", resizeCanvases);
    resizeCanvases(); // initial size set

    const influenceRadius = 180;
    
    const animate = (time: number) => {
      if (!isPaused) {
        drawOrbs(time);
        drawTrail();

        if (renderer && scene && instancedMesh && linesGeometry) {
          if (!isReducedMotion && !isMobile) {
            const mouseWorldX = mouseX - window.innerWidth / 2;
            const mouseWorldY = -(mouseY - window.innerHeight / 2);
            
            const dummy = new THREE.Object3D();
            const positions = linesGeometry.attributes.position.array as Float32Array;

            meshPoints.forEach((p, i) => {
              const dist = Math.hypot(mouseWorldX - p.ox, mouseWorldY - p.oy);
              if (dist < influenceRadius) {
                const displacement = (influenceRadius - dist) / influenceRadius;
                p.x += (mouseWorldX - p.ox) * displacement * 0.4;
                p.y += (mouseWorldY - p.oy) * displacement * 0.4;
              }
              p.x += (p.ox - p.x) * 0.08;
              p.y += (p.oy - p.y) * 0.08;

              positions[i*3] = p.x;
              positions[i*3+1] = p.y;
              
              dummy.position.set(p.x, p.y, 0);
              dummy.updateMatrix();
              instancedMesh!.setMatrixAt(i, dummy.matrix);
            });

            instancedMesh.instanceMatrix.needsUpdate = true;
            linesGeometry.attributes.position.needsUpdate = true;
          }
          renderer.render(scene, camera);
        }
      }
      if (!isReducedMotion) rafId = requestAnimationFrame(animate);
    };

    if (isMobile && !isReducedMotion && scene) {
      gsap.to(scene.scale, { x: 1.04, y: 1.04, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }

    if (!isReducedMotion) {
      rafId = requestAnimationFrame(animate);
    } else {
      drawOrbs(0);
      if (renderer && scene) renderer.render(scene, camera);
    }

    // --- FOREGROUND GSAP ANIMATIONS ---
    const tl = gsap.timeline({ delay: 3.0 }); // Wait for Preloader curtain to split!

    if (svgGroupRef.current) {
      // START THE IDLE HOVER IMMEDIATELY (Do not assemble again)
      gsap.to(svgGroupRef.current, { y: -10, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      
      const wingsFront = svgGroupRef.current.querySelectorAll(".wing-front");
      const wingsBack = svgGroupRef.current.querySelectorAll(".wing-back");
      gsap.to(wingsFront, { rotation: 12, transformOrigin: "100px 70px", duration: 0.08, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(wingsBack, { rotation: -12, transformOrigin: "110px 40px", duration: 0.08, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.04 });
    }

    if (headlineRef.current) {
      const text = "Designing Your Digital Identity";
      const words = text.split(" ");
      headlineRef.current.innerHTML = "";
      
      words.forEach(word => {
        const spanContainer = document.createElement("span");
        spanContainer.style.clipPath = "polygon(-100% -100%, 200% -100%, 200% 100%, -100% 100%)";
        spanContainer.style.display = "inline-block";
        spanContainer.style.marginRight = "15px"; // 15px space between words
        spanContainer.style.verticalAlign = "bottom";
        
        const span = document.createElement("span");
        span.innerText = word;
        span.style.display = "inline-block";
        span.className = "word";
        
        spanContainer.appendChild(span);
        headlineRef.current!.appendChild(spanContainer);
      });

      const wordElements = headlineRef.current.querySelectorAll(".word");
      gsap.set(wordElements, { y: 40, opacity: 0 });
      tl.to(wordElements, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "cmf-ease" }, 0.2);
    }

    if (subheadRef.current) {
      tl.fromTo(subheadRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "cmf-ease" }, 0.6);
    }

    if (ctaRef.current) {
      tl.fromTo(ctaRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "cmf-ease" }, 0.8);
    }

    if (scrollLineRef.current) {
      gsap.fromTo(scrollLineRef.current, { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
    }

    gsap.to(containerRef.current, {
      yPercent: 30, opacity: 0, ease: "none",
      scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true }
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvases);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (renderer) renderer.dispose();
      if (instancedMesh) instancedMesh.geometry.dispose();
      if (instancedMesh) (instancedMesh.material as THREE.Material).dispose();
      if (linesGeometry) linesGeometry.dispose();
      if (linesMaterial) linesMaterial.dispose();
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-cmf-bg flex flex-col items-center justify-center pt-[80px] md:pt-[100px] px-[20px] md:px-[24px] pb-[80px] md:pb-[60px] box-border overflow-hidden">
      
      {/* Dynamic Background CSS */}
      <style jsx>{`
        .vignette-layer {
          background: radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.85) 100%);
        }
        @media (prefers-reduced-motion: no-preference) {
          .vignette-layer {
            animation: vignettePulse 8s ease-in-out infinite;
          }
        }
        @keyframes vignettePulse {
          0%, 100% { background: radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.85) 100%); }
          50% { background: radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, transparent 60%, rgba(0,0,0,0.45) 85%, rgba(0,0,0,0.8) 100%); }
        }
      `}</style>

      {/* BACKGROUND LAYERS */}
      {/* z-index 1: Ambient Orbs */}
      <canvas ref={orbsCanvasRef} className="absolute inset-0 z-[1] pointer-events-none w-full h-full" />
      
      {/* z-index 2: ThreeJS Magnetic Mesh */}
      <canvas ref={meshCanvasRef} className="absolute inset-0 z-[2] pointer-events-none w-full h-full opacity-80" />
      
      {/* z-index 3: Flight Trail */}
      <canvas ref={trailCanvasRef} className="absolute inset-0 z-[3] pointer-events-none w-full h-full hidden md:block" />

      {/* z-index 4: Vignette Overlay */}
      <div className="vignette-layer absolute inset-0 pointer-events-none z-[4]"></div>
      
      {/* z-index 5: FOREGROUND CONTENT */}
      <div ref={containerRef} className="relative z-[5] flex flex-col items-center justify-center text-center w-full max-w-5xl mx-auto flex-1 gap-0">
        
        {/* Geometric Hummingbird SVG Logo */}
        <div className="w-[130px] md:w-[180px] mb-[28px] overflow-visible">
          <svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-2xl overflow-visible">
            <g ref={svgGroupRef}>
              <polygon points="150,70 195,65 155,75" fill="#C9A84C" />
              <polygon points="130,60 150,70 155,75" fill="#E8C96A" />
              <polygon points="130,60 155,75 135,85" fill="#f5aa42" />
              <polygon points="130,60 135,85 100,100" fill="#fc4402" />
              <polygon points="130,60 100,100 100,70" fill="#f58a42" />
              <polygon points="135,85 120,120 100,100" fill="#d9a855" />
              <polygon points="120,120 90,140 100,100" fill="#C9A84C" />
              <polygon points="90,140 60,170 80,130" fill="#7a6a3a" />
              <polygon points="60,170 40,190 70,150" fill="#5c4a2a" />
              <polygon className="wing-front" points="100,70 110,40 50,10" fill="#E8C96A" />
              <polygon className="wing-front" points="100,70 50,10 60,30" fill="#f5cc7a" />
              <polygon className="wing-front" points="100,70 60,30 40,50" fill="#f5aa42" />
              <polygon className="wing-front" points="100,70 40,50 80,80" fill="#C9A84C" />
              <polygon className="wing-back" points="110,40 130,60 90,20" fill="#7a6a3a" />
            </g>
          </svg>
        </div>

        <h1 ref={headlineRef} className="heading-display text-[42px] md:text-[72px] text-cmf-text leading-tight mb-[16px] w-full">
          Designing Your Digital Identity
        </h1>
        
        <p ref={subheadRef} className="heading-display-italic text-2xl md:text-[28px] text-cmf-gold mb-[28px]">
          We craft digital presences that endure.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-[16px] items-center justify-center w-full">
          <Magnetic strength={0.3}>
            <Link href="#work" className="bg-[#C9A84C] text-[#080808] font-display font-semibold text-[16px] tracking-[0.05em] px-[36px] py-[14px] rounded-none hover:bg-[#E8C96A] transition-colors w-full md:w-auto cursor-pointer border-none text-center flex items-center justify-center">
              View Our Work
            </Link>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link href="#contact" className="bg-transparent border border-[rgba(201,168,76,0.5)] text-[#EDE8DA] font-display font-normal text-[16px] tracking-[0.05em] px-[36px] py-[14px] rounded-none hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors w-full md:w-auto cursor-pointer text-center flex items-center justify-center">
              Start a Project
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-[32px] left-1/2 transform -translate-x-1/2 z-[5] flex flex-col items-center gap-[8px]">
        <span className="label-mono text-[10px] text-cmf-gold-muted opacity-50">SCROLL</span>
        <div className="w-[1px] h-[60px] bg-cmf-border relative overflow-hidden">
          <div ref={scrollLineRef} className="w-full h-full bg-cmf-gold absolute top-0 left-0"></div>
        </div>
      </div>

    </section>
  );
}
