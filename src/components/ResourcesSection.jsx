import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Wrench, ShieldCheck, ArrowUpRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const resources = [
  {
    id: 'installation-guide',
    icon: FileText,
    iconColor: 'text-indigo-500',
    iconBg: 'from-indigo-50 to-violet-50',
    accentColor: 'group-hover:bg-indigo-500',
    title: 'Installation Guide',
    description:
      'Step-by-step walkthrough from download to your first automated run. Covers Windows Defender bypass, .NET runtime checks, and folder structure.',
    link: '#',
    linkLabel: 'Read guide',
  },
  {
    id: 'troubleshooting',
    icon: Wrench,
    iconColor: 'text-amber-500',
    iconBg: 'from-amber-50 to-orange-50',
    accentColor: 'group-hover:bg-amber-500',
    title: 'Troubleshooting & Failed Seats',
    description:
      'Common errors, portal timeout recovery, handling absent/detained students, and re-running partially completed jobs without duplication.',
    link: '#',
    linkLabel: 'See solutions',
  },
  {
    id: 'data-privacy',
    icon: ShieldCheck,
    iconColor: 'text-emerald-500',
    iconBg: 'from-emerald-50 to-teal-50',
    accentColor: 'group-hover:bg-emerald-500',
    title: 'Data Privacy',
    description:
      'All processing happens on your local machine. No data is uploaded, stored remotely, or shared. Student records stay private, always.',
    link: '#',
    linkLabel: 'Learn more',
  },
];

export default function ResourcesSection() {
  return (
    <section
      id="resources"
      className="py-28 bg-slate-50"
      aria-label="Resources Section"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">
            <FileText size={12} strokeWidth={2.5} />
            Documentation
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
            Resources to get you started.
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto font-medium">
            Everything you need to install, run, and troubleshoot the scraper.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.a
                key={r.id}
                href={r.link}
                id={`resource-card-${r.id}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1 }}
                className="resource-card group relative flex flex-col gap-5 bg-white rounded-2xl p-7 border border-slate-200/80 cursor-pointer no-underline"
                aria-label={r.title}
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-8 right-8 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${r.accentColor}`}
                />

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${r.iconBg} flex items-center justify-center`}>
                  <Icon size={20} className={r.iconColor} strokeWidth={1.75} />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{r.description}</p>
                </div>

                {/* Link */}
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors duration-200 mt-auto">
                  {r.linkLabel}
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                  />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
