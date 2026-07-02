"use client";

import { useState, useEffect, useRef } from "react";
import { Database, Globe, Server, Shield, Zap, Terminal as TerminalIcon } from "lucide-react";

const NODES = [
  { id: 'client', label: 'Global Edge', icon: Globe, x: 100, y: 300, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
  { id: 'waf', label: 'Security (WAF)', icon: Shield, x: 350, y: 300, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  { id: 'api', label: 'API Gateway', icon: Server, x: 600, y: 300, color: 'text-cmf-gold', border: 'border-cmf-gold/30', bg: 'bg-cmf-gold/10' },
  { id: 'cache', label: 'Redis Cluster', icon: Zap, x: 850, y: 150, color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
  { id: 'db', label: 'Vector DB', icon: Database, x: 850, y: 450, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
];

const EDGES = [
  { id: 'e1', from: 'client', to: 'waf', d: 'M 100 300 L 350 300' },
  { id: 'e2', from: 'waf', to: 'api', d: 'M 350 300 L 600 300' },
  { id: 'e3', from: 'api', to: 'cache', d: 'M 600 300 C 700 300, 750 150, 850 150' },
  { id: 'e4', from: 'api', to: 'db', d: 'M 600 300 C 700 300, 750 450, 850 450' },
  { id: 'e5', from: 'cache', to: 'db', d: 'M 850 150 L 850 450' }, // Data sync
];

export default function WebArchitectureDemo() {
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Architecture Online.", 
    "[SYSTEM] All microservices operational.",
    "[SYSTEM] Awaiting traffic routing..."
  ]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Stress test logic
  useEffect(() => {
    if (!isStressTesting) return;
    
    let logCount = 0;
    const logMessages = [
      "[INFO] Massive inbound traffic spike detected from multiple global regions.",
      "[WARN] API Gateway CPU utilization reached 85%.",
      "[INFO] Auto-scaling groups provisioning 3 new instances.",
      "[WARN] Redis Cache memory threshold exceeded. Evicting LRU keys.",
      "[INFO] Vector DB shard rebalancing initialized automatically.",
      "[INFO] WAF neutralizing malicious payload attempts in real-time.",
      "[INFO] Network throughput stabilized at 4.2M req/sec.",
      "[SYSTEM] Elastic scaling complete. All systems nominal under heavy load."
    ];

    const interval = setInterval(() => {
      if (logCount < logMessages.length) {
         setLogs(prev => [...prev, logMessages[logCount]]);
         logCount++;
      } else {
         clearInterval(interval);
         setTimeout(() => setIsStressTesting(false), 3000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isStressTesting]);

  const triggerStressTest = () => {
    if (isStressTesting) return;
    setIsStressTesting(true);
    setLogs(prev => [...prev, "", "[SYSTEM] INITIATING STRESS TEST PROTOCOL..."]);
  }

  // Generate multiple packets per edge for heavy traffic feel
  const renderPackets = (edge: any) => {
    const packets = isStressTesting ? [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9] : [0];
    const duration = isStressTesting ? 0.6 : 3;
    const size = isStressTesting ? 3 : 2;
    
    return packets.map((delay, i) => (
      <circle key={`${edge.id}-p-${i}`} r={size} fill={isStressTesting ? "#ef4444" : "#C9A84C"} className="filter drop-shadow-[0_0_8px_#C9A84C]">
        <animateMotion dur={`${duration}s`} begin={`${delay * duration}s`} repeatCount="indefinite">
          <mpath href={`#${edge.id}`} />
        </animateMotion>
      </circle>
    ));
  };

  return (
    <div className="py-20 mb-20 border-t border-b border-cmf-border">
      <div className="mb-20 text-center max-w-2xl mx-auto">
        <span className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] block mb-4">
          INTERACTIVE SIMULATION
        </span>
        <h2 className="heading-display text-4xl md:text-5xl text-cmf-text mb-6">
          Architectural Assembly
        </h2>
        <p className="font-sans font-light text-cmf-text-muted text-lg">
          We construct robust, hyper-scalable digital foundations. Watch the data packets flow through our microservice topology in real-time.
        </p>
      </div>

      {/* Control Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#0a0a0a] p-6 border border-cmf-border rounded-xl">
        <div>
          <h3 className="heading-display text-2xl text-cmf-text mb-2">Microservice Topology</h3>
          <p className="font-sans text-sm text-cmf-text-muted">Live visualization of elastic scaling and dynamic request routing.</p>
        </div>
        <button 
          onClick={triggerStressTest}
          disabled={isStressTesting}
          className={`px-8 py-4 font-mono text-xs tracking-widest uppercase border transition-all duration-300 ${isStressTesting ? 'border-red-500 text-red-500 bg-red-500/10 cursor-not-allowed shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-cmf-gold text-cmf-gold hover:bg-cmf-gold hover:text-black shadow-[0_0_15px_rgba(201,168,76,0.1)]'}`}
        >
          {isStressTesting ? 'Simulation Active...' : 'Initiate Stress Test'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: SVG Topology */}
        <div className="lg:col-span-2 relative w-full aspect-square md:aspect-[10/6] bg-[#050505] border border-cmf-border rounded-xl shadow-2xl overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
              </linearGradient>
            </defs>
            
            {EDGES.map(edge => (
              <g key={edge.id}>
                {/* Visible Path */}
                <path id={edge.id} d={edge.d} fill="none" stroke="url(#edge-grad)" strokeWidth="2" strokeDasharray="4 4" />
                {/* Packets running along path */}
                {renderPackets(edge)}
              </g>
            ))}
          </svg>
          
          {/* HTML Nodes */}
          {NODES.map(node => (
             <div 
                key={node.id} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" 
                style={{ left: `${(node.x / 1000) * 100}%`, top: `${(node.y / 600) * 100}%` }}
             >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border ${node.border} ${node.bg} backdrop-blur-md flex items-center justify-center shadow-lg relative z-10 transition-all duration-300 ${isStressTesting ? 'animate-pulse scale-110 shadow-[0_0_20px_rgba(239,68,68,0.2)] border-red-500/50' : 'hover:scale-110'}`}>
                  <node.icon size={24} className={`${isStressTesting ? 'text-red-400' : node.color}`} />
                  
                  {/* Pinging ring during stress test */}
                  {isStressTesting && (
                    <div className="absolute inset-0 rounded-xl border border-red-500 animate-ping opacity-50"></div>
                  )}
                </div>
                <div className="absolute top-16 md:top-20 whitespace-nowrap text-center bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-cmf-border/50">
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${isStressTesting ? 'text-red-400' : 'text-cmf-text-muted'}`}>{node.label}</span>
                </div>
             </div>
          ))}
        </div>

        {/* Right: Terminal Logs */}
        <div className="lg:col-span-1 bg-[#0a0a0a] border border-cmf-border rounded-xl shadow-2xl h-[400px] lg:h-auto flex flex-col overflow-hidden">
          <div className="bg-[#111] border-b border-cmf-border h-12 flex items-center px-4 gap-2 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            <span className="ml-4 font-mono text-xs text-cmf-text-muted flex items-center gap-2"><TerminalIcon size={12} /> network_monitor.sh</span>
          </div>
          <div className="p-6 font-mono text-[10px] md:text-xs leading-loose flex-1 overflow-y-auto space-y-2">
            {logs.map((log, i) => (
              <div 
                key={i} 
                className={`animate-fade-in-up ${
                  log?.includes('[WARN]') ? 'text-yellow-400' : 
                  log?.includes('[SYSTEM]') ? 'text-cmf-gold' : 
                  log?.includes('STRESS TEST') ? 'text-red-500 font-bold' : 
                  'text-emerald-400'
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
