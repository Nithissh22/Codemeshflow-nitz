import { gsap } from "@/lib/gsap";

export function initThunderAnimation(
  section: HTMLElement,
  headerArea: HTMLElement,
  titleEl: HTMLElement
) {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

  // Split text into characters manually since we don't have premium SplitText
  const text = titleEl.innerText;
  titleEl.innerHTML = "";
  const chars: HTMLSpanElement[] = [];
  
  // Create chars
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.innerText = char === " " ? "\u00A0" : char;
    span.style.opacity = "0";
    span.style.display = "inline-block";
    if (char !== " ") chars.push(span);
    titleEl.appendChild(span);
  });

  // Function to run when section enters view
  const runCinematicSequence = () => {
    if (isReducedMotion || isMobile) {
      // Fallback
      gsap.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.02 });
      return;
    }

    // Set up canvases and flash
    headerArea.style.position = "relative";
    
    const staticCanvas = document.createElement("canvas");
    const boltCanvas = document.createElement("canvas");
    const flashEl = document.createElement("div");

    staticCanvas.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;";
    boltCanvas.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:2;";
    flashEl.style.cssText = "position:absolute; inset:0; background:rgba(230, 200, 100, 0.12); pointer-events:none; z-index:10; opacity:0;";

    headerArea.appendChild(staticCanvas);
    headerArea.appendChild(boltCanvas);
    headerArea.appendChild(flashEl);

    const w = headerArea.offsetWidth;
    const h = headerArea.offsetHeight;
    staticCanvas.width = w;
    staticCanvas.height = h;
    boltCanvas.width = w;
    boltCanvas.height = h;

    const ctxStatic = staticCanvas.getContext("2d");
    const ctxBolt = boltCanvas.getContext("2d");
    if (!ctxStatic || !ctxBolt) return;

    const t0 = gsap.timeline();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ACT 1 — SKY CHARGE EFFECT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    gsap.to(section, {
      backgroundColor: "#030303",
      duration: 0.6,
      ease: "power2.inOut"
    });

    let staticInterval: NodeJS.Timeout;
    const drawStatic = () => {
      ctxStatic.clearRect(0, 0, w, h);
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const alpha = 0.03 + Math.random() * 0.05;
        ctxStatic.fillStyle = `rgba(201,168,76,${alpha})`;
        ctxStatic.fillRect(x, y, 1, 1);
      }
    };
    staticInterval = setInterval(drawStatic, 40);

    setTimeout(() => {
      clearInterval(staticInterval);
      ctxStatic.clearRect(0, 0, w, h);
    }, 550);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ACT 2 — THE LIGHTNING BOLT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Find target point: first "S" in "Selected"
    const firstChar = chars[0];
    const firstCharRect = firstChar.getBoundingClientRect();
    const headerRect = headerArea.getBoundingClientRect();
    
    const endX = firstCharRect.left - headerRect.left + (firstCharRect.width / 2);
    const endY = firstCharRect.top - headerRect.top + (firstCharRect.height / 2); // Roughly baseline/center

    const startX = w * 0.3 + Math.random() * (w * 0.4);
    const startY = -10;

    const generateBolt = (x1: number, y1: number, x2: number, y2: number, roughness: number, depth: number): [number, number][] => {
      if (depth === 0) return [[x1, y1], [x2, y2]];
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * 0.3;
      const left = generateBolt(x1, y1, midX, midY, roughness * 0.6, depth - 1);
      const right = generateBolt(midX, midY, x2, y2, roughness * 0.6, depth - 1);
      return [...left, ...right.slice(1)];
    };

    const mainSegments = generateBolt(startX, startY, endX, endY, 120, 6);

    // Branches
    const branches: {segments: [number, number][]}[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * (mainSegments.length - 10)) + 5;
      const pt = mainSegments[idx];
      const dirX = (Math.random() - 0.5) * 120;
      const dirY = 60 + Math.random() * 60;
      branches.push({
        segments: generateBolt(pt[0], pt[1], pt[0] + dirX, pt[1] + dirY, 40, 3)
      });
    }

    const drawBoltPass = (ctx: CanvasRenderingContext2D, segments: [number, number][], strokeStyle: string, lineWidth: number, blur = 0, opacity = 1, progress = 1) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (blur > 0) ctx.filter = `blur(${blur}px)`;
      
      ctx.beginPath();
      ctx.moveTo(segments[0][0], segments[0][1]);
      const drawCount = Math.max(1, Math.floor(segments.length * progress));
      for (let i = 1; i < drawCount; i++) {
        ctx.lineTo(segments[i][0], segments[i][1]);
      }
      ctx.stroke();
      ctx.restore();
    };

    const obj = { progress: 0 };
    t0.to(obj, {
      progress: 1,
      duration: 0.18,
      ease: "power3.in",
      delay: 0.6, // Start at 0.6s
      onUpdate: () => {
        ctxBolt.clearRect(0, 0, w, h);
        
        // Draw branches first (dimmer)
        branches.forEach(b => {
          drawBoltPass(ctxBolt, b.segments, "rgba(201,168,76,0.3)", 12, 6, 0.4, obj.progress);
          drawBoltPass(ctxBolt, b.segments, "#E8C96A", 0.8, 0, 0.4, obj.progress);
        });

        // Main bolt
        drawBoltPass(ctxBolt, mainSegments, "rgba(201,168,76,0.3)", 12, 6, 1, obj.progress);
        drawBoltPass(ctxBolt, mainSegments, "#E8C96A", 1.5, 0, 1, obj.progress);
      },
      onComplete: () => {
        // Impact flash
        const flashTl = gsap.timeline();
        flashTl.to(flashEl, { opacity: 1, duration: 0.04 })
               .to(flashEl, { opacity: 0, duration: 0.08 })
               .to(flashEl, { opacity: 0.06, duration: 0.04 })
               .to(flashEl, { opacity: 0, duration: 0.12 });

        // ACT 3 — TITLE REVEAL
        chars.forEach((char, i) => {
          gsap.fromTo(char,
            { opacity: 0, filter: "brightness(4)" },
            { opacity: 1, filter: "brightness(1)", duration: 0.35, ease: "power2.out", delay: i * 0.03 }
          );
        });

        // Glow settle on title wrapper
        gsap.fromTo(titleEl,
          { textShadow: "0 0 30px rgba(201,168,76,0.8)" },
          { textShadow: "0 0 0px rgba(201,168,76,0)", duration: 1.2, ease: "power2.out", delay: 0.1 } // Delay until letters show
        );

        // ACT 4 — AFTERGLOW & CRACKLES
        const crackles: [number, number][][] = [];
        for (let i = 0; i < 5; i++) {
          const cx = endX + (Math.random() - 0.5) * 160;
          const cy = endY + (Math.random() - 0.5) * 80;
          crackles.push(generateBolt(cx, cy, cx + (Math.random()-0.5)*40, cy + (Math.random()-0.5)*40, 20, 3));
        }

        crackles.forEach((bolt) => {
          setTimeout(() => {
            const op = 0.3 + Math.random() * 0.3;
            drawBoltPass(ctxBolt, bolt, "rgba(201,168,76,0.8)", 0.8, 0, op, 1);
            setTimeout(() => {
              // We just clear everything roughly by redraw or let it fade out
              // For individual clear we'd need to redraw the main bolt minus this crackle
              // Instead of precise clearing, since the whole canvas fades soon, we just rely on the canvas fade.
              // Wait, the instructions say "visible for only 60-120ms". 
              // We can redraw the main bolt and branches to clear the crackle!
              ctxBolt.clearRect(0, 0, w, h);
              branches.forEach(b => {
                drawBoltPass(ctxBolt, b.segments, "rgba(201,168,76,0.3)", 12, 6, 0.4, 1);
                drawBoltPass(ctxBolt, b.segments, "#E8C96A", 0.8, 0, 0.4, 1);
              });
              drawBoltPass(ctxBolt, mainSegments, "rgba(201,168,76,0.3)", 12, 6, 1, 1);
              drawBoltPass(ctxBolt, mainSegments, "#E8C96A", 1.5, 0, 1, 1);
            }, 60 + Math.random() * 60);
          }, 120 + Math.random() * 900); // offset from 0.78s impact -> 0.9s to 1.8s
        });

        // Background return
        gsap.to(section, {
          backgroundColor: "#080808",
          duration: 1.5,
          delay: 0.4, // Since we are already at 0.78s, 0.4s delay = 1.18s
          ease: "power1.inOut"
        });

        // Canvas fade out
        gsap.to(boltCanvas, {
          opacity: 0,
          duration: 0.8,
          delay: 1.2, // 0.78s + 1.2s = 1.98s ~ 2.0s
          onComplete: () => {
            staticCanvas.remove();
            boltCanvas.remove();
            flashEl.remove();
          }
        });
      }
    });
  };

  // Set up intersection observer
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      runCinematicSequence();
    }
  }, { threshold: 0.3 });

  observer.observe(section);

  return () => {
    observer.disconnect();
  };
}
