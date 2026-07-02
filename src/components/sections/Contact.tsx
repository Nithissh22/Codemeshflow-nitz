"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { initContactAnimation } from "@/lib/animations/contactAnimation";
import Magnetic from "@/components/ui/Magnetic";
import { AnimatePresence, motion } from "framer-motion";

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !bgRef.current) return;

    gsap.to(bgRef.current, {
      opacity: 0.05,
      scale: 1.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true
      }
    });

    if (canvasRef.current) {
      let cleanupAnimation = () => {};
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cleanupAnimation = initContactAnimation(containerRef.current!, canvasRef.current!);
          } else {
            cleanupAnimation();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
        cleanupAnimation();
      };
    }
  }, []);

  return (
    <section id="contact" ref={containerRef} className="py-40 bg-cmf-bg relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh] border-t border-cmf-border text-center px-4">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />
      
      {/* Subtle radial glow background */}
      <div 
        ref={bgRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full opacity-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }}
      ></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-8">
          05 / CONNECT
        </span>
        
        <h2 className="heading-display-italic text-6xl md:text-[80px] text-cmf-text mb-6" data-reveal="true" data-reveal-type="words">
          Ready to begin?
        </h2>
        
        <p className="font-sans font-light text-lg text-cmf-text-muted mb-16">
          Tell us about your project.
        </p>
        
        <a 
          href="mailto:codemeshflow@gmail.com" 
          className="heading-display text-2xl md:text-4xl text-cmf-text relative group inline-block mb-4"
        >
          codemeshflow@gmail.com
          <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-cmf-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"></span>
        </a>

        <p className="font-sans font-light text-lg text-cmf-text-muted mb-2">
          Office: 097896 07915 / 093426 07915
        </p>
        <p className="font-sans font-light text-lg text-cmf-text-muted mb-16">
          Location: Near Erode Bus Stand
        </p>

        <Magnetic strength={0.3}>
          <motion.div layout className="relative inline-flex overflow-hidden rounded-none">
            <AnimatePresence mode="wait">
              {!showWhatsapp ? (
                <motion.button
                  key="start"
                  onClick={() => setShowWhatsapp(true)}
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-cmf-gold text-cmf-bg font-display font-semibold text-xl md:text-2xl px-10 py-5 flex items-center gap-4 hover:bg-cmf-gold-light transition-colors duration-300 whitespace-nowrap"
                >
                  Start a Project
                  <span className="text-xl">→</span>
                </motion.button>
              ) : (
                <motion.a
                  key="whatsapp"
                  href="https://wa.me/919342607915"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#25D366] text-white font-display font-semibold text-xl md:text-2xl px-8 py-5 flex items-center gap-3 hover:bg-[#20b958] transition-colors duration-300 whitespace-nowrap"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Connect on WhatsApp
                </motion.a>
              )}
            </AnimatePresence>
          </motion.div>
        </Magnetic>
      </div>
    </section>
  );
}
