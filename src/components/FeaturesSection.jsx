import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Table2, CheckCircle2 } from 'lucide-react';

const FV = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Image placeholder ────────────────────────────────────────────────────────
function Placeholder({ id, label }) {
  return (
    <div
      aria-label={label}
      className="w-full aspect-video bg-slate-100 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden relative"
    >
      {/* subtle grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-50" aria-hidden="true">
        <defs>
          <pattern id={`g-${id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${id})`} />
      </svg>

      {/* Mini chart mockup */}
      <div className="relative flex flex-col items-center gap-3 p-4">
        <div className="flex items-end gap-2">
          {[28, 44, 36, 52, 40, 56, 44].map((h, i) => (
            <div
              key={i}
              className="w-6 rounded-t-sm"
              style={{
                height: h,
                background: `linear-gradient(to top, rgba(99,102,241,${0.3 + i * 0.05}), rgba(139,92,246,${0.25 + i * 0.05}))`,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-1">
          {[['Pass','bg-emerald-400'],['Fail','bg-red-400'],['ATKT','bg-amber-400']].map(([t,c]) => (
            <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className={`w-2 h-2 rounded-full ${c}`} />
              {t}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Feature row data ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    id:       'automation',
    badge:    'Smart Automation',
    Icon:     Zap,
    headline: 'Bypasses network fatigue, resolves captchas instantly.',
    body:     'Our intelligent retry engine handles MSBTE portal instability automatically — exponential back-off, session refresh, and adaptive rate limiting. Set it once and walk away.',
    bullets:  [
      'Adaptive retry with exponential back-off',
      'Automatic session management & refresh',
      'Zero manual captcha interaction required',
    ],
    imgLabel:  'Smart Automation Preview',
    imgRight:  true,   // text-left, image-right
  },
  {
    id:       'excel',
    badge:    'Auto-Excel Formatting',
    Icon:     Table2,
    headline: 'Generates a polished Excel with merged headers & analytics.',
    body:     'Every run produces a beautifully formatted .xlsx file — merged subject-group headers, colour-coded pass/fail rows, and a built-in summary sheet with pass percentages.',
    bullets:  [
      'Merged headers, colour-coded pass/fail rows',
      'Built-in analytics & pass-percentage sheet',
      'One-click export — no macros or add-ins needed',
    ],
    imgLabel:  'Excel Output Preview',
    imgRight:  false,  // image-left, text-right
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-6 md:px-12 overflow-hidden bg-white"
      aria-label="Features"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          variants={FV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">
            <Zap size={11} strokeWidth={2.5} /> How It Works
          </span>
          <h2 className="font-sans antialiased text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900 mt-3">
            Built for speed and precision.
          </h2>
          <p className="font-sans antialiased text-slate-600 leading-relaxed text-lg mt-4 max-w-xl mx-auto">
            Two powerful engines working in tandem to automate every step of result collection.
          </p>
        </motion.div>

        {/* Feature rows */}
        {FEATURES.map((f) => (
          <div
            key={f.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 last:mb-0"
          >
            {/* ── Text column ── */}
            <motion.div
              variants={FV}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className={`flex flex-col gap-5 ${f.imgRight ? 'lg:order-1' : 'lg:order-2'}`}
            >
              <span className="badge self-start">
                <f.Icon size={11} strokeWidth={2.5} /> {f.badge}
              </span>

              <h3 className="font-sans antialiased text-2xl md:text-3xl font-bold tracking-tight leading-tight text-slate-900">
                {f.headline}
              </h3>

              <p className="font-sans antialiased text-slate-600 leading-relaxed">
                {f.body}
              </p>

              <ul className="flex flex-col gap-3 mt-1" role="list">
                {f.bullets.map(b => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2
                      size={17}
                      className="text-indigo-500 mt-0.5 shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className="font-sans antialiased text-sm font-medium text-slate-600">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Image column ── */}
            <motion.div
              variants={FV}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.1 }}
              className={f.imgRight ? 'lg:order-2' : 'lg:order-1'}
            >
              <Placeholder id={f.id} label={f.imgLabel} />
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
