import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Table2, CheckCircle2 } from 'lucide-react';

const rise = {
  hidden: { opacity: 0, y: 26 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Chart placeholder — auto height via aspect-video ──────────────────────
   aspect-video = 16/9 ratio. w-full fills the grid column.
   NEVER has a fixed h-[] so it cannot overflow or collapse its container.   */
function ChartPlaceholder({ id, label }) {
  return (
    <div
      aria-label={label}
      className="relative w-full aspect-video rounded-3xl bg-slate-100 border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center gap-4 p-6"
    >
      {/* Background grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.45]"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={`grid-${id}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
      </svg>

      {/* Decorative bar chart */}
      <div className="relative flex items-end gap-2" aria-hidden="true">
        {[36, 52, 42, 60, 48, 64, 50].map((h, i) => (
          <div
            key={i}
            className="w-7 rounded-t-sm"
            style={{
              height: h,
              background: `linear-gradient(to top,
                rgba(99,102,241,${0.30 + i * 0.04}),
                rgba(139,92,246,${0.22 + i * 0.04}))`,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="relative flex items-center gap-5" aria-hidden="true">
        {[['Pass', '#34d399'], ['Fail', '#f87171'], ['ATKT', '#fbbf24']].map(([t, c]) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            <span className="text-xs text-slate-400 font-medium">{t}</span>
          </span>
        ))}
      </div>

      <p className="relative text-xs text-slate-400 font-medium">{label}</p>
    </div>
  );
}

/* ─── Feature row data ───────────────────────────────────────────────────── */
const ROWS = [
  {
    id:       'automation',
    badge:    'Smart Automation',
    Icon:     Zap,
    headline: 'Bypasses network fatigue, resolves captchas instantly.',
    body:     'Our intelligent retry engine handles MSBTE portal instability automatically — exponential back-off, session refresh, and adaptive rate limiting. Set it once and walk away.',
    bullets: [
      'Adaptive retry with exponential back-off',
      'Automatic session management & refresh',
      'Zero manual captcha interaction required',
    ],
    imgLabel: 'Smart Automation Preview',
    textFirst: true,   // text left, image right
  },
  {
    id:       'excel',
    badge:    'Auto-Excel Formatting',
    Icon:     Table2,
    headline: 'Generates a polished Excel with merged headers & analytics.',
    body:     'Every run produces a formatted .xlsx file — merged subject-group headers, colour-coded pass/fail rows, and a built-in summary sheet with pass percentages.',
    bullets: [
      'Merged headers, colour-coded pass/fail rows',
      'Built-in analytics & pass-percentage sheet',
      'One-click export — no macros needed',
    ],
    imgLabel: 'Excel Output Preview',
    textFirst: false,  // image left, text right
  },
];

export default function FeaturesSection() {
  return (
    /*
      LAYOUT RULES:
      - Section py-24 gives clean vertical breathing room
      - max-w-7xl constrains the whole block
      - Each row is an independent grid: grid-cols-1 lg:grid-cols-2
      - gap-16 ensures columns NEVER touch or overlap
      - items-center vertical-aligns both columns to their midpoints
      - mb-24 on every row except last separates rows with 96px of air
      - Text column and image column are SIBLINGS in the same grid row
      - Order is controlled via lg:order-* — no absolute trickery
    */
    <section
      id="features"
      className="w-full py-24 px-6 md:px-12"
      aria-label="Features"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section title */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-20"
        >
          <span className="section-badge mb-4">
            <Zap size={11} strokeWidth={2.5} aria-hidden="true" />
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900 mt-3">
            Built for speed and precision.
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg mt-4 max-w-xl mx-auto">
            Two powerful engines working together to automate every step of result collection.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div className="flex flex-col gap-24">
          {ROWS.map((row) => (
            /*
              Each row is completely self-contained.
              flex-col on mobile stacks naturally.
              lg:grid-cols-2 gives strict 2-equal columns on desktop.
              items-center: both columns align to their vertical centers.
              gap-16: 64px gutter between text and image — no touching.
            */
            <div
              key={row.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              {/* ── Text column ─────────────────────────────────────────── */}
              <motion.div
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className={`flex flex-col gap-5 ${row.textFirst ? 'lg:order-1' : 'lg:order-2'}`}
              >
                <span className="section-badge self-start">
                  <row.Icon size={11} strokeWidth={2.5} aria-hidden="true" />
                  {row.badge}
                </span>

                <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-slate-900">
                  {row.headline}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {row.body}
                </p>

                <ul className="flex flex-col gap-3" role="list">
                  {row.bullets.map(b => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2
                        size={17}
                        className="text-indigo-500 shrink-0 mt-0.5"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-slate-600">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* ── Image column ─────────────────────────────────────────── */}
              <motion.div
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.1 }}
                className={row.textFirst ? 'lg:order-2' : 'lg:order-1'}
              >
                {/* aspect-video constrains height to 16:9 — no overflow possible */}
                <ChartPlaceholder id={row.id} label={row.imgLabel} />
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
