import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, BookOpen, Play, Mouse,
  CheckCircle2, FileText, Wrench, ShieldCheck, ArrowRight, Github,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   CANVAS — GOOGLE MICRO-PARTICLE PHYSICS
   ═══════════════════════════════════════════════════════════════════ */

const G_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

function spawnParticle(W, H) {
  const x = Math.random() * W;
  const y = Math.random() * H;
  return {
    x, y,
    originX: x,
    originY: y,
    vx: 0, vy: 0,
    r:     Math.random() * 1.5 + 1.5,          // 1.5 – 3 px
    color: G_COLORS[Math.floor(Math.random() * G_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  };
}

function CanvasBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let ps = Array.from({ length: 150 }, () => spawnParticle(W, H));
    const mouse = { x: -9999, y: -9999 };

    const onMove  = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      ps = Array.from({ length: 150 }, () => spawnParticle(W, H));
    };
    window.addEventListener('mousemove',  onMove,   { passive: true });
    window.addEventListener('mouseleave', onLeave,  { passive: true });
    window.addEventListener('resize',     onResize, { passive: true });

    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * 0.001;

      ps.forEach((p, i) => {
        // Sine-wave float
        p.vy += Math.sin(t + p.phase) * 0.03;

        // Spring back to origin
        p.vx += (p.originX - p.x) * 0.02;
        p.vy += (p.originY - p.y) * 0.02;

        // Mouse repel
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        if (Math.hypot(dx, dy) < 120) {
          p.vx -= dx * 0.02;   // ← spec math
          p.vy -= dy * 0.02;
        }

        // Friction
        p.vx *= 0.9;           // ← spec math
        p.vy *= 0.9;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Respawn if drifted too far (shouldn't happen with spring, but safety)
        if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) {
          ps[i] = spawnParticle(W, H);
          return;
        }

        // Draw crisp circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize',     onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-60"
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/92 backdrop-blur-xl border-b border-slate-100 shadow-sm' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 group" aria-label="Home">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow shadow-blue-200 group-hover:scale-105 transition-transform">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/>
              <path d="M8 5.5L10.5 7V10L8 11.5L5.5 10V7Z" fill="white" fillOpacity="0.35"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-[15px] tracking-tight">MSBTE Scraper</span>
        </a>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {[['Features','#features'],['Resources','#resources'],['Download','#download']].map(([l, h]) => (
            <a key={h} href={h}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150">
              {l}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="#download"
          className="hidden md:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-slate-900/20 cursor-pointer">
          <Download size={13} strokeWidth={2.5} aria-hidden="true"/>
          Download
        </a>
      </div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════ */

// The headline split into words
const WORDS = 'Experience liftoff with the next-gen result scraper.'.split(' ');

// Framer Motion variants for staggered words
const containerV = {
  hidden:  {},
  show:    { transition: { staggerChildren: 0.09 } },
};
const wordV = {
  hidden:  { opacity: 0, y: 22 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Subtitle appears after words finish (9 words × 90ms ≈ 810ms + 200ms buffer)
const SUB_DELAY = WORDS.length * 0.09 + 0.3;

function HeroSection() {
  return (
    /* EXACT spec className */
    <section
      id="hero"
      className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center text-center pt-24 pb-12"
      aria-label="Hero"
    >
      {/*
        BUG FIX #2 — inner wrapper with max-w-5xl mx-auto px-6
        Nothing ever touches the screen edge.
      */}
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#4285F4] bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] animate-pulse" aria-hidden="true"/>
            Now available for Windows
          </span>
        </motion.div>

        {/*
          TYPEWRITER HEADLINE — WORD STAGGER
          ═══════════════════════════════════
          BUG FIX #1 — CRITICAL WORD SPACING FIX:
          Every motion.span has `mr-3 md:mr-5 inline-block` so words
          NEVER touch each other. This is the specific fix requested.
        */}
        <motion.h1
          variants={containerV}
          initial="hidden"
          animate="show"
          className="text-6xl md:text-[5.5rem] font-extrabold tracking-tight text-slate-900 leading-tight mb-8"
          aria-label="Experience liftoff with the next-gen result scraper."
        >
          {WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={wordV}
              /*
                ↓ THE FIX: mr-3 md:mr-5 gives real CSS right-margin between words.
                   inline-block ensures the margin is respected on flex-wrapped lines.
              */
              className="inline-block mr-3 md:mr-5"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle — fades in after headline finishes */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: SUB_DELAY, ease: 'easeOut' }}
          className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mb-12 leading-relaxed"
        >
          Automate MSBTE seat processing. Zero effort, 100% accuracy, running completely local.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: SUB_DELAY + 0.15, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          {/* Primary */}
          <a href="#download" id="hero-dl"
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-slate-900/25 transition-all cursor-pointer active:scale-95">
            <Download size={16} strokeWidth={2.5} aria-hidden="true"/>
            Download for Windows (.exe)
            <ArrowRight size={14} className="opacity-70" aria-hidden="true"/>
          </a>

          {/* Secondary */}
          <a href="#resources" id="hero-docs"
            className="flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-8 py-4 rounded-full border-2 border-slate-200 hover:border-slate-300 hover:scale-105 hover:shadow-xl transition-all cursor-pointer active:scale-95">
            <BookOpen size={15} aria-hidden="true"/>
            Read Documentation
          </a>
        </motion.div>

        {/*
          DEMO VIDEO — CONTAINED WITHIN THE HERO COLUMN
          max-w-3xl keeps it minimal (spec says smaller than before)
        */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-3xl mx-auto mt-16 aspect-video bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center border border-slate-800 cursor-pointer relative overflow-hidden group"
          role="button"
          aria-label="Watch demo video"
          tabIndex={0}
        >
          {/* Dark gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" aria-hidden="true"/>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_60%_60%_at_25%_30%,rgba(66,133,244,0.5),transparent),radial-gradient(ellipse_50%_50%_at_75%_70%,rgba(52,168,83,0.3),transparent)]" aria-hidden="true"/>

          {/* Terminal dots */}
          <div className="absolute top-0 inset-x-0 h-9 bg-slate-800/60 border-b border-slate-700/40 flex items-center px-5 gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-red-500/80"/>
            <span className="w-3 h-3 rounded-full bg-yellow-400/80"/>
            <span className="w-3 h-3 rounded-full bg-green-500/80"/>
            <span className="ml-3 text-xs text-slate-500 font-mono">MSBTE Master Scraper v1.0</span>
          </div>

          {/* Play icon — scales up on group-hover */}
          <div className="relative flex flex-col items-center gap-4 group-hover:scale-110 transition-transform duration-300">
            <div className="relative">
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-white/15 blur-xl group-hover:scale-125 transition-transform duration-300" aria-hidden="true"/>
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-2xl group-hover:bg-white/18 transition-colors duration-300">
                <Play size={28} className="text-white ml-1" fill="white" strokeWidth={1} aria-hidden="true"/>
              </div>
            </div>
            <p className="text-white/70 text-sm font-semibold tracking-wide group-hover:text-white transition-colors duration-200">
              Watch Demo <span className="text-white/40">(1:20)</span>
            </p>
          </div>
        </motion.div>

        {/* Scroll Mouse indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: SUB_DELAY + 0.7, duration: 0.6 }}
          className="flex flex-col items-center gap-2 mt-16 text-slate-400 font-semibold tracking-widest text-xs"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <Mouse size={20} strokeWidth={1.5}/>
          </motion.div>
          <span>Scroll to see how it works</span>
        </motion.div>

      </div>{/* end inner wrapper */}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURES — ZIG-ZAG GRID WITH PADDING
   ═══════════════════════════════════════════════════════════════════ */

const fRise = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function FeaturePlaceholder({ id }) {
  return (
    <div
      className="w-full aspect-[4/3] bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden relative flex flex-col items-center justify-center gap-4 p-6"
      aria-hidden="true"
    >
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
        <defs>
          <pattern id={`g-${id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${id})`}/>
      </svg>
      {/* Chart */}
      <div className="relative flex items-end gap-2">
        {[36,54,44,62,50,68,56].map((h, i) => (
          <div key={i} className="w-7 rounded-t"
            style={{ height: h, background: `linear-gradient(to top,${['#4285F4','#34A853','#EA4335','#FBBC05','#4285F4','#34A853','#EA4335'][i]}88,${['#4285F4','#34A853','#EA4335','#FBBC05','#4285F4','#34A853','#EA4335'][i]}44)` }}/>
        ))}
      </div>
      <div className="relative flex items-center gap-4">
        {[['Pass','#34A853'],['Fail','#EA4335'],['ATKT','#FBBC05']].map(([t,c]) => (
          <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full" style={{ background: c }}/>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    /* EXACT spec className */
    <section
      id="features"
      className="relative z-10 w-full py-32 bg-slate-50 border-y border-slate-100"
      aria-label="Features"
    >
      {/*
        BUG FIX #2 — inner wrapper enforced on every section.
        Nothing touches the screen edge.
      */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 flex flex-col gap-32">

        {/* Section header */}
        <motion.div
          variants={fRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Built for speed and precision.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
            Two powerful engines automating every step of result collection.
          </p>
        </motion.div>

        {/* Row 1 — Text left, Image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-5"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#4285F4] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full self-start">
              Smart Automation
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
              Bypasses network fatigue, resolves captchas instantly.
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Intelligent retry engine with exponential back-off, auto session refresh, and adaptive rate limiting. Set it once and walk away.
            </p>
            <ul className="flex flex-col gap-3.5" role="list">
              {[
                'Adaptive retry with exponential back-off',
                'Automatic session management & refresh',
                'Zero manual captcha interaction',
              ].map(b => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-[#34A853] shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true"/>
                  <span className="text-sm font-medium text-slate-600">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <FeaturePlaceholder id="auto"/>
          </motion.div>
        </div>

        {/* Row 2 — Image left, Text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="order-2 lg:order-1"
          >
            <FeaturePlaceholder id="excel"/>
          </motion.div>

          <motion.div
            variants={fRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-5 order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#34A853] bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full self-start">
              Auto-Excel Formatting
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
              Generates a polished Excel with merged headers &amp; analytics.
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Beautiful .xlsx output — merged subject-group headers, colour-coded pass/fail rows, and a built-in summary sheet with pass percentages.
            </p>
            <ul className="flex flex-col gap-3.5" role="list">
              {[
                'Merged headers, colour-coded rows',
                'Built-in analytics & pass-rate summary',
                'One-click export — no macros needed',
              ].map(b => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-[#4285F4] shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true"/>
                  <span className="text-sm font-medium text-slate-600">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RESOURCES — STAGGERED CARDS
   ═══════════════════════════════════════════════════════════════════ */

const cardContainerV = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};
const cardV = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const CARDS = [
  {
    id: 'install', Icon: FileText,
    color: '#4285F4', bg: 'bg-blue-50', border: 'border-blue-100',
    title: 'Installation Guide',
    desc:  'Step-by-step from download to first run. Covers Defender bypass, .NET runtime, and folder setup.',
    cta:   'Read guide',
  },
  {
    id: 'trouble', Icon: Wrench,
    color: '#FBBC05', bg: 'bg-amber-50', border: 'border-amber-100',
    title: 'Troubleshooting & Failed Seats',
    desc:  'Portal timeouts, absent students, partial re-runs — every edge case documented without duplication.',
    cta:   'See solutions',
  },
  {
    id: 'privacy', Icon: ShieldCheck,
    color: '#34A853', bg: 'bg-emerald-50', border: 'border-emerald-100',
    title: 'Data Privacy',
    desc:  'Everything runs on your machine. No uploads, no remote storage, no third parties ever. Always local.',
    cta:   'Learn more',
  },
];

function ResourcesSection() {
  return (
    /* EXACT spec className */
    <section
      id="resources"
      className="relative z-10 w-full py-32 bg-white"
      aria-label="Resources"
    >
      {/* BUG FIX #2 — inner wrapper */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header — large bottom margin per spec */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Resources to get you started.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
            Everything you need from day one.
          </p>
        </motion.div>

        {/* Staggered cards grid */}
        <motion.div
          variants={cardContainerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {CARDS.map(c => (
            <motion.a
              key={c.id}
              href="#"
              id={`res-${c.id}`}
              variants={cardV}
              aria-label={c.title}
              /* EXACT spec card className */
              className="bg-slate-50 border border-slate-100 p-10 rounded-[2rem] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col gap-5 no-underline group"
            >
              {/* Icon — left aligned */}
              <div className={`w-12 h-12 ${c.bg} border ${c.border} rounded-2xl flex items-center justify-center`}>
                <c.Icon size={22} style={{ color: c.color }} strokeWidth={1.75} aria-hidden="true"/>
              </div>

              {/* Title — left aligned */}
              <h3 className="text-base font-bold text-slate-900 leading-snug">{c.title}</h3>

              {/* Desc — left aligned */}
              <p className="text-sm text-slate-500 leading-relaxed font-medium flex-1">{c.desc}</p>

              {/* CTA — left aligned */}
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
                style={{ color: c.color }}>
                {c.cta}
                <ArrowRight size={14} aria-hidden="true"/>
              </span>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DOWNLOAD CTA SECTION
   ═══════════════════════════════════════════════════════════════════ */
function DownloadSection() {
  return (
    <section
      id="download"
      className="relative z-10 w-full py-32 bg-slate-50 border-t border-slate-100"
      aria-label="Download"
    >
      {/* BUG FIX #2 — inner wrapper */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow-xl shadow-blue-200/60">
            <Download size={28} className="text-white" strokeWidth={2} aria-hidden="true"/>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Ready to automate?
          </h2>
          <p className="text-slate-500 text-lg max-w-md font-medium leading-relaxed">
            Download the Windows installer and have your first result sheet ready in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <a href="#" id="dl-btn-main"
              className="group flex items-center gap-2.5 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-slate-900/25 transition-all cursor-pointer active:scale-95">
              <Download size={16} strokeWidth={2.5} aria-hidden="true"/>
              Download for Windows (.exe)
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true"/>
            </a>
            <a href="https://github.com/prajwal-2509/MSBTE-exe-Download-Web"
              id="github-btn" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-full border-2 border-slate-200 hover:border-slate-300 hover:scale-105 hover:shadow-lg transition-all cursor-pointer active:scale-95">
              <Github size={15} aria-hidden="true"/>
              View on GitHub
            </a>
          </div>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#34A853] shrink-0" aria-hidden="true"/>
            Windows 10/11 · .NET 6.0 Runtime · No internet required at runtime
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FOOTER — EXACT SPEC
   ═══════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    /* EXACT spec className */
    <footer className="relative z-10 w-full border-t border-slate-200 bg-slate-50 py-10" role="contentinfo">
      {/* EXACT spec inner wrapper */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow shadow-blue-200">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <span className="font-bold text-slate-700 text-[13px]">MSBTE Master Scraper</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6" aria-label="Footer">
          {[['Features','#features'],['Resources','#resources'],['Download','#download']].map(([l,h]) => (
            <a key={h} href={h} className="hover:text-slate-800 transition-colors cursor-pointer">{l}</a>
          ))}
        </nav>

        {/* Attribution */}
        <div className="flex flex-col items-center md:items-end gap-0.5 text-right">
          {/* Left: EXACT spec */}
          <p>© 2026 MSBTE Master Scraper. All rights reserved.</p>
          {/* Right: EXACT spec */}
          <p>Developed by Prajwal Hulle | Govt. Polytechnic, Solapur</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT APP
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    /*
      EXACT spec wrapper: "relative w-full bg-white text-slate-900 font-sans overflow-x-hidden"
      BUG FIX #3 — flex flex-col min-h-screen so footer is pushed to the bottom
      by the flex-grow main element. No overlapping possible.
    */
    <div className="relative w-full bg-white text-slate-900 overflow-x-hidden flex flex-col min-h-screen"
      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>

      {/* Fixed particle canvas — z-0, behind all content */}
      <CanvasBackground />

      {/* Floating navbar — fixed, z-50 */}
      <Navbar />

      {/*
        BUG FIX #3 — flex-grow pushes footer to the absolute bottom.
        All sections are direct children of main — standard document flow.
      */}
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <ResourcesSection />
        <DownloadSection />
      </main>

      {/* Footer — sits after flex-grow main, always at the bottom */}
      <Footer />
    </div>
  );
}
