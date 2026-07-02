"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { MoveRight, X } from "lucide-react";
import Link from "next/link";
import { servicesData } from "@/data/services";
import { servicesBackFaceData } from "@/data/servicesBackFace";
import { initServicesAnimation } from "@/lib/animations/servicesAnimation";
import { initOrigamiAnimation } from "@/lib/animations/origamiAnimation";

const interactionData = [
  { label: "BUILD", teaser: "The rabbit hole goes deep →" },
  { label: "DEFINE", teaser: "Your competitors won't like this →" },
  { label: "FEEL", teaser: "Go on. You know you want to →" },
  { label: "THINK", teaser: "Spoiler: it works →" },
  { label: "SELL", teaser: "This one made someone cry (happy) →" },
  { label: "DIVE", teaser: "Warning: highly addictive →" },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const flippersRef = useRef<HTMLDivElement[]>([]);
  const numbersRef = useRef<HTMLSpanElement[]>([]);
  const arrowsRef = useRef<SVGSVGElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const origamiCanvasRef = useRef<HTMLCanvasElement>(null);
  const whyChooseRef = useRef<HTMLDivElement>(null);

  const [showToast, setShowToast] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  const isAnyCardHovered = useRef(false);
  const hasClickedCard = useRef(false);
  const flippedStates = useRef<boolean[]>(new Array(servicesData.length).fill(false));
  const cardRects = useRef<DOMRect[]>([]);

  const layer1Refs = useRef<HTMLElement[]>([]);
  const layer2Refs = useRef<HTMLElement[]>([]);
  const layer3Refs = useRef<HTMLElement[]>([]);
  const isCardPulled = useRef<boolean[]>(new Array(servicesData.length).fill(false));

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickIdleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rafId = useRef<number | null>(null);

  const mouseState = useRef({
    x: -100, y: -100,
    hoveredIndex: -1
  });

  useEffect(() => {
    if (!sectionRef.current || cardsRef.current.length === 0) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const cards = cardsRef.current;

    // INTERACTION 5: STAGGERED SCROLL ENTRANCE
    gsap.fromTo(cards.slice(0, 3),
      { opacity: 0, y: 40, rotateX: 8, scale: 0.97 },
      { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.65, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
    );
    
    if (cards.length > 3) {
      gsap.fromTo(cards.slice(3),
        { opacity: 0, y: 40, rotateX: 8, scale: 0.97 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.65, stagger: 0.12, delay: 0.35, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
      );
    }

    if (canvasRef.current) {
      let cleanupAnimation = () => {};
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cleanupAnimation = initServicesAnimation(
              sectionRef.current!, 
              canvasRef.current!, 
              cards as unknown as NodeListOf<HTMLElement>
            );
          } else cleanupAnimation();
        });
      }, { threshold: 0.1 });
      observer.observe(sectionRef.current);
    }

    const cleanupOrigami = initOrigamiAnimation(whyChooseRef.current!, origamiCanvasRef.current!);

    const updateRects = () => {
      cardRects.current = cards.map(c => c ? c.getBoundingClientRect() : new DOMRect());
    };
    setTimeout(updateRects, 100);
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateRects();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // UNIFIED RAF LOOP for Tilt (1), Magnetic (2), Glow (6)
    const renderLoop = () => {
      if (isMobile || isReducedMotion) return;

      const { x, y, hoveredIndex } = mouseState.current;

      cards.forEach((card, i) => {
        if (!card) return;
        const rect = cardRects.current[i];
        if (!rect || rect.width === 0) return;

        const isHovered = i === hoveredIndex;
        const isFlipped = flippedStates.current[i];
        const flipper = flippersRef.current[i];

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        if (isHovered && !isFlipped) {
          // INTERACTION 1: 3D CARD TILT
          const normX = (x - centerX) / (rect.width / 2);
          const normY = (y - centerY) / (rect.height / 2);
          
          const rotateX = normY * -6;
          const rotateY = normX * 6;

          if (flipper) {
            flipper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
          }

          const layer1 = layer1Refs.current[i] || (layer1Refs.current[i] = card.querySelector('.layer-1') as HTMLElement);
          const layer2 = layer2Refs.current[i] || (layer2Refs.current[i] = card.querySelector('.layer-2') as HTMLElement);
          const layer3 = layer3Refs.current[i] || (layer3Refs.current[i] = card.querySelector('.layer-3') as HTMLElement);
          if (layer1) layer1.style.transform = `translateZ(20px) translateX(${normX * -6}px) translateY(${normY * -6}px)`;
          if (layer2) layer2.style.transform = `translateZ(12px) translateX(${normX * -2}px) translateY(${normY * -2}px)`;
          if (layer3) layer3.style.transform = `translateZ(4px) translateX(${normX * 2}px) translateY(${normY * 2}px)`;

          // INTERACTION 6: GLOW RIPPLE
          card.style.setProperty('--mouse-x', `${x - rect.left}px`);
          card.style.setProperty('--mouse-y', `${y - rect.top}px`);

        } else if (!isFlipped && hoveredIndex === -1) {
          // INTERACTION 2: MAGNETIC HOVER PULL
          const isOutsideX = x < rect.left || x > rect.right;
          const isOutsideY = y < rect.top || y > rect.bottom;
          
          if (isOutsideX || isOutsideY) {
            const nearestX = Math.max(rect.left, Math.min(x, rect.right));
            const nearestY = Math.max(rect.top, Math.min(y, rect.bottom));
            
            const dx = x - nearestX;
            const dy = y - nearestY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 80) {
              const pullStrength = (80 - dist) / 80;
              const pullDx = (x - centerX) * pullStrength * 0.08;
              const pullDy = (y - centerY) * pullStrength * 0.08;
              
              const clampedDx = Math.max(-10, Math.min(10, pullDx));
              const clampedDy = Math.max(-10, Math.min(10, pullDy));

              isCardPulled.current[i] = true;
              gsap.to(card, { x: clampedDx, y: clampedDy, duration: 0.4, ease: "power2.out", overwrite: true });
            } else if (isCardPulled.current[i]) {
              isCardPulled.current[i] = false;
              gsap.to(card, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)", overwrite: true });
            }
          }
        }
      });

      rafId.current = requestAnimationFrame(renderLoop);
    };

    if (!isMobile && !isReducedMotion) {
      rafId.current = requestAnimationFrame(renderLoop);
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      mouseState.current.x = e.clientX;
      mouseState.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      cleanupOrigami();
    };
  }, []);

  // Idle Behaviours
  useEffect(() => {
    hasClickedCard.current = typeof window !== "undefined" && sessionStorage.getItem("firstCardClicked") === "true";

    const startIdleTimer = () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
      idleTimerRef.current = setInterval(() => {
        if (!isAnyCardHovered.current && !hasClickedCard.current) {
          triggerRandomCardNudge();
        }
      }, 4000);
    };

    const startClickIdleTimer = () => {
      if (clickIdleTimerRef.current) clearInterval(clickIdleTimerRef.current);
      clickIdleTimerRef.current = setInterval(() => {
        if (!hasClickedCard.current) triggerNumberScramble();
      }, 8000);
    };

    let lastNudgedIndex = -1;
    const triggerRandomCardNudge = () => {
      let idx;
      do { idx = Math.floor(Math.random() * cardsRef.current.length); } 
      while (idx === lastNudgedIndex && cardsRef.current.length > 1);
      lastNudgedIndex = idx;

      const card = cardsRef.current[idx];
      const arrow = arrowsRef.current[idx];
      if (!card || !arrow || flippedStates.current[idx]) return;

      const tl = gsap.timeline();
      tl.to(card, { x: -4, duration: 0.08, ease: "power2.out" })
        .to(card, { x: 4, duration: 0.1, ease: "power2.inOut" })
        .to(card, { x: 0, duration: 0.15, ease: "elastic.out(1, 0.4)" });

      gsap.timeline().to(arrow, { x: 8, duration: 0.12, ease: "power2.out" })
                     .to(arrow, { x: 0, duration: 0.25, ease: "elastic.out(1,0.5)" });
    };

    const triggerNumberScramble = () => {
      numbersRef.current.forEach((el, i) => {
        if (!el || flippedStates.current[i]) return;
        const originalText = el.getAttribute('data-original') || servicesData[i].num;
        setTimeout(() => {
          const scrambleInterval = setInterval(() => {
            el.textContent = String(Math.floor(Math.random() * 99)).padStart(2, '0');
          }, 50);
          setTimeout(() => {
            clearInterval(scrambleInterval);
            el.textContent = originalText;
          }, 600);
        }, i * 80);
      });
    };

    startIdleTimer();
    startClickIdleTimer();

    return () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
      if (clickIdleTimerRef.current) clearInterval(clickIdleTimerRef.current);
    };
  }, []);

  const handleCardEnter = (i: number, e: React.MouseEvent<HTMLDivElement>) => {
    isAnyCardHovered.current = true;
    mouseState.current.hoveredIndex = i;
    const card = e.currentTarget;
    const flipper = flippersRef.current[i];
    
    if (flipper) flipper.style.willChange = 'transform';
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    if (!flippedStates.current[i]) {
      // INTERACTION 7: ACTIVE EXPANSION
      gsap.to(card, { scale: 1.02, zIndex: 10, duration: 0.4, ease: "cubic-bezier(0.34,1.56,0.64,1)", overwrite: "auto" });
      card.style.boxShadow = '0 0 0 1px rgba(201,168,76,0.2)';
      
      cardsRef.current.forEach((otherCard, idx) => {
        if (idx !== i && otherCard) {
          const isAdjacent = Math.abs(idx - i) === 1 || Math.abs(idx - i) === 3;
          if (isAdjacent) {
            gsap.to(otherCard, { scale: 0.98, opacity: 0.85, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          } else {
            gsap.to(otherCard, { opacity: 0.7, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          }
        }
      });

      // ADVANCED UNIQUE ANIMATIONS PER CARD
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      const tags = card.querySelectorAll('span.relative.overflow-hidden.label-mono');
      const number = card.querySelector('.text-xl');
      const bgGradient = card.querySelector('.bg-gradient-to-br');

      switch(i) {
        case 0: // Web Solutions: Magnetic Pull & Glitch
          if (title) gsap.to(title, { x: 4, skewX: -2, duration: 0.1, yoyo: true, repeat: 3, ease: "none" });
          if (tags.length) gsap.to(tags, { x: 5, ease: "power2.out", duration: 0.3, stagger: 0.05 });
          break;
        case 1: // Mobile App: Staggered 3D Cascade
          gsap.fromTo([number, title, desc, ...Array.from(tags)], 
            { rotationX: -15, y: 10 }, 
            { rotationX: 0, y: 0, stagger: 0.05, duration: 0.5, ease: "back.out(1.7)", overwrite: "auto" }
          );
          break;
        case 2: // Software Dev: Neon Pulse & Blur
          card.style.boxShadow = '0 0 20px rgba(201,168,76,0.4), inset 0 0 10px rgba(201,168,76,0.1)';
          if (title) gsap.fromTo(title, { filter: 'blur(4px)' }, { filter: 'blur(0px)', duration: 0.5, ease: "power2.out" });
          break;
        case 3: // Graphic Design: Morph & Scale
          if (title) gsap.to(title, { scale: 1.05, color: '#E8C96A', duration: 0.5, ease: "elastic.out(1, 0.4)" });
          break;
        case 4: // Creative Media: Cinematic Pan
          if (title) gsap.to(title, { scale: 1.03, rotationZ: 0.5, duration: 0.6, ease: "power2.out" });
          break;
        case 5: // Digital Marketing: Scramble & Surge
          if (title) {
            const originalTitle = title.getAttribute('data-original-title') || title.textContent || "";
            if (!title.hasAttribute('data-original-title')) title.setAttribute('data-original-title', originalTitle);
            let obj = { val: 0 };
            gsap.to(obj, { val: 100, duration: 0.5, onUpdate: () => {
              title.textContent = originalTitle.split('').map(c => (c === ' ' ? ' ' : (Math.random() > 0.5 ? String.fromCharCode(33 + Math.random() * 90) : c))).join('');
            }, onComplete: () => { title.textContent = originalTitle; } });
          }
          if (tags.length) gsap.fromTo(tags, { x: 20 }, { x: 0, stagger: 0.1, duration: 0.5, ease: "power3.out" });
          break;
      }
    }

    // INTERACTION 3: BORDER TRACE
    const borderTrace = card.querySelector('.border-trace') as SVGElement;
    if (borderTrace) {
      const rect = card.getBoundingClientRect();
      const perim = 2 * (rect.width + rect.height);
      borderTrace.style.strokeDasharray = `${perim}`;
      gsap.fromTo(borderTrace, 
        { strokeDashoffset: perim, strokeOpacity: 0.6 },
        { strokeDashoffset: 0, duration: 0.6, ease: "power2.out", overwrite: true }
      );
    }
    
    // Existing Teaser Behavior
    if (card.dataset.teased !== "true" && !flippedStates.current[i]) {
      const teaser = card.querySelector('.card-teaser');
      if (teaser) {
        gsap.to(teaser, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.6 });
      }
    }
  };

  const handleCardLeave = (i: number, e: React.MouseEvent<HTMLDivElement>) => {
    isAnyCardHovered.current = false;
    mouseState.current.hoveredIndex = -1;
    const card = e.currentTarget;
    const flipper = flippersRef.current[i];
    
    if (flipper && !flippedStates.current[i]) {
      flipper.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      setTimeout(() => { if (mouseState.current.hoveredIndex !== i) flipper.style.willChange = 'auto'; }, 300);
      
      const layer1 = card.querySelector('.layer-1') as HTMLElement;
      const layer2 = card.querySelector('.layer-2') as HTMLElement;
      const layer3 = card.querySelector('.layer-3') as HTMLElement;
      if (layer1) layer1.style.transform = 'translateZ(0px)';
      if (layer2) layer2.style.transform = 'translateZ(0px)';
      if (layer3) layer3.style.transform = 'translateZ(0px)';
    }

    // INTERACTION 7: RESET EXPANSION
    cardsRef.current.forEach(c => {
      if(c) gsap.to(c, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    });
    card.style.boxShadow = 'none';

    // RESET ADVANCED UNIQUE ANIMATIONS
    const title = card.querySelector('h3');
    const tags = card.querySelectorAll('span.relative.overflow-hidden.label-mono');
    const desc = card.querySelector('p');
    const number = card.querySelector('.text-xl');

    switch(i) {
      case 0:
        if (title) gsap.to(title, { x: 0, skewX: 0, duration: 0.3 });
        if (tags.length) gsap.to(tags, { x: 0, duration: 0.3 });
        break;
      case 1:
        gsap.set([number, title, desc, ...Array.from(tags)], { clearProps: "all" });
        break;
      case 2:
        if (title) gsap.set(title, { clearProps: "filter" });
        break;
      case 3:
        if (title) gsap.to(title, { scale: 1, color: '', duration: 0.4 });
        break;
      case 4:
        if (title) gsap.to(title, { scale: 1, rotationZ: 0, duration: 0.4 });
        break;
      case 5:
        if (title) {
          const originalTitle = title.getAttribute('data-original-title');
          if (originalTitle) title.textContent = originalTitle;
          gsap.killTweensOf(title);
        }
        if (tags.length) gsap.set(tags, { clearProps: "transform" });
        break;
    }

    // INTERACTION 3: BORDER FADEOUT
    const borderTrace = card.querySelector('.border-trace') as SVGElement;
    if (borderTrace) {
      gsap.to(borderTrace, { strokeOpacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });
    }

    // Teaser reset
    if (card.dataset.teased !== "true") {
      const teaser = card.querySelector('.card-teaser');
      if (teaser) {
        gsap.to(teaser, { opacity: 0, y: 6, duration: 0.25 });
        card.dataset.teased = "true";
      }
    }
  };

  const handleCardClick = (i: number, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a')) return; // let links navigate

    const isFlipped = flippedStates.current[i];
    flippedStates.current[i] = !isFlipped;
    const flipper = flippersRef.current[i];

    if (!hasClickedCard.current) {
      hasClickedCard.current = true;
      sessionStorage.setItem("firstCardClicked", "true");
      setShowToast(true);
      setTimeout(() => {
        if (toastRef.current) {
          gsap.fromTo(toastRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
          gsap.to(toastRef.current, { y: 10, opacity: 0, duration: 0.3, delay: 3, onComplete: () => setShowToast(false) });
        }
      }, 50);
    }

    if (flipper) {
      flipper.style.transform = !isFlipped 
        ? `perspective(1200px) rotateY(180deg)` 
        : `perspective(1200px) rotateY(0deg)`;
        
      if (!isFlipped) {
        gsap.to(cardsRef.current[i], { scale: 1, boxShadow: 'none', duration: 0.4 });
      }
    }
  };

  // INTERACTION 8: TAG RIPPLE
  const handleTagEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const chip = e.currentTarget;
    const rect = chip.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'absolute rounded-full pointer-events-none z-0 mix-blend-screen';
    ripple.style.background = 'rgba(201,168,76,0.3)';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = 'translate(-50%, -50%)';
    chip.appendChild(ripple);

    gsap.fromTo(ripple,
      { width: 0, height: 0, opacity: 1 },
      { width: 120, height: 120, opacity: 0, duration: 0.5, ease: "power2.out", onComplete: () => ripple.remove() }
    );
  };

  return (
    <section id="services" ref={sectionRef} className="py-32 px-4 md:px-12 bg-cmf-bg text-cmf-text relative overflow-hidden">
      {/* INTERACTION 9: SVG Noise Overlay Filter */}
      <svg width="0" height="0" className="absolute pointer-events-none hidden">
        <defs>
          <filter id="noise-01">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-80" />
      
      <div className="max-w-[1400px] mx-auto relative z-10 services-grid" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
        <div className="mb-20 relative z-10">
          <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
            02 / SERVICES
          </span>
          <h2 className="heading-display text-5xl md:text-[56px]" data-reveal="true" data-reveal-type="words" data-reveal-trigger="top 85%">What We Do</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-cmf-border border border-cmf-border relative z-10">
          <style dangerouslySetInnerHTML={{__html: `
            .service-card { will-change: transform; }
            .service-card::before {
              content: ''; position: absolute; width: 300px; height: 300px;
              border-radius: 50%; background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 40%, transparent 70%);
              transform: translate(-50%, -50%); pointer-events: none; opacity: 0; transition: opacity 0.3s;
              left: var(--mouse-x, -100px); top: var(--mouse-y, -100px); z-index: 1;
            }
            @media (pointer: fine) { .service-card:hover::before { opacity: 1; } }
          `}} />
          
          {servicesData.map((service, i) => {
            const backFace = servicesBackFaceData[service.slug] || servicesBackFaceData['web-architecture'];
            return (
              <div 
                key={i}
                ref={(el) => { if (el) cardsRef.current[i] = el; }}
                className="service-card group relative overflow-hidden min-h-[360px] cursor-pointer bg-cmf-surface border border-transparent"
                onMouseEnter={(e) => handleCardEnter(i, e)}
                onMouseLeave={(e) => handleCardLeave(i, e)}
                onClick={(e) => handleCardClick(i, e)}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 card-border-svg">
                  <rect className="border-trace w-full h-full" x="0" y="0" fill="none" stroke="#C9A84C" strokeWidth="2" strokeOpacity="0" />
                </svg>

                <div className="card-noise absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-10" style={{ background: 'rgba(201,168,76,0.02)', filter: 'url(#noise-01)' }} />

                <div 
                  ref={(el) => { if (el) flippersRef.current[i] = el; }}
                  className="card-flipper relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" 
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="card-front absolute inset-0 p-10 md:p-12 flex flex-col justify-between bg-cmf-surface z-20" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-cmf-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    <div className="flex justify-between items-start relative z-20 layer-1 transition-transform duration-100 ease-linear">
                      <span ref={(el) => { if(el) numbersRef.current[i] = el; }} data-original={service.num} className="label-mono text-xl text-cmf-gold-muted group-hover:text-cmf-gold transition-colors duration-500 inline-block w-[30px]">
                        {service.num}
                      </span>
                      <MoveRight ref={(el) => { if(el) arrowsRef.current[i] = el as unknown as SVGSVGElement; }} className="text-cmf-gold opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-2 transition-all duration-500 w-6 h-6 stroke-[1]" />
                    </div>

                    <div className="relative z-20 mt-auto">
                      <h3 className="layer-2 font-display font-normal text-2xl md:text-3xl mb-4 group-hover:-translate-y-2 transition-transform duration-100 ease-linear">{service.title}</h3>
                      <div className="layer-3 transition-transform duration-100 ease-linear relative z-20">
                        <p className="font-sans font-light text-sm text-cmf-text-muted max-w-sm mb-8 group-hover:-translate-y-2 transition-transform duration-500 delay-75">
                          {service.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                          {service.skills.map((skill, idx) => (
                            <span 
                              key={idx} 
                              onMouseEnter={handleTagEnter}
                              className="relative overflow-hidden label-mono text-[9px] px-2 py-1 border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.5)] transition-colors duration-200 text-cmf-gold-muted uppercase tracking-wider"
                            >
                              <span className="relative z-10 pointer-events-none">{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="card-teaser absolute bottom-4 left-5 right-5 font-mono text-[10px] tracking-[0.15em] text-cmf-gold opacity-0 translate-y-[10px] pointer-events-none z-20">
                      {interactionData[i]?.teaser || "Click to explore →"}
                    </div>
                  </div>

                  <div className="card-back absolute inset-0 bg-[#0f0e0c] border border-[rgba(201,168,76,0.2)] p-10 md:p-12 flex flex-col justify-between z-30" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <button className="absolute top-6 right-6 text-cmf-gold-muted hover:text-cmf-gold transition-colors p-2 z-40" onClick={(e) => { e.stopPropagation(); handleCardClick(i, e); }}>
                      <X size={20} strokeWidth={1} />
                    </button>

                    <div className="space-y-6 relative z-30">
                      <div>
                        <div className="font-mono text-[9px] text-cmf-gold-muted uppercase tracking-widest mb-2">CORE DELIVERABLES</div>
                        <div className="font-sans font-medium text-[15px] text-[#EDE8DA] leading-snug">{backFace.deliverables}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] text-cmf-gold-muted uppercase tracking-widest mb-2">TYPICAL TIMELINE</div>
                        <div className="font-sans font-light text-[13px] text-[#b0a890]">{backFace.timeline}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] text-cmf-gold-muted uppercase tracking-widest mb-2">BEST FOR</div>
                        <div className="font-sans font-light text-[13px] text-[#b0a890]">{backFace.audience}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-8 relative z-30">
                      <Link href={`/services/${service.slug}`} className="font-mono text-[10px] tracking-widest uppercase py-3 border border-cmf-gold text-cmf-gold text-center hover:bg-cmf-gold/10 transition-colors">
                        Explore Details →
                      </Link>
                      <Link href="#contact" className="font-mono text-[10px] tracking-widest uppercase py-3 bg-cmf-gold text-[#080808] text-center hover:bg-[#E8C96A] transition-colors">
                        Start a Project →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Choose Section */}
        <div ref={whyChooseRef} className="mt-32 border-t border-[rgba(201,168,76,0.2)] pt-20 pb-10 relative z-10 overflow-hidden">
          <canvas ref={origamiCanvasRef} className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none" />
          
          <div className="relative z-10">
            <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
              03 / THE ADVANTAGE
            </span>
          <h2 className="heading-display text-4xl md:text-[48px] mb-12" data-reveal="true" data-reveal-type="words" data-reveal-trigger="top 85%">Why Choose CodeMeshFlow?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Professional Solutions",
              "Affordable Pricing",
              "Modern Design Approach",
              "Business-Focused Strategy",
              "Dedicated Support",
              "End-to-End Digital Services",
              "On-Time Delivery"
            ].map((reason, i) => (
              <div key={i} className={`flex items-center gap-5 bg-cmf-surface border border-[rgba(201,168,76,0.15)] p-6 group hover:border-[rgba(201,168,76,0.4)] hover:bg-[#0a0a09] transition-all duration-300 ${reason === "On-Time Delivery" ? "lg:col-start-2 sm:col-span-2 lg:col-span-1 sm:max-w-[calc(50%-12px)] lg:max-w-none sm:mx-auto lg:mx-0 w-full" : ""}`}>
                <div className="text-cmf-gold font-display text-xl group-hover:scale-125 transition-transform">✔</div>
                <div className="font-sans font-light text-[17px] text-[#EDE8DA] tracking-wide">{reason}</div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div ref={toastRef} className="fixed bottom-8 left-8 bg-[#0f0e0c] border border-[rgba(201,168,76,0.3)] px-4 py-3 flex gap-3 items-center z-[9999] opacity-0 shadow-2xl">
          <span className="text-cmf-gold text-lg">✦</span>
          <div>
            <div className="font-display text-[14px] text-[#EDE8DA] font-semibold leading-tight">First step taken</div>
            <div className="font-mono text-[9px] text-[#7a6a3a] tracking-[0.15em] mt-0.5">You clicked. We noticed.</div>
          </div>
        </div>
      )}
    </section>
  );
}
