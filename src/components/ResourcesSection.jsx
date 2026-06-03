import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Wrench, ShieldCheck, ArrowUpRight } from 'lucide-react';

const FV = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const CARDS = [
  {
    id:    'installation',
    Icon:  FileText,
    color: 'text-indigo-500',
    bg:    'bg-indigo-50',
    title: 'Installation Guide',
    desc:  'Step-by-step walkthrough from download to your first run. Covers Windows Defender bypass, .NET runtime checks, and folder structure.',
    cta:   'Read guide',
    href:  '#',
  },
  {
    id:    'troubleshooting',
    Icon:  Wrench,
    color: 'text-amber-500',
    bg:    'bg-amber-50',
    title: 'Troubleshooting & Failed Seats',
    desc:  'Common errors, portal timeout recovery, handling absent/detained students, and re-running partial jobs without duplication.',
    cta:   'See solutions',
    href:  '#',
  },
  {
    id:    'privacy',
    Icon:  ShieldCheck,
    color: 'text-emerald-500',
    bg:    'bg-emerald-50',
    title: 'Data Privacy',
    desc:  'All processing happens on your local machine. No data is uploaded, stored remotely, or shared. Student records stay private, always.',
    cta:   'Learn more',
    href:  '#',
  },
];

export default function ResourcesSection() {
  return (
    <section
      id="resources"
      className="py-24 px-6 md:px-12 overflow-hidden bg-slate-50/60"
      aria-label="Resources"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          variants={FV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-0"
        >
          <span className="badge mb-4">
            <FileText size={11} strokeWidth={2.5} /> Documentation
          </span>
          <h2 className="font-sans antialiased text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900 mt-3">
            Resources to get you started.
          </h2>
          <p className="font-sans antialiased text-slate-600 leading-relaxed text-lg mt-4 max-w-xl mx-auto">
            Everything you need to install, run, and troubleshoot the scraper from day one.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {CARDS.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.href}
              id={`resource-${c.id}`}
              variants={FV}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.09 }}
              className="resource-card bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col gap-5 no-underline group"
              aria-label={c.title}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                <c.Icon size={20} className={c.color} strokeWidth={1.75} aria-hidden="true" />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="font-sans antialiased text-base font-bold text-slate-900 leading-snug">
                  {c.title}
                </h3>
                <p className="font-sans antialiased text-sm text-slate-600 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              {/* CTA link */}
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors duration-200 mt-auto">
                {c.cta}
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                  aria-hidden="true"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
