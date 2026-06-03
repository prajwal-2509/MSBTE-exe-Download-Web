import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features',  href: '#features'  },
  { label: 'Resources', href: '#resources' },
  { label: 'Download',  href: '#download'  },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl shadow-sm shadow-slate-200/60 border-b border-slate-200/70'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* ── Brand ── */}
          <a href="#" className="flex items-center gap-2.5 group" aria-label="Home">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow shadow-indigo-300 group-hover:scale-105 transition-transform">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1L13.5 4.5V11.5L8 15L2.5 11.5V4.5Z" fill="white" fillOpacity="0.9"/>
                <path d="M8 5.5L11 7.25V10.75L8 12.5L5 10.75V7.25Z" fill="white" fillOpacity="0.35"/>
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-[15px] tracking-tight">MSBTE Scraper</span>
          </a>

          {/* ── Desktop links ── */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {NAV_LINKS.slice(0, 2).map(l => (
              <a key={l.href} href={l.href}
                className="nav-link text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          {/* ── CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#download" id="nav-download-cta"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/20">
              <Download size={13} strokeWidth={2.5} />
              Download
            </a>
          </div>

          {/* ── Mobile burger ── */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 flex flex-col gap-4 md:hidden shadow-lg"
          >
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#download" onClick={() => setMobileOpen(false)} id="mobile-nav-download"
              className="mt-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold text-sm px-5 py-3 rounded-full">
              <Download size={15} /> Download for Windows
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
