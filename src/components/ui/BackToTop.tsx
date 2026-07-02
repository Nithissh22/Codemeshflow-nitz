"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Magnetic from "./Magnetic";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[90]">
      <Magnetic strength={0.5}>
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-cmf-gold/10 backdrop-blur-md border border-cmf-gold/30 rounded-full flex items-center justify-center text-cmf-gold hover:bg-cmf-gold hover:text-cmf-bg transition-colors duration-300 shadow-lg group"
          aria-label="Back to top"
        >
          <ArrowUp size={20} className="transform group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </Magnetic>
    </div>
  );
}
