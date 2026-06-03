import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import {
  Download, BookOpen, Play, Mouse, Zap, Table2,
  CheckCircle2, FileText, Wrench, ShieldCheck,
  ArrowRight, Github, ChevronRight, Sparkles,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   1. CANVAS BACKGROUND — MOUSE-FOLLOWING PARTICLE PHYSICS
   ═══════════════════════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 200;
const REPEL_RADIUS   = 120;

const PARTICLE_COLORS = [
  'rgba(99,102,241,0.6)',   // indigo
  'rgba(139,92,246,0.6)',   // violet
  'rgba(168,85,247,0.6)',   // purple
  'rgba(59,130,246,0.6)',   // blue-500
  'rgba(147,197,253,0.6)',  // blue-300 soft
  'rgba(196,181,252,0.6)',  // violet-300 soft
  'rgba(249,115,22,0.6)',   // orange-500
  'rgba(251,146,60,0.6)',   // orange-400
];

function makeParticle(W, H) {
  return {
    x:     Math.random() * W,
    y:     Math.random() * H,
    r:     Math.random() * 4 + 2,                  // radius 2–6 px
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    speed: Math.random() * 0.5 + 0.15,             // upward drift speed
    vx:    0,                                       // repulsion velocity x
    vy:    0,                                       // repulsion velocity y
  };
}

function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // Size canvas to fill viewport
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    // Initialise particle array
    let particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(W, H));

    // Mouse position — starts off-screen
    const mouse = { x: -9999, y: -9999 };

    /* ── Event listeners ─────────────────────────────────────────────────── */
    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseLeave = ()  => { mouse.x = -9999;    mouse.y = -9999;     };
    const onResize    = ()  => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(W, H));
    };

    window.addEventListener('mousemove',  onMouseMove,  { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('resize',     onResize,     { passive: true });

    /* ── requestAnimationFrame loop ──────────────────────────────────────── */
    let rafId;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        /* Step 1 — Calculate distance to mouse using Math.hypot */
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        /* Step 2 — Repel force when within REPEL_RADIUS (120 px) */
        if (dist < REPEL_RADIUS && dist > 0) {
          p.vx += dx * 0.015;   // ← EXACT SPEC MATH
          p.vy += dy * 0.015;   // ← EXACT SPEC MATH
        }

        /* Step 3 — Apply friction to decay repulsion velocity */
        p.vx *= 0.92;           // ← EXACT SPEC MATH
        p.vy *= 0.92;           // ← EXACT SPEC MATH

        /* Step 4 — Apply velocities */
        p.x += p.vx;
        p.y += p.vy;

        /* Step 5 — Natural upward float */
        p.y -= p.speed;         // ← y -= speed (floats upward)

        /* Step 6 — Wrap: recycle particle when it leaves viewport */
        if (p.y < -p.r * 2)        { const n = makeParticle(W, H); n.y = H + n.r; particles[i] = n; continue; }
        if (p.x < -p.r * 4)        p.x = W + p.r * 4;
        if (p.x > W + p.r * 4)     p.x = -p.r * 4;

        /* Step 7 — Draw circle */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    /* ── Cleanup ─────────────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize',     onResize);
    };
  }, []);

  return (
    /* EXACT spec className */
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 group" aria-label="Home">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow shadow-indigo-300 group-hover:scale-105 transition-transform duration-200">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/>
              <path d="M8 5.5L10.5 7V10L8 11.5L5.5 10V7Z" fill="white" fillOpacity="0.38"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">MSBTE Scraper</span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {[['Features','#features'],['Resources','#resources']].map(([l,h]) => (
            <a key={h} href={h}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150 relative after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-px after:bg-slate-900 after:transition-all hover:after:w-full">
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a href="#download"
          className="hidden md:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 hover:shadow-lg transition-all cursor-pointer">
          <Download size={13} strokeWidth={2.5} aria-hidden="true"/>
          Download
        </a>
      </div>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. HERO SECTION
   ═══════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    /* EXACT spec className */
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20 text-center bg-transparent">

      {/* Eyebrow badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-3.5 py-1.5 rounded-full">
          <Sparkles size={11} strokeWidth={2.5} aria-hidden="true"/>
          Now available for Windows
        </span>
      </motion.div>

      {/* Main Title — EXACT spec className */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 max-w-4xl leading-[1.08]"
      >
        Experience liftoff with the{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600">
          next-gen
        </span>{' '}
        result scraper.
      </motion.h1>

      {/* Subtitle — EXACT spec className */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.22 }}
        className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed"
      >
        Automate MSBTE seat processing. Zero effort, 100% accuracy, running completely local.
      </motion.p>

      {/* Buttons — EXACT spec className + hover/active effects */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: 0.34 }}
        className="flex flex-col sm:flex-row gap-4 items-center z-20 pointer-events-auto"
      >
        {/* Primary */}
        <a href="#download" id="hero-primary"
          className="bg-slate-900 text-white rounded-full px-8 py-4 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-slate-900/25 hover:bg-slate-700 transition-all cursor-pointer">
          <Download size={18} strokeWidth={2} aria-hidden="true"/>
          Download for Windows (.exe)
        </a>

        {/* Secondary */}
        <a href="#resources" id="hero-secondary"
          className="bg-white border-2 border-slate-200 text-slate-700 rounded-full px-8 py-4 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 hover:shadow-lg hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer">
          <BookOpen size={17} strokeWidth={2} aria-hidden="true"/>
          Read Documentation
        </a>
      </motion.div>

      {/* ─── DEMO VIDEO ANIMATION — EXACT spec className & motion props ────── */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        className="w-full max-w-4xl aspect-[16/9] mt-20 bg-slate-900 rounded-3xl shadow-2xl relative flex items-center justify-center overflow-hidden cursor-pointer group z-20 pointer-events-auto border border-slate-800"
        role="button"
        aria-label="Watch demo video"
      >
        {/* Background gradient shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" aria-hidden="true"/>
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_40%,rgba(99,102,241,0.4)_0%,transparent_60%),radial-gradient(ellipse_at_70%_70%,rgba(139,92,246,0.3)_0%,transparent_55%)]" aria-hidden="true"/>

        {/* Fake terminal dots */}
        <div className="absolute top-4 left-5 flex gap-2" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-red-500/70"/>
          <span className="w-3 h-3 rounded-full bg-yellow-500/70"/>
          <span className="w-3 h-3 rounded-full bg-emerald-500/70"/>
        </div>

        {/* Play button — scales up on group hover */}
        <div className="relative flex flex-col items-center gap-4 group-hover:scale-105 transition-transform duration-300">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/18 transition-colors duration-300 shadow-2xl">
            <Play size={32} className="text-white ml-1" fill="white" strokeWidth={1.5} aria-hidden="true"/>
          </div>
          <p className="text-white/80 text-sm font-semibold tracking-wide group-hover:text-white transition-colors duration-200">
            Watch how it works <span className="text-white/50">(1:20)</span>
          </p>
        </div>

        {/* Corner badge */}
        <div className="absolute bottom-4 right-5 text-xs text-white/30 font-mono" aria-hidden="true">
          MSBTE Master Scraper v1.0
        </div>
      </motion.div>

      {/* ─── Scroll mouse indicator — bounces on Y-axis ──────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="flex flex-col items-center gap-2 mt-12"
        aria-hidden="true"
      >
        <span className="text-[10px] text-slate-400 font-semibold tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <Mouse size={22} className="text-slate-400" strokeWidth={1.5}/>
        </motion.div>
      </motion.div>

    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. FEATURES SECTION — LIGHT GRAY BACKGROUND + ZIG-ZAG GRID
   ═══════════════════════════════════════════════════════════════════════════ */

const FEATURE_BULLETS = {
  automation: [
    'Adaptive retry with exponential back-off',
    'Automatic session management & refresh',
    'Zero manual captcha interaction required',
  ],
  excel: [
    'Merged headers, colour-coded pass/fail rows',
    'Built-in analytics & pass-percentage summary',
    'One-click export — no macros or add-ins needed',
  ],
};

const fvRise = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
};

function FeaturesSection() {
  return (
    /* EXACT spec className */
    <section className="relative z-10 py-32 px-6 bg-slate-50 border-t border-slate-100" id="features" aria-label="Features">

      {/* Header */}
      <motion.h2
        variants={fvRise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="text-4xl font-bold mb-20 text-center text-slate-900"
      >
        Built for speed and precision.
      </motion.h2>

      {/* EXACT spec container */}
      <div className="max-w-7xl mx-auto flex flex-col gap-32">

        {/* ── Row 1: Text LEFT, Image RIGHT ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <motion.div
            variants={fvRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-5"
          >
            <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-3 py-1.5 rounded-full self-start">
              <Zap size={11} strokeWidth={2.5} aria-hidden="true"/> Smart Automation
            </span>
            <h3 className="text-3xl font-bold tracking-tight leading-tight text-slate-900">
              Bypasses network fatigue, resolves captchas instantly.
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Our intelligent retry engine handles MSBTE portal instability automatically — exponential back-off, session refresh, and adaptive rate limiting. Set it once and walk away.
            </p>
            <ul className="flex flex-col gap-3" role="list">
              {FEATURE_BULLETS.automation.map(b => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-indigo-500 shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true"/>
                  <span className="text-sm font-medium text-slate-600">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right image — EXACT spec motion.div */}
          <motion.div
            variants={fvRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.1 }}
            className="w-full aspect-[16/9] bg-white rounded-3xl shadow-xl border border-slate-200 flex items-center justify-center overflow-hidden relative"
            aria-label="Smart Automation Preview"
          >
            {/* SVG grid */}
            <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true" preserveAspectRatio="none">
              <defs>
                <pattern id="g1" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.8"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#g1)"/>
            </svg>
            {/* Chart mockup */}
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex items-end gap-2" aria-hidden="true">
                {[38,54,44,62,50,68,56].map((h,i)=>(
                  <div key={i} className="w-7 rounded-t"
                    style={{ height: h, background: `linear-gradient(to top,rgba(99,102,241,${0.28+i*0.05}),rgba(139,92,246,${0.22+i*0.04}))` }}/>
                ))}
              </div>
              <div className="flex items-center gap-4" aria-hidden="true">
                {[['Pass','#34d399'],['Fail','#f87171'],['ATKT','#fbbf24']].map(([t,c])=>(
                  <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }}/>{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Row 2: Image LEFT, Text RIGHT ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left image */}
          <motion.div
            variants={fvRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -10 }}
            className="w-full aspect-[16/9] bg-white rounded-3xl shadow-xl border border-slate-200 flex items-center justify-center overflow-hidden relative order-2 lg:order-1"
            aria-label="Excel Output Preview"
          >
            <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true" preserveAspectRatio="none">
              <defs>
                <pattern id="g2" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.8"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#g2)"/>
            </svg>
            {/* Spreadsheet mockup */}
            <div className="relative w-56 rounded-xl overflow-hidden border border-slate-200 shadow-lg text-xs" aria-hidden="true">
              {/* Header row */}
              <div className="grid grid-cols-4 bg-slate-700 text-white font-semibold">
                {['Roll No','Name','Sub 1','Result'].map(h=>(
                  <div key={h} className="px-2 py-1.5 border-r border-slate-600 last:border-0 truncate">{h}</div>
                ))}
              </div>
              {/* Data rows */}
              {[
                ['2401','Aditya','72','PASS'],
                ['2402','Priya','58','PASS'],
                ['2403','Rahul','38','FAIL'],
                ['2404','Sneha','81','PASS'],
              ].map(([r,n,s,res])=>(
                <div key={r} className={`grid grid-cols-4 border-t border-slate-100 ${res==='FAIL'?'bg-red-50':'bg-white'}`}>
                  {[r,n,s,res].map((v,i)=>(
                    <div key={i} className={`px-2 py-1.5 border-r border-slate-100 last:border-0 truncate font-medium ${i===3?(res==='PASS'?'text-emerald-600':'text-red-600'):''}`}>{v}</div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right text */}
          <motion.div
            variants={fvRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-5 order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-200/60 px-3 py-1.5 rounded-full self-start">
              <Table2 size={11} strokeWidth={2.5} aria-hidden="true"/> Auto-Excel Formatting
            </span>
            <h3 className="text-3xl font-bold tracking-tight leading-tight text-slate-900">
              Generates a polished Excel with merged headers &amp; analytics.
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Every run produces a beautifully formatted .xlsx — merged subject-group headers, colour-coded pass/fail rows, and a built-in summary sheet with pass percentages.
            </p>
            <ul className="flex flex-col gap-3" role="list">
              {FEATURE_BULLETS.excel.map(b => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-violet-500 shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true"/>
                  <span className="text-sm font-medium text-slate-600">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>{/* end flex flex-col gap-32 */}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. RESOURCES SECTION — DARK MODE
   ═══════════════════════════════════════════════════════════════════════════ */

const RESOURCE_CARDS = [
  {
    id:    'install',
    Icon:  FileText,
    color: 'text-indigo-400',
    bg:    'bg-indigo-500/10 border-indigo-500/20',
    title: 'Installation Guide',
    desc:  'Step-by-step walkthrough from download to your first automated run. Covers Windows Defender bypass and .NET runtime setup.',
    cta:   'Read guide',
  },
  {
    id:    'trouble',
    Icon:  Wrench,
    color: 'text-amber-400',
    bg:    'bg-amber-500/10 border-amber-500/20',
    title: 'Troubleshooting & Failed Seats',
    desc:  'Common errors, portal timeout recovery, handling absent students, and re-running partial jobs without result duplication.',
    cta:   'See solutions',
  },
  {
    id:    'privacy',
    Icon:  ShieldCheck,
    color: 'text-emerald-400',
    bg:    'bg-emerald-500/10 border-emerald-500/20',
    title: 'Data Privacy',
    desc:  'All processing happens on your local machine. No data is uploaded, stored remotely, or shared. Student records stay private.',
    cta:   'Learn more',
  },
];

function ResourcesSection() {
  return (
    /* EXACT spec className */
    <section className="relative z-10 py-32 px-6 bg-slate-950 text-white" id="resources" aria-label="Resources">

      {/* Background orbs — decorative only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/8 blur-[120px] rounded-full"/>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500/8 blur-[120px] rounded-full"/>
      </div>

      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        className="text-4xl font-bold mb-16 text-center"
      >
        Resources to get you started.
      </motion.h2>

      {/* EXACT spec grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {RESOURCE_CARDS.map((c, i) => (
          /* EXACT spec card className */
          <motion.div
            key={c.id}
            id={`res-${c.id}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22,1,0.36,1], delay: i * 0.08 }}
            whileHover={{ y: -5 }}
            className="bg-slate-900 p-10 rounded-3xl border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer flex flex-col gap-5"
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl border ${c.bg} flex items-center justify-center`}>
              <c.Icon size={22} className={c.color} strokeWidth={1.75} aria-hidden="true"/>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white leading-snug">{c.title}</h3>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed flex-1">{c.desc}</p>

            {/* CTA */}
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors group">
              {c.cta}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true"/>
            </span>
          </motion.div>
        ))}
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-20 max-w-3xl mx-auto flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden"
      >
        {[
          { val: '100%', lbl: 'Local & Private'  },
          { val: '< 2s', lbl: 'Per Seat Result'  },
          { val: '0',    lbl: 'Manual Effort'     },
        ].map(s => (
          <div key={s.lbl} className="flex-1 flex flex-col items-center py-6 px-8">
            <span className="text-2xl font-bold text-white">{s.val}</span>
            <span className="text-xs text-slate-500 font-semibold mt-1 tracking-wide whitespace-nowrap">{s.lbl}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DOWNLOAD CTA SECTION
   ═══════════════════════════════════════════════════════════════════════════ */
function DownloadSection() {
  return (
    <section id="download" className="relative z-10 py-32 px-6 bg-white flex flex-col items-center" aria-label="Download">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        className="flex flex-col items-center gap-6 text-center max-w-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-200/60">
          <Download size={28} className="text-white" strokeWidth={2} aria-hidden="true"/>
        </div>

        <h2 className="text-4xl font-bold tracking-tight text-slate-900">Ready to automate?</h2>

        <p className="text-slate-600 leading-relaxed text-lg">
          Download the Windows installer and have your first result sheet ready in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <a href="#" id="download-main"
            className="group inline-flex items-center gap-2 bg-slate-900 text-white font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-slate-900/25 hover:bg-slate-700 transition-all cursor-pointer">
            <Download size={16} strokeWidth={2.5} aria-hidden="true"/>
            Download for Windows (.exe)
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true"/>
          </a>
          <a href="https://github.com/prajwal-2509/MSBTE-exe-Download-Web"
            id="github-btn" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-full border border-slate-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer">
            <Github size={15} aria-hidden="true"/>
            View on GitHub
          </a>
        </div>

        <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true"/>
          Windows 10 / 11 · .NET 6.0 Runtime · No internet required at runtime
        </p>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. FOOTER — EXACT SPEC
   ═══════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    /* EXACT spec className */
    <footer className="relative z-10 bg-white border-t border-slate-200 py-12 px-6" role="contentinfo">
      {/* EXACT spec className */}
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-sm text-slate-500 font-medium gap-4">

        {/* EXACT spec left text */}
        <p>© 2026 MSBTE Master Scraper. All rights reserved.</p>

        {/* Nav links — centre */}
        <div className="flex items-center gap-6">
          {[['Features','#features'],['Resources','#resources'],['Download','#download']].map(([l,h])=>(
            <a key={h} href={h} className="hover:text-slate-800 transition-colors hover:scale-105 active:scale-95 cursor-pointer">{l}</a>
          ))}
        </div>

        {/* EXACT spec right text */}
        <p className="text-right">Developed by Prajwal Hulle | Govt. Polytechnic, Solapur</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
   ═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    /*
      EXACT spec wrapper className:
      "relative w-full min-h-screen overflow-hidden font-sans text-slate-900 bg-white"

      Canvas is fixed z-0 (behind sections).
      All sections are relative z-10 (in front of canvas).
      Standard document flow: sections stack top-to-bottom — no collapsing.
    */
    <div className="relative w-full min-h-screen overflow-hidden font-sans text-slate-900 bg-white">

      {/* Fixed particle canvas z-0 */}
      <CanvasBackground />

      {/* Sticky navbar z-50 */}
      <Navbar />

      {/* Page sections — plain block flow, zero absolute layout tricks */}
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <ResourcesSection />
        <DownloadSection />
      </main>

      <Footer />
    </div>
  );
}
