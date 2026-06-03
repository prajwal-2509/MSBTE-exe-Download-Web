import React from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen, ArrowRight } from 'lucide-react';
import TypewriterHeadline from './TypewriterHeadline';

// Timing — subheadline + buttons appear after typing finishes
const TYPING_DURATION_MS = 38 * 52; // chars × speed ≈ 1.97 s
const DELAY_AFTER_TYPING  = TYPING_DURATION_MS / 1000 + 0.15;

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 20 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
});

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 md:px-12 overflow-hidden"
      aria-label="Hero"
    >
      {/* Soft radial glow behind text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 45%, transparent 72%)',
        }}
      />

      {/* ── Content block ── */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6">

        {/* Eyebrow badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="badge"
          aria-label="Platform availability"
        >
          ✦ Now available for Windows
        </motion.span>

        {/* Typewriter H1 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.25 }}
          className="w-full"
        >
          <TypewriterHeadline className="text-5xl sm:text-6xl md:text-7xl" />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp(DELAY_AFTER_TYPING)}
          initial="hidden"
          animate="show"
          className="font-sans antialiased text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl"
        >
          Automate MSBTE seat processing.{' '}
          <strong className="font-semibold text-slate-800">Zero effort, 100% accuracy</strong>,
          running completely local.
        </motion.p>

        {/* CTA row */}
        <motion.div
          variants={fadeUp(DELAY_AFTER_TYPING + 0.12)}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center gap-3 mt-1"
        >
          <a
            href="#download"
            id="hero-primary-cta"
            className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/25"
          >
            <Download size={15} strokeWidth={2.5} />
            Download for Windows (.exe)
            <ArrowRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </a>

          <a
            href="#resources"
            id="hero-secondary-cta"
            className="flex items-center gap-2 bg-white/80 hover:bg-white text-slate-700 font-semibold text-sm px-7 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <BookOpen size={14} />
            Read Documentation
          </a>
        </motion.div>

        {/* Social proof stats */}
        <motion.div
          variants={fadeUp(DELAY_AFTER_TYPING + 0.24)}
          initial="hidden"
          animate="show"
          className="flex items-stretch divide-x divide-slate-200 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden mt-2"
        >
          {[
            { val: '100%', label: 'Local & Private'   },
            { val: '< 2s', label: 'Per Seat Result'   },
            { val: '0',    label: 'Manual Effort'      },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center px-7 py-3">
              <span className="text-xl font-bold text-slate-900 leading-none">{s.val}</span>
              <span className="text-[11px] text-slate-500 font-semibold mt-1 tracking-wide">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll chevron */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: DELAY_AFTER_TYPING + 0.5, duration: 0.6 }}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] text-slate-400 font-semibold tracking-[0.18em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Bottom fade-out so section blends into white content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }}
      />
    </section>
  );
}
