import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  /*
    Simple, light footer in standard document flow.
    bg-slate-50/50 border-t — clean accent, NO dark blocks.
    Pushed to bottom by standard block flow after all sections.
  */
  return (
    <footer className="w-full bg-slate-50/50 border-t border-slate-200 py-10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow shadow-indigo-200">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/>
              <path d="M8 5.5L10.5 7V10L8 11.5L5.5 10V7Z" fill="white" fillOpacity="0.4"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">MSBTE Master Scraper</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {[['Features','#features'],['Resources','#resources'],['Download','#download']].map(([l,h])=>(
            <a key={h} href={h} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">{l}</a>
          ))}
        </nav>

        {/* Attribution */}
        <div className="flex flex-col items-center md:items-end gap-0.5">
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5 flex-wrap justify-center md:justify-end">
            Developed with <Heart size={13} className="text-rose-400" aria-label="love"/> by{' '}
            <span className="font-semibold text-slate-900">Prajwal Hulle</span>
          </p>
          <p className="text-xs text-slate-500">
            Government Polytechnic, Solapur
            <span className="mx-2 text-slate-300" aria-hidden="true">|</span>
            Academic Year: 2025–2026
          </p>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="max-w-7xl mx-auto px-6 mt-6 pt-5 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-slate-400">© 2025–2026 MSBTE Master Scraper. All rights reserved.</p>
        <p className="text-xs text-slate-400">Runs 100% locally · No data collection · No telemetry</p>
      </div>
    </footer>
  );
}
