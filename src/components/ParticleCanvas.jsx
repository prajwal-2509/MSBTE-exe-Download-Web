import React, { useEffect, useRef } from 'react';

/*
  Canvas sits at z-index: -10 using position:fixed.
  Body is position:relative (set in index.css) so the stacking context is correct.
  Particles: circles (bubbles) + diamonds in pastel indigo/violet/amber/blue.
  Physics: gentle upward drift + smooth friction-based mouse repulsion.
*/

const COUNT          = 160;
const REPEL_RADIUS   = 100;
const REPEL_STRENGTH = 3.8;
const FRICTION       = 0.86;

const COLORS = [
  'rgba(99,102,241,0.45)',
  'rgba(139,92,246,0.42)',
  'rgba(168,85,247,0.38)',
  'rgba(59,130,246,0.40)',
  'rgba(234,179,8,0.36)',
  'rgba(249,115,22,0.33)',
  'rgba(20,184,166,0.35)',
];

function rnd(a, b) { return Math.random() * (b - a) + a; }

function spawn(W, H) {
  return {
    x:    rnd(0, W),
    y:    rnd(0, H),
    r:    rnd(3, 8),
    isDiamond: Math.random() > 0.72,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx:   rnd(-0.15, 0.15),
    vy:   rnd(-0.50, -0.12),
    rvx: 0,
    rvy: 0,
    alpha:    rnd(0.45, 0.92),
    alphaDir: Math.random() > 0.5 ? 1 : -1,
    alphaSpd: rnd(0.003, 0.008),
  };
}

function draw(ctx, p) {
  ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
  ctx.fillStyle   = p.color;

  if (p.isDiamond) {
    const s = p.r * 1.4;
    ctx.beginPath();
    ctx.moveTo(p.x,     p.y - s);
    ctx.lineTo(p.x + s * 0.65, p.y);
    ctx.lineTo(p.x,     p.y + s);
    ctx.lineTo(p.x - s * 0.65, p.y);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

export default function ParticleCanvas() {
  const ref  = useRef(null);
  const ps   = useRef([]);
  const mpos = useRef({ x: -9999, y: -9999 });
  const raf  = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      ps.current    = Array.from({ length: COUNT }, () => spawn(canvas.width, canvas.height));
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMove  = (e) => { mpos.current.x = e.clientX; mpos.current.y = e.clientY; };
    const onLeave = ()  => { mpos.current.x = -9999;     mpos.current.y = -9999; };
    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ps.current.forEach((p, i) => {
        /* repulsion */
        const dx = p.x - mpos.current.x;
        const dy = p.y - mpos.current.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < REPEL_RADIUS && d > 0) {
          const f = ((REPEL_RADIUS - d) / REPEL_RADIUS) * REPEL_STRENGTH;
          p.rvx  += (dx / d) * f;
          p.rvy  += (dy / d) * f;
        }

        /* friction decay */
        p.rvx *= FRICTION;
        p.rvy *= FRICTION;

        /* move */
        p.x += p.vx + p.rvx;
        p.y += p.vy + p.rvy;

        /* alpha breathe */
        p.alpha += p.alphaSpd * p.alphaDir;
        if (p.alpha > 0.95) { p.alphaDir = -1; p.alpha = 0.95; }
        if (p.alpha < 0.30) { p.alphaDir =  1; }

        /* recycle when off-screen */
        if (p.y < -20 || p.x < -60 || p.x > canvas.width + 60) {
          const n = spawn(canvas.width, canvas.height);
          n.y = canvas.height + 10;
          ps.current[i] = n;
          return;
        }

        draw(ctx, p);
      });

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize',     resize);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
