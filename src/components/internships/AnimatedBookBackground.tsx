"use client";

import { useEffect, useState } from "react";

const MAX_DEPTH = 5;

// The Slice component recursively renders 5 nested divs to create a hyper-realistic curved page.
const Slice = ({ depth, delay }: { depth: number; delay: string }) => {
  const isRoot = depth === 0;
  
  // Perfectly align the gradient across the 5 independent slices
  const bgPos = `${(depth / (MAX_DEPTH - 1)) * 100}% 0%`;
  
  // Ambient lighting gradient for a dark, luxurious look
  const pageGradient = "linear-gradient(to right, #050505 0%, #171717 15%, #171717 85%, #050505 100%)";

  return (
    <div 
      className={`absolute inset-y-0 origin-left transform-style-3d ${isRoot ? 'left-0 w-[20%]' : 'left-full w-full'}`}
      style={{ 
        animationName: isRoot ? "turn-root" : "turn-child",
        animationDuration: "8s",
        animationDelay: delay,
        animationIterationCount: "infinite",
        animationTimingFunction: "ease-in-out"
      }}
    >
      {/* Front of Page */}
      <div 
        className="absolute inset-0 backface-hidden border-t border-b border-[#ffffff0a]"
        style={{
          background: pageGradient,
          backgroundSize: `${MAX_DEPTH * 100}% 100%`,
          backgroundPosition: bgPos,
          // Gold edge on the tip of the page
          borderRight: depth === MAX_DEPTH - 1 ? "1px solid rgba(201,168,76,0.3)" : "none",
        }}
      ></div>

      {/* Back of Page */}
      <div 
        className="absolute inset-0 backface-hidden border-t border-b border-[#ffffff0a]"
        style={{
          transform: "rotateY(180deg)",
          background: pageGradient,
          backgroundSize: `${MAX_DEPTH * 100}% 100%`,
          backgroundPosition: `${100 - (depth / (MAX_DEPTH - 1)) * 100}% 0%`,
          // Gold edge on the tip of the back face
          borderLeft: depth === MAX_DEPTH - 1 ? "1px solid rgba(201,168,76,0.3)" : "none",
        }}
      ></div>

      {/* Recursively attach the next slice */}
      {depth + 1 < MAX_DEPTH && <Slice depth={depth + 1} delay={delay} />}
    </div>
  );
};

export default function AnimatedBookBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // 12 pages gives a lush, continuous fanning effect
  const pages = Array.from({ length: 12 });
  const duration = 8; // 8 seconds per full loop

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none perspective-[2500px] overflow-hidden bg-[#080808]">
      
      {/* Subtle gold spotlight on the book */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.1)_0%,transparent_60%)]"></div>

      {/* Main 3D Book Container */}
      <div 
        className="relative w-[90vw] max-w-[1200px] aspect-[2/1] transform-style-3d opacity-90"
        style={{ transform: "rotateX(45deg) rotateZ(-10deg) translateY(5%)" }}
      >
        {/* Dark Leather Cover */}
        <div className="absolute inset-0 w-[102%] h-[105%] left-[-1%] top-[-2.5%] bg-[#020202] rounded-[15px] shadow-[0_40px_100px_rgba(0,0,0,1)] border border-[#1a1a1a]"></div>
        
        {/* Central Spine Shadow */}
        <div className="absolute left-1/2 top-[-2.5%] bottom-[-2.5%] w-[60px] -ml-[30px] bg-gradient-to-r from-[#000] via-[#111] to-[#000] shadow-inner z-[-1]"></div>

        {/* Resting Left Pages (Static Block) */}
        <div className="absolute left-[2%] top-[2%] w-[48%] h-[96%] rounded-l-[10px] transform-style-3d shadow-[-10px_10px_30px_rgba(0,0,0,0.8)]"
             style={{ 
               transform: "translateZ(15px)",
               background: "linear-gradient(to right, #050505 0%, #171717 15%, #171717 85%, #050505 100%)",
               boxShadow: "inset 1px 1px 0px rgba(255,255,255,0.02)"
             }}>
           {/* Simulated Stack Thickness with Gold Edging */}
           <div className="absolute left-[-15px] top-0 bottom-0 w-[15px] bg-gradient-to-b from-[#C9A84C] via-[#826a27] to-[#403413] origin-right" style={{ transform: "rotateY(-90deg)"}}></div>
           <div className="absolute left-0 bottom-[-15px] w-full h-[15px] bg-gradient-to-r from-[#403413] to-[#1a1508] origin-top" style={{ transform: "rotateX(-90deg)"}}></div>
        </div>

        {/* Resting Right Pages (Static Block) */}
        <div className="absolute right-[2%] top-[2%] w-[48%] h-[96%] rounded-r-[10px] transform-style-3d shadow-[10px_10px_30px_rgba(0,0,0,0.8)]"
             style={{ 
               transform: "translateZ(15px)",
               background: "linear-gradient(to left, #050505 0%, #171717 15%, #171717 85%, #050505 100%)",
               boxShadow: "inset -1px 1px 0px rgba(255,255,255,0.02)"
             }}>
           {/* Simulated Stack Thickness with Gold Edging */}
           <div className="absolute right-[-15px] top-0 bottom-0 w-[15px] bg-gradient-to-b from-[#C9A84C] via-[#826a27] to-[#403413] origin-left" style={{ transform: "rotateY(90deg)"}}></div>
           <div className="absolute left-0 bottom-[-15px] w-full h-[15px] bg-gradient-to-l from-[#403413] to-[#1a1508] origin-top" style={{ transform: "rotateX(-90deg)"}}></div>
        </div>

        {/* Flipping Pages Engine */}
        <div className="absolute left-1/2 top-[2%] w-[48%] h-[96%] transform-style-3d" style={{ transform: "translateZ(16px)" }}>
          {pages.map((_, i) => {
            const delay = `${(i / pages.length) * duration}s`;
            return (
              <div 
                key={i}
                className="absolute inset-0 origin-left transform-style-3d"
                style={{ 
                  animationName: "fade-page",
                  animationDuration: `${duration}s`,
                  animationDelay: delay,
                  animationIterationCount: "infinite",
                }}
              >
                <Slice depth={0} delay={delay} />
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        /* The root slice turns fully from right to left */
        @keyframes turn-root {
          0%, 10% { transform: rotateY(0deg); }
          90%, 100% { transform: rotateY(-180deg); }
        }
        /* The child slices trail behind slightly, creating a beautiful U-shaped curve! */
        @keyframes turn-child {
          0%, 10% { transform: rotateY(0deg); }
          40% { transform: rotateY(16deg); }
          60% { transform: rotateY(16deg); }
          90%, 100% { transform: rotateY(0deg); }
        }
        /* Fade in right before lifting, fade out right after landing to loop seamlessly */
        @keyframes fade-page {
          0%, 5% { opacity: 0; }
          10%, 90% { opacity: 1; }
          95%, 100% { opacity: 0; }
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
