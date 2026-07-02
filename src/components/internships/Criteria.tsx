"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Criteria() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = document.querySelectorAll('.criteria-word');
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
    <section ref={containerRef} className="w-full bg-cmf-bg py-[120px] border-b border-cmf-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Left Column */}
        <div className="flex-1 md:sticky top-32 h-fit">
          <blockquote className="heading-display-italic font-semibold text-[32px] md:text-[38px] text-cmf-gold leading-tight">
            <div className="overflow-hidden mb-2 pt-2">
              {"We don't care where you studied.".split(" ").map((word, i) => (
                <span key={i} className="inline-block criteria-word mr-3">{word}</span>
              ))}
            </div>
            <div className="overflow-hidden pb-2">
              {"We care what you've built.".split(" ").map((word, i) => (
                <span key={i} className="inline-block criteria-word mr-3 text-[#EDE8DA]">{word}</span>
              ))}
            </div>
          </blockquote>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-12">
          
          <div className="flex flex-col gap-2">
            <h4 className="heading-display text-[24px] text-cmf-text flex items-start gap-4">
              <span className="text-cmf-gold mt-1">→</span>
              Portfolio that shows initiative
            </h4>
            <p className="font-sans font-light text-[15px] text-[#7a7468] pl-[34px]">
              Personal projects count more than coursework
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="heading-display text-[24px] text-cmf-text flex items-start gap-4">
              <span className="text-cmf-gold mt-1">→</span>
              Obsession with craft
            </h4>
            <p className="font-sans font-light text-[15px] text-[#7a7468] pl-[34px]">
              You notice kerning. You iterate past "good enough"
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="heading-display text-[24px] text-cmf-text flex items-start gap-4">
              <span className="text-cmf-gold mt-1">→</span>
              Clear thinking
            </h4>
            <p className="font-sans font-light text-[15px] text-[#7a7468] pl-[34px]">
              You can explain WHY, not just HOW
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="heading-display text-[24px] text-cmf-text flex items-start gap-4">
              <span className="text-cmf-gold mt-1">→</span>
              Hunger to grow
            </h4>
            <p className="font-sans font-light text-[15px] text-[#7a7468] pl-[34px]">
              You send us links to things that inspired you
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="heading-display text-[24px] text-cmf-text flex items-start gap-4">
              <span className="text-cmf-gold mt-1">→</span>
              Ability to ship
            </h4>
            <p className="font-sans font-light text-[15px] text-[#7a7468] pl-[34px]">
              Unfinished side projects are fine — zero shipped projects is a red flag
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 pl-[34px]">
            <p className="font-mono text-[11px] text-[rgba(201,168,76,0.3)] tracking-[0.15em] leading-relaxed">
              // We are location-flexible for the right candidate.<br/>
              // Chennai-based applicants may work from our studio.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
