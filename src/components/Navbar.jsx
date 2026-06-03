import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'Features',  href: '#features'  },
  { label: 'Resources', href: '#resources' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -68, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm'
            : 'bg-white/60 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5 group" aria-label="MSBTE Scraper Home">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow shadow-indigo-300 group-hover:scale-105 transition-transform duration-200">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95"/>
                <path d="M8 5.5L10.5 7V10L8 11.5L5.5 10V7Z" fill="white" fillOpacity="0.35"/>
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">MSBTE Scraper</span>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main">
            {LINKS.map(l => (
              <a key={l.href} href={l.href}
                className="nav-link text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Download CTA */}
          <a
            href="#download"
            id="nav-download-btn"
            className="hidden md:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-slate-900/20"
          >
            <Download size={13} strokeWidth={2.5} aria-hidden="true" />
            Download
          </a>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mob"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-x-0 top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 flex flex-col gap-4 shadow-lg md:hidden"
          >
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#download" id="mob-download-btn" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold text-sm px-5 py-3 rounded-full mt-1">
              <Download size={14} aria-hidden="true" /> Download for Windows
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
