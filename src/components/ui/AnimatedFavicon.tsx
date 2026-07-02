"use client";

import { useEffect } from "react";

const frames = [
  // Frame 1: Wings high up
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23C9A84C' d='M16 20 C 10 10, 4 4, 2 4 C 8 8, 14 16, 16 20 C 18 16, 24 8, 30 4 C 28 4, 22 10, 16 20 Z'/%3E%3C/svg%3E`,
  // Frame 2: Wings mid
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23C9A84C' d='M16 18 C 10 14, 4 12, 2 12 C 8 13, 14 16, 16 18 C 18 16, 24 13, 30 12 C 28 12, 22 14, 16 18 Z'/%3E%3C/svg%3E`,
  // Frame 3: Wings down
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23C9A84C' d='M16 16 C 10 20, 4 24, 2 24 C 8 22, 14 18, 16 16 C 18 18, 24 22, 30 24 C 28 24, 22 20, 16 16 Z'/%3E%3C/svg%3E`,
  // Frame 4: Wings mid (to complete the loop smoothly)
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23C9A84C' d='M16 18 C 10 14, 4 12, 2 12 C 8 13, 14 16, 16 18 C 18 16, 24 13, 30 12 C 28 12, 22 14, 16 18 Z'/%3E%3C/svg%3E`
];

export default function AnimatedFavicon() {
  useEffect(() => {
    let currentFrame = 0;
    
    // Find or create the favicon link element
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.type = "image/svg+xml";
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    const interval = setInterval(() => {
      if (link) {
        link.href = frames[currentFrame];
        currentFrame = (currentFrame + 1) % frames.length;
      }
    }, 150); // 150ms per frame = smooth flapping

    return () => clearInterval(interval);
  }, []);

  return null;
}
