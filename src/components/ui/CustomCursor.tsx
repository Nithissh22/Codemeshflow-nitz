"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const isCustomTextActive = useRef(false);
  
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    
    // Disable on mobile/touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      dot.style.display = "none";
      ring.style.display = "none";
      return;
    }

    // Fix alignment: GSAP sets translate directly
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    // Snappy tracking for the dot
    const dotX = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3" });
    
    // Floaty trailing tracking for the ring
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    // Initial position catchup
    let isInitialized = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isInitialized) {
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        gsap.set(ring, { x: e.clientX, y: e.clientY });
        isInitialized = true;
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Handle hover states for links and buttons
    const handleHover = () => {
      if (isCustomTextActive.current) return;
      gsap.to(dot, { scale: 0, duration: 0.2, ease: "power2.out" });
      gsap.to(ring, {
        scale: 1.5,
        backgroundColor: "rgba(201, 168, 76, 0.08)",
        backdropFilter: "blur(4px)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleHoverOut = () => {
      if (isCustomTextActive.current) return;
      gsap.to(dot, { scale: 1, duration: 0.2, ease: "power2.out" });
      gsap.to(ring, {
        scale: 1,
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Custom Event for text/image cursor
    const handleCursorState = (e: Event) => {
      const customEvent = e as CustomEvent<{ text?: string; image?: string }>;
      const { text, image } = customEvent.detail;
      
      if (text || image) {
        isCustomTextActive.current = true;
        
        if (text && textRef.current) textRef.current.innerText = text;
        if (image) {
          gsap.set(ring, { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' });
        } else {
          gsap.set(ring, { backgroundImage: 'none' });
        }
        
        gsap.to(dot, { scale: 0, duration: 0.2, ease: "power2.out" });
        
        const targetScale = image ? 10 : 2.8; // Huge scale for images
        const targetRadius = image ? "12px" : "50%";
        const targetBorder = image ? "rgba(201,168,76,0.2)" : "#C9A84C";
        
        gsap.to(ring, {
          scaleX: targetScale,
          scaleY: image ? 8 : targetScale,
          borderRadius: targetRadius,
          backgroundColor: image ? "rgba(0,0,0,1)" : "rgba(8, 8, 8, 0.9)",
          backdropFilter: "blur(8px)",
          borderColor: targetBorder,
          duration: 0.4,
          ease: "power3.out"
        });
        
        if (text && textRef.current) {
          gsap.to(textRef.current, {
            opacity: 1,
            duration: 0.2,
            delay: 0.15,
            ease: "power2.out"
          });
        } else if (textRef.current) {
          gsap.set(textRef.current, { opacity: 0 });
        }
      } else {
        isCustomTextActive.current = false;
        
        if (textRef.current) {
          gsap.to(textRef.current, {
            opacity: 0,
            duration: 0.15,
            ease: "power2.in"
          });
        }
        
        gsap.to(dot, { scale: 1, duration: 0.3, delay: 0.15, ease: "power2.out" });
        gsap.to(ring, {
          scaleX: 1,
          scaleY: 1,
          borderRadius: "50%",
          backgroundColor: "transparent",
          backgroundImage: 'none',
          backdropFilter: "blur(0px)",
          borderColor: "rgba(201,168,76,0.5)",
          duration: 0.3,
          delay: 0.15,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("cursor-state", handleCursorState);

    // Attach listeners to interactive elements
    const attachHoverEvents = () => {
      const interactiveElements = document.querySelectorAll("a, button, input, select, textarea");
      interface CustomElement extends Element { _cursorAttached?: boolean; }
      interactiveElements.forEach((el) => {
        const customEl = el as CustomElement;
        // Skip magnetic elements, they handle their own hover logic or we can let them use the default
        if (!customEl._cursorAttached) {
          customEl.addEventListener("mouseenter", handleHover);
          customEl.addEventListener("mouseleave", handleHoverOut);
          customEl._cursorAttached = true;
        }
      });
    };

    attachHoverEvents();

    const observer = new MutationObserver((mutations) => {
      let shouldAttach = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) shouldAttach = true;
      });
      if (shouldAttach) attachHoverEvents();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    // Handle magnetic snap on special elements if they have a data-magnetic attribute
    // Example usage: <button data-magnetic>...</button>
    // We could add magnetic snapping physics here later if desired

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("cursor-state", handleCursorState);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* The trailing ring / custom text container */}
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cmf-gold/50 pointer-events-none z-[9998] flex items-center justify-center transition-colors overflow-hidden"
        style={{ willChange: "transform" }}
      >
        <span 
          ref={textRef} 
          className="font-mono text-[4px] leading-tight text-center text-cmf-gold tracking-widest opacity-0 px-2"
          style={{ transform: "scale(1)", wordWrap: "break-word" }}
        >
        </span>
      </div>

      {/* The snappy solid dot */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cmf-gold pointer-events-none z-[9999]"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
