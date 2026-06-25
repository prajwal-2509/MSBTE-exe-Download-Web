"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Play, Info } from "lucide-react";
import { Container, Footer } from "../page";

const guideBgStyle = {
  backgroundColor: "#ffffff",
  backgroundImage: `
    radial-gradient(rgba(31, 60, 136, 0.05) 1.2px, transparent 1.2px),
    linear-gradient(to bottom, #F4F6FB 0%, #ffffff 500px, #ffffff 100%)
  `,
  backgroundSize: "24px 24px, 100% 100%",
};

export default function GuidePage() {
  return (
    <div style={guideBgStyle} className="min-h-screen flex flex-col font-sans text-slate-900 relative overflow-hidden">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
        <Container className="flex items-center justify-between">
          {/* Logo */}
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

          {/* Back to Home */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-20 flex-1 relative z-10">
        <Container className="max-w-3xl">
          {/* Page Title */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-wider text-[#4285F4] uppercase bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              DOCUMENTATION
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-4 mb-4">
              Installation & User Guide
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Everything you need to know from initial download to exporting your first excel report.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {/* Section 1 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4285F4]">
                  <Info size={20} strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Before You Start</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Windows 10 or 11 required",
                  "No need to install Python separately - it's bundled",
                  "~680MB free disk space for the download",
                  "Stable internet connection during the scrape (not for install)",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 leading-relaxed text-sm font-medium">
                    <CheckCircle2 size={18} className="text-[#34A853] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#34A853]">
                  <Play size={20} strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Installation Steps</h2>
              </div>
              <ol className="space-y-6">
                {[
                  "Download the .zip file from the button above",
                  "Extract the zip to any folder (e.g. Desktop or Documents)",
                  "Open the extracted MSBTE_Scraper folder",
                  "Double-click MSBTE_Scraper.exe to launch",
                  "On first launch, you'll see a one-time registration screen - enter your name, email, and college, then click Continue",
                  "The main application window will open - you're ready to scrape",
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-600 leading-relaxed text-sm font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Section 3 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">First Scrape</h2>
              </div>
              <ol className="space-y-6">
                {[
                  "Enter your User Name and College Name",
                  "Paste the official MSBTE result page URL",
                  "Enter a seat number range (e.g. 168009-168050) or load from a text/Excel file",
                  "Click \"Start Download\" and choose where to save the Excel file",
                  "Watch live progress on the \"Live Progress\" tab as each worker scrapes a seat",
                  "Once complete, find your formatted Excel report at the location you chose",
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-600 leading-relaxed text-sm font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
