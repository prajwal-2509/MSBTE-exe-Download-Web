import React from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import Typewriter from './TypewriterHeadline';

/*
  Timing: 40ms × 52 chars ≈ 2.08s typing.
  Sub-headline + buttons appear 2.25s after mount.
*/
const AFTER = 2.25;

const rise = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
});

const STATS = [
  { val: '100%', lbl: 'Local & Private'  },
  { val: '< 2s', lbl: 'Per Seat Result'  },
  { val: '0',    lbl: 'Manual Effort'    },
];

export default function HeroSection() {
  return (
    /*
      EXACT spec className:
      "relative min-h-screen flex flex-col justify-center items-center pt-32 pb-24"

      WHY relative? So the scroll indicator can use `absolute bottom-10` correctly.
      WHY min-h-screen? Hero fills the viewport without hardcoding a pixel height.
      WHY flex flex-col justify-center items-center? Content centred vertically & horizontally.
      WHY pt-32 pb-24? Top padding clears the sticky navbar (64px) + breathing room.
    */
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center pt-32 pb-24 px-6"
      aria-label="Hero"
    >
      {/* Subtle radial glow — purely decorative, no layout impact */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 45%, transparent 72%)',
          }}
        />
      </div>

      {/* ── Main content column ── */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center gap-7 text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          <span className="badge">
            <Sparkles size={11} strokeWidth={2.5} aria-hidden="true" />
            Now available for Windows
          </span>
        </motion.div>

        {/* Typewriter headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="w-full"
        >
          <Typewriter className="text-5xl sm:text-6xl md:text-7xl" />
        </motion.div>

        {/* Sub-headline — appears after typing finishes */}
        <motion.p
          variants={rise(AFTER)}
          initial="hidden"
          animate="show"
          className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl"
        >
          Automate MSBTE seat processing.{' '}
          <strong className="font-semibold text-slate-800">Zero effort, 100% accuracy</strong>,
          running completely local.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={rise(AFTER + 0.13)}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a href="#download" id="hero-download-btn"
            className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/25">
            <Download size={15} strokeWidth={2.5} aria-hidden="true" />
            Download for Windows (.exe)
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true"/>
          </a>
          <a href="#resources" id="hero-docs-btn"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-7 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <BookOpen size={14} aria-hidden="true"/>
            Read Documentation
          </a>
        </motion.div>

        {/*
          Stats bar
          ─────────
          px-8 py-5 per cell: generous independent padding so numbers NEVER squeeze.
          whitespace-nowrap: label text stays on one line at any viewport.
          divide-x divide-slate-200: clean separator between cells without borders.
        */}
        <motion.div
          variants={rise(AFTER + 0.26)}
          initial="hidden"
          animate="show"
          role="list"
          aria-label="Key statistics"
          className="inline-flex items-stretch divide-x divide-slate-200 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {STATS.map(s => (
            <div key={s.lbl} role="listitem" className="flex flex-col items-center justify-center px-8 py-5">
              <span className="block text-2xl font-bold text-slate-900 leading-none">{s.val}</span>
              <span className="block text-xs font-semibold text-slate-500 mt-1.5 tracking-wide whitespace-nowrap">{s.lbl}</span>
            </div>
          ))}
        </motion.div>

      </div>

      {/*
        SCROLL INDICATOR
        ────────────────
        EXACT spec: absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2
        This works because the section is `relative min-h-screen` — the absolute child
        is contained within the section, sitting at the very bottom of the viewport-height hero.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: AFTER + 0.55, duration: 0.7 }}
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-400 font-semibold tracking-[0.18em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-slate-300 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
