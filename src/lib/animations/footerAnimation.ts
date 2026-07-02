import { gsap } from "@/lib/gsap";

export function initFooterAnimation(
  section: HTMLElement,
  canvas: HTMLCanvasElement,
  sweepElements: HTMLElement[]
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  let rafId: number;
  let isPaused = false;
  let sweepX = -10;
  
  // Track which elements we've already swept to avoid re-triggering constantly
  const sweptState = new Map<HTMLElement, boolean>();

  let canvasRect = canvas.getBoundingClientRect();
  const updateRect = () => { canvasRect = canvas.getBoundingClientRect(); };
  window.addEventListener('scroll', updateRect, { passive: true });

  interface DriftParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    opacity: number;
  }

  const particles: DriftParticle[] = [];

  const resize = () => {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  // Init particles
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height, // start distributed
      vx: (Math.random() - 0.5) * 0.2,
      vy: 0.2 + Math.random() * 0.4,
      opacity: 0.06 + Math.random() * 0.09
    });
  }

  const handleVisibilityChange = () => {
    isPaused = document.visibilityState === "hidden";
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  const draw = () => {
    if (!ctx || isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isReducedMotion) {
      // 6 seconds per sweep (approx 360 frames at 60fps)
      // canvas.width + 20 in 360 frames = (canvas.width + 20) / 360 px per frame
      sweepX += (canvas.width + 20) / 360;
      
      if (sweepX > canvas.width + 10) {
        sweepX = -10;
        // Reset element triggers
        sweepElements.forEach(el => sweptState.set(el, false));
      }

      // Check element collisions
      sweepElements.forEach(el => {
        if (!el || sweptState.get(el)) return;
        
        const rect = el.getBoundingClientRect();
        
        const elLeft = rect.left - canvasRect.left;
        const elRight = elLeft + rect.width;
        
        // If the sweep leading edge (x+40) passes the center of the element
        const elCenter = elLeft + rect.width / 2;
        
        if (sweepX + 40 > elCenter) {
          sweptState.set(el, true);
          
          // GSAP opacity bump
          const currentOpacity = window.getComputedStyle(el).opacity;
          const base = currentOpacity ? parseFloat(currentOpacity) : 1;
          
          gsap.fromTo(el,
            { opacity: base },
            { opacity: Math.min(1, base + 0.3), duration: 0.15, yoyo: true, repeat: 1, ease: "none" }
          );
        }
      });
    }

    // Draw Sweep Line
    if (!isReducedMotion) {
      const y = canvas.height * 0.4;
      const gradient = ctx.createLinearGradient(sweepX - 120, y, sweepX + 40, y);
      gradient.addColorStop(0, `rgba(201, 168, 76, 0)`);
      gradient.addColorStop(0.6, `rgba(201, 168, 76, 0.08)`);
      gradient.addColorStop(0.85, `rgba(201, 168, 76, 0.18)`);
      gradient.addColorStop(1, `rgba(201, 168, 76, 0.06)`);

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.moveTo(sweepX - 120, y);
      ctx.lineTo(sweepX + 40, y);
      ctx.stroke();
    }

    // Draw Particles
    ctx.fillStyle = "#C9A84C";
    particles.forEach(p => {
      if (!isReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > canvas.height + 2) {
          p.y = -2;
          p.x = Math.random() * canvas.width;
          p.vx = (Math.random() - 0.5) * 0.2;
          p.vy = 0.2 + Math.random() * 0.4;
          p.opacity = 0.06 + Math.random() * 0.09;
        }
      }

      ctx.globalAlpha = p.opacity;
      ctx.fillRect(p.x, p.y, 1, 1);
    });
    ctx.globalAlpha = 1;

    if (!isReducedMotion) {
      rafId = requestAnimationFrame(draw);
    } else {
      draw(); // Static frame
    }
  };

  if (!isReducedMotion) {
    // Initial reset
    sweepElements.forEach(el => sweptState.set(el, false));
    rafId = requestAnimationFrame(draw);
  } else {
    draw();
  }

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", updateRect);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
