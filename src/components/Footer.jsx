import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50/50 border-t border-slate-200 py-12 mt-24" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* ── Left: Brand ── */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow shadow-indigo-200 shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1L13.5 4.5V11.5L8 15L2.5 11.5V4.5Z" fill="white" fillOpacity="0.9"/>
              <path d="M8 5.5L11 7.25V10.75L8 12.5L5 10.75V7.25Z" fill="white" fillOpacity="0.35"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-[15px] tracking-tight">MSBTE Master Scraper</span>
        </div>

        {/* ── Right: Attribution ── */}
        <div className="flex flex-col items-center md:items-end gap-1 text-right">
          <p className="font-sans antialiased text-sm text-slate-700 font-medium flex items-center gap-1.5 flex-wrap justify-center md:justify-end">
            Developed with
            <Heart size={13} className="text-rose-400 shrink-0" aria-label="love" />
            by{' '}
            <span className="font-semibold text-slate-900">Prajwal Hulle</span>
          </p>
          <p className="font-sans antialiased text-xs text-slate-500 leading-relaxed">
            Government Polytechnic, Solapur
            <span className="mx-2 text-slate-300">|</span>
            Academic Year: 2025–2026
          </p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-sans antialiased text-xs text-slate-400">
          © 2025–2026 MSBTE Master Scraper. All rights reserved.
        </p>
        <p className="font-sans antialiased text-xs text-slate-400">
          Runs 100% locally · No data collection · No telemetry
        </p>
      </div>
    </footer>
  );
}
