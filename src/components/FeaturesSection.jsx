import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Table2, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  {
    id: 'smart-automation',
    badge: 'Smart Automation',
    icon: Zap,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50',
    title: 'Bypasses network fatigue, resolves captchas instantly.',
    description:
      'Our intelligent retry engine handles MSBTE portal instability automatically—exponential back-off, session refresh, and adaptive rate limiting. Set it once and walk away.',
    bullets: [
      'Adaptive retry with exponential back-off',
      'Automatic session management',
      'Zero manual captcha solving',
    ],
    imageAlt: 'Smart Automation UI Mockup',
    reversed: false,
  },
  {
    id: 'auto-excel',
    badge: 'Auto-Excel Formatting',
    icon: Table2,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50',
    title: 'Generates a polished Excel with merged headers & analytics.',
    description:
      'Every run produces a beautifully formatted .xlsx file complete with merged subject-group headers, colour-coded pass/fail rows, and a built-in summary sheet with pass percentages.',
    bullets: [
      'Merged headers, colour-coded rows',
      'Built-in pass/fail analytics',
      'One-click export — no macros needed',
    ],
    imageAlt: 'Excel Output Preview',
    reversed: true,
  },
];

function FeatureImagePlaceholder({ label }) {
  return (
    <div
      className="relative w-full aspect-video rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center"
      aria-label={label}
    >
      {/* Grid lines decoration */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`grid-${label.replace(/\s/g, '')}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${label.replace(/\s/g, '')})`} />
      </svg>

      {/* Center graphic */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-8 rounded-sm bg-gradient-to-t from-indigo-200 to-violet-300"
              style={{ height: `${32 + Math.sin(i * 1.2) * 20}px`, opacity: 0.7 + i * 0.06 }}
            />
          ))}
        </div>
        <div className="h-px w-40 bg-slate-300 rounded-full" />
        <div className="flex gap-8">
          {['Pass', 'Fail', 'ATKT'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${t === 'Pass' ? 'bg-emerald-400' : t === 'Fail' ? 'bg-red-400' : 'bg-amber-400'}`} />
              <span className="text-xs text-slate-400 font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-white" aria-label="Features Section">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-20"
        >
          <span className="section-badge mb-4">
            <Zap size={12} strokeWidth={2.5} />
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
            Built for speed and precision.
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto font-medium">
            Two powerful engines working together to automate every step of result collection.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div className="flex flex-col gap-28">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className={`flex flex-col ${f.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
              >
                {/* Text side */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  className="flex-1 flex flex-col gap-5"
                >
                  <span className="section-badge self-start">
                    <Icon size={12} strokeWidth={2.5} />
                    {f.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed font-medium">{f.description}</p>

                  <ul className="flex flex-col gap-3 mt-1">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-indigo-500 mt-0.5 shrink-0" strokeWidth={2} />
                        <span className="text-slate-600 text-sm font-medium">{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Image side */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: 0.12 }}
                  className="flex-1 w-full"
                >
                  <FeatureImagePlaceholder label={f.imageAlt} />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
