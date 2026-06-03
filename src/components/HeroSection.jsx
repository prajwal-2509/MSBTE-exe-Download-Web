import React from 'react';
import { motion } from 'framer-motion';
import { Download, BookOpen, ArrowRight, Sparkles, Zap } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import TypewriterHeadline from './TypewriterHeadline';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stats = [
  { value: '100%', label: 'Local & Private' },
  { value: '< 2s', label: 'Per Seat Result' },
  { value: '0', label: 'Manual Effort' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white pt-16"
      aria-label="Hero Section"
    >
      {/* Canvas Background */}
      <ParticleCanvas />

      {/* Radial gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-badge">
            <Sparkles size={12} strokeWidth={2.5} />
            Now available for Windows
          </span>
        </motion.div>

        {/* Typewriter H1 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="max-w-3xl"
        >
          <TypewriterHeadline />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 2.4, duration: 0.6, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl leading-relaxed"
        >
          Automate MSBTE seat processing.{' '}
          <span className="text-slate-700 font-semibold">Zero effort, 100% accuracy</span>, running completely local.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 2.7, duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-2"
        >
          <a
            href="#download"
            id="hero-download-btn"
            className="group flex items-center gap-2.5 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-0.5"
          >
            <Download size={16} strokeWidth={2.5} />
            Download for Windows (.exe)
            <ArrowRight
              size={14}
              className="ml-0.5 group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </a>
          <a
            href="#resources"
            id="hero-docs-btn"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <BookOpen size={15} />
            Read Documentation
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 3.0, duration: 0.6, ease: 'easeOut' }}
          className="flex items-center divide-x divide-slate-200 mt-4 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl px-2 py-1 shadow-sm"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center px-6 py-2">
              <span className="text-xl font-bold text-slate-900">{s.value}</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))',
          zIndex: 5,
        }}
        aria-hidden="true"
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        aria-hidden="true"
      >
        <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
