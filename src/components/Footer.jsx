import React from 'react';
import { Heart } from 'lucide-react';

const NAV = [
  { label: 'Features',  href: '#features'  },
  { label: 'Resources', href: '#resources' },
  { label: 'Download',  href: '#download'  },
];

export default function Footer() {
  return (
    /*
      LAYOUT RULES:
      - bg-slate-50/50 — light, NOT dark. No heavy contrast strip.
      - border-t border-slate-200 — single clean top accent divider
      - py-12 gives breathing room
      - flex-col md:flex-row justify-between aligns brand left, attribution right
      - Second row (copyright) separated by border-t and pt-6 mt-8
      - NO fixed heights, NO absolute positioning, NO dark colours
    */
    <footer
      className="w-full bg-slate-50/50 border-t border-slate-200 py-12"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">

        {/* ── Top row: brand + nav + attribution ─────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow shadow-indigo-200">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/>
                <path d="M8 5.5L10.5 7V10L8 11.5L5.5 10V7Z" fill="white" fillOpacity="0.35"/>
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              MSBTE Master Scraper
            </span>
          </div>

          {/* Nav links */}
          <nav
            className="flex items-center gap-6"
            aria-label="Footer navigation"
          >
            {NAV.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors duration-150"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Attribution — right side */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5 flex-wrap">
              Developed with
              <Heart size={13} className="text-rose-400 shrink-0" aria-label="love" />
              by{' '}
              <span className="font-semibold text-slate-900">Prajwal Hulle</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Government Polytechnic, Solapur
              <span className="mx-2 text-slate-300" aria-hidden="true">|</span>
              Academic Year: 2025–2026
            </p>
          </div>
        </div>

        {/* ── Bottom row: copyright + privacy note ────────────────────── */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © 2025–2026 MSBTE Master Scraper. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Runs 100% locally · No data collection · No telemetry
          </p>
        </div>

      </div>
    </footer>
  );
}
