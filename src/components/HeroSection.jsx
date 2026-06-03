import React from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import Typewriter from './TypewriterHeadline';

/* Timing: 40ms × 52 chars ≈ 2.08 s typing */
const AFTER_TYPE = 2.25;

const rise = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  show:   {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const STATS = [
  { val: '100%', lbl: 'Local & Private' },
  { val: '< 2s',  lbl: 'Per Seat Result' },
  { val: '0',     lbl: 'Manual Effort'   },
];

export default function HeroSection() {
  return (
    /*
      LAYOUT RULES ENFORCED:
      - Section uses standard block layout: py-32 gives tall breathing room
      - flex-col + items-center stacks everything vertically, never overlapping
      - No absolute positioning on text or buttons
      - max-w-4xl constrains the column to readable width
      - gap-6 between every child so nothing ever touches
    */
    <section
      id="hero"
      className="w-full py-32 md:py-44 px-6"
      aria-label="Hero"
    >
      {/* Center column — all children stack top-to-bottom */}
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">

        {/* 1. Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <span className="section-badge">
            <Sparkles size={11} strokeWidth={2.5} aria-hidden="true" />
            Now available for Windows
          </span>
        </motion.div>

        {/* 2. Typewriter headline — height is auto, driven by text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.22 }}
          className="w-full"
        >
          <Typewriter className="text-5xl sm:text-6xl md:text-7xl" />
        </motion.div>

        {/* 3. Sub-headline */}
        <motion.p
          variants={rise(AFTER_TYPE)}
          initial="hidden"
          animate="show"
          className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl"
        >
          Automate MSBTE seat processing.{' '}
          <strong className="font-semibold text-slate-800">
            Zero effort, 100% accuracy
          </strong>
          , running completely local.
        </motion.p>

        {/* 4. CTA buttons row */}
        <motion.div
          variants={rise(AFTER_TYPE + 0.14)}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#download"
            id="hero-download-cta"
            className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/25"
          >
            <Download size={15} strokeWidth={2.5} aria-hidden="true" />
            Download for Windows (.exe)
            <ArrowRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
              aria-hidden="true"
            />
          </a>

          <a
            href="#resources"
            id="hero-docs-cta"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-7 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <BookOpen size={14} aria-hidden="true" />
            Read Documentation
          </a>
        </motion.div>

        {/* 5. Stats bar
              CRITICAL: generous px-8 py-4 per cell so text never squashes.
              divide-x creates the vertical separators cleanly.
        */}
        <motion.div
          variants={rise(AFTER_TYPE + 0.28)}
          initial="hidden"
          animate="show"
          className="inline-flex items-stretch divide-x divide-slate-200 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          role="list"
          aria-label="Key statistics"
        >
          {STATS.map(s => (
            <div
              key={s.lbl}
              role="listitem"
              className="flex flex-col items-center justify-center px-8 py-4"
            >
              <span className="block text-2xl font-bold text-slate-900 leading-none">
                {s.val}
              </span>
              <span className="block text-[11px] font-semibold text-slate-500 mt-1.5 tracking-wide whitespace-nowrap">
                {s.lbl}
              </span>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Scroll indicator — sits below the column, in normal flow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: AFTER_TYPE + 0.55, duration: 0.6 }}
        aria-hidden="true"
        className="flex flex-col items-center gap-2 mt-16"
      >
        <span className="text-[10px] text-slate-400 font-semibold tracking-[0.18em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-slate-300 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
