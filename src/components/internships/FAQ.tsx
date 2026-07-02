"use client";

import { useState, useRef } from "react";
import { gsap } from "@/lib/gsap";

const FAQS = [
  {
    q: "Is this a paid internship?",
    a: "Yes. Stipend varies by role and experience. Discussed during the interview stage."
  },
  {
    q: "Can I apply if I'm still in college?",
    a: "Absolutely. Pre-final and final year students are welcome. We work around academic schedules for the right candidate."
  },
  {
    q: "Is relocation required?",
    a: "Remote roles are fully remote. Hybrid roles are Chennai-based. We'll always specify clearly in the listing."
  },
  {
    q: "How competitive is selection?",
    a: "We receive many applications and select 4. We'd rather tell you it's competitive than pretend otherwise."
  },
  {
    q: "Can this lead to a full-time role?",
    a: "Two of our current full-time team members started as interns. We don't promise it, but we don't rule it out either."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (index: number) => {
    const isOpening = openIndex !== index;
    
    if (openIndex !== null && openIndex !== index && contentRefs.current[openIndex]) {
      gsap.to(contentRefs.current[openIndex], {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }

    if (isOpening && contentRefs.current[index]) {
      gsap.fromTo(contentRefs.current[index],
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      setOpenIndex(index);
    } else {
      if (contentRefs.current[index]) {
        gsap.to(contentRefs.current[index], {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      }
      setOpenIndex(null);
    }
  };

  return (
    <section className="w-full bg-[#0a0a0a] py-[120px]">
      <div className="max-w-[720px] mx-auto px-6">
        
        <h2 className="heading-display-italic text-[36px] md:text-[48px] text-[#EDE8DA] mb-16 text-center">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col border-t border-[rgba(201,168,76,0.12)]">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-[rgba(201,168,76,0.12)]">
                <button 
                  onClick={() => toggleAccordion(i)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="font-display font-normal text-[20px] text-[#EDE8DA] group-hover:text-cmf-gold transition-colors">
                    {faq.q}
                  </span>
                  <span 
                    className={`text-[24px] font-light transition-all duration-300 transform ${isOpen ? 'rotate-45 text-cmf-gold' : 'text-[#7a6a3a]'}`}
                  >
                    +
                  </span>
                </button>
                <div 
                  ref={el => { contentRefs.current[i] = el; }}
                  className="h-0 opacity-0 overflow-hidden"
                >
                  <p className="font-sans font-light text-[14px] text-[#7a7468] pb-6 leading-relaxed pr-8">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
