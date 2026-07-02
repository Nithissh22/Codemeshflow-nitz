export function initWorkAnimation(
  section: HTMLElement,
  canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  let rafId: number;
  let isPaused = false;
  let frameCount = 0;

  // Spotlight state
  let targetX = window.innerWidth / 2;
  let currentX = window.innerWidth / 2;
  let targetOpacity = 0;
  let currentOpacity = 0;

  let sectionRect = section.getBoundingClientRect();
  const updateRect = () => { sectionRect = section.getBoundingClientRect(); };
  window.addEventListener('scroll', updateRect, { passive: true });

  const resize = () => {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    updateRect();
  };
  window.addEventListener("resize", resize);
  resize();

  const handleVisibilityChange = () => {
    isPaused = document.visibilityState === "hidden";
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Spotlight mouse tracking
  let lastMove = 0;
  const handleMouseMove = (e: MouseEvent) => {
    if (isMobile || isReducedMotion) return;
    const now = Date.now();
    if (now - lastMove < 16) return;
    lastMove = now;

    targetX = e.clientX - sectionRect.left;
    targetOpacity = 1;
  };

  const handleMouseLeave = () => {
    targetOpacity = 0;
  };

  if (!isMobile && !isReducedMotion) {
    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    section.addEventListener("mouseenter", () => { targetOpacity = 1; });
  }

  const drawGrain = () => {
    // Fill canvas with clearRect
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Film grain
    const size = 3;
    const cols = Math.ceil(canvas.width / size);
    const rows = Math.ceil(canvas.height / size);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const opacity = Math.random() * 0.018;
        if (opacity > 0.005) { // Optimization: only draw if > 0.005
          ctx.fillStyle = `rgba(201, 168, 76, ${opacity})`;
          ctx.fillRect(i * size, j * size, size, size);
        }
      }
    }
  };

  // We need to keep grain persistent if we don't redraw it every frame, 
  // but if we only clearRect and drawGrain every 3 frames, the spotlight will be sluggish/choppy if it relies on the same canvas.
  // Wait, if the spotlight is on the same canvas, we MUST clear and redraw every frame.
  // We can cache the grain into an OffscreenCanvas or just redraw the spotlight over the grain, 
  // but since we clearRect, we lose the grain. 
  // The brief says "Fill canvas with ctx.clearRect... every 3 frames". If we clear every 3 frames, frames 1 and 2 keep the old grain + old spotlight.
  // To have smooth spotlight but 3-frame grain, we need to draw the spotlight every frame, but draw the grain from a cached image buffer, OR use two canvases.
  // The brief specified "BACKGROUND - FILM GRAIN (Canvas 2D, full section)".
  // Let's use a cached offscreen canvas for the grain that updates every 3 frames.
  
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const grainCtx = grainCanvas.getContext("2d");
  
  if (grainCtx) {
    const size = 3;
    for (let i = 0; i < 256; i += size) {
      for (let j = 0; j < 256; j += size) {
        const opacity = Math.random() * 0.018;
        if (opacity > 0.005) {
          grainCtx.fillStyle = `rgba(201, 168, 76, ${opacity})`;
          grainCtx.fillRect(i, j, size, size);
        }
      }
    }
  }

  let patternOffset = { x: 0, y: 0 };
  let pattern: CanvasPattern | null = null;

  const draw = () => {
    if (!ctx || isPaused) return;

    if (!isReducedMotion) {
      frameCount++;
      if (frameCount % 3 === 0) {
        patternOffset.x = Math.floor(Math.random() * 256);
        patternOffset.y = Math.floor(Math.random() * 256);
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grain buffer
    if (!pattern) pattern = ctx.createPattern(grainCanvas, "repeat");
    if (pattern) {
      ctx.save();
      ctx.translate(-patternOffset.x, -patternOffset.y);
      ctx.fillStyle = pattern;
      ctx.fillRect(patternOffset.x, patternOffset.y, canvas.width, canvas.height);
      ctx.restore();
    }

    // Draw spotlight
    if (!isMobile && !isReducedMotion) {
      currentX += (targetX - currentX) * 0.06;
      currentOpacity += (targetOpacity - currentOpacity) * 0.06;

      if (currentOpacity > 0.01) {
        const gradient = ctx.createLinearGradient(currentX - 180, 0, currentX + 180, 0);
        gradient.addColorStop(0, `rgba(201, 168, 76, 0)`);
        gradient.addColorStop(0.35, `rgba(201, 168, 76, ${0.04 * currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(201, 168, 76, ${0.07 * currentOpacity})`);
        gradient.addColorStop(0.65, `rgba(201, 168, 76, ${0.04 * currentOpacity})`);
        gradient.addColorStop(1, `rgba(201, 168, 76, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(currentX - 180, 0, 360, canvas.height);
      }
    }

    if (!isReducedMotion) rafId = requestAnimationFrame(draw);
  };

  if (isReducedMotion) {
    draw();
  } else {
    rafId = requestAnimationFrame(draw);
  }

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", updateRect);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    if (!isMobile && !isReducedMotion) {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      section.removeEventListener("mouseenter", () => { targetOpacity = 1; });
    }
  };
}
