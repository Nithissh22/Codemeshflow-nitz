"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { initBrandsAnimation } from "@/lib/animations/brandsAnimation";
import { 
  HebronLogo, 
  SwastikLogo, 
  BulletinLogo, 
  D2RLogo, 
  SuryaaLogo, 
  JaiMachiLogo 
} from "@/components/ui/BrandLogos";
import OrigamiBulletLoading from "@/components/ui/OrigamiBulletLoading";
import AxeLogLoading from "@/components/ui/AxeLogLoading";

const brands = [
  {
    name: "Hebron Automotive",
    logoText: "Hebron",
    url: "https://hebronautomative-xx89.vercel.app/",
    LogoComponent: HebronLogo
  },
  {
    name: "Swastik & Company",
    logoText: "Swastik & Co",
    url: "https://www.swastikandcompany.in/",
    LogoComponent: SwastikLogo
  },
  {
    name: "Bulletin Groups",
    logoText: "Bulletin Groups",
    url: "https://www.bulletinngroups.com/",
    LogoComponent: BulletinLogo
  },
  {
    name: "D2R Holidays",
    logoText: "D2R Holidays",
    url: "https://www.instagram.com/d2r.holidays?igsh=YWJ4Z2F5aWNzZXg3",
    LogoComponent: D2RLogo
  },
  {
    name: "Suryaa Agency",
    logoText: "Suryaa",
    url: "https://suryaa-agency.vercel.app/",
    LogoComponent: SuryaaLogo
  },
  {
    name: "Personal-Portfolio",
    logoText: "Jai Machi",
    url: "https://jai-machi-main-delta.vercel.app/",
    LogoComponent: JaiMachiLogo
  }
];

export default function TrustedBrands() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bulletinLoadingUrl, setBulletinLoadingUrl] = useState<string | null>(null);
  const [swastikLoadingUrl, setSwastikLoadingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const cleanupAnimation = initBrandsAnimation(containerRef.current, canvasRef.current);

    const cards = containerRef.current.querySelectorAll('.brand-card');
    
    gsap.fromTo(cards, 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      cleanupAnimation();
    };
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-cmf-bg border-t border-cmf-border relative overflow-hidden flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-60 mix-blend-screen" />
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center text-center px-4 md:px-12">
        
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] uppercase block mb-4">
          02 / OUR TRUSTED BRANDS
        </span>
        
        <h2 className="heading-display-italic text-5xl md:text-[64px] text-cmf-text mb-6">
          Partners that define quality
        </h2>
        
        <p className="font-sans font-light text-lg md:text-xl text-cmf-text-muted mb-20 max-w-2xl">
          A curated lineup of brands we trust every day for durability, finish, and long-term performance.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
          {brands.map((brand, idx) => {
            const Logo = brand.LogoComponent;
            return (
            <a 
              key={idx} 
              href={brand.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => {
                if (brand.name === "Bulletin Groups") {
                  e.preventDefault();
                  setBulletinLoadingUrl(brand.url);
                } else if (brand.name === "Swastik & Company") {
                  e.preventDefault();
                  setSwastikLoadingUrl(brand.url);
                }
              }}
              className="brand-card opacity-0 group bg-cmf-surface border border-cmf-border rounded-lg p-4 md:p-8 flex items-center justify-center aspect-square md:aspect-[2/1] hover:shadow-[0_0_30px_rgba(201,168,76,0.1)] hover:border-cmf-gold transition-all duration-500 transform hover:-translate-y-2 relative cursor-pointer"
            >
              {Logo ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100 text-cmf-gold">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center">
                    <Logo className="w-full h-full drop-shadow-sm md:drop-shadow-[0_0_15px_rgba(201,168,76,0.5)]" />
                  </div>
                  <span className="mt-4 text-lg md:text-xl font-display font-medium tracking-wide text-cmf-text-muted group-hover:text-cmf-text transition-colors">
                    {brand.logoText}
                  </span>
                </div>
              ) : (
                <div className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-cmf-text-muted transition-colors duration-500 group-hover:text-cmf-gold">
                  {brand.logoText}
                </div>
              )}
            </a>
          )})}
        </div>

      </div>

      {bulletinLoadingUrl && <OrigamiBulletLoading redirectUrl={bulletinLoadingUrl} onComplete={() => setBulletinLoadingUrl(null)} />}
      {swastikLoadingUrl && <AxeLogLoading redirectUrl={swastikLoadingUrl} onComplete={() => setSwastikLoadingUrl(null)} />}
    </section>
  );
}
