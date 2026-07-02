"use client";

import { useState, useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const ROLES = [
  {
    id: "01",
    title: "UI/UX Design Intern",
    desc: "Visual design, prototyping, Figma systems",
    category: "DESIGN",
    duration: "12 WEEKS",
    mode: "HYBRID",
    tasks: [
      "Designing screens for live client projects",
      "Building and maintaining Figma component libraries",
      "Presenting work in weekly client reviews"
    ],
    slotsFilled: 2,
    slotsTotal: 4
  },
  {
    id: "02",
    title: "Frontend Development Intern",
    desc: "Next.js, React, GSAP, creative dev",
    category: "DEVELOPMENT",
    duration: "12 WEEKS",
    mode: "REMOTE",
    tasks: [
      "Translating Figma designs to pixel-perfect React",
      "Writing reusable frontend components",
      "Optimizing performance for high-traffic sites"
    ],
    slotsFilled: 3,
    slotsTotal: 4
  },
  {
    id: "03",
    title: "Motion & Interaction Intern",
    desc: "GSAP, Three.js, WebGL, animation systems",
    category: "DEVELOPMENT",
    duration: "12 WEEKS",
    mode: "HYBRID",
    tasks: [
      "Creating scroll-triggered GSAP animations",
      "Prototyping WebGL shaders",
      "Orchestrating complex timeline sequences"
    ],
    slotsFilled: 1,
    slotsTotal: 2
  },
  {
    id: "04",
    title: "Brand Strategy Intern",
    desc: "Research, positioning, deck creation",
    category: "STRATEGY",
    duration: "12 WEEKS",
    mode: "REMOTE",
    tasks: [
      "Conducting competitor and market research",
      "Writing brand narrative presentations",
      "Assisting in client discovery workshops"
    ],
    slotsFilled: 4,
    slotsTotal: 4
  },
  {
    id: "05",
    title: "Creative Copywriting Intern",
    desc: "Brand voice, web copy, content strategy",
    category: "STRATEGY",
    duration: "8 WEEKS",
    mode: "REMOTE",
    tasks: [
      "Drafting website copy and microcopy",
      "Developing tone of voice guidelines",
      "Collaborating with designers on layout storytelling"
    ],
    slotsFilled: 0,
    slotsTotal: 2
  }
];

const FILTERS = ["ALL", "DESIGN", "DEVELOPMENT", "STRATEGY"];

export default function OpenRoles() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [displayedRoles, setDisplayedRoles] = useState(ROLES);
  
  // Track if we've done the initial scroll animation
  const hasAnimatedIn = useRef(false);

  const handleFilter = (filter: string) => {
    if (filter === activeFilter) return;
    
    const newRoles = filter === "ALL" ? ROLES : ROLES.filter(r => r.category === filter);
    
    const currentElements = listRef.current?.children;
    if (currentElements && currentElements.length > 0) {
      gsap.to(currentElements, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          setDisplayedRoles(newRoles);
          setActiveFilter(filter);
        }
      });
    } else {
      setDisplayedRoles(newRoles);
      setActiveFilter(filter);
    }
  };

  // Filter change animation
  useEffect(() => {
    // Skip this if it's the very first render, the ScrollTrigger will handle the first entrance
    if (!hasAnimatedIn.current) return;
    
    const currentElements = listRef.current?.children;
    if (currentElements && currentElements.length > 0) {
      gsap.fromTo(currentElements,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [displayedRoles]);

  // Initial ScrollTrigger entrance animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // 1. Animate Header Text
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children,
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.15, 
            ease: "cmf-ease",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            }
          }
        );
      }

      // 2. Animate Filters
      if (filtersRef.current) {
        gsap.fromTo(filtersRef.current.children,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: filtersRef.current,
              start: "top 85%",
            }
          }
        );
      }

      // 3. Animate Role Rows
      if (listRef.current) {
        gsap.fromTo(listRef.current.children,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 80%",
              onEnter: () => {
                hasAnimatedIn.current = true; // allow filter clicks to animate normally now
              }
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#080808] py-[120px] border-b border-cmf-border overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        <div ref={headerRef}>
          <div className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] mb-4">
            OPEN POSITIONS
          </div>
          <h2 className="heading-display-italic text-[42px] md:text-[56px] text-[#EDE8DA] mb-12">
            Current Cohort Openings
          </h2>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="flex flex-wrap gap-3 mb-16">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`border px-[16px] py-[6px] font-mono text-[9px] tracking-[0.2em] transition-all duration-300 ${
                activeFilter === f 
                  ? "bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.5)] text-cmf-gold shadow-[0_0_15px_rgba(201,168,76,0.15)]" 
                  : "border-[rgba(201,168,76,0.2)] text-[#7a6a3a] hover:border-[rgba(201,168,76,0.5)] hover:text-cmf-gold hover:shadow-[0_0_10px_rgba(201,168,76,0.1)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Roles List */}
        <div ref={listRef} className="flex flex-col border-t border-cmf-border">
          {displayedRoles.map((role) => (
            <div 
              key={role.id} 
              className="group relative border-b border-cmf-border overflow-hidden transition-[height,background] duration-500 hover:bg-[#0f0e0c] h-[100px] hover:h-[220px]"
            >
              {/* Highlight Sweep Animation on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.03)] to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

              {/* Main Strip Content (Always visible) */}
              <div className="absolute top-0 left-0 w-full h-[100px] flex items-center px-4 md:px-8">
                <span className="label-mono text-[10px] text-cmf-gold-muted w-[40px] shrink-0 group-hover:text-cmf-gold transition-colors duration-300">{role.id}</span>
                
                <div className="flex flex-col justify-center w-full max-w-[400px]">
                  <h3 className="heading-display text-[24px] text-cmf-text group-hover:text-cmf-gold transition-colors duration-300 transform group-hover:translate-x-2">
                    {role.title}
                  </h3>
                  <p className="font-sans font-light text-[13px] text-[#7a7468] truncate transition-transform duration-300 group-hover:translate-x-2">
                    {role.desc}
                  </p>
                </div>

                <div className="hidden md:flex gap-4 ml-auto items-center">
                  <span className="font-mono text-[10px] tracking-widest text-[#b0a890] border border-cmf-border px-3 py-1 rounded-full group-hover:border-cmf-gold/30 transition-colors">{role.category}</span>
                  <span className="font-mono text-[10px] tracking-widest text-[#b0a890] border border-cmf-border px-3 py-1 rounded-full group-hover:border-cmf-gold/30 transition-colors">{role.duration}</span>
                  <span className="font-mono text-[10px] tracking-widest text-[#b0a890] border border-cmf-border px-3 py-1 rounded-full group-hover:border-cmf-gold/30 transition-colors">{role.mode}</span>
                </div>

                <div className="ml-auto md:ml-8">
                  <a href="#application-form" className="label-mono flex items-center gap-2 text-[10px] text-cmf-gold uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all cursor-pointer">
                    <span>Apply</span>
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </a>
                </div>
              </div>

              {/* Expanded Content */}
              <div className="absolute top-[100px] left-0 w-full h-[120px] px-4 md:px-[88px] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-cmf-gold uppercase tracking-[0.2em] mb-3">What you'll work on:</span>
                  <ul className="flex flex-col gap-2">
                    {role.tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2 font-sans text-[13px] text-[#b0a890] transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" style={{ transitionDelay: `${150 + i * 50}ms` }}>
                        <span className="text-cmf-gold">→</span> {task}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden lg:flex flex-col items-end pr-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="font-mono text-[9px] text-[#7a7468] uppercase tracking-[0.2em] mb-3">
                    {role.slotsTotal - role.slotsFilled} / {role.slotsTotal} slots remaining
                  </span>
                  <div className="flex gap-1 h-[2px] w-[60px]">
                    {Array.from({ length: role.slotsTotal }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 h-full ${i < role.slotsFilled ? 'bg-cmf-gold' : 'bg-[rgba(201,168,76,0.15)]'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {displayedRoles.length === 0 && (
            <div className="h-[100px] flex items-center justify-center text-cmf-text-muted font-sans text-sm">
              No open positions in this category currently.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
