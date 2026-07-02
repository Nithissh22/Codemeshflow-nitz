"use client";

import { useEffect, useRef } from "react";
import { initProcessHandAnimation } from "@/lib/animations/processAnimation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export const processData = [
  { 
    id: "requirement-discussion",
    num: "01", 
    name: "Requirement Discussion", 
    desc: "We begin by understanding your business goals, target audience, and project requirements to create the right digital solution.",
    timeline: ["PHASE 1", "REQUIREMENTS", "DISCOVERY"],
    outcome: "A clear understanding of project goals, audience, and scope.",
    accent: "rgba(201,168,76,0.8)",
    bgType: "radar",
    svgMark: (
      <svg viewBox="0 0 120 80" className="w-[120px] h-[80px]" style={{ stroke: 'rgba(201,168,76,0.35)', strokeWidth: 0.8, fill: 'none' }}>
        <circle cx="60" cy="40" r="20" />
        <circle cx="60" cy="40" r="10" />
        <line x1="60" y1="5" x2="60" y2="15" />
        <line x1="60" y1="65" x2="60" y2="75" />
        <line x1="25" y1="40" x2="35" y2="40" />
        <line x1="85" y1="40" x2="95" y2="40" />
      </svg>
    ),
    deliverables: [
      { title: "Business Goal Analysis", sub: "Understanding objectives and KPIs" },
      { title: "Audience Profiling", sub: "Defining target demographics" },
      { title: "Requirement Gathering", sub: "Documenting features and functionality" },
    ],
    tools: ["Zoom", "Notion", "Google Docs"]
  },
  { 
    id: "planning-strategy",
    num: "02", 
    name: "Planning & Strategy", 
    desc: "Our team prepares a structured plan, sitemap, and design approach tailored to your business needs.",
    timeline: ["PHASE 2", "STRATEGY", "BLUEPRINT"],
    outcome: "A comprehensive roadmap and architecture for your project.",
    accent: "rgba(180,150,60,0.8)",
    bgType: "dots",
    svgMark: (
      <svg viewBox="0 0 120 80" className="w-[120px] h-[80px]" style={{ stroke: 'rgba(201,168,76,0.35)', strokeWidth: 0.8, fill: 'none' }}>
        <circle cx="30" cy="40" r="2" fill="rgba(201,168,76,0.35)" />
        <circle cx="50" cy="20" r="2" fill="rgba(201,168,76,0.35)" />
        <circle cx="70" cy="60" r="2" fill="rgba(201,168,76,0.35)" />
        <circle cx="90" cy="40" r="2" fill="rgba(201,168,76,0.35)" />
        <polyline points="30,40 50,20 70,60 90,40" />
      </svg>
    ),
    deliverables: [
      { title: "Sitemap Creation", sub: "Structuring the website hierarchy" },
      { title: "Wireframing", sub: "Low-fidelity layouts and user flows" },
      { title: "Project Timeline", sub: "Detailed schedule and milestones" },
    ],
    tools: ["Miro", "Figma", "Jira"]
  },
  { 
    id: "design-development",
    num: "03", 
    name: "Design & Development", 
    desc: "We create a modern, responsive, and user-friendly website with a focus on performance and user experience.",
    timeline: ["PHASE 3", "CREATIVE", "ENGINEERING"],
    outcome: "A fully functional, pixel-perfect digital product.",
    accent: "rgba(220,180,80,0.8)",
    bgType: "lines",
    svgMark: (
      <svg viewBox="0 0 120 80" className="w-[120px] h-[80px]" style={{ stroke: 'rgba(201,168,76,0.35)', strokeWidth: 0.8, fill: 'none' }}>
        <rect x="30" y="15" width="45" height="35" />
        <rect x="45" y="30" width="45" height="35" />
      </svg>
    ),
    deliverables: [
      { title: "UI/UX Design", sub: "High-fidelity mockups and prototyping" },
      { title: "Frontend Engineering", sub: "Responsive layouts and interactive elements" },
      { title: "Backend Architecture", sub: "Database design and API integration" },
    ],
    tools: ["Figma", "Next.js", "Tailwind CSS", "Node.js"]
  },
  { 
    id: "review-feedback",
    num: "04", 
    name: "Review & Feedback", 
    desc: "You review the website and provide feedback. We make the necessary refinements to ensure everything meets your expectations.",
    timeline: ["PHASE 4", "QA", "REFINEMENT"],
    outcome: "A polished product refined by your direct feedback.",
    accent: "rgba(201,168,76,1.0)",
    bgType: "chevrons",
    svgMark: (
      <svg viewBox="0 0 120 80" className="w-[120px] h-[80px]" style={{ stroke: 'rgba(201,168,76,0.35)', strokeWidth: 0.8, fill: 'none' }}>
        <line x1="20" y1="60" x2="100" y2="60" />
        <path d="M60 70 L60 20 M50 30 L60 20 L70 30" />
      </svg>
    ),
    deliverables: [
      { title: "Client Staging Link", sub: "Access to private review environment" },
      { title: "Feedback Integration", sub: "Iterative revisions based on comments" },
      { title: "Cross-Device Testing", sub: "Ensuring compatibility across platforms" },
    ],
    tools: ["Vercel Preview", "Loom", "GitHub"]
  },
  { 
    id: "launch-deployment",
    num: "05", 
    name: "Launch & Deployment", 
    desc: "After final approval, we deploy the website, configure the domain, SSL, and hosting environment.",
    timeline: ["PHASE 5", "DEPLOYMENT", "GO LIVE"],
    outcome: "Your product is live and accessible to the world.",
    accent: "rgba(160,130,50,0.8)",
    bgType: "radar",
    svgMark: (
      <svg viewBox="0 0 120 80" className="w-[120px] h-[80px]" style={{ stroke: 'rgba(201,168,76,0.35)', strokeWidth: 0.8, fill: 'none' }}>
        <circle cx="60" cy="40" r="15" strokeDasharray="4 2" />
        <circle cx="60" cy="40" r="25" strokeDasharray="1 3" />
        <path d="M60 25 L60 10 M60 55 L60 70 M45 40 L30 40 M75 40 L90 40" />
      </svg>
    ),
    deliverables: [
      { title: "Domain Configuration", sub: "DNS routing and SSL certificates" },
      { title: "Production Deployment", sub: "Pushing code to live servers" },
      { title: "Final QA Audit", sub: "Post-launch verification" },
    ],
    tools: ["Vercel", "Cloudflare", "AWS"]
  },
  { 
    id: "ongoing-support",
    num: "06", 
    name: "Ongoing Support", 
    desc: "We continue to support your business with maintenance, updates, security monitoring, and technical assistance.",
    timeline: ["PHASE 6", "MAINTENANCE", "SUPPORT"],
    outcome: "Peace of mind knowing your platform is secure and up-to-date.",
    accent: "rgba(201,168,76,0.6)",
    bgType: "dots",
    svgMark: (
      <svg viewBox="0 0 120 80" className="w-[120px] h-[80px]" style={{ stroke: 'rgba(201,168,76,0.35)', strokeWidth: 0.8, fill: 'none' }}>
        <path d="M40 20 L80 20 L80 60 L40 60 Z" />
        <circle cx="60" cy="40" r="8" fill="rgba(201,168,76,0.35)" />
      </svg>
    ),
    deliverables: [
      { title: "Performance Monitoring", sub: "24/7 uptime and speed tracking" },
      { title: "Security Updates", sub: "Patching vulnerabilities" },
      { title: "Content Updates", sub: "Assistance with new site content" },
    ],
    tools: ["Sentry", "Google Analytics", "Slack"]
  }
];

function getCardBackground(bgType: string) {
  switch (bgType) {
    case 'radar':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="15%" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="30%" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="60%" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="75%" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
        </svg>
      );
    case 'dots':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="rgba(201,168,76,0.15)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      );
    case 'lines':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="lineGrid" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#lineGrid)" />
        </svg>
      );
    case 'chevrons':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="chevronGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M10 30 L20 20 L30 30" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#chevronGrid)" />
        </svg>
      );
    default:
      return null;
  }
}

const CardBorderAndPattern = ({ accent }: { accent: string }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-90 mix-blend-screen" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id={`cardPattern-${accent.replace(/[^a-zA-Z0-9]/g, '')}`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 20 L40 20 M20 0 L20 40" stroke={accent} strokeWidth="0.5" strokeOpacity="0.08" />
        <circle cx="20" cy="20" r="1.5" fill={accent} fillOpacity="0.15" />
        <path d="M15 15 L25 25 M15 25 L25 15" stroke={accent} strokeWidth="0.5" strokeOpacity="0.1" />
      </pattern>
      
      <linearGradient id={`goldGradient-${accent.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
        <stop offset="50%" stopColor={accent} stopOpacity="0.2" />
        <stop offset="100%" stopColor={accent} stopOpacity="0.8" />
      </linearGradient>
    </defs>

    {/* Pattern Background */}
    <rect x="25" y="25" width="910" height="550" fill={`url(#cardPattern-${accent.replace(/[^a-zA-Z0-9]/g, '')})`} rx="16" />

    {/* Outer Borders */}
    <rect x="20" y="20" width="920" height="560" rx="20" fill="none" stroke={`url(#goldGradient-${accent.replace(/[^a-zA-Z0-9]/g, '')})`} strokeWidth="1.5" />
    <rect x="32" y="32" width="896" height="536" rx="12" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
    <rect x="44" y="44" width="872" height="512" rx="6" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.2" />

    {/* Corner Ornaments */}
    {[
      {x: 64, y: 64, rot: 0},
      {x: 896, y: 64, rot: 90},
      {x: 896, y: 536, rot: 180},
      {x: 64, y: 536, rot: 270}
    ].map((pos, i) => (
      <g key={`corner-${i}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rot})`}>
        <path d="M 0 -24 C 24 -24, 24 0, 24 24" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.6" />
        <path d="M -12 -12 C 12 -12, 12 12, 12 12" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.4" />
        <circle cx="0" cy="0" r="4" fill={accent} fillOpacity="0.8" />
        <circle cx="24" cy="24" r="2.5" fill={accent} fillOpacity="0.4" />
        <path d="M 0 -36 L 6 -24 L 0 -18 L -6 -24 Z" fill={accent} fillOpacity="0.3" />
        <path d="M 36 0 L 24 6 L 18 0 L 24 -6 Z" fill={accent} fillOpacity="0.3" />
      </g>
    ))}
  </svg>
);

const CardMandala = ({ accent }: { accent: string }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-90 mix-blend-screen" viewBox="0 0 960 600" xmlns="http://www.w3.org/2000/svg">
    <style>
      {`
        .spin-slow { transform-origin: 480px 300px; animation: spin 60s linear infinite; }
        .spin-reverse { transform-origin: 480px 300px; animation: spinReverse 40s linear infinite; }
        .pulse-glow { transform-origin: 480px 300px; animation: pulseGlow 4s ease-in-out infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}
    </style>

    {/* Center Mandala */}
    <g className="spin-slow">
      {/* Sun rays */}
      {Array.from({ length: 48 }).map((_, i) => (
        <line key={`ray-${i}`} x1="480" y1="110" x2="480" y2={i % 2 === 0 ? "50" : "80"} stroke={accent} strokeWidth="1" strokeOpacity={i % 2 === 0 ? "0.3" : "0.15"} transform={`rotate(${i * 7.5}, 480, 300)`} />
      ))}
      <circle cx="480" cy="300" r="190" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
    </g>

    <g className="spin-reverse">
      <circle cx="480" cy="300" r="180" fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4 6" />
      <circle cx="480" cy="300" r="170" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Inner star shapes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`star-${i}`} transform={`rotate(${i * 30}, 480, 300)`}>
          <path d="M 480 180 L 498 140 L 480 110 L 462 140 Z" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.5" />
          <path d="M 480 140 L 486 125 L 480 110 L 474 125 Z" fill={accent} fillOpacity="0.4" />
          <circle cx="480" cy="160" r="2" fill={accent} fillOpacity="0.6" />
        </g>
      ))}
    </g>

    <g className="pulse-glow">
      <circle cx="480" cy="300" r="120" fill="#050505" fillOpacity="0.95" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="480" cy="300" r="110" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 3" />
      <circle cx="480" cy="300" r="105" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.2" />
    </g>

    {/* Left & Right Medallions */}
    <g transform="translate(160, 300)">
      <g style={{ transformOrigin: '0 0', animation: 'spin 40s linear infinite' }}>
        <circle cx="0" cy="0" r="45" fill="#050505" fillOpacity="0.8" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="0" cy="0" r="35" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="3 4" />
      </g>
      <path d="M 0 -24 L 18 0 L 0 24 L -18 0 Z" fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="1" strokeOpacity="0.5" style={{ animation: 'pulseGlow 4s ease-in-out infinite' }} />
      <path d="M 0 -65 C 25 -45, 25 45, 0 65" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.3" />
      <path d="M 0 -65 C -25 -45, -25 45, 0 65" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.3" />
    </g>

    <g transform="translate(800, 300)">
      <g style={{ transformOrigin: '0 0', animation: 'spinReverse 40s linear infinite' }}>
        <circle cx="0" cy="0" r="45" fill="#050505" fillOpacity="0.8" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="0" cy="0" r="35" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="3 4" />
      </g>
      <path d="M 0 -24 L 18 0 L 0 24 L -18 0 Z" fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="1" strokeOpacity="0.5" style={{ animation: 'pulseGlow 4s ease-in-out infinite' }} />
      <path d="M 0 -65 C -25 -45, -25 45, 0 65" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.3" />
      <path d="M 0 -65 C 25 -45, 25 45, 0 65" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.3" />
    </g>
  </svg>
);

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (initialized.current) return;
    initialized.current = true;
    
    let cleanup = () => {};
    const timeout = setTimeout(() => {
      cleanup = initProcessHandAnimation(sectionRef.current!);
    }, 100);

    return () => {
      clearTimeout(timeout);
      cleanup();
      initialized.current = false;
    };
  }, []);

  return (
    <section ref={sectionRef} className="process-section relative w-full h-[100svh] min-h-[600px] md:min-h-[800px] bg-[#050505] overflow-hidden flex flex-col items-center justify-center perspective-[1600px]" id="process">
      
      <div className="absolute left-0 w-full flex flex-col items-center justify-center pointer-events-none z-0" style={{ top: 'max(4rem, calc(100svh - 720px))' }}>
        <div className="flex items-center gap-4 mb-2 opacity-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C9A84C]"></span>
          </span>
          <span className="font-mono text-[14px] font-semibold tracking-[0.3em] text-[#C9A84C] uppercase">
            Click the cards to unfold our process
          </span>
          <div className="w-24 h-[1px] bg-gradient-to-r from-[#C9A84C] to-transparent opacity-80"></div>
        </div>
        <h2 className="font-display font-light text-[45px] sm:text-[70px] md:text-[100px] lg:text-[130px] bg-clip-text text-transparent bg-gradient-to-b from-[#EDE8DA] to-[#C9A84C] opacity-40 tracking-[0.15em] leading-none uppercase ml-0 md:ml-6 text-center">
          Methodology
        </h2>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hand-scene {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 100%;
          max-height: 800px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          transform-style: preserve-3d;
          z-index: 10;
        }

        .process-card {
          position: absolute;
          width: 960px;
          height: 600px;
          background: rgba(5, 5, 5, 0.95);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 20px;
          transform-origin: 50% 250%; /* Origin way below the card to create a massive arc */
          transform-style: preserve-3d;
          cursor: pointer;
          will-change: transform;
          box-shadow: 
            0 30px 60px -15px rgba(0,0,0,0.9), 
            inset 0 0 0 1px rgba(201,168,76,0.1),
            inset 0 0 60px rgba(201,168,76,0.05);
          overflow: hidden;
          transition: filter 0.3s ease, box-shadow 0.3s ease;
        }

        .process-card:hover {
          box-shadow: 
            0 40px 80px -20px rgba(0,0,0,1), 
            inset 0 0 0 1px rgba(201,168,76,0.2),
            inset 0 0 80px rgba(201,168,76,0.1);
        }

        .card-ambient-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          width: 100%;
          height: 100%;
          opacity: 0.5;
        }

        /* The Cover State - what you see in the fan */
        .card-cover {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          pointer-events: none;
        }

        .cover-num {
          position: absolute;
          font-family: 'Playfair Display', serif;
          font-size: 380px;
          font-weight: 300;
          color: rgba(255,255,255,0.015);
          line-height: 0.8;
          z-index: 1;
        }

        .cover-title {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          color: #EDE8DA;
          letter-spacing: 0.08em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.8);
          margin: 0;
          text-transform: uppercase;
        }

        .cover-title-wrapper {
          position: relative;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* The Detail State - what you see when expanded */
        .card-details {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0;
          padding: 56px 64px;
          box-sizing: border-box;
          z-index: 10;
          opacity: 0;
          pointer-events: none;
        }

        .card-divider {
          background: rgba(201,168,76,0.12);
          align-self: stretch;
          margin: 40px 0;
        }

        .close-btn {
          position: absolute;
          top: 40px;
          right: 40px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(20,20,20,0.9);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
          z-index: 50;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: rotate(90deg);
        }

        .nav-btns {
          position: absolute;
          bottom: 40px;
          right: 40px;
          display: flex;
          gap: 16px;
          opacity: 0;
          pointer-events: none;
          z-index: 50;
        }

        .nav-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(20,20,20,0.9);
          border: 1px solid rgba(201,168,76,0.2);
          color: #C9A84C;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .nav-btn:hover {
          background: rgba(201,168,76,0.25);
          transform: scale(1.05);
        }

        @media (max-width: 900px) {
          .process-card {
            width: 90vw;
            height: 70vh;
            transform-origin: 50% 150%;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
          .cover-num {
            font-size: 200px;
          }
          .cover-title {
            font-size: 32px;
            text-align: center;
            line-height: 1.1;
            padding: 0 10px;
          }
          .cover-title-wrapper span {
            font-size: 10px;
            margin-bottom: 8px;
          }
          .card-details {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            padding: 32px 24px;
            padding-bottom: 100px;
            overflow-y: auto;
            pointer-events: auto;
          }
          .card-divider {
            height: 1px;
            width: 100%;
            margin: 24px 0;
          }
        }
      `}} />

      <div className="hand-scene">
        {processData.map((phase, i) => (
          <div 
            key={phase.id} 
            className="process-card group" 
            data-index={i}
          >
            {getCardBackground(phase.bgType)}
            <canvas className="card-ambient-canvas"></canvas>

            {/* ALWAYS VISIBLE INTRICATE FRAME AND PATTERN */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ transform: 'translateZ(-10px)' }}>
              <CardBorderAndPattern accent={phase.accent} />
            </div>

            {/* COVER STATE */}
            <div className="card-cover" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 z-10 pointer-events-none" style={{ transform: 'translateZ(15px)' }}>
                <CardMandala accent={phase.accent} />
              </div>
              <div className="cover-num" style={{ transform: 'translateZ(30px)' }}>{phase.num}</div>
              <div className="cover-title-wrapper" style={{ transform: 'translateZ(45px)' }}>
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3 opacity-90 font-semibold" style={{ color: phase.accent }}>
                  Phase {phase.num}
                </span>
                <h3 className="cover-title" style={{ textShadow: `0 0 40px ${phase.accent}60` }}>{phase.name}</h3>
              </div>
              {/* Click Ripple Container */}
              <div className="click-ripple-container absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none z-50" style={{ transform: 'translateZ(50px)' }}></div>
            </div>

            {/* DETAILS STATE */}
            <div className="card-details" data-lenis-prevent="true">
              {/* Left Column */}
              <div className="flex flex-col relative h-full md:pr-8">
                <div className="relative z-10 flex-1 flex flex-col">
                  <span className="font-mono text-[11px] text-cmf-gold tracking-[0.3em] uppercase block mb-4 sec-label">
                    04 / METHODOLOGY — {phase.num}
                  </span>
                  
                  <h3 className="font-display font-semibold text-[60px] text-white leading-none mb-6 phase-title">
                    {phase.name}
                  </h3>
                  
                  <div className="h-[2px] bg-cmf-gold mb-6 gold-line" style={{ width: '60px', opacity: 0.6 }} />
                  
                  <p className="font-sans font-light text-[15px] text-cmf-text-muted leading-relaxed mb-6 max-w-[400px] body-desc">
                    {phase.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-6 tag-chips">
                    {phase.timeline.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.05)] px-3 py-[6px] font-mono text-[10px] text-cmf-gold tracking-[0.15em] uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="font-serif italic font-light text-[18px] text-[rgba(201,168,76,0.9)] mt-auto max-w-[400px] leading-relaxed quote-text">
                    "{phase.outcome}"
                  </div>
                </div>
              </div>

              <div className="card-divider"></div>

              {/* Right Column */}
              <div className="flex flex-col relative h-full md:pl-8">
                <span className="font-mono text-[11px] text-cmf-gold tracking-widest uppercase mb-6 block deliv-label">
                  DELIVERABLES
                </span>
                
                <div className="space-y-5 flex-1 deliv-list">
                  {phase.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-5 deliv-item">
                      <span className="text-cmf-gold font-mono text-[14px] mt-[2px]">→</span>
                      <div>
                        <h4 className="font-sans font-medium text-[16px] text-[#EDE8DA] mb-2 tracking-wide">
                          {item.title}
                        </h4>
                        <p className="font-sans font-light text-[14px] text-[#b0a890] leading-relaxed">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button className="close-btn" aria-label="Close Details">
              <X size={24} />
            </button>
            
            <div className="nav-btns">
              <button className="nav-btn prev-btn" aria-label="Previous Card">
                <ChevronLeft size={24} />
              </button>
              <button className="nav-btn next-btn" aria-label="Next Card">
                <ChevronRight size={24} />
              </button>
            </div>
            
          </div>
        ))}
      </div>
      
    </section>
  );
}
