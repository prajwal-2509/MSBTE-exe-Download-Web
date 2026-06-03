import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Table2, CheckCircle2 } from 'lucide-react';

const rise = {
  hidden: { opacity: 0, y: 26 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Image placeholder ───────────────────────────────────────────────────────
   EXACT spec: w-full aspect-[16/9] bg-slate-100 rounded-3xl border border-slate-200 shadow-lg
   aspect-[16/9] makes height purely ratio-driven — no hardcoded px, no overflow. */
function ImagePlaceholder({ id, label }) {
  return (
    <div
      className="w-full aspect-[16/9] bg-slate-100 rounded-3xl border border-slate-200 shadow-lg overflow-hidden relative flex flex-col items-center justify-center gap-4 p-6"
      aria-label={label}
    >
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <pattern id={`g-${id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${id})`}/>
      </svg>

      {/* Bar chart */}
      <div className="relative flex items-end gap-2" aria-hidden="true">
        {[38, 54, 44, 62, 50, 68, 56].map((h, i) => (
          <div key={i} className="w-7 rounded-t"
            style={{ height: h, background: `linear-gradient(to top, rgba(99,102,241,${0.28+i*0.05}), rgba(139,92,246,${0.22+i*0.05}))` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="relative flex items-center gap-5" aria-hidden="true">
        {[['Pass','#34d399'],['Fail','#f87171'],['ATKT','#fbbf24']].map(([t,c])=>(
          <span key={t} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }}/>
            <span className="text-xs text-slate-400 font-medium">{t}</span>
          </span>
        ))}
      </div>
      <p className="relative text-xs text-slate-400 font-medium">{label}</p>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export default function FeaturesSection() {
  /*
    useScroll on the section itself.
    offset: 'start end' = when section top hits viewport bottom (enters view).
            'end start' = when section bottom hits viewport top (leaves view).
    This gives us a 0→1 progress number across the full section scroll.
  */
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /*
    useTransform: map scroll progress to y-position for each orb.
    Orb 1 (top-right): moves upward -120px as you scroll through.
    Orb 2 (bottom-left): moves downward +80px as you scroll through.
    This creates a gentle parallax depth effect behind the content.
  */
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['0px',  '-120px']);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ['0px',   '80px']);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ['0px',  '-60px']);

  return (
    /*
      EXACT spec:  <section className="py-32 relative">
      relative is required for the absolute orbs to position against this section.
      Orbs are absolute inside the section — they do NOT affect document flow.
    */
    <section
      id="features"
      ref={sectionRef}
      className="py-32 relative"
      aria-label="Features"
    >

      {/*
        ── PARALLAX GRADIENT ORBS ──────────────────────────────────────────
        These are EXACTLY per spec:
          w-96 h-96 bg-purple-300/20 blur-[100px] rounded-full absolute
        Tied to useScroll → useTransform so they slowly move as user scrolls.
        pointer-events-none so they don't block clicks.
        overflow-hidden on the section clips them to section bounds.
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Orb 1 — top right, purple */}
        <motion.div
          style={{ y: orb1Y }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-purple-300/20 blur-[100px] rounded-full"
        />
        {/* Orb 2 — bottom left, indigo */}
        <motion.div
          style={{ y: orb2Y }}
          className="absolute bottom-0 -left-20 w-96 h-96 bg-indigo-300/20 blur-[100px] rounded-full"
        />
        {/* Orb 3 — center, violet (accent) */}
        <motion.div
          style={{ y: orb3Y }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-200/15 blur-[120px] rounded-full"
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-20"
        >
          <span className="badge mb-4">
            <Zap size={11} strokeWidth={2.5} aria-hidden="true"/>
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900 mt-3">
            Built for speed and precision.
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg mt-4 max-w-xl mx-auto">
            Two powerful engines working in tandem to automate every step of result collection.
          </p>
        </motion.div>

        {/*
          EXACT spec: flex flex-col gap-32
          Each row gets 128px of vertical separation — physically impossible to overlap.
        */}
        <div className="flex flex-col gap-32">

          {/* ── Row 1: Text LEFT, Image RIGHT ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="flex flex-col gap-5"
            >
              <span className="badge self-start">
                <Zap size={11} strokeWidth={2.5} aria-hidden="true"/>
                Smart Automation
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-slate-900">
                Bypasses network fatigue, resolves captchas instantly.
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Our intelligent retry engine handles MSBTE portal instability automatically — exponential back-off, session refresh, and adaptive rate limiting. Set it once and walk away.
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {[
                  'Adaptive retry with exponential back-off',
                  'Automatic session management & refresh',
                  'Zero manual captcha interaction required',
                ].map(b => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-indigo-500 shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true"/>
                    <span className="text-sm font-medium text-slate-600">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: image */}
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.1 }}
            >
              <ImagePlaceholder id="auto" label="Smart Automation Preview"/>
            </motion.div>
          </div>

          {/* ── Row 2: Image LEFT, Text RIGHT ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: image */}
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.1 }}
              className="lg:order-1 order-2"
            >
              <ImagePlaceholder id="excel" label="Excel Output Preview"/>
            </motion.div>

            {/* Right: text */}
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="lg:order-2 order-1 flex flex-col gap-5"
            >
              <span className="badge self-start">
                <Table2 size={11} strokeWidth={2.5} aria-hidden="true"/>
                Auto-Excel Formatting
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-slate-900">
                Generates a polished Excel with merged headers &amp; analytics.
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Every run produces a beautifully formatted .xlsx — merged subject-group headers, colour-coded pass/fail rows, and a built-in summary sheet with pass percentages.
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {[
                  'Merged headers, colour-coded pass/fail rows',
                  'Built-in analytics & pass-percentage sheet',
                  'One-click export — no macros needed',
                ].map(b => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-indigo-500 shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true"/>
                    <span className="text-sm font-medium text-slate-600">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>{/* end flex-col gap-32 */}
      </div>{/* end max-w-7xl */}
    </section>
  );
}
