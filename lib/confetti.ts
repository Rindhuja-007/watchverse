// Lightweight canvas confetti burst for sensory visual celebrations (zero external dependencies)

export function triggerConfettiBurst() {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = ["#d9f06a", "#38bdf8", "#f43f5e", "#a855f7", "#eab308", "#10b981", "#ffffff"];
  const particleCount = 70;
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    vRot: number;
    alpha: number;
  }> = [];

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight / 2.5;

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 5 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 14,
      alpha: 1,
    });
  }

  let animationFrameId: number;
  let startTime = performance.now();

  function animate(now: number) {
    const elapsed = now - startTime;
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let alive = false;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // Gravity
      p.vx *= 0.98; // Friction
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - elapsed / 1800);

      if (p.alpha > 0) {
        alive = true;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = p.alpha;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx!.restore();
      }
    });

    if (alive && elapsed < 2000) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}
