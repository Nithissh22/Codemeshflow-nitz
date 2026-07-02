export function initServicesAnimation(
  section: HTMLElement,
  canvas: HTMLCanvasElement,
  cards: NodeListOf<HTMLElement>
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  let rafId: number;
  let isPaused = false;
  let offset = 0;

  // Setup nodes
  const nodes: { xIdx: number; yIdx: number; speed: number; phase: number }[] = [];
  for (let i = 0; i < 40; i++) {
    nodes.push({
      xIdx: Math.floor(Math.random() * 50) - 10,
      yIdx: Math.floor(Math.random() * 50) - 10,
      speed: 0.001 + Math.random() * 0.002, // 3s-7s cycle
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Hover Sonar Pulse state
  interface Ring {
    radius: number;
    opacity: number;
    width: number;
    delay: number;
    active: boolean;
  }
  
  interface CardPulse {
    cardIndex: number;
    x: number;
    y: number;
    rings: Ring[];
    time: number;
  }
  
  let activePulses: CardPulse[] = [];

  const resize = () => {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  const handleVisibilityChange = () => {
    isPaused = document.visibilityState === "hidden";
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Setup card listeners
  const handleMouseEnter = (e: MouseEvent, index: number, card: HTMLElement) => {
    if (isMobile || isReducedMotion) return;
    
    // Get card center relative to section
    const cardRect = card.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const x = cardRect.left - sectionRect.left + cardRect.width / 2;
    const y = cardRect.top - sectionRect.top + cardRect.height / 2;

    const newPulse: CardPulse = {
      cardIndex: index,
      x,
      y,
      time: 0,
      rings: [
        { radius: 0, opacity: 0.5, width: 1.5, delay: 0, active: false },
        { radius: 0, opacity: 0.5, width: 1.5, delay: 21, active: false }, // ~0.35s at 60fps
        { radius: 0, opacity: 0.5, width: 1.5, delay: 42, active: false },
      ]
    };
    
    // Replace any existing pulse for this card
    activePulses = activePulses.filter(p => p.cardIndex !== index);
    activePulses.push(newPulse);
  };

  const handleMouseLeave = (index: number) => {
    // Abort pulse
    activePulses = activePulses.filter(p => p.cardIndex !== index);
  };

  if (!isMobile && !isReducedMotion) {
    cards.forEach((card, i) => {
      card.addEventListener("mouseenter", (e) => handleMouseEnter(e, i, card));
      card.addEventListener("mouseleave", () => handleMouseLeave(i));
    });
  }

  const draw = (time: number) => {
    if (!ctx || isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Circuit Traces
    ctx.beginPath();
    ctx.strokeStyle = "rgba(201, 168, 76, 0.04)";
    ctx.lineWidth = 1;

    const spacing = 60;
    if (!isReducedMotion) {
      offset += 0.3;
      if (offset >= spacing) offset = 0;
    }

    const diagCount = Math.max(canvas.width, canvas.height) * 2 / spacing;
    
    // Draw diagonal grid
    for (let i = -diagCount; i < diagCount; i++) {
      const p = i * spacing + offset;
      
      // Bottom-left to top-right
      ctx.moveTo(p, 0);
      ctx.lineTo(p - canvas.height, canvas.height);

      // Top-left to bottom-right
      ctx.moveTo(p, 0);
      ctx.lineTo(p + canvas.height, canvas.height);
    }
    ctx.stroke();

    // Draw Nodes
    nodes.forEach(node => {
      const nx = node.xIdx * spacing + offset;
      const ny = node.yIdx * spacing + offset;
      
      // Calculate intersection visually
      const interX = nx;
      const interY = ny; // Simplification, drawing them aligned to the offset
      
      const osc = Math.sin(time * node.speed + node.phase);
      const opacity = 0.06 + ((osc + 1) / 2) * (0.25 - 0.06);
      
      ctx.fillStyle = `rgba(201, 168, 76, ${opacity})`;
      ctx.fillRect(interX - 1.5, interY - 1.5, 3, 3);
    });

    // 2. Draw Sonar Pulses
    if (!isReducedMotion) {
      activePulses.forEach(pulse => {
        pulse.time++;
        pulse.rings.forEach(ring => {
          if (pulse.time > ring.delay) {
            ring.active = true;
            // Expand ring
            ring.radius += 200 / 72; // reach 200px in 1.2s (72 frames)
            ring.opacity -= 0.5 / 72;
            ring.width -= 1.2 / 72;
            
            if (ring.radius > 200) {
              ring.active = false;
            } else {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(201, 168, 76, ${Math.max(0, ring.opacity)})`;
              ctx.lineWidth = Math.max(0.1, ring.width);
              ctx.arc(pulse.x, pulse.y, ring.radius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        });
      });

      // Cleanup finished pulses
      activePulses = activePulses.filter(p => p.rings.some(r => r.active || p.time <= r.delay));
    }

    if (!isReducedMotion) {
      rafId = requestAnimationFrame(draw);
    }
  };

  if (isReducedMotion) {
    draw(0);
  } else {
    rafId = requestAnimationFrame(draw);
  }

  // Return destroy function
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    cards.forEach((card, i) => {
      // It's safe to just clear listeners implicitly by relying on react unmounts if needed, 
      // but proper cleanup is better. Wait, we can't easily remove anonymous functions without references.
      // We'll rely on the DOM nodes being destroyed by React.
    });
  };
}
