import React from 'react';
import { motion } from 'framer-motion';
import { Download, Github, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function DownloadSection() {
  return (
    <section
      id="download"
      className="py-28 bg-white overflow-hidden"
      aria-label="Download Section"
    >
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        {/* Background glow blob */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(99,102,241,0.09) 0%, rgba(139,92,246,0.05) 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="relative flex flex-col items-center gap-6"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-200 mb-2">
            <Download size={28} className="text-white" strokeWidth={2} />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Ready to automate?
          </h2>
          <p className="text-slate-500 text-lg max-w-md font-medium leading-relaxed">
            Download the Windows installer and have your first result sheet ready in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <a
              href="#"
              id="main-download-btn"
              className="group flex items-center gap-2.5 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-7 py-4 rounded-full transition-all duration-200 hover:shadow-2xl hover:shadow-slate-900/25 hover:-translate-y-1"
            >
              <Download size={16} strokeWidth={2.5} />
              Download for Windows (.exe)
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </a>
            <a
              href="#"
              id="github-btn"
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <Github size={15} />
              View on GitHub
            </a>
          </div>

          {/* System req badge */}
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Requires Windows 10/11 · .NET 6.0 Runtime · No internet required at runtime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
