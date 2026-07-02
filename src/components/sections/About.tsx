"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";
import { initStatsAnimation } from "@/lib/animations/statsAnimation";
import CatEyes from "@/components/ui/CatEyes";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  
  // Animation Refs
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const statsCanvasRef = useRef<HTMLCanvasElement>(null);
  const statCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Text GSAP Refs
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(SplitText);
    if (!sectionRef.current) return;

    // 1. Counter logic
    countersRef.current.forEach((counter) => {
      if (!counter) return;
      const target = parseInt(counter.getAttribute("data-target") || "0", 10);
      
      gsap.fromTo(counter, 
        { innerHTML: "0" },
        {
          innerHTML: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: statsContainerRef.current || sectionRef.current,
            start: "top 80%"
          }
        }
      );
    });

    // 2. Text Reveal GSAP
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!eyebrowRef.current || !quoteRef.current || !bodyRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true
        }
      });

      const splitEyebrow = new SplitText(eyebrowRef.current, { type: "chars" });
      gsap.set(splitEyebrow.chars, { willChange: "transform, opacity" });
      tl.from(splitEyebrow.chars, {
        opacity: 0,
        stagger: 0.04,
        ease: "none",
        duration: 0.01,
        onComplete: () => cursorRef.current?.classList.add("animate-terminal-blink")
      });

      if (lineRef.current) {
        tl.fromTo(lineRef.current, 
          { scaleY: 0 },
          { scaleY: 1, duration: 1.0, ease: "power2.inOut", transformOrigin: "top center" },
          0.1
        );
      }

      tl.add("quoteStart", 0.2);
      const quoteOuter = new SplitText(quoteRef.current, { type: "words" });
      const quoteInner = new SplitText(quoteOuter.words, { type: "words" });
      gsap.set(quoteOuter.words, { clipPath: "polygon(-100% -100%, 200% -100%, 200% 100%, -100% 100%)", verticalAlign: "bottom", display: "inline-block" });
      gsap.set(quoteInner.words, { willChange: "transform" });
      
      tl.from(quoteInner.words, {
        y: "100%",
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.07,
      }, "quoteStart");

      const paragraphs = Array.from(bodyRef.current.children);
      const bodyOuter = new SplitText(paragraphs, { type: "lines" });
      const bodyInner = new SplitText(bodyOuter.lines, { type: "lines" });
      gsap.set(bodyOuter.lines, { clipPath: "polygon(-100% -100%, 200% -100%, 200% 100%, -100% 100%)", verticalAlign: "bottom" });
      gsap.set(bodyInner.lines, { willChange: "transform, opacity" });
      
      tl.from(bodyInner.lines, {
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "quoteStart+=0.5");

      if (dotRef.current) {
        tl.fromTo(dotRef.current, 
          { scale: 0 },
          { 
            scale: 1, 
            duration: 0.3, 
            ease: "back.out(2)",
            onComplete: () => dotRef.current?.classList.add("animate-dot-pulse-loop")
          }, 
          ">"
        );
      }

      if (leftColRef.current) {
        gsap.to(leftColRef.current, {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      return () => {
        splitEyebrow.revert();
        quoteInner.revert();
        quoteOuter.revert();
        bodyInner.revert();
        bodyOuter.revert();
      };
    });

    let cleanupStats = () => {};

    if (statsCanvasRef.current && statsContainerRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cleanupStats = initStatsAnimation(statsContainerRef.current!, statsCanvasRef.current!, statCardsRef.current.filter(Boolean) as HTMLElement[]);
          } else {
            cleanupStats();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(statsContainerRef.current);
    }

    return () => {
      cleanupStats();
    };

  }, []);

  const handleMouseEnter = () => {
    gsap.to(quoteRef.current, { color: "#EDE8DA", duration: 0.4 });
    gsap.to(lineRef.current, { backgroundColor: "rgba(201,168,76,0.7)", duration: 0.3 });
  };
  
  const handleMouseLeave = () => {
    gsap.to(quoteRef.current, { color: "#C9A84C", duration: 0.4 });
    gsap.to(lineRef.current, { backgroundColor: "rgba(201,168,76,0.25)", duration: 0.3 });
  };

  const setCounterRef = (el: HTMLSpanElement | null, i: number) => {
    countersRef.current[i] = el;
  };

  const setStatCardRef = (el: HTMLDivElement | null, i: number) => {
    statCardsRef.current[i] = el;
  };

  return (
    <section id="about" ref={sectionRef} className="py-32 bg-cmf-bg relative overflow-hidden">
      {/* Huge Background Cat Eyes (Replacing Philosophy Canvas) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[15%] w-[800px] lg:w-[1200px] pointer-events-none opacity-40 z-0">
        <CatEyes className="w-full h-auto" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes terminalBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-terminal-blink {
          animation: terminalBlink 0.5s step-start 3;
        }
        
        @keyframes dotScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.6); }
        }
        @keyframes dotShadow {
          0% { box-shadow: 0 0 0px 0px rgba(201,168,76,0.4); }
          100% { box-shadow: 0 0 0px 8px rgba(201,168,76,0); }
        }
        .animate-dot-pulse-loop {
          animation: dotScale 2.4s ease-in-out infinite, dotShadow 2.4s ease-out infinite;
        }
      `}} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
        <div className="mb-16 flex items-center">
          <span ref={eyebrowRef} className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block">
            03 / PHILOSOPHY
          </span>
          <span ref={cursorRef} className="inline-block w-[1px] h-[12px] bg-cmf-gold ml-2 opacity-0"></span>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          {/* Vertical Divider & Dot */}
          <div className="hidden lg:block absolute left-[50%] -translate-x-1/2 top-0 bottom-0 z-0">
            <div ref={lineRef} className="w-[1px] h-full bg-[rgba(201,168,76,0.25)] origin-top"></div>
            <div ref={dotRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cmf-gold rounded-full scale-0"></div>
          </div>

          <div 
            ref={leftColRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative z-10"
          >
            <h2 ref={quoteRef} className="heading-display-italic text-4xl md:text-[44px] text-cmf-gold leading-tight cursor-default">
              &quot;We don&apos;t build websites. We craft digital legacies.&quot;
            </h2>
          </div>
          
          <div ref={bodyRef} className="flex flex-col justify-center gap-8 relative z-10">
            <p className="font-sans font-light text-base text-[#b0a890] leading-relaxed max-w-lg">
              CodeMeshFlow was founded on the belief that a brand&apos;s digital presence should be its most powerful asset. We reject the generic and the templated, choosing instead to design bespoke experiences that capture the true essence of our clients.
            </p>
            <p className="font-sans font-light text-base text-[#b0a890] leading-relaxed max-w-lg">
              Through a meticulous blend of strategic thinking, cinematic animation, and precise engineering, we build platforms that don&apos;t just endure—they lead.
            </p>
          </div>
        </div>

        {/* Stats Container */}
        <div ref={statsContainerRef} className="border-t border-cmf-border relative mt-16 pt-16">
          <canvas ref={statsCanvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full -mx-4 md:-mx-12 px-4 md:px-12" style={{ width: 'calc(100% + 2rem)' }} />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 relative z-10">
            <div ref={(el) => setStatCardRef(el, 0)} className="relative inline-block px-4">
              <div className="flex items-baseline gap-1">
                <span ref={(el) => setCounterRef(el, 0)} data-target="10" className="heading-display text-5xl md:text-[64px] text-cmf-gold">0</span>
                <span className="heading-display text-5xl md:text-[64px] text-cmf-gold">+</span>
              </div>
              <span className="label-mono text-[10px] text-cmf-text-muted mt-2 block">PROJECTS</span>
            </div>
            
            <div ref={(el) => setStatCardRef(el, 1)} className="relative inline-block px-4">
              <div className="flex items-baseline gap-1">
                <span ref={(el) => setCounterRef(el, 1)} data-target="1" className="heading-display text-5xl md:text-[64px] text-cmf-gold">0</span>
              </div>
              <span className="label-mono text-[10px] text-cmf-text-muted mt-2 block">YEAR IN SERVICE</span>
            </div>
            
            <div ref={(el) => setStatCardRef(el, 2)} className="col-span-2 md:col-span-1 relative inline-block px-4">
              <div className="flex items-baseline gap-1">
                <span ref={(el) => setCounterRef(el, 2)} data-target="5" className="heading-display text-5xl md:text-[64px] text-cmf-gold">0</span>
              </div>
              <span className="label-mono text-[10px] text-cmf-text-muted mt-2 block">AWARDS WON</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
