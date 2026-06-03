import React, { useEffect, useRef } from 'react';

/*
  InteractiveCanvas
  ─────────────────
  - fixed inset-0 z-[-10] pointer-events-auto
  - 150 particles: circles with pastel fill colors
  - window mousemove tracks cursor x,y
  - RAF loop: each particle drifts upward, repels from mouse when < 150px
  - Uses Math.hypot() for distance calculation
  - Friction (0.92) settles repulsion velocity back to natural drift
*/

const PARTICLE_COUNT = 150;
const REPEL_RADIUS   = 150;
const REPEL_FORCE    = 4.5;
const FRICTION       = 0.92;

const PASTEL_COLORS = [
  'rgba(147, 197, 253, 0.7)',  // blue-300
  'rgba(167, 139, 250, 0.65)', // violet-400
  'rgba(196, 181, 253, 0.60)', // violet-300
  'rgba(139, 92,  246, 0.55)', // violet-500
  'rgba(99,  102, 241, 0.60)', // indigo-500
  'rgba(165, 180, 252, 0.65)', // indigo-300
  'rgba(251, 191, 36,  0.45)', // amber-400
  'rgba(110, 231, 183, 0.50)', // emerald-300
  'rgba(249, 168, 212, 0.50)', // pink-300
];

function createParticle(W, H) {
  const baseVy = -(Math.random() * 0.55 + 0.15); // natural upward speed
  return {
    x:      Math.random() * W,
    y:      Math.random() * H,
    r:      Math.random() * 4 + 2,               // radius 2–6 px
    color:  PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
    vx:     (Math.random() - 0.5) * 0.3,          // slight horizontal wobble
    vy:     baseVy,
    baseVy,                                        // used to restore natural upward drift
  };
}

export default function InteractiveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // Size canvas to full viewport
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    // Create particle array
    let particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(W, H));

    // Track mouse coordinates via window — works regardless of which element is on top
    const mouse = { x: -9999, y: -9999 };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener('mousemove',  onMouseMove,  { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Handle resize
    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(W, H));
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // ── 1. Calculate distance to mouse using Math.hypot ───────────────
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        // ── 2. Repulsion — only fires when cursor is within REPEL_RADIUS ──
        if (dist < REPEL_RADIUS && dist > 0) {
          // Scale force by closeness: closer = stronger push
          const forceMagnitude = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE;
          // Push direction is the normalised vector FROM mouse TO particle
          p.vx += (dx / dist) * forceMagnitude;
          p.vy += (dy / dist) * forceMagnitude;
        }

        // ── 3. Friction — decays excess velocity, particle returns to natural path
        p.vx *= FRICTION;
        // Blend vy back toward baseVy (natural upward drift) as repulsion fades
        p.vy  = p.vy * FRICTION + p.baseVy * (1 - FRICTION);

        // ── 4. Move particle
        p.x += p.vx;
        p.y += p.vy;

        // ── 5. Wrap edges — particle reappears from opposite side
        if (p.y < -p.r * 2)    { particles[i] = createParticle(W, H); particles[i].y = H + p.r; continue; }
        if (p.x < -p.r * 4)    p.x = W + p.r * 4;
        if (p.x > W + p.r * 4) p.x = -p.r * 4;

        // ── 6. Draw circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize',     onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100%',
        height:        '100%',
        zIndex:        -10,
        pointerEvents: 'auto',
        display:       'block',
      }}
    />
  );
}
