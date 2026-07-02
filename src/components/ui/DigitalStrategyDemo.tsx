"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Target, Activity } from "lucide-react";

export default function DigitalStrategyDemo() {
  const [budget, setBudget] = useState<number>(10000);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger animation state after mount
    setTimeout(() => setIsMounted(true), 100);
  }, []);

  // Algorithmic Math for ROI Projection (Mock)
  const roas = 3.8 + (budget / 100000); // ROAS scales slightly with budget for demo purposes
  const projectedRevenue = budget * roas;
  const conversions = Math.floor(projectedRevenue / 150); // Assume $150 AOV
  const cac = budget / conversions;

  // Chart Data (Mocking month over month growth based on budget)
  const chartData = [
    { month: "M1", value: 20 },
    { month: "M2", value: 35 },
    { month: "M3", value: 45 },
    { month: "M4", value: 65 },
    { month: "M5", value: 80 },
    { month: "M6", value: 100 },
  ];

  return (
    <div className="py-20 mb-20 border-t border-b border-cmf-border">
      <div className="mb-20 text-center max-w-2xl mx-auto">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
          INTERACTIVE DASHBOARD
        </span>
        <h2 className="heading-display text-4xl md:text-5xl text-cmf-text mb-6">
          Predictive Architecture
        </h2>
        <p className="font-sans font-light text-cmf-text-muted text-lg">
          We don&apos;t guess. We architect digital ecosystems engineered for exponential growth. Use the simulator below to project potential returns based on strategic capital allocation.
        </p>
      </div>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ROI Simulator (Left Col) */}
        <div className="lg:col-span-5 bg-[#050505] border border-cmf-border p-8 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cmf-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div>
            <h3 className="font-display text-2xl text-cmf-text mb-2">Growth Simulator</h3>
            <p className="text-cmf-text-muted text-sm mb-12">Adjust the strategic monthly budget to calculate projected ecosystem returns.</p>
            
            {/* Slider */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <span className="font-sans text-cmf-text-muted uppercase tracking-widest text-xs">Monthly Capital</span>
                <span className="font-display text-2xl text-cmf-gold">₹{budget.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="100000" 
                step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-1 bg-cmf-border rounded-lg appearance-none cursor-pointer accent-cmf-gold"
                style={{
                  background: `linear-gradient(to right, #C9A84C ${(budget - 1000) / (100000 - 1000) * 100}%, #222 ${(budget - 1000) / (100000 - 1000) * 100}%)`
                }}
              />
              <div className="flex justify-between items-center mt-3 label-mono text-[10px] text-cmf-text-muted">
                <span>₹1K</span>
                <span>₹100K+</span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-cmf-border p-6 transform transition-transform hover:-translate-y-1">
              <Target size={18} className="text-cmf-gold-muted mb-4" />
              <span className="block text-xs text-cmf-text-muted tracking-widest uppercase mb-1">Projected Rev</span>
              <span className="font-display text-2xl text-cmf-text">₹{Math.round(projectedRevenue).toLocaleString()}</span>
            </div>
            <div className="bg-[#0a0a0a] border border-cmf-border p-6 transform transition-transform hover:-translate-y-1">
              <TrendingUp size={18} className="text-cmf-gold-muted mb-4" />
              <span className="block text-xs text-cmf-text-muted tracking-widest uppercase mb-1">Target ROAS</span>
              <span className="font-display text-2xl text-cmf-text">{roas.toFixed(2)}x</span>
            </div>
            <div className="bg-[#0a0a0a] border border-cmf-border p-6 transform transition-transform hover:-translate-y-1">
              <Users size={18} className="text-cmf-gold-muted mb-4" />
              <span className="block text-xs text-cmf-text-muted tracking-widest uppercase mb-1">Conversions</span>
              <span className="font-display text-2xl text-cmf-text">{conversions.toLocaleString()}</span>
            </div>
            <div className="bg-[#0a0a0a] border border-cmf-border p-6 transform transition-transform hover:-translate-y-1">
              <Activity size={18} className="text-cmf-gold-muted mb-4" />
              <span className="block text-xs text-cmf-text-muted tracking-widest uppercase mb-1">Est. CPA</span>
              <span className="font-display text-2xl text-cmf-text">₹{cac.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Analytics & Roadmap (Right Col) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Animated Chart */}
          <div className="bg-[#050505] border border-cmf-border p-8 md:p-10 shadow-2xl flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="font-display text-2xl text-cmf-text mb-1">Ecosystem Trajectory</h3>
                <p className="text-cmf-text-muted text-sm">6-month projected momentum</p>
              </div>
              <div className="px-3 py-1 border border-cmf-gold/30 bg-cmf-gold/5 text-cmf-gold text-xs tracking-widest uppercase">
                Live Data
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 md:gap-6 pt-10">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <div className="w-full relative bg-[#111] rounded-t-sm h-40 flex items-end justify-center">
                    {/* Animated Bar */}
                    <div 
                      className="absolute bottom-0 w-full bg-cmf-gold/80 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ 
                        height: isMounted ? `${data.value}%` : '0%',
                        transitionDelay: `${idx * 150}ms`
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-cmf-gold shadow-[0_0_10px_rgba(201,168,76,0.8)]"></div>
                    </div>
                  </div>
                  <span className="mt-4 label-mono text-[10px] text-cmf-text-muted group-hover:text-cmf-gold transition-colors">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Roadmap */}
          <div className="bg-[#050505] border border-cmf-border p-8 shadow-2xl">
             <h3 className="font-display text-xl text-cmf-text mb-6">Strategic Phasing</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { phase: "01. Architecture", desc: "Foundation & Audience Mapping" },
                  { phase: "02. Deployment", desc: "Omnichannel Rollout & A/B Tests" },
                  { phase: "03. Scaling", desc: "Algorithmic Optimization & Growth" }
                ].map((item, idx) => (
                  <div key={idx} className="border border-cmf-border p-4 hover:border-cmf-gold transition-colors group cursor-crosshair relative overflow-hidden">
                     <div className="absolute inset-0 bg-cmf-gold/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                     <span className="block font-display text-cmf-text mb-2 relative z-10">{item.phase}</span>
                     <span className="block font-sans font-light text-xs text-cmf-text-muted relative z-10">{item.desc}</span>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
