"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const words = document.querySelectorAll('.quote-word');
    gsap.fromTo(words,
      { y: "100%", opacity: 0 },
      { 
        y: "0%", opacity: 1, duration: 0.8, stagger: 0.05, ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%"
        }
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-[#0a0a0a] py-[120px] border-b border-cmf-border">
      <div className="max-w-[720px] mx-auto px-6 flex flex-col items-center text-center">
        
        <div className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] mb-12">
          THE PROGRAMME
        </div>

        <blockquote className="heading-display-italic font-semibold text-[36px] md:text-[48px] text-[#EDE8DA] leading-tight mb-16">
          <div className="overflow-hidden mb-2 pt-2">
            {"Most internships are observation.".split(" ").map((word, i) => (
              <span key={i} className="inline-block quote-word mr-3">{word}</span>
            ))}
          </div>
          <div className="overflow-hidden pb-2">
            {"Ours is participation.".split(" ").map((word, i) => (
              <span key={i} className="inline-block quote-word mr-3 text-cmf-gold">{word}</span>
            ))}
          </div>
        </blockquote>

        <div className="flex flex-col gap-6 text-left w-full mb-20">
          <p className="font-sans font-light text-[16px] text-[#b0a890] leading-relaxed">
            Over 12 weeks, you'll be embedded in live client projects — contributing to strategy sessions, design reviews, and production deployments. Your name goes in the credits.
          </p>
          <p className="font-sans font-light text-[16px] text-[#b0a890] leading-relaxed">
            We work with a maximum of 4 interns per cohort. Intentionally small. So every person gets real mentorship, real responsibility, and real output to show the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div className="group relative bg-[#0f0e0c] border border-[rgba(201,168,76,0.12)] p-[32px_28px] overflow-hidden transition-all duration-500 hover:border-[rgba(201,168,76,0.5)]">
            <div className="absolute inset-0 bg-cmf-gold opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="absolute top-1/2 left-1/2 w-[150%] aspect-square bg-cmf-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-[1.5s] ease-out pointer-events-none blur-[60px]"></div>
            
            <div className="relative z-10">
              <svg className="w-[28px] h-[28px] mb-8" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <h3 className="heading-display font-semibold text-[22px] text-[#EDE8DA] mb-4">Mentorship</h3>
              <p className="font-sans font-light text-[13px] text-[#7a7468] leading-relaxed">
                Weekly 1:1s with senior designers and developers. Direct access, honest feedback.
              </p>
            </div>
          </div>

          <div className="group relative bg-[#0f0e0c] border border-[rgba(201,168,76,0.12)] p-[32px_28px] overflow-hidden transition-all duration-500 hover:border-[rgba(201,168,76,0.5)]">
            <div className="absolute inset-0 bg-cmf-gold opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="absolute top-1/2 left-1/2 w-[150%] aspect-square bg-cmf-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-[1.5s] ease-out pointer-events-none blur-[60px]"></div>
            
            <div className="relative z-10">
              <svg className="w-[28px] h-[28px] mb-8" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              <h3 className="heading-display font-semibold text-[22px] text-[#EDE8DA] mb-4">Live Projects</h3>
              <p className="font-sans font-light text-[13px] text-[#7a7468] leading-relaxed">
                Real clients, real briefs, real deadlines. Portfolio pieces that actually launched.
              </p>
            </div>
          </div>

          <div className="group relative bg-[#0f0e0c] border border-[rgba(201,168,76,0.12)] p-[32px_28px] overflow-hidden transition-all duration-500 hover:border-[rgba(201,168,76,0.5)]">
            <div className="absolute inset-0 bg-cmf-gold opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="absolute top-1/2 left-1/2 w-[150%] aspect-square bg-cmf-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-[1.5s] ease-out pointer-events-none blur-[60px]"></div>
            
            <div className="relative z-10">
              <svg className="w-[28px] h-[28px] mb-8" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.2">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              <h3 className="heading-display font-semibold text-[22px] text-[#EDE8DA] mb-4">Recognition</h3>
              <p className="font-sans font-light text-[13px] text-[#7a7468] leading-relaxed">
                Letter of recommendation, portfolio feature on our site, and referrals to our client network.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
