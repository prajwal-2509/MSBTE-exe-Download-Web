"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Download,
  BookOpen,
  CheckCircle2,
  FileText,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Box,
  HardDrive,
} from "lucide-react";

const MotionLink = motion(Link);

/* ═══════════════════════════════════════════════════════════════════════════
   UX POLISH STYLE CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */
const meshBgStyle = {
  backgroundColor: "#f8fafc",
  backgroundImage: `
    radial-gradient(at 0% 0%, rgba(66, 133, 244, 0.03) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(52, 168, 83, 0.02) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(251, 188, 5, 0.02) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(234, 67, 53, 0.02) 0px, transparent 50%)
  `,
};

const whiteMeshBgStyle = {
  backgroundColor: "#ffffff",
  backgroundImage: `
    radial-gradient(at 0% 0%, rgba(66, 133, 244, 0.015) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(52, 168, 83, 0.01) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(251, 188, 5, 0.01) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(234, 67, 53, 0.01) 0px, transparent 50%)
  `,
};

const featuresBgStyle = {
  backgroundColor: "#ffffff",
  backgroundImage: `
    radial-gradient(rgba(31, 60, 136, 0.09) 1.2px, transparent 1.2px),
    linear-gradient(to bottom, #F4F6FB 0%, #ffffff 50%, #ffffff 100%)
  `,
  backgroundSize: "24px 24px, 100% 100%",
};

const dotGridBgStyle = {
  backgroundColor: "#f8fafc",
  backgroundImage: "radial-gradient(rgba(31, 60, 136, 0.07) 1.2px, transparent 1.2px)",
  backgroundSize: "24px 24px",
};

const listContainerV = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItemV = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

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
    // TASK 1: strictly 1 px – 2.5 px for high-density micro-particle look
    r: Math.random() * 1.5 + 1,
    color: GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS BACKGROUND — HIGH-DENSITY MICRO-PARTICLE ENGINE
   • 450 tiny dots (1–2.5 px) in Google colors — matches antigravity.google density
   • Sine-wave gentle float, each particle has a unique phase offset
   • Mouse proximity < 140 px → strong repel via vx/vy
   • Tight spring (0.035) + friction (0.88) → crisp snap-back, zero jitter
   • pointer-events-none ensures ALL buttons/links stay fully clickable
   ═══════════════════════════════════════════════════════════════════════════ */
function CanvasBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    // TASK 1: upgraded from 120 → 450 particles
    let particles: Particle[] = Array.from({ length: 450 }, () =>
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
      // respawn 450 on every resize so density is always consistent
      particles = Array.from({ length: 450 }, () => makeParticle(W, H));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    let raf: number;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * 0.001;

      particles.forEach((p) => {
        /*
         * TASK 1 — UPGRADED PHYSICS
         *
         * Spring force: 0.035 (was 0.02) — tighter pull to origin for
         * a crisp, jitter-free snap-back after mouse repulsion.
         */
        p.vx += (p.originX - p.x) * 0.035;
        p.vy += (p.originY - p.y) * 0.035;

        /* Sine-wave gentle float — unchanged, keeps motion organic */
        p.vy += Math.sin(t + p.phase) * 0.025;

        /*
         * Mouse repulsion — Math.hypot distance check
         * Threshold raised 120 → 140 px for wider interaction radius.
         * Repel force raised 0.04 → 0.055 for responsive snap-away.
         * TASK 2: canvas is pointer-events-none so every button/link
         * beneath remains fully clickable regardless of cursor position.
         */
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        if (Math.hypot(dx, dy) < 140) {
          p.vx += dx * 0.055;
          p.vy += dy * 0.055;
        }

        /*
         * Friction: 0.88 (was 0.9) — slightly stronger damping eliminates
         * residual oscillation and produces a clean, settled resting state.
         */
        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;

        /* Draw crisp sub-3 px dot — micro-particle aesthetic */
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
      /*
       * opacity-80 (was 70) — with 450 particles the field needs slightly
       * more visibility. pointer-events-none is non-negotiable: it ensures
       * the canvas NEVER intercepts clicks on buttons, links, or the nav.
       */
      className="fixed inset-0 z-0 pointer-events-none bg-white opacity-80"
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INNER CONTAINER — DRY helper used inside every section
   CRITICAL: prevents content from ever touching the viewport edges
   ═══════════════════════════════════════════════════════════════════════════ */
export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
        <motion.a
          href="https://github.com/prajwal-2509/msbte-result-scraper-v3/releases/download/v.1.0.0/MSBTE_Scraper_v1.0.0.zip"
          download
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, boxShadow: "0 10px 20px -5px rgba(15, 23, 42, 0.2)" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer transition-colors hover:bg-slate-800"
          aria-label="Download"
        >
          <Download size={13} strokeWidth={2.5} aria-hidden="true" />
          Download
        </motion.a>
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
          className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/60 text-blue-600 text-xs font-bold tracking-[0.14em] uppercase border border-blue-100/80 mb-10 shadow-sm"
        >
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "linear",
            }}
          />
          <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] animate-pulse relative z-10" aria-hidden="true" />
          <span className="relative z-10">Now Available for Windows</span>
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 z-20"
        >
          {/* Primary */}
          <motion.a
            href="https://github.com/prajwal-2509/msbte-result-scraper-v3/releases/download/v.1.0.0/MSBTE_Scraper_v1.0.0.zip"
            download
            target="_blank"
            rel="noopener noreferrer"
            id="hero-download"
            whileHover={{ scale: 1.03, boxShadow: "0 20px 30px -10px rgba(15, 23, 42, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="whitespace-nowrap flex items-center gap-2 bg-slate-900 text-white font-semibold text-sm px-8 py-4 rounded-full cursor-pointer transition-colors hover:bg-slate-800"
          >
            <Download size={16} strokeWidth={2.5} aria-hidden="true" />
            Download for Windows (.exe)
          </motion.a>

          {/* Secondary */}
          <motion.a
            href="#resources"
            id="hero-docs"
            whileHover={{ scale: 1.03, boxShadow: "0 20px 30px -10px rgba(226, 232, 240, 0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="whitespace-nowrap flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold text-sm px-8 py-4 rounded-full cursor-pointer transition-colors hover:border-slate-300"
          >
            <BookOpen size={15} aria-hidden="true" />
            Read Documentation
          </motion.a>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  return (
    <section
      ref={containerRef}
      id="demo"
      style={meshBgStyle}
      className="py-32 w-full border-t border-slate-100 overflow-hidden"
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

        {/* Outer parallax container */}
        <motion.div style={{ y }} className="w-full max-w-4xl mx-auto z-10">
          {/* Inner animation container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="aspect-video w-full bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col justify-end group relative overflow-hidden border border-slate-800 hover:shadow-blue-500/20 transition-shadow"
            aria-label="Watch demo video"
          >
            {/* Dark bg gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_60%_60%_at_25%_30%,rgba(66,133,244,0.5),transparent),radial-gradient(ellipse_50%_50%_at_75%_70%,rgba(52,168,83,0.3),transparent)]" />

            {/* Terminal dots */}
            <div className="absolute top-0 inset-x-0 h-9 bg-slate-800/60 border-b border-slate-700/40 flex items-center px-5 gap-1.5 z-10">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-slate-500 font-mono">MSBTE Master Scraper v1.0</span>
            </div>

            {/* Video element - absolute to fill container below title bar */}
            <div className="absolute inset-0 pt-9">
              <video
                controls
                className="w-full h-full rounded-b-[2rem] object-cover"
                aria-label="Demo Video Player"
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
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

function WorkerGridMockup() {
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const workerStates = [
    // Worker 0
    [
      { status: "idle" as const, text: "Idle" },
      { status: "working" as const, text: "Navigating..." },
      { status: "working" as const, text: "Submitting..." },
      { status: "done" as const, text: "Done" }
    ],
    // Worker 1
    [
      { status: "working" as const, text: "Solving captcha..." },
      { status: "done" as const, text: "Done" },
      { status: "idle" as const, text: "Idle" },
      { status: "working" as const, text: "Navigating..." }
    ],
    // Worker 2
    [
      { status: "idle" as const, text: "Idle" },
      { status: "working" as const, text: "Navigating..." },
      { status: "working" as const, text: "Solving captcha..." },
      { status: "done" as const, text: "Done" }
    ],
    // Worker 3
    [
      { status: "working" as const, text: "Navigating..." },
      { status: "working" as const, text: "Submitting..." },
      { status: "done" as const, text: "Done" },
      { status: "idle" as const, text: "Idle" }
    ],
    // Worker 4
    [
      { status: "done" as const, text: "Done" },
      { status: "idle" as const, text: "Idle" },
      { status: "working" as const, text: "Solving captcha..." },
      { status: "working" as const, text: "Submitting..." }
    ],
    // Worker 5
    [
      { status: "idle" as const, text: "Idle" },
      { status: "working" as const, text: "Solving captcha..." },
      { status: "done" as const, text: "Done" },
      { status: "idle" as const, text: "Idle" }
    ]
  ];

  const getStatusColor = (status: "idle" | "working" | "done") => {
    switch (status) {
      case "working":
        return "#3B6FD4";
      case "done":
        return "#2E9E6B";
      case "idle":
      default:
        return "#CBD5E1";
    }
  };

  const getBorderColor = (status: "idle" | "working" | "done") => {
    switch (status) {
      case "working":
        return "border-l-[#3B6FD4]";
      case "done":
        return "border-l-[#2E9E6B]";
      case "idle":
      default:
        return "border-l-[#CBD5E1]";
    }
  };

  return (
    <div className="w-full h-[340px] bg-slate-50 rounded-3xl border border-[#1F3C88]/8 shadow-[0_24px_48px_-12px_rgba(31,60,136,0.12)] p-5 flex flex-col justify-center gap-4 relative overflow-hidden">
      {/* Decorative Title Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 z-10">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase font-mono">
          Live Scraper Grid
        </span>
        <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">
          Active Thread Pool
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3.5 z-10">
        {workerStates.map((states, idx) => {
          const w = states[tick];
          return (
            <motion.div
              key={idx}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`bg-white border-l-[3px] ${getBorderColor(w.status)} border-y border-r border-slate-200 rounded-lg p-3 shadow-sm flex flex-col justify-between h-[80px] relative`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Worker {idx}
                </span>
                <motion.span
                  animate={{
                    backgroundColor: getStatusColor(w.status),
                    scale: w.status === "working" ? [1, 1.3, 1] : 1,
                  }}
                  transition={{
                    scale: { repeat: w.status === "working" ? Infinity : 0, duration: 1.5, ease: "easeInOut" },
                    backgroundColor: { duration: 0.3 }
                  }}
                  className="w-2.5 h-2.5 rounded-full"
                />
              </div>
              
              {/* Status text */}
              <motion.p 
                key={w.text}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-semibold text-slate-700 leading-tight"
              >
                {w.text}
              </motion.p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ExcelGridMockup() {
  const rows = [
    { seat: "204321", name: "ADITYA SHINDE", m1: "100/84", m2: "100/91", pct: "87.5%", res: "DISTINCTION", class: "bg-emerald-100 text-emerald-800" },
    { seat: "204322", name: "PRANAV PATIL", m1: "100/76", m2: "100/82", pct: "79.0%", res: "DISTINCTION", class: "bg-emerald-100 text-emerald-800" },
    { seat: "204323", name: "ROHIT DESHMUKH", m1: "100/62", m2: "100/70", pct: "66.0%", res: "FIRST CLASS", class: "bg-blue-100 text-blue-800" },
    { seat: "204324", name: "SNEHA KULKARNI", m1: "100/94", m2: "100/97", pct: "95.5%", res: "DISTINCTION", class: "bg-emerald-100 text-emerald-800" },
    { seat: "204325", name: "VIKRAM JADHAV", m1: "100/35", m2: "100/42", pct: "38.5%", res: "PASS CLASS", class: "bg-amber-100 text-amber-800" },
  ];

  return (
    <div className="w-full h-[340px] bg-white rounded-3xl border border-[#1F3C88]/8 shadow-[0_24px_48px_-12px_rgba(31,60,136,0.12)] p-5 flex flex-col justify-between overflow-hidden relative">
      {/* Excel header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#107C41] flex items-center justify-center shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 1h-8A2.5 2.5 0 005 3.5v17A2.5 2.5 0 007.5 23h9a2.5 2.5 0 002.5-2.5v-14L15.5 1z" fill="#107C41" />
              <path d="M15.5 1v6h6" fill="#185C37" />
              <path d="M9 16l6-6M9 10l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xs font-bold text-slate-700 font-mono">
            MSBTE_Results_W26.xlsx
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium font-sans">
          Auto-Formatted Sheets
        </span>
      </div>

      {/* Spreadsheet Table */}
      <div className="flex-1 mt-3 overflow-x-auto">
        <table className="w-full text-left border-collapse text-[10px]">
          <thead>
            <tr className="bg-slate-100 text-slate-600 border-t border-b border-slate-200">
              <th className="py-2 px-2.5 border-r border-slate-200 font-bold font-mono">Seat No</th>
              <th className="py-2 px-2.5 border-r border-slate-200 font-bold">Name</th>
              <th className="py-1 px-2 border-r border-slate-200 text-center font-bold" colSpan={2}>Subject Code Marks</th>
              <th className="py-2 px-2.5 border-r border-slate-200 text-center font-bold">Percentage</th>
              <th className="py-2 px-2.5 text-center font-bold">Result</th>
            </tr>
            <tr className="bg-slate-50 text-[9px] text-slate-400 border-b border-slate-200">
              <th className="py-1 px-2 border-r border-slate-200"></th>
              <th className="py-1 px-2 border-r border-slate-200"></th>
              <th className="py-1 px-2 border-r border-slate-200 text-center font-semibold text-blue-600">22412 (OS)</th>
              <th className="py-1 px-2 border-r border-slate-200 text-center font-semibold text-purple-600">22415 (DS)</th>
              <th className="py-1 px-2 border-r border-slate-200"></th>
              <th className="py-1 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr 
                key={r.seat} 
                className={`border-b border-slate-150 transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <td className="py-2 px-2.5 border-r border-slate-150 font-medium text-slate-500 font-mono">{r.seat}</td>
                <td className="py-2 px-2.5 border-r border-slate-150 font-bold text-slate-700 truncate max-w-[90px]">{r.name}</td>
                <td className="py-2 px-2 border-r border-slate-150 text-center font-medium text-slate-600">{r.m1}</td>
                <td className="py-2 px-2 border-r border-slate-150 text-center font-medium text-slate-600">{r.m2}</td>
                <td className="py-2 px-2.5 border-r border-slate-150 text-center font-bold text-slate-700">{r.pct}</td>
                <td className="py-1.5 px-2.5 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide ${r.class}`}>
                    {r.res}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-[9px] text-slate-400 font-mono bg-slate-50 -mx-5 -mb-5 px-5 py-2">
        <span className="bg-white border-x border-t border-slate-200 text-[#107C41] font-bold px-2.5 py-1 rounded-t -mb-2 z-10">
          Result Sheet
        </span>
        <span className="px-2 py-1">Department Stats</span>
        <span className="px-2 py-1">+ Add Sheet</span>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      style={featuresBgStyle}
      className="py-32 w-full border-t border-slate-100 relative overflow-hidden"
      aria-label="Features"
    >
      {/* Decorative blobs in brand navy */}
      <div 
        className="absolute -right-32 -top-16 w-[400px] h-[400px] rounded-full bg-[#1F3C88] opacity-[0.05] blur-[90px] pointer-events-none z-0" 
        aria-hidden="true"
      />
      <div 
        className="absolute -left-32 -bottom-16 w-[400px] h-[400px] rounded-full bg-[#1F3C88] opacity-[0.05] blur-[90px] pointer-events-none z-0" 
        aria-hidden="true"
      />

      <Container className="flex flex-col gap-32 relative z-10">

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
              Watch every worker scrape in real time.
            </h3>
            <p className="text-slate-500 leading-relaxed">
              A live status grid shows exactly what each concurrent worker is doing right now - navigating, solving captcha, or submitting - so nothing feels like a black box.
            </p>
            <motion.ul
              variants={listContainerV}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="flex flex-col gap-3"
            >
              {[
                "Live per-worker status grid, not just a log",
                "Local OCR captcha solving - zero manual typing",
                "Up to 30 retry attempts per seat with fresh captcha each time",
              ].map((b) => (
                <motion.li key={b} variants={listItemV} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-[#34A853] shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-sm font-medium text-slate-600">{b}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={riseV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <WorkerGridMockup />
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
            <ExcelGridMockup />
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
              Excel that adapts to any department.
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Subjects, marks, and grading symbols are detected dynamically at runtime - no hardcoded subject lists. Works identically whether you're scraping Computer, Mechanical, or Electrical results.
            </p>
            <motion.ul
              variants={listContainerV}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="flex flex-col gap-3"
            >
              {[
                "Dynamic subject detection - any department, any semester",
                "Handles grace marks, condoned marks, and absent/exempt codes",
                "Built-in difficulty heatmap and pass-rate insights",
              ].map((b) => (
                <motion.li key={b} variants={listItemV} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-[#4285F4] shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-sm font-medium text-slate-600">{b}</span>
                </motion.li>
              ))}
            </motion.ul>
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
    topBorderColor: "#4285F4",
    title: "Installation Guide",
    desc: "Step-by-step from download to first run. Covers PyInstaller setup, folder configurations, and initial launching.",
    cta: "Read guide",
    href: "/guide",
  },
  {
    id: "trouble",
    Icon: Wrench,
    color: "#FBBC05",
    bg: "bg-amber-50",
    border: "border-amber-100",
    topBorderColor: "#FBBC05",
    title: "Troubleshooting",
    desc: "Windows Defender may flag the .exe as unrecognized on first run - this is normal for unsigned PyInstaller apps. Click 'More info' then 'Run anyway' to proceed.",
    cta: "See solutions",
    href: "/troubleshooting",
  },
  {
    id: "privacy",
    Icon: ShieldCheck,
    color: "#34A853",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    topBorderColor: "#34A853",
    title: "Data Privacy",
    desc: "Everything runs on your machine. No uploads, no remote storage. Student data stays local, always.",
    cta: "Learn more",
    href: "/privacy",
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
      style={dotGridBgStyle}
      className="py-32 w-full border-t border-slate-100"
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
            <MotionLink
              key={c.id}
              href={c.href}
              id={`res-${c.id}`}
              variants={cardV}
              whileHover={{
                y: -6,
                boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.12)",
                borderColor: "#e2e8f0",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ borderTop: `4px solid ${c.topBorderColor}` }}
              className="group flex flex-col gap-5 bg-white border border-slate-200 rounded-[2rem] p-10 cursor-pointer no-underline"
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
            </MotionLink>
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
      style={featuresBgStyle}
      className="py-32 w-full border-t border-slate-100 relative overflow-hidden"
      aria-label="Download"
    >
      {/* Decorative blobs in brand navy */}
      <div 
        className="absolute -right-32 -top-16 w-[350px] h-[350px] rounded-full bg-[#1F3C88] opacity-[0.05] blur-[80px] pointer-events-none z-0" 
        aria-hidden="true"
      />
      <div 
        className="absolute -left-32 -bottom-16 w-[350px] h-[350px] rounded-full bg-[#1F3C88] opacity-[0.05] blur-[80px] pointer-events-none z-0" 
        aria-hidden="true"
      />

      <Container className="flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 max-w-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow-xl shadow-blue-200/60 animate-pulse">
            <Download size={28} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Ready to automate?
          </h2>
          <p className="text-slate-500 leading-relaxed text-lg">
            Download the Windows installer and have your first result sheet ready in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 z-10">
            <motion.a
              href="https://github.com/prajwal-2509/msbte-result-scraper-v3/releases/download/v.1.0.0/MSBTE_Scraper_v1.0.0.zip"
              download
              target="_blank"
              rel="noopener noreferrer"
              id="dl-main"
              whileHover={{ scale: 1.03, boxShadow: "0 20px 30px -10px rgba(15, 23, 42, 0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="whitespace-nowrap group flex items-center gap-2 bg-slate-900 text-white font-semibold text-sm px-8 py-4 rounded-full cursor-pointer transition-colors hover:bg-slate-800"
            >
              <Download size={16} strokeWidth={2.5} />
              Download for Windows (.exe)
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
            <motion.a 
              href="https://github.com/prajwal-2509/msbte-result-scraper-v3"
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, boxShadow: "0 20px 30px -10px rgba(226, 232, 240, 0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-white border-2 border-slate-200 text-slate-700 px-7 py-3.5 rounded-full font-semibold hover:border-slate-300 cursor-pointer flex items-center gap-2 transition-colors"
            >
              {/* 👇 Inline Bulletproof GitHub SVG Icon */}
              <svg 
                className="w-5 h-5 fill-current" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.06.069-.06 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View on GitHub
            </motion.a>
          </div>

          {/* System Requirements Meta Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-10">
            {/* Badge 1: Windows */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#1F3C88]/5 border border-[#1F3C88]/10 text-slate-700 shadow-sm backdrop-blur-sm">
              <svg className="w-3.5 h-3.5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.101zM11.25 1.9L24 0v11.55H11.25V1.9zM11.25 12.45H24v11.55l-12.75-1.9v-9.65z" />
              </svg>
              <span>Windows 10/11</span>
            </div>

            {/* Badge 2: Python / Package */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#1F3C88]/5 border border-[#1F3C88]/10 text-slate-700 shadow-sm backdrop-blur-sm">
              <Box size={14} className="text-[#34A853]" strokeWidth={2.5} />
              <span>Python 3.11+ bundled</span>
            </div>

            {/* Badge 3: Download / Disk */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#1F3C88]/5 border border-[#1F3C88]/10 text-slate-700 shadow-sm backdrop-blur-sm">
              <HardDrive size={14} className="text-[#FBBC05]" strokeWidth={2.5} />
              <span>~680MB, fully offline</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════════════ */
export function Footer() {
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
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right gap-0 font-medium">
            <p className="text-sm font-semibold text-slate-700 leading-tight">© 2026 MSBTE Master Scraper.</p>
            <p className="text-xs font-medium text-slate-400 leading-tight mt-0.5">Developed by Prajwal Hulle | Govt. Polytechnic, Solapur</p>
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
