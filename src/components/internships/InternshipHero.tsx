"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import AnimatedBookBackground from "./AnimatedBookBackground";

export default function InternshipHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const words1 = document.querySelectorAll('.word-reveal-1');
    const words2 = document.querySelectorAll('.word-reveal-2');
    
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(words1, 
      { y: "100%" }, 
      { y: "0%", duration: 0.8, stagger: 0.05, ease: "power4.out" }
    ).fromTo(words2,
      { y: "100%" },
      { y: "0%", duration: 0.8, stagger: 0.05, ease: "power4.out" },
      "-=0.4"
    ).fromTo(".subhead-fade",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.2"
    );

    gsap.fromTo(".stat-counter", 
      { innerText: 0 },
      { 
        innerText: (index: number, target: HTMLElement) => target.dataset.target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stats-row",
          start: "top 80%"
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-[#080808] flex flex-col justify-center overflow-hidden pt-20 border-b border-cmf-border">
      
      <AnimatedBookBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        <div className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] mb-8">
          05 / INTERNSHIPS
        </div>

        <h1 ref={headlineRef} className="heading-display text-[56px] md:text-[88px] font-semibold leading-[1.1] mb-8">
          <div className="overflow-hidden mb-2">
            {"Shape the future.".split(" ").map((word, i) => (
              <span key={i} className="inline-block word-reveal-1 text-[#EDE8DA] mr-4">{word}</span>
            ))}
          </div>
          <div className="overflow-hidden">
            {"Starting now.".split(" ").map((word, i) => (
              <span key={i} className="inline-block word-reveal-2 text-cmf-gold mr-4">{word}</span>
            ))}
          </div>
        </h1>

        <p className="subhead-fade font-sans font-light text-[18px] text-[#7a7468] max-w-[520px] mx-auto mb-[48px] leading-relaxed">
          We take on a small cohort of exceptional students and fresh graduates each quarter. You won't fetch coffee. You'll ship real work.
        </p>

        <div className="stats-row flex flex-wrap items-center justify-center gap-8 md:gap-16 border-t border-cmf-border pt-8 mt-4">
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="font-display font-semibold text-[56px] text-cmf-gold leading-none stat-counter" data-target="4">0</span>
            <span className="label-mono text-[9px] text-[#7a6a3a] tracking-[0.2em] uppercase mt-2 text-center">Cohort size<br/>per quarter</span>
          </div>
          <div className="hidden md:block w-[1px] h-16 bg-cmf-gold/20"></div>
          <div className="flex flex-col items-center min-w-[120px]">
            <div className="flex items-end text-cmf-gold leading-none">
              <span className="font-display font-semibold text-[56px] stat-counter" data-target="12">0</span>
            </div>
            <span className="label-mono text-[9px] text-[#7a6a3a] tracking-[0.2em] uppercase mt-2 text-center">Programme<br/>duration (weeks)</span>
          </div>
          <div className="hidden md:block w-[1px] h-16 bg-cmf-gold/20"></div>
          <div className="flex flex-col items-center min-w-[120px]">
            <div className="flex items-end text-cmf-gold leading-none">
              <span className="font-display font-semibold text-[56px] stat-counter" data-target="100">0</span>
              <span className="font-display font-semibold text-[56px]">%</span>
            </div>
            <span className="label-mono text-[9px] text-[#7a6a3a] tracking-[0.2em] uppercase mt-2 text-center">Real projects<br/>shipped</span>
          </div>
        </div>

      </div>

      <div className="absolute bottom-[32px] left-1/2 transform -translate-x-1/2 z-[5] flex flex-col items-center gap-[8px]">
        <span className="label-mono text-[10px] text-cmf-gold-muted opacity-50">SCROLL</span>
        <div className="w-[1px] h-[60px] bg-cmf-border relative overflow-hidden">
          <div className="w-full h-full bg-cmf-gold absolute top-0 left-0 animate-scroll-line"></div>
        </div>
      </div>
    </section>
  );
}
