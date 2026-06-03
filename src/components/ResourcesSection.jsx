import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Wrench, ShieldCheck, ArrowUpRight } from 'lucide-react';

const rise = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
};

const CARDS = [
  {
    id:    'install',
    Icon:  FileText,
    clr:   'text-indigo-500',
    bg:    'bg-indigo-50',
    title: 'Installation Guide',
    desc:  'Step-by-step walkthrough from download to your first automated run. Covers Windows Defender bypass, .NET runtime checks, and folder structure.',
    cta:   'Read guide',
  },
  {
    id:    'trouble',
    Icon:  Wrench,
    clr:   'text-amber-500',
    bg:    'bg-amber-50',
    title: 'Troubleshooting & Failed Seats',
    desc:  'Common errors, portal timeout recovery, handling absent or detained students, and re-running partial jobs without result duplication.',
    cta:   'See solutions',
  },
  {
    id:    'privacy',
    Icon:  ShieldCheck,
    clr:   'text-emerald-500',
    bg:    'bg-emerald-50',
    title: 'Data Privacy',
    desc:  'All processing happens on your local machine. No data is uploaded, stored remotely, or shared with any third party. Student records stay private.',
    cta:   'Learn more',
  },
];

export default function ResourcesSection() {
  return (
    /*
      LAYOUT RULES:
      - py-24 vertical breathing room
      - max-w-7xl mx-auto keeps content centred
      - Title block + mt-12 gap + cards grid are all separate stacked children
      - grid-cols-1 md:grid-cols-3 gap-8 — clean 3-col on tablet+
      - Cards use flex-col gap-5 so icon → title → desc → cta never overlaps
    */
    <section
      id="resources"
      className="w-full py-24 px-6 md:px-12 bg-slate-50/70"
      aria-label="Resources"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Header — sits fully ABOVE the cards grid ─────────────────── */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center"
        >
          <span className="section-badge mb-4">
            <FileText size={11} strokeWidth={2.5} aria-hidden="true" />
            Documentation
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900 mt-3">
            Resources to get you started.
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg mt-4 max-w-xl mx-auto">
            Everything you need to install, run, and troubleshoot the scraper from day one.
          </p>
        </motion.div>

        {/* ── Cards grid — separated from header by mt-12 ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {CARDS.map((c, i) => (
            <motion.a
              key={c.id}
              href="#"
              id={`res-${c.id}`}
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08 }}
              aria-label={c.title}
              className="res-card group flex flex-col gap-5 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm no-underline"
            >
              {/* Icon badge */}
              <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <c.Icon size={20} className={c.clr} strokeWidth={1.75} aria-hidden="true" />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {c.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                {c.desc}
              </p>

              {/* CTA link — pinned to bottom by flex-1 on desc */}
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors duration-200">
                {c.cta}
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                  aria-hidden="true"
                />
              </span>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
