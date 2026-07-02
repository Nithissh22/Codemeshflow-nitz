export function initContactAnimation(
  section: HTMLElement,
  canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  let rafId: number;
  let isPaused = false;

  let wellX = window.innerWidth / 2;
  let wellY = window.innerHeight / 2;
  let targetWellX = wellX;
  let targetWellY = wellY;

  let canvasRect = canvas.getBoundingClientRect();
  const updateRect = () => { canvasRect = canvas.getBoundingClientRect(); };
  window.addEventListener('scroll', updateRect, { passive: true });

  const resize = () => {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    updateRect();
    if (targetWellX === wellX) {
      targetWellX = canvas.width / 2;
      targetWellY = canvas.height / 2;
      wellX = targetWellX;
      wellY = targetWellY;
    }
  };
  window.addEventListener("resize", resize);
  resize();

  const handleVisibilityChange = () => {
    isPaused = document.visibilityState === "hidden";
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  let lastMove = 0;
  const handleMouseMove = (e: MouseEvent) => {
    if (isMobile || isReducedMotion) return;
    const now = Date.now();
    if (now - lastMove < 16) return;
    lastMove = now;
    
    targetWellX = e.clientX - canvasRect.left;
    targetWellY = e.clientY - canvasRect.top;
  };

  const handleMouseLeave = () => {
    targetWellX = canvas.width / 2;
    targetWellY = canvas.height / 2;
  };

  if (!isMobile && !isReducedMotion) {
    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
  }

  interface Pulse {
    progress: number;
    speed: number;
    size: number;
    opacity: number;
  }
  let pulses: Pulse[] = [];

  const spawnPulse = () => {
    if (pulses.length >= 15) return;
    if (Math.random() > 0.05) return;
    pulses.push({
      progress: 0,
      speed: 0.003 + Math.random() * 0.004,
      size: 2 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.6
    });
  };

  const getBezierPoint = (t: number, p0: number[], p1: number[], p2: number[], p3: number[]) => {
    const cX = 3 * (p1[0] - p0[0]);
    const bX = 3 * (p2[0] - p1[0]) - cX;
    const aX = p3[0] - p0[0] - cX - bX;

    const cY = 3 * (p1[1] - p0[1]);
    const bY = 3 * (p2[1] - p1[1]) - cY;
    const aY = p3[1] - p0[1] - cY - bY;

    const x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0[0];
    const y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0[1];

    return { x, y };
  };

  const draw = (time: number) => {
    if (!ctx || isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isReducedMotion) {
      wellX += (targetWellX - wellX) * 0.04;
      wellY += (targetWellY - wellY) * 0.04;
      spawnPulse();
    } else {
      wellX = canvas.width / 2;
      wellY = canvas.height / 2;
    }

    const startY1 = canvas.height / 2 + Math.sin(time / 1000) * 30;
    const startY2 = canvas.height / 2 + Math.cos(time / 1200) * 30;

    // Control points for Wire 1 (Input)
    const p0_1 = [0, startY1];
    const p1_1 = [canvas.width / 3, startY1];
    const p2_1 = [wellX - 100, wellY];
    const p3_1 = [wellX, wellY];

    // Control points for Wire 2 (Output)
    const p0_2 = [wellX, wellY];
    const p1_2 = [wellX + 100, wellY];
    const p2_2 = [canvas.width - canvas.width / 3, startY2];
    const p3_2 = [canvas.width, startY2];

    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";

    // Draw Wire 1
    ctx.beginPath();
    ctx.moveTo(p0_1[0], p0_1[1]);
    ctx.bezierCurveTo(p1_1[0], p1_1[1], p2_1[0], p2_1[1], p3_1[0], p3_1[1]);
    ctx.strokeStyle = "rgba(201, 168, 76, 0.25)";
    ctx.stroke();

    // Draw Wire 2
    ctx.beginPath();
    ctx.moveTo(p0_2[0], p0_2[1]);
    ctx.bezierCurveTo(p1_2[0], p1_2[1], p2_2[0], p2_2[1], p3_2[0], p3_2[1]);
    ctx.strokeStyle = "rgba(201, 168, 76, 0.25)";
    ctx.stroke();

    // Draw Pulses
    pulses.forEach(p => {
      p.progress += p.speed;
      
      let pos;
      if (p.progress <= 0.5) {
        // First half: Wire 1
        const t = p.progress * 2;
        pos = getBezierPoint(t, p0_1, p1_1, p2_1, p3_1);
      } else {
        // Second half: Wire 2
        const t = (p.progress - 0.5) * 2;
        pos = getBezierPoint(t, p0_2, p1_2, p2_2, p3_2);
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
      ctx.shadowColor = "#C9A84C";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    });

    pulses = pulses.filter(p => p.progress < 1);

    // Draw Connection Node
    const timeSec = time / 1000;
    
    const pulseRadius = 6 + Math.sin(timeSec * 4) * 2;
    ctx.beginPath();
    ctx.arc(wellX, wellY, pulseRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(201, 168, 76, 0.8)";
    ctx.shadowColor = "#C9A84C";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(wellX, wellY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Outer faint ring
    ctx.beginPath();
    ctx.arc(wellX, wellY, pulseRadius * 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(201, 168, 76, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (!isReducedMotion) {
      rafId = requestAnimationFrame(draw);
    } else {
      draw(time);
    }
  };

  if (!isReducedMotion) {
    rafId = requestAnimationFrame(draw);
  } else {
    for(let i=0; i<5; i++) {
      pulses.push({ progress: Math.random(), speed: 0, size: 3, opacity: 0.5 });
    }
    draw(0);
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
