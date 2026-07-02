"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline();

    // Reset styles
    gsap.set(overlayRef.current, { yPercent: 0, borderBottomLeftRadius: "0%", borderBottomRightRadius: "0%" });
    gsap.set(contentRef.current, { y: 50, opacity: 0 });

    if (logoRef.current) {
      gsap.set(logoRef.current, { opacity: 1, scale: 1 });
      tl.to(logoRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.inOut",
        delay: 1.5 // Added delay so the loader can be seen
      });
    }

    // Pull the curtain up with a slight curve on the bottom edge
    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
      onUpdate: function() {
        // Create a fluid curve effect based on progress
        const progress = this.progress();
        if (progress > 0 && progress < 1 && overlayRef.current) {
          const curve = Math.sin(progress * Math.PI) * 10;
          overlayRef.current.style.borderBottomLeftRadius = `${curve}%`;
          overlayRef.current.style.borderBottomRightRadius = `${curve}%`;
        }
      }
    }, "-=0.2");

    // Fade and slide content up
    tl.to(contentRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6");

  }, []);

  return (
    <>
      <div 
        ref={overlayRef} 
        className="fixed inset-0 z-[9999] bg-[#080808] flex items-center justify-center pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <img 
          ref={logoRef} 
          src="/loader.gif" 
          alt="Loading..." 
          className="w-full max-w-[600px] object-contain mix-blend-screen grayscale sepia hue-rotate-[-10deg] saturate-[2] brightness-[0.8] contrast-[1.5]" 
        />
      </div>
      <div ref={contentRef} style={{ willChange: "transform, opacity" }}>
        {children}
      </div>
    </>
  );
}
