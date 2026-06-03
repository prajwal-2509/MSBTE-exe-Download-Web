import React, { useEffect, useRef } from 'react';

// ─── Particle configuration ───────────────────────────────────────────────────
const COUNT        = 180;
const REPEL_RADIUS = 110;
const REPEL_FORCE  = 4.2;

const PALETTE = [
  'rgba(99,102,241,0.50)',  // indigo
  'rgba(139,92,246,0.45)',  // violet
  'rgba(168,85,247,0.40)',  // purple
  'rgba(59,130,246,0.42)',  // blue
  'rgba(234,179,8,0.38)',   // gold/amber
  'rgba(249,115,22,0.35)',  // orange
  'rgba(99,102,241,0.28)',  // soft indigo
];

const SHAPE_TYPES = ['dot', 'dot', 'dot', 'cross', 'triangle']; // weighted toward dots

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function makeParticle(W, H) {
  const size   = rand(2.5, 7);
  const shape  = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
  const color  = PALETTE[Math.floor(Math.random() * PALETTE.length)];

  return {
    x:      rand(0, W),
    y:      rand(0, H),
    ox:     0,                // will be set below
    oy:     0,
    vx:     rand(-0.18, 0.18),
    vy:     rand(-0.5, -0.15),
    size,
    shape,
    color,
    alpha:      rand(0.45, 0.95),
    alphaDir:   Math.random() > 0.5 ? 1 : -1,
    alphaSpd:   rand(0.004, 0.009),
    // repulsion velocity (decays back to 0)
    rvx: 0,
    rvy: 0,
  };
}

function initParticles(W, H) {
  return Array.from({ length: COUNT }, () => {
    const p = makeParticle(W, H);
    p.ox = p.x;
    p.oy = p.y;
    return p;
  });
}

function drawShape(ctx, p) {
  const { x, y, size, shape, color, alpha } = p;
  ctx.globalAlpha = alpha;
  ctx.fillStyle   = color;
  ctx.strokeStyle = color;

  if (shape === 'dot') {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

  } else if (shape === 'cross') {
    const arm = size * 1.3;
    ctx.lineWidth   = Math.max(1.2, size * 0.4);
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(x - arm, y); ctx.lineTo(x + arm, y);
    ctx.moveTo(x, y - arm); ctx.lineTo(x, y + arm);
    ctx.stroke();

  } else if (shape === 'triangle') {
    const r = size * 1.2;
    ctx.beginPath();
    ctx.moveTo(x,           y - r);
    ctx.lineTo(x + r * 0.866, y + r * 0.5);
    ctx.lineTo(x - r * 0.866, y + r * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticleCanvas() {
  const canvasRef    = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef     = useRef({ x: -9999, y: -9999 });
  const rafRef       = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const FRICTION = 0.88;  // repulsion velocity decay per frame

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        // ── Mouse repulsion ──────────────────────────────────────
        const dx   = p.x - mouseRef.current.x;
        const dy   = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 0) {
          const strength = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE;
          const angle    = Math.atan2(dy, dx);
          p.rvx += Math.cos(angle) * strength;
          p.rvy += Math.sin(angle) * strength;
        }

        // Apply and decay repulsion
        p.rvx *= FRICTION;
        p.rvy *= FRICTION;

        // ── Natural drift ────────────────────────────────────────
        p.x += p.vx + p.rvx;
        p.y += p.vy + p.rvy;

        // ── Alpha pulse ──────────────────────────────────────────
        p.alpha += p.alphaSpd * p.alphaDir;
        if (p.alpha >= 0.95) { p.alphaDir = -1; p.alpha = 0.95; }
        if (p.alpha <= 0.3)  { p.alphaDir =  1; }

        // ── Wrap / reset ─────────────────────────────────────────
        if (p.y < -20)             { particlesRef.current[i] = (() => { const n = makeParticle(canvas.width, canvas.height); n.y = canvas.height + 10; n.ox = n.x; n.oy = n.y; return n; })(); return; }
        if (p.x < -40)             p.x = canvas.width  + 40;
        if (p.x > canvas.width+40) p.x = -40;

        drawShape(ctx, p);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
