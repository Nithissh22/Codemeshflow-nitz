"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Image from "next/image";
import { initWorkAnimation } from "@/lib/animations/workAnimation";
import { initThunderAnimation } from "@/lib/animations/thunderAnimation";

const projects = [
  { num: "01", name: "Hebron Automotive", tag: "INDUSTRIAL IDENTITY", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop", href: "https://hebronautomative-xx89.vercel.app/" },
  { num: "02", name: "Swastik & Company", tag: "CORPORATE IDENTITY", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop", href: "https://www.swastikandcompany.in/" },
  { num: "03", name: "Bulletin Groups", tag: "BUSINESS PORTFOLIO", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop", href: "http://www.bulletinngroups.com" },
  { num: "04", name: "D2R Holidays", tag: "SOCIAL MEDIA", img: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2069&auto=format&fit=crop", href: "https://www.instagram.com/d2r.holidays?igsh=YWJ4Z2F5aWNzZXg3" },
  { num: "05", name: "Suryaa Agency", tag: "AGENCY PORTFOLIO", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop", href: "https://suryaa-agency.vercel.app/" },
  { num: "06", name: "Personal-Portfolio", tag: "WEB APPLICATION", img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2000&auto=format&fit=crop", href: "https://jai-machi-main-delta.vercel.app/" }
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !titleRef.current) return;
    
    // Thunder Animation for header
    const cleanupThunder = initThunderAnimation(sectionRef.current, headerRef.current, titleRef.current);

    // Background Animation
    if (sectionRef.current && canvasRef.current) {
      let cleanupAnimation = () => {};
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cleanupAnimation = initWorkAnimation(sectionRef.current!, canvasRef.current!);
          } else {
            cleanupAnimation();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(sectionRef.current);

      return () => {
        observer.disconnect();
        cleanupAnimation();
        cleanupThunder();
      };
    }
  }, []);

  return (
    <section id="work" ref={sectionRef} className="py-32 bg-cmf-bg border-t border-cmf-border relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />
      
      <style jsx>{`
        .project-strip::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(201, 168, 76, 0.03);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
          pointer-events: none;
        }
        .project-strip:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .project-image {
          clip-path: inset(100% 0 0 0);
          transition: clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-strip:hover .project-image {
          clip-path: inset(0 0 0 0);
        }
      `}</style>

      <div ref={headerRef} className="max-w-[1400px] mx-auto px-4 md:px-12 mb-20 relative z-10">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
          01 / SELECTED WORK
        </span>
        <h2 ref={titleRef} className="heading-display-italic text-5xl md:text-[64px] text-cmf-text relative z-10">
          Selected Work
        </h2>
        <p className="block md:hidden text-cmf-gold text-xs mt-6 font-mono uppercase tracking-widest relative z-10">
          (Kindly view projects on PC for the best experience)
        </p>
      </div>

      <div className="w-full flex flex-col relative z-10">
        {projects.map((project, i) => (
          <a 
            key={i} 
            href={project.href || "#"}
            target={project.href ? "_blank" : undefined}
            rel={project.href ? "noopener noreferrer" : undefined}
            className="project-strip group relative border-t border-cmf-border transition-colors duration-500 flex items-center justify-between px-4 md:px-12 py-12 md:py-16 overflow-hidden cursor-pointer block"
          >
            <div className="project-image absolute inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-cmf-gold/5 z-10 mix-blend-overlay pointer-events-none"></div>
              <Image 
                src={project.img} 
                alt={project.name} 
                fill 
                className="object-cover opacity-20 grayscale mix-blend-screen transform scale-110 group-hover:scale-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                unoptimized
              />
            </div>

            <div className="flex items-center gap-6 md:gap-16 relative z-10 transform transition-transform duration-500 group-hover:-translate-x-4">
              <span className="font-mono text-[14px] md:text-xl text-cmf-gold-muted transition-colors duration-300 group-hover:text-cmf-gold">
                {project.num}
              </span>
              <h3 className="heading-display text-3xl md:text-[40px] text-cmf-text transition-colors duration-300 group-hover:text-white">
                {project.name}
              </h3>
            </div>

            <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-x-4 mt-2 md:mt-0">
              <span className="font-mono text-[10px] md:text-[12px] tracking-[0.25em] text-cmf-text-muted border border-cmf-border px-3 py-1 uppercase hidden md:inline-block">
                {project.tag}
              </span>
            </div>
            
            <div className="relative z-10 hidden md:block transform transition-transform duration-500 group-hover:-translate-x-4">
              <span className="label-mono text-xs text-cmf-gold">{project.tag}</span>
            </div>
          </a>
        ))}
        <div className="border-t border-cmf-border w-full relative z-10"></div>
      </div>
    </section>
  );
}
