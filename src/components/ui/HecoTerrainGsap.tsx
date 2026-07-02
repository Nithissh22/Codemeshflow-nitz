"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function HecoTerrainGsap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener("resize", resize);
    resize();

    // Terrain Config
    const lines = 45;
    const pointsPerLine = 80;
    const gridWidth = 1400;
    const gridDepth = 1200;
    
    // Fish Config
    interface Fish {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      active: boolean;
      delay: number;
    }
    const fishes: Fish[] = Array.from({ length: 5 }, () => ({
      x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, active: false, delay: Math.random() * 200
    }));

    const focalLength = 400;

    const draw = (time: number) => {
      const t = time * 0.8; // Time scaler
      
      // Clear background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const offsetY = height * 0.2; // Shift terrain up/down
      const camY = 150; // Camera height
      const camZ = gridDepth / 2 + 200; // Camera distance

      // 1. Draw Terrain Lines
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < lines; i++) {
        const z = (i / lines) * gridDepth - gridDepth / 2;
        
        ctx.beginPath();
        let firstPoint = true;
        
        // Calculate fade based on depth
        const zRatio = (z + gridDepth / 2) / gridDepth; // 0 (far) to 1 (near)
        const alpha = Math.min(1, Math.max(0, zRatio * 1.5 - 0.2));
        
        // Brand colors
        if (i % 6 === 0) ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`; // #C9A84C
        else if (i % 4 === 0) ctx.strokeStyle = `rgba(245, 170, 66, ${alpha})`; // #f5aa42
        else ctx.strokeStyle = `rgba(50, 50, 50, ${alpha * 0.8})`;

        for (let j = 0; j <= pointsPerLine; j++) {
          const x = (j / pointsPerLine) * gridWidth - gridWidth / 2;
          
          // Wave Math
          const y = Math.sin(x * 0.005 + t) * 40 +
                    Math.sin(z * 0.008 - t * 1.2) * 30 +
                    Math.sin((x * z) * 0.00001 + t * 2) * 20;

          // 3D Projection
          const dz = camZ - z;
          if (dz <= 0) continue;
          
          const scale = focalLength / dz;
          const px = width / 2 + x * scale;
          const py = offsetY + (camY - y) * scale; // invert Y for canvas

          if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      }

      // 2. Process and Draw Fishes
      fishes.forEach(fish => {
        if (!fish.active) {
          fish.delay--;
          if (fish.delay <= 0) {
            // Spawn fish
            fish.active = true;
            fish.x = (Math.random() - 0.5) * gridWidth * 0.8;
            fish.z = (Math.random() - 0.5) * gridDepth * 0.8;
            fish.y = 0; // Water level
            fish.vy = 8 + Math.random() * 8; // Jump strength
            fish.vx = (Math.random() - 0.5) * 4;
            fish.vz = (Math.random() - 0.5) * 4;
          }
        } else {
          // Physics
          fish.y += fish.vy;
          fish.vy -= 0.3; // Gravity
          fish.x += fish.vx;
          fish.z += fish.vz;

          // Hit water
          if (fish.y < 0) {
            fish.active = false;
            fish.delay = 100 + Math.random() * 200; // Wait before jumping again
            
            // Draw splash ripple (optional, skip for now to keep clean)
          } else {
            // Draw jumping fish
            const dz = camZ - fish.z;
            if (dz > 0) {
              const scale = focalLength / dz;
              const px = width / 2 + fish.x * scale;
              const py = offsetY + (camY - fish.y) * scale;
              
              const fishSize = 12 * scale; // Scale by depth
              
              ctx.save();
              ctx.translate(px, py);
              // Rotate fish based on velocity (arc)
              const angle = Math.atan2(-fish.vy, fish.vx); 
              ctx.rotate(angle);
              
              // Draw stylized glowing fish (simple teardrop/crescent)
              ctx.beginPath();
              ctx.moveTo(fishSize, 0); // Nose
              ctx.quadraticCurveTo(0, fishSize/2, -fishSize, 0); // Top curve to tail
              ctx.quadraticCurveTo(0, -fishSize/2, fishSize, 0); // Bottom curve to nose
              ctx.closePath();
              
              // Glowing effect
              ctx.shadowColor = "#fc4402";
              ctx.shadowBlur = 10;
              ctx.fillStyle = "#f5aa42";
              ctx.fill();
              
              ctx.restore();
            }
          }
        }
      });
    };

    // GSAP Ticker Loop
    const tick = (time: number) => {
      draw(time);
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-[#050505]">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Top fade overlay */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-cmf-bg to-transparent pointer-events-none" />
    </div>
  );
}
