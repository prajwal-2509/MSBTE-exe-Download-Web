import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   CANVAS BACKGROUND COMPONENT
   • 150 tiny particles, radius 1–3 px, Google colors
   • mousemove tracks mouse.x / mouse.y
   • RAF loop: particles float; if Math.hypot(dx,dy) < 120 → repel via vx/vy
   • friction 0.9 + spring pulls back to originX/originY
───────────────────────────────────────────────────────────────────────────── */
const GOOGLE = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

function mkP(W, H) {
  const x = Math.random() * W;
  const y = Math.random() * H;
  return {
    x, y,
    originX: x,
    originY: y,
    vx: 0, vy: 0,
    r:     Math.random() * 2 + 1,                        // radius 1–3 px
    color: GOOGLE[Math.floor(Math.random() * 4)],
    phase: Math.random() * Math.PI * 2,
  };
}

function CanvasParticles() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let ps = Array.from({ length: 150 }, () => mkP(W, H));

    // Mouse tracking
    let mouseX = -9999, mouseY = -9999;
    const onMove  = e => { mouseX = e.clientX; mouseY = e.clientY; };
    const onLeave = () => { mouseX = -9999;    mouseY = -9999;     };
    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });

    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      ps = Array.from({ length: 150 }, () => mkP(W, H));
    };
    window.addEventListener('resize', onResize, { passive: true });

    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * 0.001;

      ps.forEach(p => {
        /* Spring force back to origin */
        p.vx += (p.originX - p.x) * 0.02;
        p.vy += (p.originY - p.y) * 0.02;

        /* Sine-wave float */
        p.vy += Math.sin(t + p.phase) * 0.03;

        /* Mouse repulsion — EXACT MATH: Math.hypot for distance */
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        if (Math.hypot(dx, dy) < 120) {
          /* repel away using velocity */
          p.vx += dx * 0.04;
          p.vy += dy * 0.04;
        }

        /* Friction — returns particle to its natural path */
        p.vx *= 0.9;
        p.vy *= 0.9;

        /* Apply velocity */
        p.x += p.vx;
        p.y += p.vy;

        /* Draw crisp circle */
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
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HEADLINE WORD-STAGGER (Framer Motion)
   CRITICAL FIX: each word gets `inline-block mr-3 md:mr-5` so words never squish
───────────────────────────────────────────────────────────────────────────── */
const WORDS = 'Experience liftoff with the next-gen result scraper.'.split(' ');

const sentenceV = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09 } },
};
const wordV = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
};

const WORD_DELAY = WORDS.length * 0.09 + 0.25; // when subtitle / buttons appear

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT APP
   Following the EXACT structural skeleton provided by the user.
   Every wrapper class is copied verbatim.
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  return (

    /* ═══ EXACT SPEC WRAPPER ══════════════════════════════════════════════ */
    <main className="relative w-full min-h-screen bg-white font-sans overflow-x-hidden"
      style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>


      {/* ════════════════════════════════════════════════════════════════════
          1. CANVAS BACKGROUND — fixed behind everything
          EXACT SPEC wrapper: fixed inset-0 z-0 pointer-events-none opacity-70
         ════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
        <CanvasParticles />
      </div>


      {/* ════════════════════════════════════════════════════════════════════
          2. HEADER / NAVBAR
          EXACT SPEC: fixed top-0 w-full z-50 bg-white/50 backdrop-blur-md
         ════════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 bg-white/50 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Brand — EXACT SPEC */}
          <div className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow shadow-blue-300" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/>
                <path d="M8 5.5L10.5 7V10L8 11.5L5.5 10V7Z" fill="white" fillOpacity="0.4"/>
              </svg>
            </div>
            MSBTE Scraper
          </div>

          {/* Nav links — EXACT SPEC */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#resources" className="hover:text-slate-900 transition-colors">Resources</a>
          </div>

          {/* CTA — EXACT SPEC */}
          <button
            onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform hover:bg-slate-700 cursor-pointer">
            Download
          </button>
        </div>
      </nav>


      {/* ════════════════════════════════════════════════════════════════════
          3. HERO SECTION
          EXACT SPEC: relative z-10 w-full h-screen flex flex-col items-center justify-center pt-20
         ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 w-full h-screen flex flex-col items-center justify-center pt-20"
        id="hero" aria-label="Hero">

        {/* EXACT SPEC inner wrapper */}
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">

          {/* Pill badge — EXACT SPEC */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-widest uppercase mb-8 border border-blue-100"
          >
            Now Available for Windows
          </motion.div>

          {/* ── HEADLINE — FRAMER MOTION WORD STAGGER ──────────────────────
              EXACT SPEC className on h1.
              CRITICAL WORD-SPACING FIX: every word span has
              `inline-block mr-3 md:mr-5` — words physically cannot squish.
             ────────────────────────────────────────────────────────────── */}
          {/* FIX 1 — OVERLAPPING HEADLINE FIX
               flex-wrap + gap-x/gap-y on the parent handles ALL word spacing.
               No mr- on spans needed — flex gap is the correct CSS solution. */}
          <motion.h1
            variants={sentenceV}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center gap-x-3 md:gap-x-5 gap-y-2 md:gap-y-4 text-5xl md:text-[5.5rem] font-extrabold tracking-tight text-slate-900 mb-8 max-w-5xl"
            aria-label="Experience liftoff with the next-gen result scraper."
          >
            {WORDS.map((word, i) => (
              <motion.span
                key={i}
                variants={wordV}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle — EXACT SPEC, fades in after headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: WORD_DELAY, ease: 'easeOut' }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium"
          >
            Automate MSBTE seat processing.{' '}
            <span className="font-bold text-slate-800">Zero effort, 100% accuracy</span>,
            running completely local.
          </motion.p>

          {/* FIX 2 — BUTTON CONTAINER: flex-wrap + justify-center + w-full px-4
               whitespace-nowrap on each button prevents text from wrapping inside the pill. */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: WORD_DELAY + 0.15, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 items-center z-20 pointer-events-auto w-full px-4"
          >
            {/* Primary */}
            <button
              id="hero-download-btn"
              onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}
              className="whitespace-nowrap bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 cursor-pointer hover:bg-slate-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download for Windows (.exe)
            </button>

            {/* Secondary */}
            <button
              id="hero-docs-btn"
              onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}
              className="whitespace-nowrap bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-semibold hover:border-slate-300 transition-all cursor-pointer hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg">
              Read Documentation
            </button>
          </motion.div>
        </div>

        {/* FIX 3 — SCROLL INDICATOR wrapped in <a href="#demo">
               Clicking it smoothly scrolls to the demo section.              */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: WORD_DELAY + 0.7, duration: 0.6 }}
        >
          <a
            href="#demo"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer z-20"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll to explore</span>
            <motion.div
              animate={{ scaleY: [1, 0.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-current to-transparent"
            />
          </a>
        </motion.div>
      </section>


      {/* ════════════════════════════════════════════════════════════════════
          4. DEMO VIDEO SECTION
          EXACT SPEC: relative z-10 w-full py-24 bg-white
         ════════════════════════════════════════════════════════════════════ */}
      {/* id="demo" added so the scroll indicator anchor above can target it */}
      <section id="demo" className="relative z-10 w-full py-24 bg-white" aria-label="Demo">

        {/* EXACT SPEC inner wrapper */}
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center">

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-8"
          >
            See it in action
          </motion.p>

          {/* Demo video — EXACT SPEC, wrapped in Framer Motion whileInView */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="w-full aspect-video bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center border border-slate-800 cursor-pointer hover:shadow-blue-500/20 transition-shadow group relative overflow-hidden"
            role="button"
            aria-label="Watch demo video"
            tabIndex={0}
          >
            {/* Background depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" aria-hidden="true"/>
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_60%_60%_at_25%_30%,rgba(66,133,244,0.5),transparent),radial-gradient(ellipse_50%_50%_at_75%_70%,rgba(52,168,83,0.3),transparent)]" aria-hidden="true"/>

            {/* Terminal dots */}
            <div className="absolute top-0 inset-x-0 h-9 bg-slate-800/60 border-b border-slate-700/40 flex items-center px-5 gap-1.5" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-red-500/80"/>
              <span className="w-3 h-3 rounded-full bg-yellow-400/80"/>
              <span className="w-3 h-3 rounded-full bg-green-500/80"/>
              <span className="ml-3 text-xs text-slate-500 font-mono">MSBTE Master Scraper v1.0</span>
            </div>

            {/* EXACT SPEC play icon */}
            <div className="relative w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform shadow-2xl">
              {/* EXACT SPEC CSS triangle */}
              <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-white ml-1" aria-hidden="true"/>
            </div>

            {/* FIX 3b — fade-in animation on Watch Demo text */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/70 mt-6 font-medium tracking-wide relative group-hover:text-white transition-colors"
            >
              Watch Demo <span className="text-white/40">(1:20)</span>
            </motion.p>
          </motion.div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════════
          5. FEATURES ZIG-ZAG GRID
          EXACT SPEC: relative z-10 w-full py-32 bg-slate-50 border-t border-slate-100
         ════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 w-full py-32 bg-slate-50 border-t border-slate-100" aria-label="Features">

        {/* EXACT SPEC inner wrapper — stops content touching left edge */}
        <div className="w-full max-w-6xl mx-auto px-6 flex flex-col gap-32">

          {/* Section header — EXACT SPEC */}
          <div className="w-full text-center mb-[-40px]">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Built for speed and precision.
            </motion.h2>
          </div>

          {/* ── ROW 1: Text LEFT, Image RIGHT — EXACT SPEC ───────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Left text — EXACT SPEC */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start text-left"
            >
              <span className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-4">Smart Automation</span>
              <h3 className="text-3xl font-bold tracking-tight mb-6">
                Bypasses network fatigue, resolves captchas instantly.
              </h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Our intelligent retry engine handles MSBTE portal instability automatically. Set it once and walk away.
              </p>
              {/* Checkmarks */}
              <ul className="flex flex-col gap-3">
                {['Adaptive retry with exponential back-off','Auto session management & refresh','Zero manual captcha interaction'].map(b => (
                  <li key={b} className="flex items-start gap-3">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span className="text-sm font-medium text-slate-600">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right image — EXACT SPEC */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="w-full aspect-[4/3] bg-white rounded-3xl shadow-lg border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center gap-4 p-6"
              aria-label="Smart Automation Preview"
            >
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true" preserveAspectRatio="none">
                <defs><pattern id="g1" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.8"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#g1)"/>
              </svg>
              {/* Bar chart */}
              <div className="relative flex items-end gap-2" aria-hidden="true">
                {[36,54,44,62,50,68,56].map((h,i)=>(
                  <div key={i} className="w-7 rounded-t" style={{ height:h, background:`linear-gradient(to top,#4285F4${(80+i*10).toString(16)},#34A853${(60+i*8).toString(16)})` }}/>
                ))}
              </div>
              <div className="relative flex items-center gap-4" aria-hidden="true">
                {[['Pass','#34A853'],['Fail','#EA4335'],['ATKT','#FBBC05']].map(([t,c])=>(
                  <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <span className="w-2 h-2 rounded-full" style={{ background:c }}/>{t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── ROW 2: Image LEFT, Text RIGHT (zig-zag) ───────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Left image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="w-full aspect-[4/3] bg-white rounded-3xl shadow-lg border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center gap-4 p-6 order-2 md:order-1"
              aria-label="Excel Output Preview"
            >
              {/* Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true" preserveAspectRatio="none">
                <defs><pattern id="g2" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.8"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#g2)"/>
              </svg>
              {/* Spreadsheet mockup */}
              <div className="relative w-52 rounded-xl overflow-hidden border border-slate-200 shadow text-xs" aria-hidden="true">
                <div className="grid grid-cols-4 bg-slate-700 text-white font-bold">
                  {['Roll','Name','Sub 1','Result'].map(h=><div key={h} className="px-2 py-2 border-r border-slate-600 last:border-0 truncate">{h}</div>)}
                </div>
                {[['2401','Aditya','72','PASS'],['2402','Priya','58','PASS'],['2403','Rahul','36','FAIL'],['2404','Sneha','81','PASS']].map(([r,n,s,res])=>(
                  <div key={r} className={`grid grid-cols-4 border-t border-slate-100 ${res==='FAIL'?'bg-red-50':'bg-white'}`}>
                    {[r,n,s,res].map((v,i)=><div key={i} className={`px-2 py-1.5 border-r border-slate-100 last:border-0 truncate font-medium ${i===3?(res==='PASS'?'text-emerald-600':'text-red-600'):''}`}>{v}</div>)}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start text-left order-1 md:order-2"
            >
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4">Auto-Excel Formatting</span>
              <h3 className="text-3xl font-bold tracking-tight mb-6">
                Generates a polished Excel with merged headers &amp; analytics.
              </h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Every run produces a beautifully formatted .xlsx — merged subject-group headers, colour-coded pass/fail rows, and a built-in summary sheet with pass percentages.
              </p>
              <ul className="flex flex-col gap-3">
                {['Merged headers, colour-coded pass/fail rows','Built-in analytics & pass-rate summary','One-click export — no macros needed'].map(b=>(
                  <li key={b} className="flex items-start gap-3">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span className="text-sm font-medium text-slate-600">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════════
          6. RESOURCES GRID
          EXACT SPEC: relative z-10 w-full py-32 bg-white
         ════════════════════════════════════════════════════════════════════ */}
      <section id="resources" className="relative z-10 w-full py-32 bg-white" aria-label="Resources">

        {/* EXACT SPEC inner wrapper */}
        <div className="w-full max-w-6xl mx-auto px-6">

          {/* EXACT SPEC heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-extrabold tracking-tight text-center mb-16"
          >
            Resources to get you started.
          </motion.h2>

          {/* EXACT SPEC grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 — EXACT SPEC */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22,1,0.36,1], delay: 0 }}
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Installation Guide</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Step-by-step walkthrough from download to your first run. Covers Windows Defender bypass, .NET runtime, and folder structure.
              </p>
              <a href="#" className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">Read guide &rarr;</a>
            </motion.div>

            {/* Card 2 — Troubleshooting */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22,1,0.36,1], delay: 0.09 }}
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBBC05" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Troubleshooting & Failed Seats</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Portal timeouts, absent students, partial re-runs — every edge case documented without result duplication.
              </p>
              <a href="#" className="text-amber-600 font-semibold text-sm hover:text-amber-700 transition-colors">See solutions &rarr;</a>
            </motion.div>

            {/* Card 3 — Data Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22,1,0.36,1], delay: 0.18 }}
              className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Data Privacy</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Everything runs on your machine. No uploads, no remote storage, no third parties ever. Student records stay private, always.
              </p>
              <a href="#" className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors">Learn more &rarr;</a>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════════
          DOWNLOAD CTA (bonus section)
         ════════════════════════════════════════════════════════════════════ */}
      <section id="download" className="relative z-10 w-full py-32 bg-slate-50 border-t border-slate-100" aria-label="Download">
        <div className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
            className="flex flex-col items-center gap-6 max-w-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200/60">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Ready to automate?</h2>
            <p className="text-slate-500 leading-relaxed">
              Download the Windows installer and have your first result sheet ready in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-2">
              <button id="download-main-btn"
                className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 cursor-pointer hover:bg-slate-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download for Windows (.exe)
              </button>
              <a href="https://github.com/prajwal-2509/MSBTE-exe-Download-Web"
                target="_blank" rel="noopener noreferrer"
                className="bg-white border-2 border-slate-200 text-slate-700 px-7 py-3.5 rounded-full font-semibold hover:border-slate-300 transition-all cursor-pointer hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                View on GitHub
              </a>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true"/>
              Windows 10/11 · .NET 6.0 Runtime · No internet required at runtime
            </p>
          </motion.div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════════
          7. FOOTER — EXACT SPEC
          relative z-10 w-full bg-slate-50 border-t border-slate-200 py-10 mt-20
         ════════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 w-full bg-slate-50 border-t border-slate-200 py-10 mt-20" role="contentinfo">

        {/* FIX 4 — FOOTER ALIGNMENT: max-w-7xl, lg:flex-row, gap-8, text-center lg:text-left */}
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-center text-sm text-slate-500 font-medium gap-8 text-center lg:text-left">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center shadow shadow-blue-200" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/></svg>
            </div>
            <span className="font-bold text-slate-700">MSBTE Master Scraper</span>
          </div>

          {/* Nav */}
          <div className="flex gap-6">
            <a href="#features" className="hover:text-slate-800 transition-colors">Features</a>
            <a href="#resources" className="hover:text-slate-800 transition-colors">Resources</a>
            <a href="#download" className="hover:text-slate-800 transition-colors">Download</a>
          </div>

          {/* EXACT SPEC attribution */}
          <div className="flex flex-col items-center md:items-end gap-0.5">
            {/* Left spec text */}
            <p>© 2026 MSBTE Master Scraper.</p>
            {/* Right spec text */}
            <p>Developed by Prajwal Hulle | Govt. Polytechnic, Solapur | Academic Year: 2025–2026</p>
          </div>

        </div>
      </footer>


    </main>
  );
}
