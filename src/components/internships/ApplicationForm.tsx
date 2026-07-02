"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";
import { initFlockAnimation } from "@/lib/animations/flockAnimation";

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    portfolio: "",
    sentence: "",
    why: "",
    availability: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const formRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initFlockAnimation(canvasRef.current);
      return cleanup;
    }
  }, []);

  const handleNextStep = (step: number) => {
    if (currentStep < step) {
      setCurrentStep(step);
      // Find the next field and animate it in
      setTimeout(() => {
        const nextField = document.getElementById(`field-${step}`);
        if (nextField) {
          gsap.fromTo(nextField, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
          );
        }
      }, 50);
    }
  };

  const handleSubmit = async () => {
    setStatus("sending");
    
    // Construct WhatsApp message
    const message = `*New Internship Application*
    
*Name:* ${formData.name}
*Role:* ${formData.role}
*Portfolio:* ${formData.portfolio}
*In one sentence:* ${formData.sentence || 'N/A'}
*Why join:* ${formData.why}
*Availability:* ${formData.availability || 'N/A'}
`;

    const whatsappUrl = `https://wa.me/919342607915?text=${encodeURIComponent(message)}`;

    // Simulate short loading before redirect
    setTimeout(() => {
      setStatus("success");
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => {
            formRef.current!.style.display = "none";
            const successState = document.getElementById("success-state");
            if (successState) {
              successState.style.display = "block";
              gsap.fromTo(successState,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
              );
            }
          }
        });
      }
    }, 800);
  };

  return (
    <section id="application-form" className="w-full bg-[#080808] py-[120px] border-b border-[#1a1a1a] relative overflow-hidden">
      
      {/* Dynamic Ambient Background Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />
        
        {/* Subtle moving grid */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,168,76,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Drifting Golden Orbs */}
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] bg-[rgba(201,168,76,0.07)]"
          animate={{
            x: [0, 150, -100, 0],
            y: [0, -100, 150, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ left: '-10%', top: '10%' }}
        />
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] bg-[rgba(201,168,76,0.04)]"
          animate={{
            x: [0, -200, 150, 0],
            y: [0, 150, -100, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ right: '-5%', bottom: '-10%' }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] bg-[rgba(255,255,255,0.015)]"
          animate={{
            x: [0, 100, -150, 0],
            y: [0, 150, -50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ left: '30%', top: '40%' }}
        />
      </div>

      <div className="max-w-[720px] mx-auto px-6 relative z-10">
        
        <div className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] mb-4 text-center">
          START THE CONVERSATION
        </div>

        <h2 className="heading-display-italic text-[48px] md:text-[64px] text-[#EDE8DA] mb-20 text-center">
          Tell us about yourself.
        </h2>

        <div ref={formRef} className="flex flex-col gap-12">
          
          {/* Field 1: Name */}
          <div id="field-1" className="flex flex-col">
            <label className="font-mono text-[9px] tracking-[0.25em] text-cmf-gold mb-2">I AM</label>
            <input 
              type="text" 
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              onBlur={() => { if (formData.name) handleNextStep(2); }}
              onKeyDown={(e) => { if (e.key === 'Enter' && formData.name) handleNextStep(2); }}
              className="bg-transparent border-none border-b border-[rgba(201,168,76,0.2)] py-3 font-sans font-light text-[18px] text-[#EDE8DA] outline-none placeholder-[#5a5040] focus:border-[rgba(201,168,76,0.7)] transition-colors"
            />
          </div>

          {/* Field 2: Role */}
          {currentStep >= 2 && (
            <div id="field-2" className="flex flex-col opacity-0">
              <label className="font-mono text-[9px] tracking-[0.25em] text-cmf-gold mb-2">I WANT TO JOIN AS</label>
              <select 
                value={formData.role}
                onChange={(e) => {
                  setFormData({...formData, role: e.target.value});
                  if (e.target.value) handleNextStep(3);
                }}
                className="bg-transparent border-none border-b border-[rgba(201,168,76,0.2)] py-3 font-sans font-light text-[18px] text-[#EDE8DA] outline-none focus:border-[rgba(201,168,76,0.7)] transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-[#5a5040]">Select a role</option>
                <option value="UI/UX Design" className="bg-[#0f0e0c]">UI/UX Design</option>
                <option value="Frontend Dev" className="bg-[#0f0e0c]">Frontend Dev</option>
                <option value="Motion Intern" className="bg-[#0f0e0c]">Motion Intern</option>
                <option value="Strategy" className="bg-[#0f0e0c]">Strategy</option>
                <option value="Copywriting" className="bg-[#0f0e0c]">Copywriting</option>
              </select>
            </div>
          )}

          {/* Field 3: Portfolio */}
          {currentStep >= 3 && (
            <div id="field-3" className="flex flex-col opacity-0">
              <label className="font-mono text-[9px] tracking-[0.25em] text-cmf-gold mb-2">MY WORK LIVES AT</label>
              <input 
                type="url" 
                placeholder="https://yourportfolio.com"
                value={formData.portfolio}
                onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                onBlur={() => { if (formData.portfolio) handleNextStep(4); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && formData.portfolio) handleNextStep(4); }}
                className="bg-transparent border-none border-b border-[rgba(201,168,76,0.2)] py-3 font-sans font-light text-[18px] text-[#EDE8DA] outline-none placeholder-[#5a5040] focus:border-[rgba(201,168,76,0.7)] transition-colors"
              />
            </div>
          )}

          {/* Field 4: One Sentence */}
          {currentStep >= 4 && (
            <div id="field-4" className="flex flex-col opacity-0 relative">
              <label className="font-mono text-[9px] tracking-[0.25em] text-cmf-gold mb-2">IN ONE SENTENCE, I AM</label>
              <input 
                type="text" 
                maxLength={120}
                placeholder="a designer who..."
                value={formData.sentence}
                onChange={(e) => setFormData({...formData, sentence: e.target.value})}
                onBlur={() => { if (formData.sentence) handleNextStep(5); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && formData.sentence) handleNextStep(5); }}
                className="bg-transparent border-none border-b border-[rgba(201,168,76,0.2)] py-3 font-sans font-light text-[18px] text-[#EDE8DA] outline-none placeholder-[#5a5040] focus:border-[rgba(201,168,76,0.7)] transition-colors pr-16"
              />
              <span className={`absolute bottom-3 right-0 font-mono text-[9px] ${formData.sentence.length > 100 ? 'text-cmf-gold' : 'text-[#5a5040]'}`}>
                {formData.sentence.length} / 120
              </span>
            </div>
          )}

          {/* Field 5: Why */}
          {currentStep >= 5 && (
            <div id="field-5" className="flex flex-col opacity-0">
              <label className="font-mono text-[9px] tracking-[0.25em] text-cmf-gold mb-2">I WANT TO JOIN CODEMESHFLOW BECAUSE</label>
              <textarea 
                rows={4}
                placeholder="Be honest. We read everything."
                value={formData.why}
                onChange={(e) => setFormData({...formData, why: e.target.value})}
                onBlur={() => { if (formData.why) handleNextStep(6); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && formData.why) { e.preventDefault(); handleNextStep(6); } }}
                className="bg-transparent border-none border-b border-[rgba(201,168,76,0.2)] py-3 font-sans font-light text-[18px] text-[#EDE8DA] outline-none placeholder-[#5a5040] focus:border-[rgba(201,168,76,0.7)] transition-colors resize-none"
              ></textarea>
            </div>
          )}

          {/* Field 6: Availability */}
          {currentStep >= 6 && (
            <div id="field-6" className="flex flex-col opacity-0">
              <label className="font-mono text-[9px] tracking-[0.25em] text-cmf-gold mb-4">I CAN START</label>
              <div className="flex flex-wrap gap-4">
                {["IMMEDIATELY", "NEXT MONTH", "IN 3 MONTHS"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFormData({...formData, availability: opt});
                      handleNextStep(7);
                    }}
                    className={`border px-[24px] py-[12px] font-mono text-[10px] tracking-[0.2em] transition-all duration-300 ${
                      formData.availability === opt 
                        ? "bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.5)] text-cmf-gold" 
                        : "border-[rgba(201,168,76,0.2)] text-[#7a6a3a] hover:border-[rgba(201,168,76,0.5)] hover:text-cmf-gold"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {currentStep >= 7 && (
            <div id="field-7" className="mt-8 opacity-0 flex justify-center">
              <button 
                onClick={handleSubmit}
                disabled={status !== "idle"}
                className="group bg-cmf-gold text-[#080808] font-display font-semibold text-[20px] px-[48px] py-[16px] rounded-none hover:bg-[#E8C96A] transition-colors flex items-center gap-4 disabled:opacity-80"
              >
                {status === "idle" && (
                  <>Send my application <span className="group-hover:translate-x-[6px] transition-transform">→</span></>
                )}
                {status === "sending" && (
                  <>Sending<span className="animate-pulse">...</span></>
                )}
                {status === "success" && (
                  <>Received. We'll be in touch. ✦</>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Success State (Hidden initially) */}
        <div id="success-state" className="hidden text-center mt-8">
          <div className="font-display font-semibold text-[48px] text-cmf-gold mb-6">✦</div>
          <h3 className="heading-display-italic text-[36px] text-[#EDE8DA] mb-6">Application received.</h3>
          <p className="font-sans font-light text-[15px] text-[#7a7468] max-w-[400px] mx-auto mb-12 leading-relaxed">
            We review every submission personally. If there's a fit, you'll hear from us within 7 days.
          </p>
          <p className="font-sans font-light text-[15px] text-[#7a7468]">
            While you wait — follow our work on <br/>
            <a href="#" className="text-cmf-gold hover:underline">Instagram</a> and <a href="#" className="text-cmf-gold hover:underline">LinkedIn</a>
          </p>
        </div>

      </div>
    </section>
  );
}
