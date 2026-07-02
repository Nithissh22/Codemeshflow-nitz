"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Target, MousePointerClick, BarChart2 } from "lucide-react";

export default function DigitalMarketingDemo() {
  const [budget, setBudget] = useState(1000);
  const [metrics, setMetrics] = useState({
    impressions: 45000,
    clicks: 1200,
    conversions: 85,
    roi: 240
  });

  useEffect(() => {
    // Simulate metrics calculation based on budget slider
    const multiplier = budget / 1000;
    setMetrics({
      impressions: Math.floor(45000 * multiplier * (1 + (Math.random() * 0.1))),
      clicks: Math.floor(1200 * multiplier * (1 + (Math.random() * 0.15))),
      conversions: Math.floor(85 * multiplier * (1 + (Math.random() * 0.2))),
      roi: Math.floor(240 + (multiplier * 15))
    });
  }, [budget]);

  return (
    <div className="w-full bg-[#050505] border border-cmf-border p-6 md:p-12 rounded-xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="mb-12 relative z-10">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.2em] mb-2 block">MARKETING ENGINE</span>
        <h3 className="text-3xl text-white font-display">Campaign Simulator</h3>
        <p className="text-white/40 font-light text-sm mt-2 max-w-lg">Adjust the marketing budget below to see estimated real-time impacts on reach, engagement, and conversion metrics across major ad networks.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative z-10">
        {/* Controls */}
        <div className="w-full lg:w-1/3">
          <div className="bg-[#0a0a09] border border-[rgba(201,168,76,0.15)] p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-[11px] text-white/60 tracking-widest">MONTHLY BUDGET</span>
              <span className="font-display text-xl text-cmf-gold">${budget.toLocaleString()}</span>
            </div>
            
            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="100"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-cmf-gold"
            />
            
            <div className="flex justify-between text-[10px] text-white/30 font-mono mt-3">
              <span>$500</span>
              <span>$10,000+</span>
            </div>

            <div className="mt-10">
              <span className="font-mono text-[11px] text-white/60 tracking-widest block mb-4">PLATFORM DISTRIBUTION</span>
              <div className="flex flex-col gap-3">
                {[
                  { name: "Google Ads (Search)", percent: 45 },
                  { name: "Meta (FB & IG)", percent: 35 },
                  { name: "LinkedIn (B2B)", percent: 20 },
                ].map((plat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] text-white/50 mb-1">
                      <span>{plat.name}</span>
                      <span>{plat.percent}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-cmf-gold/50" style={{ width: `${plat.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="w-full lg:w-2/3 grid grid-cols-2 gap-4">
          <div className="bg-[#0a0a09] border border-white/5 p-6 rounded-xl flex flex-col justify-between group hover:border-cmf-gold/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#111] rounded-lg text-white/60 group-hover:text-cmf-gold transition-colors">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">+12.5%</span>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">Est. Impressions</div>
              <div className="font-display text-3xl text-white">{metrics.impressions.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-[#0a0a09] border border-white/5 p-6 rounded-xl flex flex-col justify-between group hover:border-cmf-gold/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#111] rounded-lg text-white/60 group-hover:text-cmf-gold transition-colors">
                <MousePointerClick size={20} />
              </div>
              <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">+8.2%</span>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">Click-Throughs</div>
              <div className="font-display text-3xl text-white">{metrics.clicks.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-[#0a0a09] border border-white/5 p-6 rounded-xl flex flex-col justify-between group hover:border-cmf-gold/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#111] rounded-lg text-white/60 group-hover:text-cmf-gold transition-colors">
                <Target size={20} />
              </div>
              <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">+18.4%</span>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">Conversions (Leads)</div>
              <div className="font-display text-3xl text-white">{metrics.conversions.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1508] to-[#0a0a09] border border-[rgba(201,168,76,0.3)] p-6 rounded-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-cmf-gold/10 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="p-3 bg-cmf-gold/20 rounded-lg text-cmf-gold">
                <BarChart2 size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-cmf-gold/70 text-xs mb-1 font-mono tracking-widest">PROJECTED ROI</div>
              <div className="font-display text-4xl text-cmf-gold">{metrics.roi}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
