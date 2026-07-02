"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = [
  "Web Design",
  "Brand Identity",
  "Motion Design",
  "Digital Strategy",
  "UI/UX",
  "Development"
];

export default function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    // We clone the content to make it seamless
    const content = textRef.current;
    const clone = content.cloneNode(true);
    containerRef.current.appendChild(clone);

    const marqueeElements = containerRef.current.children as HTMLCollection;
    
    // Base animation
    const tween = gsap.to(marqueeElements, {
      xPercent: -100,
      repeat: -1,
      duration: 40,
      ease: "none"
    });

    // ScrollTrigger for velocity skew & speed
    let proxy = { skew: 0 };
    let skewSetter = gsap.quickSetter(containerRef.current, "skewX", "deg");
    let clamp = gsap.utils.clamp(-20, 20);

    gsap.to(proxy, {
      skew: 0,
      duration: 0.8,
      ease: "power3",
      overwrite: true,
      onUpdate: () => skewSetter(proxy.skew)
    });

    ScrollTrigger.create({
      onUpdate: (self: any) => {
        let skew = clamp(self.getVelocity() / -300);
        
        // Increase timeScale based on velocity magnitude
        gsap.to(tween, {
          timeScale: 1 + Math.abs(skew),
          duration: 0.2,
          overwrite: true
        });
        
        // Return to normal speed slowly
        gsap.to(tween, {
          timeScale: 1,
          duration: 1,
          delay: 0.2,
          ease: "power2.out",
          overwrite: "auto"
        });

        // Apply skew
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew)
          });
        }
      }
    });

    return () => {
      tween.kill();
    };

  }, []);

  return (
    <div className="w-full border-y border-cmf-border overflow-hidden bg-cmf-surface py-4 flex whitespace-nowrap">
      <div ref={containerRef} className="flex min-w-full">
        <div ref={textRef} className="flex items-center">
          {items.concat(items).map((item, i) => ( // double up to ensure we fill wide screens before repeating
            <div key={i} className="flex items-center">
              <span className="label-mono text-[11px] text-cmf-gold-muted mx-8 tracking-[0.3em]">
                {item}
              </span>
              <span className="text-cmf-gold text-[8px]">◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
