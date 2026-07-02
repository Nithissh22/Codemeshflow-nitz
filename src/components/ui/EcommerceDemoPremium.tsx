"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { ShoppingCart, Star, Zap, Check } from "lucide-react";

export default function EcommerceDemoPremium() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const img = imageRef.current;
    const info = infoRef.current;
    const badge = badgeRef.current;
    
    if (!container || !img || !info) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      gsap.to(img, {
        x: (x - centerX) * 0.08,
        y: (y - centerY) * 0.08,
        rotateX,
        rotateY,
        duration: 0.8,
        ease: "power2.out"
      });

      if (badge) {
        gsap.to(badge, {
          x: (x - centerX) * 0.12,
          y: (y - centerY) * 0.12,
          duration: 0.6,
          ease: "power2.out"
        });
      }

      gsap.to(info, {
        x: (x - centerX) * -0.03,
        y: (y - centerY) * -0.03,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to([img, info, badge], {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.4)"
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="py-20">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <span className="label-mono text-[10px] text-[#00D4FF] tracking-[0.3em] block mb-4 uppercase">
          Single Product Immersion
        </span>
        <h2 className="heading-display text-4xl md:text-5xl text-cmf-text mb-6">
          VIBRANT.
        </h2>
        <p className="font-sans font-light text-cmf-text-muted text-lg">
          An alternative e-commerce approach. Highly interactive, vibrant, and focused on storytelling and product immersion to drive conversions.
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-3xl bg-[#030712] border border-white/5 min-h-[700px] flex items-center justify-center shadow-2xl"
        style={{ perspective: "1200px" }}
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#60A5FA]/20 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[#C084FC]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center gap-16 py-16">
          
          {/* Product Info */}
          <div ref={infoRef} className="flex-1 text-left w-full md:pr-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
              <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">In Stock & Ready to Ship</span>
            </div>
            
            <h3 className="font-display text-5xl md:text-[80px] font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/30 mb-6 leading-[0.9] tracking-tight">
              AeroGlow<br/>Elite.
            </h3>
            
            <p className="font-sans text-lg md:text-xl text-white/50 mb-10 max-w-md leading-relaxed font-light">
              Experience spatial audio like never before. Titanium drivers meet zero-latency wireless tech in a shell designed for absolute comfort.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 border-t border-white/10 pt-8 mt-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-2">Retail Price</span>
                <span className="font-display text-4xl text-white tracking-tight">₹24,999</span>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="w-full sm:w-auto relative group overflow-hidden rounded-full bg-white text-black px-10 py-5 font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA] to-[#C084FC] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {added ? (
                    <>
                      <Check size={20} className={added ? "text-white" : ""} />
                      <span className={added ? "text-white" : ""}>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} className="group-hover:text-white transition-colors" />
                      <span className="group-hover:text-white transition-colors">Add to Cart</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Product Image */}
          <div className="flex-1 w-full flex justify-center perspective-[1200px] mt-10 md:mt-0">
            <div 
              ref={imageRef}
              className="relative w-full max-w-[500px] aspect-square transform-style-3d z-20"
            >
              {/* Glowing orb behind image directly tied to the image container */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#60A5FA]/40 to-[#C084FC]/40 rounded-full blur-[80px] -z-10 scale-75"></div>
              
              <div className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transform-style-3d">
                <Image 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop" 
                  alt="AeroGlow Pro Headphones" 
                  fill 
                  className="object-cover mix-blend-screen scale-110"
                />
              </div>

              {/* Floating badges */}
              <div 
                ref={badgeRef}
                className="absolute -right-4 bottom-20 z-30 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform-style-3d translate-z-12"
              >
                <div className="w-10 h-10 rounded-full bg-[#60A5FA]/20 flex items-center justify-center text-[#60A5FA]">
                  <Zap size={20} />
                </div>
                <div className="flex flex-col pr-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Battery</span>
                  <span className="text-base font-bold text-white">40+ Hrs</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
