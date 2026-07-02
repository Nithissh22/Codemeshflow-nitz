"use client";

import { useState, useEffect } from "react";
import { Cpu, Send, Sparkles, Terminal, Code } from "lucide-react";

export default function AiAutomationDemo() {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState("");

  const generateResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.length < 5 || lowerInput === "optimize my") {
      return `Error: Command ambiguous or missing parameters.
Please provide a more descriptive request. 
Example: "Optimize my sales pipeline" or "Generate CRM integration code".`;
    }

    if (lowerInput.includes("error") || lowerInput.includes("fix") || lowerInput.includes("bug")) {
      return `Scanning system logs for anomalies...
Identified 2 critical exceptions in microservice architecture.
Applying automated patch...
> Rerouting traffic from failing nodes... [Done]
> Rebooting container instances... [Done]
> Injecting memory leak hotfix... [Done]
System stability restored. Zero downtime achieved.`;
    }

    if (lowerInput.includes("code") || lowerInput.includes("build") || lowerInput.includes("website") || lowerInput.includes("app")) {
      return `Compiling requirements for full-stack application...
Generating React components and API endpoints...
> Scaffolded Next.js architecture... [Done]
> Integrated Prisma ORM with PostgreSQL... [Done]
> Implemented JWT Authentication flows... [Done]
> Deployed to edge network... [Done]
Code generation complete. 14,302 lines written in 0.8s.`;
    }
    
    if (lowerInput.includes("marketing") || lowerInput.includes("seo") || lowerInput.includes("sales")) {
      return `Analyzing digital footprint and conversion funnels...
Identified low organic engagement on key landing pages.
Applying AI marketing optimization algorithms...
> Generating 50 SEO-optimized content topics... [Done]
> A/B testing ad copy variants... [Done]
> Reallocating ad spend dynamically... [Done]
Campaigns updated. Expected ROI increase: 22%.`;
    }

    // Default response
    return `Analyzing command: "${input}"...
Scanning related business workflows...
Identified 3 bottlenecks in current process pipeline.
Applying LLM optimization model...
> Generating automated email response templates... [Done]
> Configuring predictive lead scoring algorithm... [Done]
> Deploying conversational agent to staging... [Done]
System optimization complete. Estimated time saved: 14 hrs/week.`;
  };

  const handleGenerate = () => {
    if (!inputText.trim() || isGenerating) return;
    setIsGenerating(true);
    setStreamText("");
    
    const responseToStream = generateResponse(inputText.trim());
    
    let i = 0;
    const interval = setInterval(() => {
      setStreamText((prev) => prev + responseToStream.charAt(i));
      i++;
      if (i >= responseToStream.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 20); // Faster typing speed for a snappier feel
  };

  return (
    <div className="w-full bg-[#050505] border border-cmf-border p-6 md:p-12 rounded-xl relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.05)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="text-center mb-10 relative z-10">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.2em] mb-2 block flex items-center justify-center gap-2"><Sparkles size={12} /> INTELLIGENT SYSTEMS</span>
        <h3 className="text-3xl text-white font-display">LLM Integration & Automation</h3>
        <p className="text-white/40 font-light text-sm mt-2 max-w-lg mx-auto">Interact with our simulated AI workflow engine. We build custom machine learning models that integrate directly into your business logic.</p>
      </div>

      <div className="w-full max-w-2xl bg-[#0a0a09] border border-white/10 rounded-xl overflow-hidden relative z-10 shadow-2xl">
        
        {/* Top bar */}
        <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex items-center gap-3">
          <Cpu className="text-cmf-gold" size={18} />
          <span className="font-mono text-xs text-white/60 tracking-wider">CMF_AI_ENGINE_v2.0</span>
          <div className="ml-auto flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
        </div>

        {/* Console Area */}
        <div className="p-6 h-[250px] bg-[#050505] font-mono text-sm overflow-y-auto flex flex-col justify-end">
          {streamText === "" && !isGenerating ? (
             <div className="text-white/20 text-center flex flex-col items-center justify-center h-full gap-3">
               <Terminal size={32} />
               <span>Awaiting input command...</span>
             </div>
          ) : (
             <div className="leading-loose whitespace-pre-wrap">
               <span className={streamText.startsWith("Error:") ? "text-red-400" : "text-[#00ffcc]"}>
                 {streamText}
               </span>
               {isGenerating && <span className="inline-block w-2 h-4 bg-cmf-gold ml-1 animate-pulse"></span>}
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0a0a09] border-t border-white/5">
          <div className="relative">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g., Optimize my customer onboarding workflow..."
              className="w-full bg-[#161616] border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white font-mono text-xs focus:outline-none focus:border-cmf-gold/50 transition-colors"
            />
            <button 
              onClick={handleGenerate}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cmf-gold/10 hover:bg-cmf-gold/20 text-cmf-gold rounded transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
