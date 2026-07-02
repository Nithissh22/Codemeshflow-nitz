import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";

export function useTextReveal() {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    
    gsap.registerPlugin(SplitText);

    // Find all elements with data-reveal
    const elements = document.querySelectorAll("[data-reveal='true']");
    
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      elements.forEach((el) => {
        // Prevent double initialization
        if (el.classList.contains("reveal-initialized")) return;
        el.classList.add("reveal-initialized");

        const splitType = el.getAttribute("data-reveal-type") || "words"; // words, chars, or lines
        const delay = parseFloat(el.getAttribute("data-reveal-delay") || "0");
        const triggerParams = el.getAttribute("data-reveal-trigger") || "top 85%";

        const split = new SplitText(el, { type: splitType });
        
        // Setup initial state based on type
        let targets: any = null;
        let animationParams: any = {
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: triggerParams,
            once: true
          },
          delay: delay
        };

        if (splitType === "chars") {
          targets = split.chars;
          gsap.set(targets, { opacity: 0, y: 20 });
          animationParams = { ...animationParams, opacity: 1, y: 0, stagger: 0.02, ease: "back.out(2)" };
        } else if (splitType === "words") {
          // Double split for masking effect
          const innerSplit = new SplitText(split.words, { type: "words" });
          gsap.set(split.words, { clipPath: "polygon(-100% -100%, 200% -100%, 200% 100%, -100% 100%)", verticalAlign: "bottom" });
          targets = innerSplit.words;
          gsap.set(targets, { y: "110%" });
          animationParams = { ...animationParams, y: "0%", stagger: 0.04 };
        } else { // lines
          const innerSplit = new SplitText(split.lines, { type: "lines" });
          gsap.set(split.lines, { clipPath: "polygon(-100% -100%, 200% -100%, 200% 100%, -100% 100%)", verticalAlign: "bottom" });
          targets = innerSplit.lines;
          gsap.set(targets, { y: "110%", opacity: 0 });
          animationParams = { ...animationParams, y: "0%", opacity: 1, stagger: 0.1, duration: 1 };
        }

        gsap.to(targets, animationParams);
      });
    });

    return () => {
      // Revert splits on cleanup
      elements.forEach(el => {
        if ((el as any)._split) (el as any)._split.revert();
      });
    };
  }, []);
}
