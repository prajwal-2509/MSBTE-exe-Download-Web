import React from 'react';
import { motion } from 'framer-motion';
import { Heart, GraduationCap, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400" role="contentinfo">
      {/* Top border gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/30">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1L13.5 4.5V11.5L8 15L2.5 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9" />
                <path d="M8 5L10.5 6.5V9.5L8 11L5.5 9.5V6.5L8 5Z" fill="white" fillOpacity="0.4" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">MSBTE Master Scraper</span>
          </div>

          {/* Attribution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <p className="text-sm font-medium text-slate-300">
              Developed with{' '}
              <Heart size={13} className="inline text-rose-400 mx-0.5" aria-label="love" />{' '}
              by{' '}
              <span className="text-white font-semibold">Prajwal Hulle</span>
            </p>
            <p className="text-xs flex items-center gap-1.5 flex-wrap justify-center">
              <GraduationCap size={13} className="text-indigo-400 shrink-0" aria-hidden="true" />
              <span>Government Polytechnic, Solapur</span>
              <span className="opacity-40">·</span>
              <span>Academic Year: 2025–2026</span>
            </p>
          </motion.div>

          {/* Nav links */}
          <nav aria-label="Footer navigation" className="flex items-center gap-6 text-xs font-medium">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#resources" className="hover:text-white transition-colors duration-200">Resources</a>
            <a href="#download" className="hover:text-white transition-colors duration-200">Download</a>
          </nav>
        </div>

        {/* Bottom line */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© 2025–2026 MSBTE Master Scraper. All rights reserved.</span>
          <span>Runs 100% locally · No data collection · No telemetry</span>
        </div>
      </div>
    </footer>
  );
}
