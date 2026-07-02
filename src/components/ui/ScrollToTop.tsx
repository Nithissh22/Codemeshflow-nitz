"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    // Initial check
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div 
      className={`fixed bottom-8 right-8 z-[99] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible 
          ? "opacity-100 translate-y-0 pointer-events-auto" 
          : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0a0a0a]/80 backdrop-blur-md border border-cmf-gold/20 text-cmf-gold shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:bg-cmf-gold hover:text-[#050505] hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-300"
      >
        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
        <span className="absolute -inset-1 rounded-full border border-cmf-gold/0 group-hover:border-cmf-gold/30 group-hover:scale-110 transition-all duration-500"></span>
      </button>
    </div>
  );
}
