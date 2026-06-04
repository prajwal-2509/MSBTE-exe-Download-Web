"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Download,
  BookOpen,
  Play,
  CheckCircle2,
  FileText,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Github,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  phase: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */
const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"] as const;

function makeParticle(W: number, H: number): Particle {
  const x = Math.random() * W;
  const y = Math.random() * H;
  return {
    x,
    y,
    originX: x,
    originY: y,
    vx: 0,
    vy: 0,
    r: Math.random() * 2 + 1,
    color: GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS BACKGROUND
   • 120 tiny dots in Google colors
   • Slowly drift with sine-wave float
   • Mouse proximity < 120px → repel via vx/vy; friction pulls back to origin
   ═══════════════════════════════════════════════════════════════════════════ */
function CanvasBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let particles: Particle[] = Array.from({ length: 120 }, () =>
      makeParticle(W, H)
    );

    let mouseX = -9999,
      mouseY = -9999;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from({ length: 120 }, () => makeParticle(W, H));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    let raf: number;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * 0.001;

      particles.forEach((p) => {
        /* Spring force back to origin */
        p.vx += (p.originX - p.x) * 0.02;
        p.vy += (p.originY - p.y) * 0.02;

        /* Sine-wave gentle float */
        p.vy += Math.sin(t + p.phase) * 0.03;

        /* Mouse repulsion — Math.hypot distance check */
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        if (Math.hypot(dx, dy) < 120) {
          p.vx += dx * 0.04;
          p.vy += dy * 0.04;
        }

        /* Friction — dampens velocity, particle returns to origin naturally */
        p.vx *= 0.9;
        p.vy *= 0.9;

        p.x += p.vx;
        p.y += p.vy;

        /* Draw crisp dot */
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
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    /*
      EXACT SPEC: fixed inset-0 z-0 pointer-events-none bg-white
      bg-white gives the page its pristine background; canvas dots sit on top.
    */
    <canvas
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none bg-white opacity-70"
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INNER CONTAINER — DRY helper used inside every section
   CRITICAL: prevents content from ever touching the viewport edges
   ═══════════════════════════════════════════════════════════════════════════ */
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-6xl mx-auto px-6 md:px-12 ${className}`}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════════════════════ */
function Header() {
  return (
    /* EXACT SPEC: sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b py-4 */
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
      <Container className="flex items-center justify-between">

        {/* Logo — left */}
        <a href="#" className="flex items-center gap-2.5 group" aria-label="Home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow shadow-blue-200 group-hover:scale-105 transition-transform">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95" />
              <path d="M8 5.5L10.5 7V10L8 11.5L5.5 10V7Z" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="font-bold text-[15px] text-slate-900 tracking-tight">
            MSBTE Scraper
          </span>
        </a>

        {/* Navigation — center */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {[
            ["Features", "#features"],
            ["Resources", "#resources"],
            ["Download", "#download"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Download CTA — right */}
        <a
          href="#download"
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-slate-900/20 cursor-pointer"
          aria-label="Download"
        >
          <Download size={13} strokeWidth={2.5} aria-hidden="true" />
          Download
        </a>
      </Container>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO — Headline word stagger
   ═══════════════════════════════════════════════════════════════════════════ */
const WORDS = "Experience liftoff with the next-gen result scraper.".split(" ");

/* EXACT SPEC: parent is flex flex-wrap justify-center gap-x-3 md:gap-x-5 gap-y-2 */
const sentenceV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const wordV = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};
const WORD_DELAY = WORDS.length * 0.09 + 0.3;

function Hero() {
  return (
    /*
      EXACT SPEC: flex flex-col justify-center items-center pt-32 pb-20 text-center min-h-[85vh]
      Standard document flow — no absolute positioning for content.
    */
    <section
      id="hero"
      className="flex flex-col justify-center items-center pt-32 pb-20 text-center min-h-[85vh]"
      aria-label="Hero"
    >
      <Container className="flex flex-col items-center">

        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-[0.14em] uppercase border border-blue-100 mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] animate-pulse" aria-hidden="true" />
          Now Available for Windows
        </motion.div>

        {/*
          HEADLINE — word-by-word stagger
          CRITICAL FIX: parent is `flex flex-wrap justify-center gap-x-3 md:gap-x-5 gap-y-2`
          Words never overlap because flex gap handles spacing — NOT inline margins.
        */}
        <motion.h1
          variants={sentenceV}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-x-3 md:gap-x-5 gap-y-2 text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl"
          aria-label="Experience liftoff with the next-gen result scraper."
        >
          {WORDS.map((word, i) => (
            <motion.span key={i} variants={wordV}>
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline — EXACT SPEC className */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: WORD_DELAY, ease: "easeOut" }}
          className="text-xl text-slate-500 max-w-2xl mx-auto mt-8 leading-relaxed font-medium"
        >
          Automate MSBTE seat processing.{" "}
          <span className="font-bold text-slate-800">Zero effort, 100% accuracy</span>,
          running completely local.
        </motion.p>

        {/* Buttons — EXACT SPEC container */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: WORD_DELAY + 0.15, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          {/* Primary */}
          <a
            href="#download"
            id="hero-download"
            className="whitespace-nowrap flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-slate-900/25 transition-all cursor-pointer active:scale-95"
          >
            <Download size={16} strokeWidth={2.5} aria-hidden="true" />
            Download for Windows (.exe)
          </a>

          {/* Secondary */}
          <a
            href="#resources"
            id="hero-docs"
            className="whitespace-nowrap flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <BookOpen size={15} aria-hidden="true" />
            Read Documentation
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#demo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: WORD_DELAY + 0.7, duration: 0.6 }}
          className="flex flex-col items-center gap-2 mt-20 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
          aria-label="Scroll to demo"
        >
          <span className="text-[9px] uppercase tracking-[0.22em] font-bold">
            Scroll to explore
          </span>
          <motion.div
            animate={{ scaleY: [1, 0.5, 1], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-current to-transparent"
          />
        </motion.a>

      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEMO VIDEO SECTION
   ═══════════════════════════════════════════════════════════════════════════ */
function DemoSection() {
  return (
    /* EXACT SPEC: py-24 w-full bg-slate-50 border-t border-slate-100 */
    <section
      id="demo"
      className="py-24 w-full bg-slate-50 border-t border-slate-100"
      aria-label="Demo"
    >
      <Container className="flex flex-col items-center">

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-8"
        >
          See it in action
        </motion.p>

        {/*
          EXACT SPEC motion.div — fades and slides up on scroll (whileInView).
          aspect-video w-full max-w-4xl mx-auto bg-slate-900 rounded-[2rem] shadow-2xl
          flex flex-col items-center justify-center cursor-pointer group
        */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="aspect-video w-full max-w-4xl mx-auto bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden border border-slate-800 hover:shadow-blue-500/20 transition-shadow"
          role="button"
          aria-label="Watch demo video"
          tabIndex={0}
        >
          {/* Dark bg gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_60%_60%_at_25%_30%,rgba(66,133,244,0.5),transparent),radial-gradient(ellipse_50%_50%_at_75%_70%,rgba(52,168,83,0.3),transparent)]" />

          {/* Terminal dots */}
          <div className="absolute top-0 inset-x-0 h-9 bg-slate-800/60 border-b border-slate-700/40 flex items-center px-5 gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-slate-500 font-mono">MSBTE Master Scraper v1.0</span>
          </div>

          {/* Play icon — white, scales on group-hover */}
          <div className="relative flex flex-col items-center gap-5 group-hover:scale-110 transition-transform duration-300">
            <div className="relative">
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-white/15 blur-xl group-hover:scale-125 transition-transform duration-300" />
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:bg-white/18 transition-colors duration-300">
                <Play size={30} className="text-white ml-1.5" fill="white" strokeWidth={1} />
              </div>
            </div>

            {/* Watch Demo text — fades in */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="text-white/70 font-medium tracking-wide text-sm relative group-hover:text-white transition-colors duration-200"
            >
              Watch Demo <span className="text-white/40">(1:20)</span>
            </motion.p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURES — ZIG-ZAG GRID
   ═══════════════════════════════════════════════════════════════════════════ */
const riseV = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

function ChartPlaceholder({ id }: { id: string }) {
  return (
    <div className="w-full aspect-[4/3] bg-white rounded-3xl border border-slate-200 shadow-lg relative overflow-hidden flex flex-col items-center justify-center gap-4 p-6">
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id={`g-${id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${id})`} />
      </svg>
      <div className="relative flex items-end gap-2">
        {[36, 54, 44, 62, 50, 68, 56].map((h, i) => (
          <div
            key={i}
            className="w-7 rounded-t"
            style={{
              height: h,
              background: `linear-gradient(to top, ${["#4285F4", "#34A853", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"][i]}99,${["#4285F4", "#34A853", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"][i]}44)`,
            }}
          />
        ))}
      </div>
      <div className="relative flex items-center gap-4">
        {([["Pass", "#34A853"], ["Fail", "#EA4335"], ["ATKT", "#FBBC05"]] as const).map(([t, c]) => (
          <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-32 w-full bg-white border-t border-slate-100"
      aria-label="Features"
    >
      <Container className="flex flex-col gap-32">

        {/* Section label */}
        <motion.div
          variants={riseV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Built for speed and precision.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
            Two powerful engines automating every step.
          </p>
        </motion.div>

        {/* Row 1 — Text left, Image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={riseV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-5"
          >
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#4285F4]">
              Smart Automation
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
              Bypasses network fatigue, resolves captchas instantly.
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Intelligent retry engine with exponential back-off, auto session refresh, and adaptive rate limiting. Set it once and walk away.
            </p>
            <ul className="flex flex-col gap-3">
              {["Adaptive retry with exponential back-off", "Auto session management & refresh", "Zero manual captcha interaction"].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-[#34A853] shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-sm font-medium text-slate-600">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={riseV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <ChartPlaceholder id="auto" />
          </motion.div>
        </div>

        {/* Row 2 — Image left, Text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={riseV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="order-2 lg:order-1"
          >
            <ChartPlaceholder id="excel" />
          </motion.div>

          <motion.div
            variants={riseV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-5 order-1 lg:order-2"
          >
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#34A853]">
              Auto-Excel Formatting
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
              Generates a polished Excel with merged headers &amp; analytics.
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Beautifully formatted .xlsx — merged subject-group headers, colour-coded pass/fail rows, and a built-in pass-rate summary sheet.
            </p>
            <ul className="flex flex-col gap-3">
              {["Merged headers, colour-coded rows", "Built-in analytics & pass-rate summary", "One-click export — no macros needed"].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-[#4285F4] shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-sm font-medium text-slate-600">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESOURCES
   ═══════════════════════════════════════════════════════════════════════════ */
const CARDS = [
  {
    id: "install",
    Icon: FileText,
    color: "#4285F4",
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "Installation Guide",
    desc: "Step-by-step from download to first run. Covers Defender bypass, .NET runtime, and folder setup.",
    cta: "Read guide",
  },
  {
    id: "trouble",
    Icon: Wrench,
    color: "#FBBC05",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Troubleshooting",
    desc: "Portal timeouts, absent students, partial re-runs — every edge case documented without duplication.",
    cta: "See solutions",
  },
  {
    id: "privacy",
    Icon: ShieldCheck,
    color: "#34A853",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Data Privacy",
    desc: "Everything runs on your machine. No uploads, no remote storage. Student data stays local, always.",
    cta: "Learn more",
  },
] as const;

const cardContainerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const cardV = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

function ResourcesSection() {
  return (
    <section
      id="resources"
      className="py-32 w-full bg-slate-50 border-t border-slate-100"
      aria-label="Resources"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Resources to get you started.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Everything you need from day one.
          </p>
        </motion.div>

        <motion.div
          variants={cardContainerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {CARDS.map((c) => (
            <motion.a
              key={c.id}
              href="#"
              id={`res-${c.id}`}
              variants={cardV}
              className="group flex flex-col gap-5 bg-white border border-slate-200 rounded-[2rem] p-10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer no-underline"
              aria-label={c.title}
            >
              <div className={`w-12 h-12 ${c.bg} border ${c.border} rounded-2xl flex items-center justify-center`}>
                <c.Icon size={22} style={{ color: c.color }} strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">{c.desc}</p>
              <span
                className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all duration-200"
                style={{ color: c.color }}
              >
                {c.cta}
                <ArrowRight size={14} />
              </span>
            </motion.a>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DOWNLOAD CTA
   ═══════════════════════════════════════════════════════════════════════════ */
function DownloadSection() {
  return (
    <section
      id="download"
      className="py-32 w-full bg-white border-t border-slate-100"
      aria-label="Download"
    >
      <Container className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 max-w-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow-xl shadow-blue-200/60">
            <Download size={28} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Ready to automate?
          </h2>
          <p className="text-slate-500 leading-relaxed text-lg">
            Download the Windows installer and have your first result sheet ready in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <a
              href="#"
              id="dl-main"
              className="whitespace-nowrap group flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-slate-900/25 transition-all cursor-pointer active:scale-95"
            >
              <Download size={16} strokeWidth={2.5} />
              Download for Windows (.exe)
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="https://github.com/prajwal-2509/MSBTE-exe-Download-Web"
              target="_blank"
              rel="noopener noreferrer"
              id="github-link"
              className="whitespace-nowrap flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-full hover:scale-105 hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Github size={15} />
              View on GitHub
            </a>
          </div>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#34A853] shrink-0" />
            Windows 10/11 · .NET 6.0 Runtime · No internet required at runtime
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    /* EXACT SPEC: w-full bg-white border-t border-slate-200 py-10 mt-auto */
    <footer className="w-full bg-white border-t border-slate-200 py-10 mt-auto" role="contentinfo">
      <Container>
        {/* EXACT SPEC: flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 gap-4 text-center sm:text-left */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 gap-4 text-center sm:text-left">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow shadow-blue-100">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95" />
              </svg>
            </div>
            <span className="font-bold text-slate-700 text-[13px]">MSBTE Master Scraper</span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-6" aria-label="Footer">
            {[["Features", "#features"], ["Resources", "#resources"], ["Download", "#download"]].map(([l, h]) => (
              <a key={h} href={h} className="hover:text-slate-800 transition-colors">
                {l}
              </a>
            ))}
          </nav>

          {/* Attribution */}
          <div className="flex flex-col items-center sm:items-end gap-0.5 font-medium">
            <p>© 2026 MSBTE Master Scraper.</p>
            <p>Developed by Prajwal Hulle | Govt. Polytechnic, Solapur</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT PAGE — EXACT SPEC SHELL
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  return (
    <>
      {/* Canvas is isolated at z-0 — completely behind the main shell */}
      <CanvasBackground />

      {/*
        EXACT SPEC main shell:
        relative flex flex-col min-h-screen overflow-hidden z-10
        Header → Hero → Demo → Features → Resources → Download → Footer
        stack naturally in document flow. NO absolute positioning for layout.
      */}
      <main className="relative flex flex-col min-h-screen overflow-hidden z-10">
        <Header />
        <Hero />
        <DemoSection />
        <FeaturesSection />
        <ResourcesSection />
        <DownloadSection />
        <Footer />
      </main>
    </>
  );
}
