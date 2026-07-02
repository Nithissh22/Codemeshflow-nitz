"use client";

import { useState, useEffect } from "react";
import { Play, Settings, Database, Server, Code, CheckCircle, Activity, Box } from "lucide-react";

export default function SoftwareDevDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev >= 4 ? 0 : prev + 1));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const steps = [
    { icon: <Database size={16} />, label: "Data Ingestion", desc: "Connecting to API endpoints" },
    { icon: <Server size={16} />, label: "Processing", desc: "Running business logic algorithms" },
    { icon: <Settings size={16} />, label: "Automation", desc: "Triggering Webhooks & CRM updates" },
    { icon: <Box size={16} />, label: "Storage", desc: "Committing to secure cloud DB" },
  ];

  return (
    <div className="w-full bg-[#050505] border border-cmf-border p-6 md:p-12 rounded-xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cmf-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
        <div>
          <div className="text-cmf-gold text-[10px] font-mono tracking-[0.2em] mb-2 uppercase">Custom Software Architecture</div>
          <h3 className="text-2xl text-white font-display">Workflow Automation Engine</h3>
        </div>
        <button 
          onClick={() => { setIsRunning(!isRunning); if(!isRunning) setActiveStep(0); }}
          className={`mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 text-[11px] font-mono tracking-wider transition-colors ${isRunning ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-cmf-gold text-black border border-cmf-gold hover:bg-[#E8C96A]'}`}
        >
          {isRunning ? (
            <>■ STOP PIPELINE</>
          ) : (
            <><Play size={14} fill="currentColor" /> RUN PIPELINE</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        {steps.map((step, idx) => {
          const isActive = activeStep === idx && isRunning;
          const isCompleted = activeStep > idx && isRunning;
          
          return (
            <div key={idx} className={`p-5 rounded-lg border transition-all duration-500 ${isActive ? 'bg-cmf-gold/10 border-cmf-gold shadow-[0_0_20px_rgba(201,168,76,0.15)] transform -translate-y-1' : isCompleted ? 'bg-[#0a0a09] border-[rgba(201,168,76,0.2)]' : 'bg-[#0a0a09] border-white/5 opacity-50'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-md ${isActive ? 'bg-cmf-gold text-black' : isCompleted ? 'bg-[rgba(201,168,76,0.2)] text-cmf-gold' : 'bg-[#1a1a1a] text-white/40'}`}>
                  {step.icon}
                </div>
                {isCompleted && <CheckCircle size={14} className="text-cmf-gold" />}
                {isActive && <Activity size={14} className="text-cmf-gold animate-pulse" />}
              </div>
              <div className="text-white/90 text-sm font-medium mb-1">{step.label}</div>
              <div className="text-white/40 text-[10px] leading-relaxed">{step.desc}</div>
              
              {/* Progress bar line */}
              <div className="mt-4 h-[2px] w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className={`h-full bg-cmf-gold transition-all ${isActive ? 'w-full duration-[1500ms] ease-linear' : isCompleted ? 'w-full duration-0' : 'w-0 duration-0'}`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code snippet simulation */}
      <div className="mt-8 bg-[#0a0a09] border border-white/5 rounded-lg p-5 font-mono text-[10px] md:text-[12px] text-white/50 relative overflow-hidden h-[150px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a09] z-10 pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
          <Code size={14} className="text-cmf-gold" />
          <span className="text-white/70">Terminal Output</span>
        </div>
        <div className={`flex flex-col gap-2 transition-transform duration-500 ${isRunning ? 'translate-y-0' : 'translate-y-4 opacity-50'}`}>
          <div className={`${activeStep >= 0 && isRunning ? 'text-cmf-gold/80' : ''}`}>&gt; Initializing pipeline connection... [OK]</div>
          <div className={`${activeStep >= 1 && isRunning ? 'text-cmf-gold/80' : ''}`}>&gt; Fetching data from external API... 240ms</div>
          <div className={`${activeStep >= 2 && isRunning ? 'text-cmf-gold/80' : ''}`}>&gt; Executing logic module user_sync.ts...</div>
          <div className={`${activeStep >= 3 && isRunning ? 'text-cmf-gold/80' : ''}`}>&gt; Pushing events to CRM webhook... 120ms</div>
          <div className={`${activeStep >= 4 && isRunning ? 'text-green-400/80' : ''}`}>&gt; Pipeline executed successfully. Data stored.</div>
        </div>
      </div>
    </div>
  );
}
