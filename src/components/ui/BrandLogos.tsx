import React from "react";

interface LogoProps {
  className?: string;
}

export const HebronLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Abstract Geometric H / Speed silhouette */}
    <path d="M25 20 L45 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M55 20 L75 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M35 50 L65 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M20 70 L80 30" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
  </svg>
);

export const SwastikLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Geometric Hardware / Structure / S & C concept */}
    <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" stroke="currentColor" strokeWidth="4" />
    <path d="M50 20 L50 50 L80 65" stroke="currentColor" strokeWidth="4" />
    <path d="M20 35 L50 50 L50 80" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="8" fill="currentColor" />
  </svg>
);

export const BulletinLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sleek Origami Bullet / B shape */}
    <path d="M30 80 L30 30 L50 15 L70 30 L70 80" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M30 80 L50 95 L70 80" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 15 L50 95" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    <path d="M30 45 L70 45" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    <path d="M30 65 L70 65" stroke="currentColor" strokeWidth="2" opacity="0.4" />
  </svg>
);

export const D2RLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Minimalist Globe & Flight Path */}
    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3" />
    <ellipse cx="50" cy="50" rx="30" ry="10" stroke="currentColor" strokeWidth="1" transform="rotate(-30 50 50)" opacity="0.5" />
    <path d="M10 90 C 20 60, 40 40, 80 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M70 15 L85 15 L80 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SuryaaLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Abstract Geometric Sun / Eclipse */}
    <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="6" />
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
    {/* Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <line
        key={angle}
        x1="50"
        y1="10"
        x2="50"
        y2="5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
  </svg>
);

export const JaiMachiLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Intertwined Links representing Partnership / Handshake */}
    <rect x="25" y="35" width="40" height="20" rx="10" stroke="currentColor" strokeWidth="5" />
    <rect x="35" y="45" width="40" height="20" rx="10" stroke="currentColor" strokeWidth="5" />
    <path d="M45 45 L55 45" stroke="#080808" strokeWidth="8" /> {/* Cutout for intertwining effect */}
    <path d="M45 45 L55 45" stroke="currentColor" strokeWidth="5" />
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" opacity="0.2" />
  </svg>
);
