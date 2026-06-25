"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Container, Footer } from "../page";
import { motion, AnimatePresence } from "framer-motion";

const bgStyle = {
  backgroundColor: "#ffffff",
  backgroundImage: `
    radial-gradient(rgba(31, 60, 136, 0.05) 1.2px, transparent 1.2px),
    linear-gradient(to bottom, #F4F6FB 0%, #ffffff 500px, #ffffff 100%)
  `,
  backgroundSize: "24px 24px, 100% 100%",
};

const FAQS = [
  {
    q: "Windows Defender blocks the app",
    a: "Windows Defender may show \"Windows protected your PC\" since this app isn't digitally signed. This is normal for independently built tools. Click \"More info\", then \"Run anyway\" to proceed. The app itself does not modify system files or require admin rights."
  },
  {
    q: "A seat number fails to scrape",
    a: "The app automatically retries each seat up to 30 times with a fresh captcha attempt each time. If a seat still fails after all retries, it will be logged and skipped so the rest of your batch completes. You can find the seat numbers worth checking manually in the application log."
  },
  {
    q: "The app seems slow on the first captcha solve",
    a: "The first captcha solve after launching takes slightly longer because the OCR model loads into memory. Subsequent captchas solve almost instantly."
  },
  {
    q: "Antivirus software flags the .exe",
    a: "Since this is an unsigned, independently distributed executable, some antivirus software may flag it as unrecognized. The source code is fully open and available on GitHub for review."
  },
  {
    q: "The download doesn't start when I click the button",
    a: "Make sure pop-ups/downloads aren't blocked by your browser. Alternatively, visit the GitHub Releases page directly and download the .zip from there."
  }
];

export default function TroubleshootingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={bgStyle} className="min-h-screen flex flex-col font-sans text-slate-900 relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
        <Container className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center shadow shadow-blue-200 group-hover:scale-105 transition-transform">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5L13 4.5V11.5L8 14.5L3 11.5V4.5Z" fill="white" fillOpacity="0.95" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-sm group-hover:text-slate-700 transition-colors">
              MSBTE Master Scraper
            </span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-20 flex-1 relative z-10">
        <Container className="max-w-3xl">
          {/* Title */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-wider text-[#FBBC05] uppercase bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
              HELP & SUPPORT
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-4 mb-4">
              Troubleshooting
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Common issues, solutions, and operational questions answered.
            </p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between text-left p-6 md:p-8 font-semibold text-slate-800 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <span className="text-[15px] md:text-base pr-4">{faq.q}</span>
                    <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 md:px-8 pb-8 pt-0 border-t border-slate-100 text-slate-500 text-sm leading-relaxed font-medium">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
