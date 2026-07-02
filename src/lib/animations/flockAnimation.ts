export function initFlockAnimation(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let rafId: number;
  let isPaused = false;
  
  // Resize handler
  const resize = () => {
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
  };
  window.addEventListener('resize', resize);
  resize();

  const numBirds = 150; // plenty of birds
  const birds: any[] = [];

  for (let i = 0; i < numBirds; i++) {
    birds.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5 - 1, // Mostly moving left
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1.5,
      flapSpeed: Math.random() * 0.1 + 0.05,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.1
    });
  }

  const renderLoop = () => {
    if (!isPaused && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      birds.forEach(bird => {
        // Move
        bird.x += bird.vx;
        bird.y += bird.vy;

        // Wrap around
        if (bird.x < -20) bird.x = canvas.width + 20;
        if (bird.x > canvas.width + 20) bird.x = -20;
        if (bird.y < -20) bird.y = canvas.height + 20;
        if (bird.y > canvas.height + 20) bird.y = -20;

        // Draw bird
        bird.phase += bird.flapSpeed;
        const wingY = Math.sin(bird.phase) * bird.size; // Flap offset

        ctx.beginPath();
        ctx.strokeStyle = `rgba(201, 168, 76, ${bird.opacity})`;
        ctx.lineWidth = 1;
        
        // Left wing tip
        ctx.moveTo(bird.x - bird.size * 2, bird.y - wingY);
        // Center body
        ctx.quadraticCurveTo(bird.x - bird.size, bird.y, bird.x, bird.y + bird.size * 0.5);
        // Right wing tip
        ctx.quadraticCurveTo(bird.x + bird.size, bird.y, bird.x + bird.size * 2, bird.y - wingY);
        
        ctx.stroke();
      });
    }
    rafId = requestAnimationFrame(renderLoop);
  };

  renderLoop();

  const observer = new IntersectionObserver((entries) => {
    isPaused = !entries[0].isIntersecting;
  });
  observer.observe(canvas);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    observer.disconnect();
  };
}
