import React from 'react';
import { motion } from 'framer-motion';
import { Download, Github, ArrowRight } from 'lucide-react';

const FV = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function DownloadSection() {
  return (
    <section
      id="download"
      className="py-24 px-6 md:px-12 overflow-hidden bg-white"
      aria-label="Download"
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative max-w-3xl mx-auto text-center">

          {/* Glow blob */}
          <div
            aria-hidden="true"
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.06) 50%, transparent 72%)',
            }}
          />

          <motion.div
            variants={FV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-200/70">
              <Download size={28} className="text-white" strokeWidth={2} aria-hidden="true" />
            </div>

            <h2 className="font-sans antialiased text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900">
              Ready to automate?
            </h2>

            <p className="font-sans antialiased text-slate-600 leading-relaxed text-lg max-w-md">
              Download the Windows installer and have your first result sheet ready in minutes.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
              <a
                href="#"
                id="download-primary-btn"
                className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-slate-900/25"
              >
                <Download size={15} strokeWidth={2.5} aria-hidden="true" />
                Download for Windows (.exe)
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#"
                id="github-link-btn"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Github size={15} aria-hidden="true" />
                View on GitHub
              </a>
            </div>

            {/* System note */}
            <p className="font-sans antialiased text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" aria-hidden="true" />
              Requires Windows 10 / 11 · .NET 6 Runtime · No internet needed at runtime
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
