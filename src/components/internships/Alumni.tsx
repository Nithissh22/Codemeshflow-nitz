"use client";

export default function Alumni() {
  const ALUMNI = [
    {
      name: "Arjun M.",
      role: "UI/UX Intern → 2023",
      quote: "Shipped 3 live projects in 12 weeks. Now at a Series B startup as lead designer."
    },
    {
      name: "Priya K.",
      role: "Frontend Intern → 2023",
      quote: "Learned more in 3 months than 2 years of college. Portfolio went from zero to hired."
    },
    {
      name: "Rahul S.",
      role: "Motion Intern → 2024",
      quote: "They trusted me with client-facing animations in week 2. That trust changed everything."
    }
  ];

  return (
    <section className="w-full bg-[#080808] py-[120px] border-b border-cmf-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        <div className="label-mono text-[10px] text-cmf-gold tracking-[0.3em] mb-4">
          ALUMNI
        </div>

        <h2 className="heading-display-italic text-[36px] md:text-[42px] text-[#EDE8DA] mb-12">
          Where they went next
        </h2>

        <div className="flex flex-col border-t border-cmf-border">
          {ALUMNI.map((person, i) => (
            <div 
              key={i} 
              className="group relative border-b border-cmf-border overflow-hidden transition-[height,background] duration-500 hover:bg-[#0a0a0a] h-[80px] hover:h-[140px]"
            >
              <div className="absolute top-0 left-0 w-full h-[80px] flex items-center px-4 md:px-8">
                
                <div className="flex items-center w-full md:w-[300px]">
                  <h3 className="heading-display text-[20px] text-[#EDE8DA] group-hover:text-cmf-gold transition-colors">
                    {person.name}
                  </h3>
                </div>

                <div className="hidden md:block">
                  <span className="font-mono text-[9px] text-[#7a6a3a] tracking-[0.2em] uppercase">
                    {person.role}
                  </span>
                </div>

              </div>

              <div className="absolute top-[80px] left-0 w-full h-[60px] px-4 md:px-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <p className="font-sans font-light italic text-[14px] text-[#b0a890]">
                  "{person.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
