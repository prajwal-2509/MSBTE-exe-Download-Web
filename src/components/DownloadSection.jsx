import React from 'react';
import { motion } from 'framer-motion';
import { Download, Github, ArrowRight } from 'lucide-react';

const rise = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function DownloadSection() {
  return (
    /*
      EXACT spec: py-32 flex flex-col items-center
      This is its own separate section — completely isolated from the Footer below.
    */
    <section
      id="download"
      className="py-32 px-6 flex flex-col items-center"
      aria-label="Download"
    >
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="w-full max-w-3xl flex flex-col items-center gap-6 text-center"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-200/60">
          <Download size={28} className="text-white" strokeWidth={2} aria-hidden="true"/>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900">
          Ready to automate?
        </h2>

        <p className="text-slate-600 leading-relaxed text-lg max-w-md">
          Download the Windows installer and have your first result sheet ready in minutes.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a href="#" id="download-main-btn"
            className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-slate-900/25">
            <Download size={15} strokeWidth={2.5} aria-hidden="true"/>
            Download for Windows (.exe)
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true"/>
          </a>
          <a href="https://github.com/prajwal-2509/MSBTE-exe-Download-Web"
            id="github-link-btn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <Github size={15} aria-hidden="true"/>
            View on GitHub
          </a>
        </div>

        <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true"/>
          Windows 10 / 11 · .NET 6.0 Runtime · No internet required at runtime
        </p>
      </motion.div>
    </section>
  );
}
