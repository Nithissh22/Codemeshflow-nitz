export function initStatsAnimation(
  section: HTMLElement,
  canvas: HTMLCanvasElement,
  statCards: HTMLElement[]
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  let rafId: number;
  let isPaused = false;

  interface Particle {
    cardIndex: number;
    orbitTarget: number;
    orbitRadius: number; // Current radius
    orbitSpeed: number;
    angle: number;
    size: number;
    opacity: number;
    char: string;
    offsetX: number;
    offsetY: number;
    delayStart: number;
    born: number;
  }

  let particles: Particle[] = [];
  const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "%", "/"];

  let sectionRect = section.getBoundingClientRect();
  const updateRect = () => { sectionRect = section.getBoundingClientRect(); };
  window.addEventListener('scroll', updateRect, { passive: true });

  const resize = () => {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    
    // Re-anchor (we just calculate anchors on the fly during draw to be resize-safe)
  };
  window.addEventListener("resize", resize);

  // Setup
  statCards.forEach((card, idx) => {
    for (let i = 0; i < 20; i++) {
      particles.push({
        cardIndex: idx,
        orbitTarget: 40 + Math.random() * 80,
        orbitRadius: 0,
        orbitSpeed: 0.003 + Math.random() * 0.005,
        angle: Math.random() * Math.PI * 2,
        size: 1 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.25,
        char: chars[Math.floor(Math.random() * chars.length)],
        offsetX: 0,
        offsetY: 0,
        delayStart: Math.random() * 600,
        born: Date.now()
      });
    }
  });

  const handleVisibilityChange = () => {
    isPaused = document.visibilityState === "hidden";
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Mouse Gravity
  let mouseX = -1000;
  let mouseY = -1000;
  let targetIntensity = 0;

  let lastMove = 0;
  const handleMouseMove = (e: MouseEvent) => {
    if (isMobile || isReducedMotion) return;
    const now = Date.now();
    if (now - lastMove < 16) return;
    lastMove = now;

    mouseX = e.clientX - sectionRect.left;
    mouseY = e.clientY - sectionRect.top;
    targetIntensity = 1;
  };

  const handleMouseLeave = () => {
    mouseX = -1000;
    mouseY = -1000;
  };

  if (!isMobile && !isReducedMotion) {
    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
  }

  // Draw loop
  const draw = () => {
    if (!ctx || isPaused) return;
    
    // Adjust canvas bounds if needed (e.g. initial load)
    if (canvas.width !== section.offsetWidth) resize();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const now = Date.now();

    ctx.font = "8px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    particles.forEach(p => {
      // 1. Expansion animation
      if (now - p.born > p.delayStart && p.orbitRadius < p.orbitTarget) {
        p.orbitRadius += (p.orbitTarget - p.orbitRadius) * 0.05;
      }

      p.angle += p.orbitSpeed;

      // Calculate anchor relative to canvas
      const card = statCards[p.cardIndex];
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const anchorX = cardRect.left - sectionRect.left + cardRect.width / 2;
      const anchorY = cardRect.top - sectionRect.top + cardRect.height / 2;

      // Base position
      const baseXP = anchorX + Math.cos(p.angle) * p.orbitRadius;
      const baseYP = anchorY + Math.sin(p.angle) * p.orbitRadius;

      // Mouse Pull
      if (!isMobile && !isReducedMotion) {
        const dx = mouseX - baseXP;
        const dy = mouseY - baseYP;
        const dist = Math.hypot(dx, dy);

        if (dist < 120) {
          const pull = (120 - dist) / 120;
          p.offsetX += dx * pull * 0.15;
          p.offsetY += dy * pull * 0.15;
        }

        // Spring decay
        p.offsetX *= 0.88;
        p.offsetY *= 0.88;
      }

      // Draw
      ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
      ctx.fillText(p.char, baseXP + p.offsetX, baseYP + p.offsetY);
    });

    if (!isReducedMotion) rafId = requestAnimationFrame(draw);
  };

  if (!isReducedMotion) {
    rafId = requestAnimationFrame(draw);
  } else {
    // Jump straight to target for static frame
    particles.forEach(p => p.orbitRadius = p.orbitTarget);
    draw();
  }

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", updateRect);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    if (!isMobile && !isReducedMotion) {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    }
  };
}
