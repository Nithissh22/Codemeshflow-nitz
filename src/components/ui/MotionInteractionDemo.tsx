"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MotionInteractionDemo() {
  const magneticRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridDotsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 1. Magnetic Button Physics
  useEffect(() => {
    const el = magneticRef.current;
    if (!el) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      gsap.to(el, {
        x: x * 0.5,
        y: y * 0.5,
        rotation: x * 0.1,
        duration: 1,
        ease: "power3.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)"
      });
    };
    
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // 2. Text Scramble/Reveal Hover
  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;
    
    const text = textEl.innerText;
    const chars = text.split("");
    textEl.innerHTML = "";
    
    chars.forEach((char) => {
      const span = document.createElement("span");
      span.innerText = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.className = "char relative";
      textEl.appendChild(span);
    });

    const charElements = textEl.querySelectorAll(".char");

    const handleMouseEnter = () => {
      gsap.to(charElements, {
        yPercent: -100,
        opacity: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: () => {
          gsap.fromTo(charElements, 
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.4, stagger: 0.03, ease: "back.out(1.5)" }
          );
        }
      });
    };

    const wrapper = textEl.parentElement;
    wrapper?.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      wrapper?.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // 3. Spotlight Mask
  useEffect(() => {
    const container = cursorContainerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update CSS variables for the mask position smoothly using GSAP
      gsap.to(container, {
        "--x": `${x}px`,
        "--y": `${y}px`,
        duration: 0.1,
        ease: "power2.out"
      });
    };
    
    // Set initial position to center
    container.style.setProperty('--x', `${container.offsetWidth / 2}px`);
    container.style.setProperty('--y', `${container.offsetHeight / 2}px`);
    
    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 4. 3D Tilt Cards
  useEffect(() => {
    const cleanupFns: Array<() => void> = [];

    cardsRef.current.forEach(card => {
      if (!card) return;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg
        const rotateY = ((x - centerX) / centerX) * 15;
        
        gsap.to(card, {
          rotateX,
          rotateY,
          scale: 1.05,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 1000
        });
        
        // Move inner glare
        const glare = card.querySelector('.glare') as HTMLElement;
        if (glare) {
          gsap.to(glare, {
            x: x - rect.width,
            y: y - rect.height,
            opacity: 0.4,
            duration: 0.5
          });
        }
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.3)"
        });
        
        const glare = card.querySelector('.glare') as HTMLElement;
        if (glare) {
          gsap.to(glare, { opacity: 0, duration: 0.5 });
        }
      };
      
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
      
      cleanupFns.push(() => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    return () => cleanupFns.forEach(fn => fn());
  }, []);

  // 5. Infinite Marquee
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    
    const content = marquee.innerHTML;
    marquee.innerHTML = content + content;
    
    // Use a slight delay to ensure fonts/layout are calculated
    setTimeout(() => {
      const totalWidth = marquee.scrollWidth / 2;
      
      gsap.to(marquee, {
        x: -totalWidth,
        duration: 20,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
      });
    }, 100);
  }, []);

  // 6. Proximity Grid
  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      gridDotsRef.current.forEach((dot) => {
        if (!dot) return;
        const dotRect = dot.getBoundingClientRect();
        const dotX = (dotRect.left - rect.left) + dotRect.width / 2;
        const dotY = (dotRect.top - rect.top) + dotRect.height / 2;
        
        const distX = mouseX - dotX;
        const distY = mouseY - dotY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        const maxDist = 120;
        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist;
          gsap.to(dot, {
            x: -(distX / distance) * force * 40,
            y: -(distY / distance) * force * 40,
            scale: 1 + force * 2,
            backgroundColor: "#C9A84C",
            duration: 0.3,
            ease: "power2.out"
          });
        } else {
          gsap.to(dot, {
            x: 0,
            y: 0,
            scale: 1,
            backgroundColor: "rgba(255,255,255,0.1)",
            duration: 0.5,
            ease: "power2.out"
          });
        }
      });
    };
    
    const handleMouseLeave = () => {
      gridDotsRef.current.forEach(dot => {
        if (!dot) return;
        gsap.to(dot, {
          x: 0, y: 0, scale: 1, backgroundColor: "rgba(255,255,255,0.1)", duration: 0.8, ease: "elastic.out(1, 0.3)"
        });
      });
    };
    
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="py-20 mb-20 border-t border-b border-cmf-border">
      <div className="mb-20 text-center max-w-2xl mx-auto">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
          INTERACTIVE LAB
        </span>
        <h2 className="heading-display text-4xl md:text-5xl text-cmf-text mb-6">
          Applied Motion Systems
        </h2>
        <p className="font-sans font-light text-cmf-text-muted text-lg">
          We engineer dynamic experiences that react to user intent. Explore the laboratory below to interact with physics-based UI elements, kinetic typography, and spatial computing interfaces.
        </p>
      </div>
      
      {/* Demo 1: Magnetic Gravity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h3 className="text-2xl text-cmf-text font-display mb-4">Magnetic Gravity</h3>
          <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
            By applying simulated physics to interactive elements, we bridge the gap between digital and physical. Elements have mass and pull towards the user&apos;s cursor, creating an irresistible tactile experience that encourages engagement.
          </p>
          <span className="text-cmf-gold text-sm italic font-sans block">Hover over the button to interact →</span>
        </div>
        
        <div className="h-[350px] border border-cmf-border bg-[#080808] flex items-center justify-center relative overflow-hidden group rounded-lg shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.05)_0%,transparent_60%)]"></div>
          <button 
            ref={magneticRef}
            className="relative z-10 w-40 h-40 rounded-full border border-cmf-gold text-cmf-gold flex items-center justify-center font-display text-2xl transition-colors duration-500 hover:bg-cmf-gold hover:text-cmf-bg"
          >
            Play
          </button>
        </div>
      </div>

      {/* Demo 2: Kinetic Typography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="order-2 md:order-1 h-[350px] border border-cmf-border bg-[#080808] flex items-center justify-center relative overflow-hidden cursor-crosshair group rounded-lg shadow-xl">
          <div className="absolute inset-0 bg-[rgba(201,168,76,0.02)] transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
          <h2 
            ref={textRef}
            className="heading-display text-4xl md:text-6xl text-cmf-text relative z-10 overflow-hidden py-4"
          >
            Fluidity
          </h2>
        </div>

        <div className="order-1 md:order-2">
          <h3 className="text-2xl text-cmf-text font-display mb-4">Kinetic Typography</h3>
          <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
            Typography shouldn&apos;t just be read; it should be felt. We split static words into their component characters and choreograph their movement, turning simple text blocks into expressive brand statements.
          </p>
          <span className="text-cmf-gold text-sm italic font-sans block">Hover over the text block to interact ←</span>
        </div>
      </div>

      {/* Demo 3: Spotlight Masking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h3 className="text-2xl text-cmf-text font-display mb-4">Spotlight Masking</h3>
          <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
            By mapping cursor coordinates to CSS radial gradients and masks, we can create an interactive &quot;X-Ray&quot; effect. This technique allows users to actively uncover hidden content or vibrant secondary brand layers, making discovery feel magical.
          </p>
          <span className="text-cmf-gold text-sm italic font-sans block">Move your mouse inside the container →</span>
        </div>
        
        <div 
          ref={cursorContainerRef}
          className="h-[350px] bg-[#050505] relative overflow-hidden rounded-lg shadow-xl border border-cmf-border cursor-none"
          style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
        >
          {/* Base Layer (Visible) */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#080808]">
            <span className="font-display text-4xl text-neutral-800 tracking-widest opacity-30 text-center px-4">HOVER TO REVEAL</span>
          </div>

          {/* Hidden Reveal Layer */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 pointer-events-none transition-opacity duration-300"
            style={{ 
              maskImage: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 0%, transparent 150px)',
              WebkitMaskImage: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 0%, transparent 150px)'
            }}
          >
            <span className="font-display text-4xl text-white tracking-widest font-bold text-center px-4 drop-shadow-xl">INTERACTIVE MAGIC</span>
          </div>
        </div>
      </div>

      {/* Demo 4: 3D Tilt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 h-[400px] bg-[#050505] flex items-center justify-center relative perspective-[1000px] gap-6">
          
          {[1, 2].map((i, idx) => (
            <div 
              key={i}
              ref={el => { cardsRef.current[idx] = el; }}
              className="relative w-40 h-60 bg-[#111] border border-cmf-border rounded-xl shadow-2xl cursor-crosshair transform-style-3d overflow-hidden"
            >
              {/* Inner content layer */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none">
                <span className="font-mono text-[10px] text-cmf-gold tracking-widest">PROJECT 0{i}</span>
                <span className="font-display text-lg text-white">Spatial UI</span>
              </div>
              
              {/* Abstract image layer */}
              <div className="absolute inset-0 bg-cmf-gold/10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(201,168,76,0.15) 0%, transparent 50%)" }}></div>
              
              {/* Dynamic Glare */}
              <div className="glare absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_50%)] mix-blend-overlay opacity-0 pointer-events-none"></div>
            </div>
          ))}
          
        </div>

        <div className="order-1 md:order-2">
          <h3 className="text-2xl text-cmf-text font-display mb-4">Spatial Interfaces</h3>
          <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
            By interpolating the user&apos;s exact mouse coordinates, we can calculate `rotateX` and `rotateY` transforms alongside a simulated glass glare. This creates the illusion of deep 3D space and tangible materials directly in the browser.
          </p>
          <span className="text-cmf-gold text-sm italic font-sans block">Hover around the cards to tilt them ←</span>
        </div>
      </div>

      {/* Demo 5: Infinite Marquee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-24">
        <div>
          <h3 className="text-2xl text-cmf-text font-display mb-4">Continuous Velocity</h3>
          <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
            By leveraging GSAP modifiers, we can create perfectly seamless infinite loops. This technique is highly effective for typography banners, brand tickers, and client carousels.
          </p>
        </div>
        
        <div className="h-[250px] border border-cmf-border bg-[#050505] overflow-hidden flex items-center relative rounded-lg shadow-xl cursor-ew-resize">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>
          
          <div ref={marqueeRef} className="flex whitespace-nowrap gap-12 items-center pl-12 will-change-transform">
            <span className="font-display text-5xl md:text-6xl text-transparent [-webkit-text-stroke:1px_rgba(201,168,76,0.4)] uppercase tracking-widest hover:[-webkit-text-stroke:1px_#C9A84C] transition-all duration-300">
              Fluid Motion • Seamless • 
            </span>
            <span className="font-display text-5xl md:text-6xl text-transparent [-webkit-text-stroke:1px_rgba(201,168,76,0.4)] uppercase tracking-widest hover:[-webkit-text-stroke:1px_#C9A84C] transition-all duration-300">
              Fluid Motion • Seamless • 
            </span>
          </div>
        </div>
      </div>

      {/* Demo 6: Proximity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-24">
        <div className="order-2 md:order-1 h-[400px] bg-[#050505] border border-cmf-border relative overflow-hidden rounded-lg shadow-xl" ref={gridContainerRef}>
          <div className="absolute inset-0 flex flex-wrap content-center justify-center p-8 gap-[22px]">
            {Array.from({ length: 154 }).map((_, i) => (
              <div 
                key={i} 
                ref={el => { gridDotsRef.current[i] = el; }}
                className="w-1.5 h-1.5 rounded-full bg-white/10"
              />
            ))}
          </div>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="font-display text-2xl text-white/30 tracking-widest mix-blend-overlay">REPULSION</span>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <h3 className="text-2xl text-cmf-text font-display mb-4">Proximity Systems</h3>
          <p className="font-sans font-light text-cmf-text-muted text-lg mb-8 leading-relaxed">
            By calculating Euclidean distance vectors between the cursor and a matrix of elements, we create dynamic repulsion fields. This gives digital interfaces an organic, highly responsive feel.
          </p>
          <span className="text-cmf-gold text-sm italic font-sans block">Hover over the matrix grid to interact ←</span>
        </div>
      </div>

    </div>
  );
}
