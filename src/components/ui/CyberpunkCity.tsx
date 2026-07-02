"use client";
import { useEffect, useState } from "react";

export default function CyberpunkCity() {
  const [mounted, setMounted] = useState(false);
  const [power, setPower] = useState(true);
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[1] pointer-events-none mix-blend-screen overflow-hidden">
      
      {/* POWER SWITCH */}
      <button 
        onClick={() => setPower(!power)}
        className="fixed bottom-8 right-8 z-[100] pointer-events-auto font-mono text-[10px] tracking-[0.2em] px-4 py-2 border flex items-center gap-2 transition-all duration-500 backdrop-blur-sm hover:scale-105 active:scale-95"
        style={{
          borderColor: power ? 'rgba(252,68,2,0.5)' : 'rgba(255,255,255,0.2)',
          color: power ? '#fc4402' : '#888',
          backgroundColor: power ? 'rgba(252,68,2,0.1)' : 'rgba(0,0,0,0.5)'
        }}
      >
        <span className={`w-2 h-2 rounded-full transition-all duration-500 ${power ? 'bg-[#fc4402] shadow-[0_0_8px_#fc4402]' : 'bg-gray-600'}`}></span>
        {power ? "CITY POWER: ON" : "CITY POWER: OFF"}
      </button>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtlePan {
          0% { transform: translateX(0) scale(1.02); }
          50% { transform: translateX(-2%) scale(1.02); }
          100% { transform: translateX(0) scale(1.02); }
        }
        .realistic-parallax {
          animation: subtlePan 35s ease-in-out infinite;
        }
        @keyframes flickerReal {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; filter: url(#strongGlow); }
          20%, 22%, 24%, 55% { opacity: 0.1; filter: none; }
        }
        @keyframes pulseAmbient {
          0%, 100% { opacity: 0.7; filter: url(#subtleGlow); }
          50% { opacity: 1; filter: url(#strongGlow); }
        }
        @keyframes sweepBeam {
          0% { transform: rotate(-30deg); opacity: 0; }
          50% { transform: rotate(10deg); opacity: 0.4; }
          100% { transform: rotate(50deg); opacity: 0; }
        }
        @keyframes fogDrift {
          0% { transform: translateX(-5%); opacity: 0.2; }
          50% { transform: translateX(5%); opacity: 0.5; }
          100% { transform: translateX(-5%); opacity: 0.2; }
        }
        .anim-flicker { animation: flickerReal 4s infinite; }
        .anim-flicker-slow { animation: flickerReal 9s infinite reverse; }
        .anim-pulse { animation: pulseAmbient 5s ease-in-out infinite; }
        .anim-pulse-fast { animation: pulseAmbient 2.5s ease-in-out infinite; }
        .anim-beam { animation: sweepBeam 12s infinite ease-in-out; transform-origin: bottom center; }
        .anim-fog { animation: fogDrift 25s infinite ease-in-out; }
      `}} />
      
      <div className="absolute bottom-[-10px] left-0 w-full h-[80vh] md:h-[90vh] realistic-parallax">
        <svg 
          viewBox="0 0 1600 600" 
          preserveAspectRatio="none" 
          className="w-full h-full drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="subtleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <linearGradient id="fogGlow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={power ? "#fc4402" : "#0a0a0a"} stopOpacity={power ? "0.8" : "0.2"} />
              <stop offset="50%" stopColor={power ? "#f5aa42" : "#050505"} stopOpacity={power ? "0.1" : "0.05"} />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="beamGradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#f5aa42" stopOpacity="0" />
              <stop offset="100%" stopColor="#f5aa42" stopOpacity={power ? "0.12" : "0"} />
            </linearGradient>
            
            <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="distantGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c1e16" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            
            {/* Window Patterns for realism */}
            <pattern id="windowsSmall" width="12" height="15" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="3" height="4" fill={power ? "#E8C96A" : "#111"} opacity={power ? "0.15" : "0.5"} />
              <rect x="7" y="2" width="3" height="4" fill={power ? "#fc4402" : "#111"} opacity={power ? "0.05" : "0.5"} />
              <rect x="2" y="8" width="3" height="4" fill={power ? "#f5aa42" : "#222"} opacity={power ? "0.4" : "0.3"} className={power ? "anim-flicker-slow" : ""} />
              <rect x="7" y="8" width="3" height="4" fill="#000" opacity="0.9" />
            </pattern>
            <pattern id="windowsLarge" width="20" height="25" patternUnits="userSpaceOnUse">
              <rect x="3" y="3" width="14" height="6" fill={power ? "#f5aa42" : "#111"} opacity={power ? "0.3" : "0.4"} />
              <rect x="3" y="13" width="6" height="6" fill={power ? "#fc4402" : "#222"} opacity={power ? "0.5" : "0.3"} className={power ? "anim-pulse-fast" : ""} />
              <rect x="11" y="13" width="6" height="6" fill={power ? "#E8C96A" : "#1a1a1a"} opacity={power ? "0.8" : "0.5"} className={power ? "anim-flicker" : ""} />
            </pattern>
          </defs>

          {/* Deep Ambient Fog */}
          <rect x="0" y="0" width="1600" height="600" fill="url(#fogGlow)" opacity="0.4" className="anim-fog" />

          {/* Searchlights / Sky beams */}
          <polygon points="600,600 300,0 500,0" fill="url(#beamGradient)" className="anim-beam" />
          <polygon points="1200,600 1500,0 1300,0" fill="url(#beamGradient)" className="anim-beam" style={{ animationDelay: '-6s' }} />

          {/* LAYER 1: Deep Distant Skyline (Atmospheric depth) */}
          <g fill="url(#distantGradient)" opacity="0.8">
            <path d="M0,600 L0,300 L30,300 L30,330 L50,330 L50,280 L70,280 L70,350 L120,350 L120,240 L160,240 L160,320 L220,320 L220,180 L250,180 L250,210 L290,210 L290,270 L340,270 L340,150 L380,150 L380,310 L430,310 L430,220 L470,220 L470,340 L530,340 L530,190 L560,190 L560,280 L620,280 L620,170 L650,170 L650,200 L710,200 L710,260 L780,260 L780,120 L820,120 L820,300 L890,300 L890,210 L940,210 L940,320 L1010,320 L1010,160 L1060,160 L1060,250 L1120,250 L1120,140 L1150,140 L1150,290 L1220,290 L1220,190 L1270,190 L1270,310 L1340,310 L1340,150 L1390,150 L1390,270 L1450,270 L1450,170 L1500,170 L1500,340 L1560,340 L1560,220 L1600,220 L1600,600 Z" />
          </g>

          {/* LAYER 2: Midground Intricate Buildings */}
          <g fill="url(#buildingGradient)">
            {/* Mega Structure Left */}
            <path d="M-20,600 L-20,250 L40,250 L60,200 L120,200 L140,250 L200,250 L200,600 Z" />
            <rect x="50" y="220" width="80" height="380" fill="url(#windowsSmall)" />
            {/* Tall Spire */}
            <path d="M250,600 L250,120 L270,120 L275,50 L285,50 L290,120 L310,120 L310,600 Z" />
            <circle cx="280" cy="45" r="4" fill="#fc4402" className={power ? "anim-pulse" : ""} filter={power ? "url(#strongGlow)" : ""} style={{ opacity: power ? 1 : 0.2, transition: 'opacity 1s' }} />
            <rect x="260" y="150" width="40" height="450" fill="url(#windowsLarge)" />
            {/* Blocky Corp Building */}
            <path d="M360,600 L360,220 L400,220 L400,180 L480,180 L480,220 L520,220 L520,600 Z" />
            <rect x="380" y="200" width="100" height="400" fill="url(#windowsSmall)" />
            <rect x="420" y="120" width="40" height="60" fill={power ? "#f5aa42" : "#111"} opacity={power ? "0.1" : "0.5"} />
            <text x="440" y="160" fill={power ? "#f5aa42" : "#333"} fontSize="24" fontFamily="monospace" textAnchor="middle" filter={power ? "url(#subtleGlow)" : ""} className={power ? "anim-flicker-slow" : ""} fontWeight="bold" style={{ transition: 'all 1s' }}>CORP</text>
            {/* Complex Multi-tier */}
            <path d="M580,600 L580,300 L610,300 L610,240 L650,240 L650,150 L690,150 L690,100 L710,100 L710,150 L750,150 L750,240 L790,240 L790,300 L820,300 L820,600 Z" />
            <rect x="620" y="260" width="160" height="340" fill="url(#windowsLarge)" opacity="0.5" />
            <rect x="660" y="170" width="80" height="70" fill="none" stroke={power ? "#fc4402" : "#333"} strokeWidth="4" filter={power ? "url(#strongGlow)" : ""} className={power ? "anim-pulse-fast" : ""} style={{ transition: 'all 1s' }} />
            {/* Giant Pillar Right */}
            <path d="M880,600 L880,180 L920,130 L1000,130 L1040,180 L1040,600 Z" />
            <rect x="900" y="190" width="120" height="410" fill="url(#windowsSmall)" />
            {/* Slanted Roof */}
            <path d="M1100,600 L1100,280 L1180,200 L1260,200 L1260,600 Z" />
            <rect x="1120" y="280" width="120" height="320" fill="url(#windowsSmall)" />
            <line x1="1140" y1="260" x2="1240" y2="260" stroke="#E8C96A" strokeWidth="6" filter="url(#strongGlow)" className="anim-flicker" style={{ opacity: power ? 1 : 0, transition: 'opacity 1s' }} />
            {/* Right Edge Spire */}
            <path d="M1320,600 L1320,160 L1360,160 L1370,80 L1390,80 L1400,160 L1440,160 L1440,600 Z" />
            <rect x="1340" y="180" width="80" height="420" fill="url(#windowsLarge)" />
            <circle cx="1380" cy="75" r="5" fill="#fc4402" filter={power ? "url(#strongGlow)" : ""} className={power ? "anim-pulse-fast" : ""} style={{ opacity: power ? 1 : 0.2, transition: 'opacity 1s' }} />
            {/* Right Block */}
            <path d="M1500,600 L1500,240 L1620,240 L1620,600 Z" />
            <rect x="1520" y="260" width="80" height="340" fill="url(#windowsSmall)" />
          </g>

          {/* LAYER 3: Deep Foreground Silhouettes (Pure Black, intersecting everything) */}
          <g fill="#050505">
            <polygon points="-20,600 -20,400 80,400 80,450 160,450 160,350 280,350 280,420 350,420 350,380 480,380 480,480 600,480 600,340 720,340 720,460 850,460 850,390 980,390 980,450 1100,450 1100,360 1240,360 1240,430 1380,430 1380,380 1520,380 1520,460 1620,460 1620,600" />
            <polygon points="-20,600 -20,500 120,500 120,550 300,550 300,480 450,480 450,530 650,530 650,460 820,460 820,520 1000,520 1000,480 1200,480 1200,550 1400,550 1400,490 1620,490 1620,600" fill="#000000" />
          </g>

          {/* LAYER 4: High-detail glowing signs overlapping silhouettes */}
          <g filter="url(#strongGlow)" style={{ opacity: power ? 1 : 0, transition: 'opacity 1s' }}>
            {/* Holographic lines / UI elements floating */}
            <line x1="200" y1="360" x2="260" y2="360" stroke="#f5aa42" strokeWidth="3" className="anim-pulse" />
            <line x1="200" y1="370" x2="240" y2="370" stroke="#fc4402" strokeWidth="2" />
            
            {/* Neon Billboards */}
            <rect x="520" y="390" width="60" height="30" fill="#fc4402" className="anim-flicker-slow" />
            <text x="550" y="412" fill="#000" fontSize="18" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">DATA</text>

            <rect x="900" y="410" width="50" height="20" fill="none" stroke="#E8C96A" strokeWidth="3" className="anim-pulse-fast" />
            
            <circle cx="120" cy="420" r="15" fill="none" stroke="#f5aa42" strokeWidth="4" className="anim-flicker" />
            <circle cx="120" cy="420" r="6" fill="#fc4402" />
            
            <path d="M1280,380 L1320,380 L1320,410 L1280,410 Z" fill="#f5aa42" className="anim-pulse" />
            
            {/* Vertical data streams */}
            <line x1="780" y1="360" x2="780" y2="440" stroke="#E8C96A" strokeWidth="4" className="anim-flicker-slow" />
            <line x1="790" y1="370" x2="790" y2="420" stroke="#fc4402" strokeWidth="2" className="anim-pulse-fast" />
          </g>

          {/* Foreground Atmosphere Layer */}
          <rect x="0" y="500" width="1600" height="100" fill="url(#fogGlow)" opacity="0.6" className="anim-fog" />
        </svg>
      </div>
    </div>
  );
}
