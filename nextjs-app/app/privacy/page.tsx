"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Database, EyeOff, Scale } from "lucide-react";
import { Container, Footer } from "../page";

const bgStyle = {
  backgroundColor: "#ffffff",
  backgroundImage: `
    radial-gradient(rgba(31, 60, 136, 0.05) 1.2px, transparent 1.2px),
    linear-gradient(to bottom, #F4F6FB 0%, #ffffff 500px, #ffffff 100%)
  `,
  backgroundSize: "24px 24px, 100% 100%",
};

export default function PrivacyPage() {
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
            <span className="text-xs font-bold tracking-wider text-[#34A853] uppercase bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              TRUST & SECURITY
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-4 mb-4">
              Data Privacy Policy
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              We believe in total transparency. Learn what data our app accesses, stores, and collects.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="flex flex-col gap-8">
            {/* Section 1 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4285F4]">
                  <Database size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">What This Tool Does</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                This application automates retrieval of publicly available student result data from the official MSBTE result portal, the same data any individual could check manually one seat at a time. It does not bypass any login, paywall, or access restriction.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#34A853]">
                  <Shield size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">What Data Stays Local</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                All scraped results, generated Excel/PDF files, and your session history are stored only on your own computer in a local SQLite database. Nothing about the scraped student data is ever sent to any external server.
              </p>
            </div>

            {/* Section 3 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500">
                  <EyeOff size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">What We Do Collect</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                On first launch, the app asks for your name, email, and college for basic usage tracking - this helps us understand who's using the tool. This information is sent to a private Google Sheet and is never shared with third parties or used for any other purpose.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#FBBC05]">
                  <Scale size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Your Responsibility</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                Since this tool retrieves publicly available academic data, you are responsible for using it in compliance with your institution's policies and MSBTE's terms of service.
              </p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
