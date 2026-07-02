"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CatEyes({ className = "w-[180px] md:w-[240px]" }: { className?: string }) {
  const leftEyeRef = useRef<SVGGElement>(null);
  const rightEyeRef = useRef<SVGGElement>(null);
  const leftPupilRef = useRef<SVGEllipseElement>(null);
  const rightPupilRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Idle organic movement for pupils (tracking invisible targets)
      gsap.to([leftPupilRef.current, rightPupilRef.current], {
        x: () => (Math.random() - 0.5) * 8,
        y: () => (Math.random() - 0.5) * 4,
        duration: () => 1 + Math.random() * 2,
        ease: "sine.inOut",
        onComplete: function () {
          this.restart(); // Loop random movement
        }
      });

      // Blinking Sequence (matches the GIF vibe)
      const blink = () => {
        // Rapid close
        gsap.to([leftEyeRef.current, rightEyeRef.current], {
          scaleY: 0.05,
          duration: 0.1,
          transformOrigin: "center center",
          ease: "power2.in"
        });
        // Rapid open
        gsap.to([leftEyeRef.current, rightEyeRef.current], {
          scaleY: 1,
          duration: 0.15,
          delay: 0.1,
          transformOrigin: "center center",
          ease: "back.out(2)"
        });
      };

      // Randomize blinks
      const blinkLoop = () => {
        blink();
        // Wait between 2s and 6s for next blink
        gsap.delayedCall(2 + Math.random() * 4, blinkLoop);
      };
      
      // Start blinking loop after 2 seconds
      gsap.delayedCall(2, blinkLoop);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={`${className} drop-shadow-2xl flex items-center justify-center pointer-events-none relative z-10 overflow-visible`}>
      {/* Hand-crafted SVG Cat Eyes replacing the image */}
      <svg viewBox="0 0 300 120" className="w-full h-auto overflow-visible">
        <defs>
          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5aa42" />   {/* Orange inner */}
            <stop offset="70%" stopColor="#C9A84C" />  {/* Gold mid */}
            <stop offset="100%" stopColor="#8a7332" /> {/* Dark Gold edge */}
          </radialGradient>
          
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Deep pupil shadow */}
          <filter id="pupilShadow">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#fc4402" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* LEFT EYE */}
        <g ref={leftEyeRef} filter="url(#neonGlow)">
          {/* Eye Base (Almond Shape with sharp inner corner) */}
          <path 
            d="M 140 60 Q 80 10 20 40 Q 60 100 140 60 Z" 
            fill="url(#eyeGradient)" 
          />
          {/* Pupil (Vertical Cat Slit) */}
          <ellipse 
            ref={leftPupilRef}
            cx="80" cy="55" rx="6" ry="30" 
            fill="#050505"
            filter="url(#pupilShadow)"
          />
          {/* Eye Highlight (Glassy reflection) */}
          <path 
            d="M 60 30 Q 80 20 100 35 Q 80 25 60 30 Z" 
            fill="rgba(255,255,255,0.7)" 
          />
        </g>

        {/* RIGHT EYE (Mirrored) */}
        <g ref={rightEyeRef} filter="url(#neonGlow)" transform="translate(300, 0) scale(-1, 1)">
          {/* Eye Base */}
          <path 
            d="M 140 60 Q 80 10 20 40 Q 60 100 140 60 Z" 
            fill="url(#eyeGradient)" 
          />
          {/* Pupil */}
          <ellipse 
            ref={rightPupilRef}
            cx="80" cy="55" rx="6" ry="30" 
            fill="#050505"
            filter="url(#pupilShadow)"
          />
          {/* Eye Highlight */}
          <path 
            d="M 60 30 Q 80 20 100 35 Q 80 25 60 30 Z" 
            fill="rgba(255,255,255,0.7)" 
          />
        </g>

      </svg>
    </div>
  );
}
