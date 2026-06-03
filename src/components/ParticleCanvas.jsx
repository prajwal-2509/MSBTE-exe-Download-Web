import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 220;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const SHAPES = ['circle', 'diamond', 'circle', 'circle']; // more circles for subtle look

const COLORS = [
  'rgba(99,102,241,0.45)',   // indigo
  'rgba(139,92,246,0.40)',   // violet
  'rgba(249,115,22,0.35)',   // orange
  'rgba(59,130,246,0.38)',   // blue
  'rgba(168,85,247,0.35)',   // purple
  'rgba(99,102,241,0.25)',   // soft indigo
  'rgba(234,179,8,0.30)',    // amber
];

function createParticle(width, height) {
  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    size: randomBetween(3, 9),
    speedX: randomBetween(-0.25, 0.25),
    speedY: randomBetween(-0.55, -0.15),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    alpha: randomBetween(0.5, 1.0),
    alphaSpeed: randomBetween(0.003, 0.008),
    alphaDir: Math.random() > 0.5 ? 1 : -1,
    life: randomBetween(0, 1),
  };
}

function drawParticle(ctx, p) {
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;
  ctx.beginPath();

  if (p.shape === 'diamond') {
    const s = p.size;
    ctx.moveTo(p.x, p.y - s);
    ctx.lineTo(p.x + s * 0.6, p.y);
    ctx.lineTo(p.x, p.y + s);
    ctx.lineTo(p.x - s * 0.6, p.y);
    ctx.closePath();
  } else {
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  }

  ctx.fill();
  ctx.globalAlpha = 1;
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Repopulate on resize
      particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      );
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };
    window.addEventListener('mouseleave', onMouseLeave);

    const REPULSION_RADIUS = 120;
    const REPULSION_STRENGTH = 3.5;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSION_RADIUS) {
          const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * REPULSION_STRENGTH;
          p.y += Math.sin(angle) * force * REPULSION_STRENGTH;
        }

        // Drift upward
        p.x += p.speedX;
        p.y += p.speedY;

        // Alpha pulse
        p.alpha += p.alphaSpeed * p.alphaDir;
        if (p.alpha >= 1.0) { p.alphaDir = -1; p.alpha = 1.0; }
        if (p.alpha <= 0.3) { p.alphaDir = 1; }

        // Reset if floated above screen
        if (p.y < -p.size * 2) {
          particles.current[i] = createParticle(canvas.width, canvas.height);
          particles.current[i].y = canvas.height + p.size;
        }
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;

        drawParticle(ctx, p);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
