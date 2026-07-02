"use client";

import { useEffect, useRef } from "react";
import HecoTerrainGsap from "@/components/ui/HecoTerrainGsap";
import { gsap } from "@/lib/gsap";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const sweepRefs = useRef<(HTMLElement | null)[]>([]);

  const addSweepRef = (el: HTMLElement | null) => {
    if (el && !sweepRefs.current.includes(el)) {
      sweepRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (sectionRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Simple fade in for the footer elements when visible
            gsap.fromTo(sweepRefs.current, 
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
            );
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(sectionRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <footer ref={sectionRef} className="bg-cmf-bg relative z-20 overflow-hidden min-h-[40vh]">
      <HecoTerrainGsap />
      
      {/* Full width hairline */}
      <div className="w-full h-[1px] bg-cmf-border relative z-10"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 grid grid-cols-1 md:grid-cols-3 items-center gap-6 relative z-10">
        
        {/* Logo */}
        <div ref={addSweepRef} className="flex items-center gap-2 justify-self-center md:justify-self-start">
          <div className="w-5 h-5">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="75,35 97,32 77,37" fill="#C9A84C" />
              <polygon points="65,30 75,35 77,37" fill="#E8C96A" />
              <polygon points="65,30 77,37 67,42" fill="#f5aa42" />
              <polygon points="65,30 67,42 50,50" fill="#fc4402" />
              <polygon points="65,30 50,50 50,35" fill="#f58a42" />
              <polygon points="50,35 55,20 25,5" fill="#E8C96A" />
              <polygon points="50,35 25,5 30,15" fill="#f5cc7a" />
              <polygon points="45,70 30,85 40,65" fill="#7a6a3a" />
              <polygon points="67,42 60,60 50,50" fill="#d9a855" />
              <polygon points="60,60 45,70 50,50" fill="#C9A84C" />
            </svg>
          </div>
          <span className="text-cmf-text font-display font-semibold text-lg tracking-tight">
            CodeMeshFlow
          </span>
        </div>

        {/* Socials & Copyright */}
        <div className="flex items-center gap-8 text-cmf-text-muted justify-self-center">
          <a ref={addSweepRef} href="https://www.facebook.com/share/1EsM5WmkZq/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-cmf-gold transition-colors" title="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a ref={addSweepRef} href="https://www.linkedin.com/in/codemeshflow-8b270a415/" target="_blank" rel="noopener noreferrer" className="hover:text-cmf-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a ref={addSweepRef} href="https://www.instagram.com/codemeeshflow?igsh=d2gxZDR3NXFzOWJ2" target="_blank" rel="noopener noreferrer" className="hover:text-cmf-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a ref={addSweepRef} href="https://wa.me/919342607915" target="_blank" rel="noopener noreferrer" className="hover:text-cmf-gold transition-colors" title="WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
          <a ref={addSweepRef} href="https://www.google.com/maps?rlz=1C1CHZN_enIN1208IN1208&gs_lcrp=EgZjaHJvbWUqBggEEEUYOzIGCAAQRRg8MgYIARBFGDsyBggCEEUYOzIGCAMQRRg5MgYIBBBFGDsyBggFEEUYPDIGCAYQRRhBMgYIBxBFGEHSAQg0MDI5ajBqN6gCALACAA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KUuZxScfb6k7MQWJlIlCvX_o&daddr=Rr+Lodge,+232,Vctv+Main+Road,+oppsite,+Sathy+Rd,+Erode,+Tamil+Nadu+638003" target="_blank" rel="noopener noreferrer" className="hover:text-cmf-gold transition-colors" title="Our Office Location">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </a>
        </div>

        <div className="flex flex-col md:items-end gap-1 justify-self-center md:justify-self-end">
          <span ref={addSweepRef} className="label-mono text-[10px] text-cmf-gold block text-center md:text-right">
            CEO & FOUNDER: SHARAN K T
          </span>
          <span ref={addSweepRef} className="label-mono text-[10px] text-cmf-text-muted text-center md:text-right block">
            Designed & Built with precision. <br/>
            &copy; {new Date().getFullYear()} CodeMeshFlow.
          </span>
        </div>

      </div>
    </footer>
  );
}
