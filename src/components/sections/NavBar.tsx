"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Magnetic from "@/components/ui/Magnetic";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Internships", href: "/internships", isSpecial: true },
  { name: "Work", href: "/#work" },
  { name: "Contact", href: "/#contact" }
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(logoRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.8 },
      "-=0.6"
    )
    .fromTo(linksRef.current.filter(Boolean),
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "-=0.6"
    );
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center transition-all duration-500 border-b ${isScrolled ? "bg-[#080808]/80 backdrop-blur-md border-cmf-gold/50 py-4" : "bg-transparent border-transparent py-6"}`}
    >
      {/* Logo */}
      <div ref={logoRef} className="flex items-center gap-3">
        <div className="w-8 h-8 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="75,35 97,32 77,37" fill="#C9A84C" />
            <polygon points="65,30 75,35 77,37" fill="#E8C96A" />
            <polygon points="65,30 77,37 67,42" fill="#f5aa42" />
            <polygon points="65,30 67,42 50,50" fill="#fc4402" />
            <polygon points="65,30 50,50 50,35" fill="#f58a42" />
            <polygon points="50,35 55,20 25,5" fill="#E8C96A" />
            <polygon points="50,35 25,5 30,15" fill="#f5cc7a" />
            <polygon points="45,70 30,85 40,65" fill="#7a6a3a" />
            <polygon points="67,42 60,60 50,50" fill="#d9a855" />
            <polygon points="60,60 45,70 50,50" fill="#C9A84C" />
          </svg>
        </div>
        <span className="text-cmf-text font-display font-semibold text-2xl tracking-tight hidden md:block">
          CodeMeshFlow
        </span>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-12 font-mono text-[10px] tracking-[0.25em]">
        {NAV_LINKS.map((link, i) => (
          <Magnetic key={link.name} strength={0.2}>
            <Link
              ref={el => { linksRef.current[i] = el; }}
              href={link.href}
              className="group relative px-2 py-2 text-cmf-text hover:text-cmf-gold transition-colors"
            >
              {link.name}
              {pathname === link.href ? (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[2px] h-[2px] bg-cmf-gold rounded-full" />
              ) : link.isSpecial ? (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-cmf-gold opacity-0 group-hover:opacity-100 transition-opacity animate-pulse text-[14px] leading-none">
                  •
                </span>
              ) : (
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cmf-gold transition-all duration-300 group-hover:w-full" />
              )}
            </Link>
          </Magnetic>
        ))}
        
        <Magnetic strength={0.4}>
          <Link
            ref={el => { linksRef.current[NAV_LINKS.length] = el; }}
            href="/#contact"
            className="bg-cmf-gold text-cmf-bg px-6 py-3 font-mono text-[10px] tracking-[0.2em] font-semibold hover:bg-white transition-colors uppercase"
          >
            Start a project
          </Link>
        </Magnetic>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-cmf-text hover:text-cmf-gold transition-colors z-[110] relative"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-[#080808] z-[105] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center gap-8 font-display text-2xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-cmf-text hover:text-cmf-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 bg-cmf-gold text-cmf-bg px-8 py-4 font-mono text-sm tracking-[0.2em] font-semibold hover:bg-white transition-colors uppercase"
          >
            Start a project
          </Link>
        </div>
      </div>
    </nav>
  );
}
