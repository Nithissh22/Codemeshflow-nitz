"use client";

import { useState, useRef, useEffect } from "react";
import { Palette, Box, Type, MousePointer2 } from "lucide-react";
import { gsap } from "gsap";

type Theme = "classic" | "neon" | "minimal" | "organic" | "pop" | "glass";

const THEMES = {
  classic: {
    name: "Classic Gold",
    bg: "bg-[#050505]",
    card: "bg-[#0a0a0a]",
    primary: "text-[#C9A84C]",
    primaryHex: "#C9A84C",
    border: "border-[#C9A84C]/30",
    text: "text-neutral-200",
    heading: "text-white",
    font: "font-serif",
    radius: "rounded-sm",
    button: "bg-[#C9A84C] text-[#050505]"
  },
  neon: {
    name: "Cyber Neon",
    bg: "bg-[#09090b]",
    card: "bg-[#18181b]",
    primary: "text-[#22d3ee]",
    primaryHex: "#22d3ee",
    border: "border-[#22d3ee]/50",
    text: "text-zinc-100",
    heading: "text-white",
    font: "font-mono",
    radius: "rounded-xl",
    button: "bg-transparent border border-[#22d3ee] text-[#22d3ee] shadow-[0_0_15px_rgba(34,211,238,0.3)]"
  },
  minimal: {
    name: "Stark Minimal",
    bg: "bg-neutral-100",
    card: "bg-white",
    primary: "text-neutral-900",
    primaryHex: "#171717",
    border: "border-neutral-200",
    text: "text-neutral-600",
    heading: "text-neutral-900",
    font: "font-sans",
    radius: "rounded-none",
    button: "bg-[#171717] text-white"
  },
  organic: {
    name: "Earthy Organic",
    bg: "bg-[#f4f1ea]",
    card: "bg-[#faf9f6]",
    primary: "text-[#4d7c5f]",
    primaryHex: "#4d7c5f",
    border: "border-[#4d7c5f]/30",
    text: "text-[#5c564c]",
    heading: "text-[#2e3b32]",
    font: "font-serif",
    radius: "rounded-[32px]",
    button: "bg-[#4d7c5f] text-white"
  },
  pop: {
    name: "Vibrant Pop",
    bg: "bg-[#fff0f5]",
    card: "bg-white",
    primary: "text-[#ff0066]",
    primaryHex: "#ff0066",
    border: "border-[#ff0066]/40",
    text: "text-[#33001a]",
    heading: "text-[#33001a]",
    font: "font-sans",
    radius: "rounded-md",
    button: "bg-[#ff0066] text-white border-2 border-[#33001a] shadow-[4px_4px_0px_#33001a]"
  },
  glass: {
    name: "Midnight Glass",
    bg: "bg-[#020617]",
    card: "bg-white/5 backdrop-blur-xl",
    primary: "text-[#818cf8]",
    primaryHex: "#818cf8",
    border: "border-white/10",
    text: "text-slate-300",
    heading: "text-white",
    font: "font-sans",
    radius: "rounded-2xl",
    button: "bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-white/20"
  }
};

export default function BrandIdentityDemo() {
  const [activeTheme, setActiveTheme] = useState<Theme>("classic");
  const [isHoveringAnatomy, setIsHoveringAnatomy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    
    const elements = el.children;
    gsap.killTweensOf(elements);
    gsap.set(elements, { clearProps: "all" });

    switch(activeTheme) {
      case "classic":
        // Slow, luxurious float up
        gsap.from(elements, { y: 20, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power3.out" });
        break;
      case "neon":
        // Glitchy/stepped digital reveal
        gsap.from(elements, { opacity: 0, scale: 0.98, duration: 0.4, stagger: 0.1, ease: "steps(4)" });
        break;
      case "minimal":
        // Brutalist sharp slide
        gsap.from(elements, { x: -40, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power4.out" });
        break;
      case "organic":
        // Soft, breathing expansion
        gsap.from(elements, { scale: 0.96, opacity: 0, duration: 1.2, stagger: 0.3, ease: "sine.inOut" });
        break;
      case "pop":
        // Highly elastic, bouncy pop
        gsap.from(elements, { y: 40, scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.1, ease: "elastic.out(1, 0.4)" });
        break;
      case "glass":
        // 3D perspective float
        gsap.from(elements, { rotationX: -15, y: 30, opacity: 0, duration: 1, stagger: 0.15, transformPerspective: 1000, ease: "power2.out" });
        break;
    }
  }, [activeTheme]);

  const t = THEMES[activeTheme];

  return (
    <div className={"py-20 mb-20 border-y border-cmf-border transition-colors duration-1000 " + t.bg}>
      <div className="mb-20 text-center max-w-2xl mx-auto px-4">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
          BRAND SYSTEM SIMULATOR
        </span>
        <h2 className={"heading-display text-4xl md:text-5xl mb-6 transition-colors duration-1000 " + t.heading}>
          Dynamic Identities
        </h2>
        <p className={"font-sans font-light text-lg transition-colors duration-1000 " + t.text}>
          A brand is not a static logo. It is a living design system. Interact with the controls below to see how our architectural approach to design tokens allows a brand to instantly morph.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
        
        {/* Controls (Left Col) */}
        <div className={"lg:col-span-4 p-8 border transition-all duration-1000 " + t.card + " " + t.border + " " + t.radius}>
          <h3 className={"flex items-center gap-2 text-xl mb-8 transition-colors duration-1000 " + t.font + " " + t.heading}>
            <Palette size={20} className={t.primary} />
            Theme Controls
          </h3>
          
          <div className="flex flex-col gap-4">
            {(Object.keys(THEMES) as Theme[]).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => setActiveTheme(themeKey)}
                className={
                  "flex items-center justify-between p-4 border transition-all duration-300 " + 
                  THEMES[themeKey].radius + " " +
                  (activeTheme === themeKey 
                    ? THEMES[themeKey].border + " " + THEMES[themeKey].primary + " bg-black/5" 
                    : "border-transparent " + t.text + " hover:border-gray-500/30")
                }
              >
                <span className={"font-medium " + THEMES[themeKey].font}>{THEMES[themeKey].name}</span>
                {activeTheme === themeKey && <div className={"w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] bg-current " + THEMES[themeKey].primary}></div>}
              </button>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-500/20">
            <h4 className={"text-xs uppercase tracking-widest mb-4 " + t.text}>Active Tokens</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={"text-sm " + t.text}>Primary</span>
                <span className={"font-mono text-xs px-2 py-1 bg-black/10 " + t.primary + " " + t.radius}>{t.primaryHex}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={"text-sm " + t.text}>Typography</span>
                <span className={"font-mono text-xs px-2 py-1 bg-black/10 " + t.primary + " " + t.radius}>{t.font.replace('font-', '')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={"text-sm " + t.text}>Border Radius</span>
                <span className={"font-mono text-xs px-2 py-1 bg-black/10 " + t.primary + " " + t.radius}>{t.radius.replace('rounded-', '') || '0px'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview (Right Col) */}
        <div ref={previewRef} className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Typography Scale */}
          <div className="preview-panel-wrapper">
            <div className={"h-full p-8 border transition-all duration-1000 flex flex-col justify-center min-h-[250px] " + t.card + " " + t.border + " " + t.radius}>
              <h3 className={"flex items-center gap-2 text-sm uppercase tracking-widest mb-8 " + t.text}>
                <Type size={16} /> Typographic Scale
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-end gap-6 border-b border-gray-500/10 pb-4">
                  <span className={"w-16 font-mono text-xs opacity-50 " + t.text}>H1</span>
                  <h1 className={"text-5xl md:text-6xl tracking-tight transition-all duration-1000 " + t.font + " " + t.heading}>
                    Agility & Flow.
                  </h1>
                </div>
                <div className="flex items-end gap-6 border-b border-gray-500/10 pb-4">
                  <span className={"w-16 font-mono text-xs opacity-50 " + t.text}>H2</span>
                  <h2 className={"text-3xl md:text-4xl transition-all duration-1000 opacity-90 " + t.font + " " + t.heading}>
                    Designing the future.
                  </h2>
                </div>
                <div className="flex items-start gap-6">
                  <span className={"w-16 font-mono text-xs opacity-50 " + t.text}>P</span>
                  <p className={"text-base md:text-lg max-w-xl transition-all duration-1000 font-sans " + t.text}>
                    Systematic design tokens ensure absolute consistency across every single touchpoint, from web applications to physical collateral.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Component Anatomy */}
          <div className="preview-panel-wrapper flex-1 flex flex-col">
            <div className={"p-8 border transition-all duration-1000 flex-1 relative overflow-hidden flex flex-col " + t.card + " " + t.border + " " + t.radius}>
              <h3 className={"flex items-center gap-2 text-sm uppercase tracking-widest mb-12 " + t.text}>
                <Box size={16} /> Component Anatomy
              </h3>
              
              <div className="flex-1 flex items-center justify-center relative">
                 
                 <div 
                   className="relative group cursor-crosshair"
                   onMouseEnter={() => setIsHoveringAnatomy(true)}
                   onMouseLeave={() => setIsHoveringAnatomy(false)}
                 >
                   {/* The Button Component */}
                   <button className={"relative z-10 px-12 py-4 text-lg font-medium transition-all duration-1000 flex items-center gap-3 " + t.radius + " " + t.font + " " + t.button}>
                     Connect System
                     <MousePointer2 size={18} className={"transition-opacity duration-300 " + (isHoveringAnatomy ? "opacity-100" : "opacity-0")} />
                   </button>
  
                   {/* Anatomy Overlays (Visible on Hover) */}
                   <div className={"absolute inset-0 border border-dashed transition-opacity duration-300 pointer-events-none " + (isHoveringAnatomy ? "opacity-100" : "opacity-0") + " " + (activeTheme === "minimal" ? "border-red-500 scale-110" : "border-pink-500 scale-[1.15]")}>
                      <span className={"absolute -top-6 left-1/2 transform -translate-x-1/2 font-mono text-[10px] whitespace-nowrap " + (activeTheme === "minimal" ? "text-red-500" : "text-pink-500")}>
                        margin: 16px
                      </span>
                      <div className={"absolute inset-0 border border-solid m-2 opacity-50 " + (activeTheme === "minimal" ? "border-blue-500" : "border-green-500")}></div>
                      <span className={"absolute -bottom-6 left-1/2 transform -translate-x-1/2 font-mono text-[10px] whitespace-nowrap " + (activeTheme === "minimal" ? "text-blue-500" : "text-green-500")}>
                        padding: 16px 48px
                      </span>
                   </div>
                   
                 </div>
  
              </div>
              
              <div className="absolute bottom-4 right-8">
                 <span className={"font-mono text-xs transition-opacity duration-300 " + t.text + " " + (isHoveringAnatomy ? "opacity-0" : "opacity-50 animate-pulse")}>
                   [Hover to inspect]
                 </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
