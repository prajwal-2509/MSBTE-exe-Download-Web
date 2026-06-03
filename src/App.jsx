import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, BookOpen, Play, Mouse,
  CheckCircle2, FileText, Wrench, ShieldCheck,
  ArrowRight, Github, Sparkles, ChevronDown,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════════
   1. CANVAS BACKGROUND — GOOGLE ANTIGRAVITY MICRO-PARTICLES
   Spring force to origin + sine wave float + mouse repulsion (EXACT MATH)
   ═══════════════════════════════════════════════════════════════════════════════ */

// Google brand palette
const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

function makeParticle(W, H) {
  const x = Math.random() * W;
  const y = Math.random() * H;
  return {
    x,
    y,
    originX: x,                                           // spring resting position
    originY: y,
    vx: 0,
    vy: 0,
    r:     Math.random() * 2 + 1,                         // EXACT spec: tiny 1–3 px
    color: GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)],
    phase: Math.random() * Math.PI * 2,                   // for sine wave offset
  };
}

function CanvasBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    let particles = Array.from({ length: 150 }, () => makeParticle(W, H));

    // Mouse off-screen by default
    const mouse = { x: -9999, y: -9999 };

    const onMove  = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = ()  => { mouse.x = -9999;     mouse.y = -9999;     };
    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from({ length: 150 }, () => makeParticle(W, H));
    };

    window.addEventListener('mousemove',  onMove,   { passive: true });
    window.addEventListener('mouseleave', onLeave,  { passive: true });
    window.addEventListener('resize',     onResize, { passive: true });

    let rafId;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      const now = Date.now() * 0.001;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        /* ── SPRING FORCE: pull particle back to originX/originY ─────────
           EXACT SPEC MATH: vx += (originX - x) * 0.02                    */
        p.vx += (p.originX - p.x) * 0.02;
        p.vy += (p.originY - p.y) * 0.02;

        /* ── SINE WAVE FLOAT: subtle vertical oscillation ────────────── */
        p.vy += Math.sin(now + p.phase) * 0.04;

        /* ── MOUSE REPEL ─────────────────────────────────────────────────
           EXACT SPEC MATH:
           dx = p.x - mouse.x  (vector FROM mouse TO particle)
           if Math.hypot(dx,dy) < 100: vx -= dx * 0.03                    */
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 100 && dist > 0) {
          p.vx -= dx * 0.03;   // ← EXACT SPEC MATH
          p.vy -= dy * 0.03;   // ← EXACT SPEC MATH
        }

        /* ── FRICTION ────────────────────────────────────────────────────
           EXACT SPEC MATH: vx *= 0.9                                      */
        p.vx *= 0.9;           // ← EXACT SPEC MATH
        p.vy *= 0.9;           // ← EXACT SPEC MATH

        /* ── UPDATE POSITION ─────────────────────────────────────────────
           EXACT SPEC MATH: x += vx                                        */
        p.x += p.vx;           // ← EXACT SPEC MATH
        p.y += p.vy;

        /* ── DRAW CRISP CIRCLE ───────────────────────────────────────── */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize',     onResize);
    };
  }, []);

  return (
    /* EXACT spec className — opacity-60 for the Antigravity micro-particle look */
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-60"
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   NAVBAR — Transparent floating, does not affect document flow
   ═══════════════════════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 group" aria-label="Home">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow shadow-blue-300 group-hover:scale-105 transition-transform">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/>
              <path d="M8 5.5L10.5 7V10L8 11.5L5.5 10V7Z" fill="white" fillOpacity="0.35"/>
            </svg>
          </div>
          <span className="font-semibold text-slate-900 text-sm tracking-tight">MSBTE Scraper</span>
        </a>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {[['Features','#features'],['Resources','#resources'],['Download','#download']].map(([l,h])=>(
            <a key={h} href={h}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              {l}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="#download"
          className="hidden md:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-full hover:scale-105 transition-transform cursor-pointer shadow-sm">
          <Download size={13} aria-hidden="true"/> Download
        </a>
      </div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   2. HERO SECTION — DEAD CENTER WITH FRAMER MOTION WORD STAGGER
   ═══════════════════════════════════════════════════════════════════════════════ */

const HEADLINE_WORDS = 'Experience liftoff with the next-gen result scraper.'.split(' ');

/* EXACT spec variants */
const containerVariants = {
  initial:  {},
  animate:  { transition: { staggerChildren: 0.1 } },   // ← EXACT SPEC
};

const wordVariants = {
  initial:  { opacity: 0, y: 20 },                      // ← EXACT SPEC
  animate:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// Subtitle appears after all words have animated (~1.1s + buffer)
const SUBTITLE_DELAY = HEADLINE_WORDS.length * 0.1 + 0.35;

function HeroSection() {
  return (
    /*
      EXACT spec className:
      "relative z-10 w-full h-screen flex flex-col items-center justify-center text-center px-6"
      h-screen forces perfect vertical centering without any tricks.
    */
    <section
      id="hero"
      className="relative z-10 w-full h-screen flex flex-col items-center justify-center text-center px-6"
      aria-label="Hero"
    >
      {/* Eyebrow badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#4285F4] bg-blue-50 border border-blue-200/50 px-4 py-1.5 rounded-full">
          <Sparkles size={11} aria-hidden="true"/> Now available for Windows
        </span>
      </motion.div>

      {/* ── Typewriter Headline — word stagger via Framer Motion ──────────────
          EXACT spec:
          parent: variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          each word: variants={{ initial: { opacity:0, y:20 }, animate: { opacity:1, y:0 } }}
          className: "text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-6 max-w-5xl"
      ─────────────────────────────────────────────────────────────────────────── */}
      <motion.h1
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-6 max-w-5xl leading-[1.05]"
        aria-label="Experience liftoff with the next-gen result scraper."
      >
        {HEADLINE_WORDS.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className="inline-block mr-[0.22em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtitle — EXACT spec className, fades in after words finish */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: SUBTITLE_DELAY, ease: 'easeOut' }}
        className="text-xl text-slate-500 max-w-2xl mb-10 tracking-tight leading-relaxed"
      >
        Automate MSBTE seat processing. Zero effort, 100% accuracy, running completely local.
      </motion.p>

      {/* Buttons — EXACT spec: flex gap-4 z-20 pointer-events-auto */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: SUBTITLE_DELAY + 0.18, ease: 'easeOut' }}
        className="flex gap-4 z-20 pointer-events-auto flex-col sm:flex-row items-center"
      >
        {/* Primary — black pill */}
        <a
          href="#download"
          id="hero-primary-btn"
          className="flex items-center gap-2 bg-slate-900 text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:scale-105 transition-transform cursor-pointer hover:bg-slate-700 shadow-lg shadow-slate-900/20 active:scale-95"
        >
          <Download size={16} strokeWidth={2} aria-hidden="true"/>
          Download for Windows (.exe)
        </a>

        {/* Secondary — outline pill */}
        <a
          href="#resources"
          id="hero-secondary-btn"
          className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold text-sm px-8 py-3.5 rounded-full hover:scale-105 transition-transform cursor-pointer hover:border-slate-300 hover:bg-slate-50 active:scale-95"
        >
          <BookOpen size={15} aria-hidden="true"/>
          Read Documentation
        </a>
      </motion.div>

      {/*
        SCROLL INDICATOR — EXACT spec:
        "absolute bottom-10" + glowing mouse icon + animate-bounce + "SCROLL TO SEE HOW IT WORKS"
        Lives inside the h-screen relative section → sits at very bottom of viewport.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: SUBTITLE_DELAY + 0.6, duration: 0.7 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        {/* Glowing mouse icon */}
        <div className="animate-bounce">
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-slate-300/40 blur-md scale-150"/>
            <Mouse
              size={22}
              className="relative text-slate-400"
              strokeWidth={1.5}
            />
          </div>
        </div>
        <span className="text-[9px] font-bold tracking-[0.22em] text-slate-400 uppercase">
          Scroll to see how it works
        </span>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   3. DEMO VIDEO SECTION — SCROLL REVEAL
   ═══════════════════════════════════════════════════════════════════════════════ */
function DemoSection() {
  return (
    /* EXACT spec className */
    <section
      className="relative z-10 w-full min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 bg-slate-50/50"
      aria-label="Demo"
    >
      {/* Label above */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs font-bold tracking-[0.18em] uppercase text-slate-400 mb-6"
      >
        See it in action
      </motion.p>

      {/* EXACT spec motion.div */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="w-full max-w-5xl aspect-video bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex items-center justify-center border border-slate-800 cursor-pointer group"
        role="button"
        aria-label="Watch demo video"
        tabIndex={0}
      >
        {/* Dark background gradient */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" aria-hidden="true"/>
        <div className="absolute inset-0 rounded-[2rem] opacity-25 bg-[radial-gradient(ellipse_60%_50%_at_30%_35%,rgba(66,133,244,0.5),transparent),radial-gradient(ellipse_50%_50%_at_75%_65%,rgba(52,168,83,0.3),transparent)]" aria-hidden="true"/>

        {/* Terminal chrome */}
        <div className="absolute top-0 inset-x-0 h-10 bg-slate-800/70 flex items-center px-5 gap-2 border-b border-slate-700/50" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-red-500/80"/>
          <span className="w-3 h-3 rounded-full bg-yellow-400/80"/>
          <span className="w-3 h-3 rounded-full bg-green-500/80"/>
          <span className="ml-4 text-xs text-slate-500 font-mono">MSBTE Master Scraper v1.0</span>
        </div>

        {/* Play button — scales up on group-hover */}
        <div className="relative flex flex-col items-center gap-5 group-hover:scale-105 transition-transform duration-300">
          {/* Outer glow ring */}
          <div className="relative">
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-white/20 blur-xl scale-110 group-hover:scale-125 transition-transform duration-300" aria-hidden="true"/>
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:bg-white/18 transition-colors duration-300">
              <Play size={34} className="text-white ml-1.5" fill="white" strokeWidth={1} aria-hidden="true"/>
            </div>
          </div>
          <p className="text-white/70 text-sm font-semibold tracking-wide group-hover:text-white transition-colors duration-200">
            Watch Demo{' '}
            <span className="text-white/40">(1:20)</span>
          </p>
        </div>
      </motion.div>

      {/* Caption */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-sm text-slate-400 font-medium"
      >
        Full walkthrough: scraping 200 seats, auto-generating the Excel report.
      </motion.p>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   4. FEATURES — ZIG-ZAG GRID
   ═══════════════════════════════════════════════════════════════════════════════ */

const fRise = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function ImagePlaceholder({ id, colorA, colorB }) {
  return (
    <div
      className="w-full aspect-[4/3] bg-slate-100 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col items-center justify-center gap-4 p-6"
      aria-hidden="true"
    >
      {/* Subtle grid */}
      <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none">
        <defs>
          <pattern id={`g-${id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.7"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${id})`}/>
      </svg>

      {/* Mini chart */}
      <div className="relative flex items-end gap-2">
        {[36, 52, 44, 62, 50, 68, 58].map((h, i) => (
          <div key={i} className="w-7 rounded-t"
            style={{ height: h, background: `linear-gradient(to top, ${colorA}${Math.round(48 + i * 8).toString(16)}, ${colorB}${Math.round(38 + i * 8).toString(16)})` }}
          />
        ))}
      </div>
      <div className="relative flex items-center gap-4">
        {[['Pass','#34d399'],['Fail','#f87171'],['ATKT','#fbbf24']].map(([t,c])=>(
          <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full" style={{ background: c }}/>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

const AUTOMATION_BULLETS = [
  'Adaptive retry with exponential back-off',
  'Automatic session management & refresh',
  'Zero manual captcha interaction required',
];

const EXCEL_BULLETS = [
  'Merged headers, colour-coded pass/fail rows',
  'Built-in analytics & pass-percentage sheet',
  'One-click export — no macros needed',
];

function FeaturesSection() {
  return (
    /*
      EXACT spec:
      "relative z-10 w-full py-32 px-6 max-w-7xl mx-auto flex flex-col gap-32"
    */
    <section
      id="features"
      className="relative z-10 w-full py-32 px-6 max-w-7xl mx-auto flex flex-col gap-32"
      aria-label="Features"
    >
      {/* Section header */}
      <motion.div
        variants={fRise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold tracking-tighter text-slate-900 mb-4">
          Built for speed and precision.
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Two engines. Total automation. Every result, every time.
        </p>
      </motion.div>

      {/* ── Row 1: Text LEFT, Image RIGHT ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left text */}
        <motion.div
          variants={fRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col gap-6"
        >
          {/* EXACT spec headline className */}
          <h3 className="text-4xl font-bold tracking-tighter mb-4 text-slate-900 leading-tight">
            Bypasses network fatigue, resolves captchas instantly.
          </h3>
          <p className="text-slate-500 leading-relaxed text-base">
            Our intelligent retry engine handles MSBTE portal instability automatically — exponential back-off, session refresh, and adaptive rate limiting. Set it once and walk away.
          </p>
          <ul className="flex flex-col gap-3" role="list">
            {AUTOMATION_BULLETS.map(b => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 size={17} className="text-[#34A853] shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true"/>
                <span className="text-sm text-slate-600 font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: image placeholder EXACT spec className */}
        <motion.div
          variants={fRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          <ImagePlaceholder id="auto" colorA="#4285F4" colorB="#EA4335"/>
        </motion.div>
      </div>

      {/* ── Row 2: Image LEFT, Text RIGHT ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left: image placeholder */}
        <motion.div
          variants={fRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
          className="order-2 lg:order-1"
        >
          <ImagePlaceholder id="excel" colorA="#34A853" colorB="#FBBC05"/>
        </motion.div>

        {/* Right text */}
        <motion.div
          variants={fRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col gap-6 order-1 lg:order-2"
        >
          <h3 className="text-4xl font-bold tracking-tighter mb-4 text-slate-900 leading-tight">
            Generates a polished Excel with merged headers &amp; analytics.
          </h3>
          <p className="text-slate-500 leading-relaxed text-base">
            Every run produces a beautifully formatted .xlsx — merged subject-group headers, colour-coded pass/fail rows, and a built-in summary sheet with pass percentages.
          </p>
          <ul className="flex flex-col gap-3" role="list">
            {EXCEL_BULLETS.map(b => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 size={17} className="text-[#4285F4] shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true"/>
                <span className="text-sm text-slate-600 font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   5A. RESOURCES SECTION
   ═══════════════════════════════════════════════════════════════════════════════ */

const CARDS = [
  {
    id: 'install', Icon: FileText, color: '#4285F4', bg: 'bg-blue-50',
    title: 'Installation Guide',
    desc:  'Step-by-step from download to first run. Covers Windows Defender bypass, .NET runtime, and folder setup.',
    cta:   'Read guide',
  },
  {
    id: 'trouble', Icon: Wrench, color: '#FBBC05', bg: 'bg-amber-50',
    title: 'Troubleshooting & Failed Seats',
    desc:  'Portal timeouts, absent students, partial re-runs — every edge case covered without result duplication.',
    cta:   'See solutions',
  },
  {
    id: 'privacy', Icon: ShieldCheck, color: '#34A853', bg: 'bg-emerald-50',
    title: 'Data Privacy',
    desc:  'Everything runs on your machine. No uploads, no remote storage, no third parties. Student data stays local.',
    cta:   'Learn more',
  },
];

function ResourcesSection() {
  return (
    <section
      id="resources"
      className="relative z-10 w-full py-24 px-6 bg-slate-50/80 border-t border-slate-100"
      aria-label="Resources"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold tracking-tighter text-slate-900 mb-4">
          Resources to get you started.
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Everything you need from day one.
        </p>
      </motion.div>

      {/* EXACT spec grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {CARDS.map((c, i) => (
          <motion.a
            key={c.id}
            href="#"
            id={`res-${c.id}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22,1,0.36,1], delay: i * 0.08 }}
            aria-label={c.title}
            /* EXACT spec card className */
            className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-all cursor-pointer flex flex-col gap-5 no-underline group"
          >
            {/* Icon */}
            <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center`}>
              <c.Icon size={22} style={{ color: c.color }} strokeWidth={1.75} aria-hidden="true"/>
            </div>

            <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed flex-1">{c.desc}</p>

            <span className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
              style={{ color: c.color }}>
              {c.cta}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true"/>
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DOWNLOAD CTA
   ═══════════════════════════════════════════════════════════════════════════════ */
function DownloadSection() {
  return (
    <section id="download" className="relative z-10 w-full py-32 px-6 bg-white flex flex-col items-center" aria-label="Download">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
        className="flex flex-col items-center gap-6 text-center max-w-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-200/60">
          <Download size={28} className="text-white" strokeWidth={2} aria-hidden="true"/>
        </div>
        <h2 className="text-4xl font-bold tracking-tighter text-slate-900">Ready to automate?</h2>
        <p className="text-slate-500 leading-relaxed text-lg max-w-md">
          Download the Windows installer and have your first result sheet in minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
          <a href="#" id="dl-main"
            className="group flex items-center gap-2 bg-slate-900 text-white font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform cursor-pointer hover:bg-slate-700 shadow-lg shadow-slate-900/20">
            <Download size={16} strokeWidth={2.5} aria-hidden="true"/>
            Download for Windows (.exe)
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true"/>
          </a>
          <a href="https://github.com/prajwal-2509/MSBTE-exe-Download-Web"
            id="github-link" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-full border-2 border-slate-200 hover:scale-105 active:scale-95 transition-transform cursor-pointer hover:border-slate-300">
            <Github size={15} aria-hidden="true"/> View on GitHub
          </a>
        </div>
        <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true"/>
          Windows 10/11 · .NET 6.0 Runtime · No internet required at runtime
        </p>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   5B. FOOTER — EXACT SPEC
   ═══════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    /* EXACT spec wrapper */
    <footer className="relative z-10 w-full border-t border-slate-100 bg-white py-12 px-6" role="contentinfo">
      {/* EXACT spec inner div */}
      <div className="flex justify-between items-center max-w-7xl mx-auto text-sm text-slate-400 font-medium flex-col md:flex-row gap-4">

        {/* EXACT spec left */}
        <p>© 2026 MSBTE Master Scraper. All rights reserved.</p>

        {/* Center nav */}
        <nav className="flex items-center gap-6" aria-label="Footer">
          {[['Features','#features'],['Resources','#resources'],['Download','#download']].map(([l,h])=>(
            <a key={h} href={h} className="hover:text-slate-700 transition-colors cursor-pointer">{l}</a>
          ))}
        </nav>

        {/* EXACT spec right */}
        <p>Developed by Prajwal Hulle | Govt. Polytechnic, Solapur</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ROOT APP — EXACT SPEC WRAPPER
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    /*
      EXACT spec wrapper className:
      "relative w-full bg-white text-slate-900 font-sans overflow-x-hidden"
      Standard document flow — sections stack top-to-bottom.
      Canvas is fixed z-0, all sections are z-10 → correct stacking.
    */
    <div className="relative w-full bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* Fixed micro-particle canvas z-0 — opacity-60 for the Antigravity look */}
      <CanvasBackground />

      {/* Floating navbar — fixed, doesn't affect document flow */}
      <Navbar />

      {/* Page content — stacked sections in natural document flow */}
      <main id="main-content">
        <HeroSection />
        <DemoSection />
        <FeaturesSection />
        <ResourcesSection />
        <DownloadSection />
      </main>

      <Footer />
    </div>
  );
}
