import React from 'react';
import ParticleCanvas   from './components/ParticleCanvas';
import Navbar           from './components/Navbar';
import HeroSection      from './components/HeroSection';
import FeaturesSection  from './components/FeaturesSection';
import ResourcesSection from './components/ResourcesSection';
import DownloadSection  from './components/DownloadSection';
import Footer           from './components/Footer';

/*
  ROOT LAYOUT ARCHITECTURE
  ════════════════════════

  <body> (position: relative — set in index.css)
    │
    ├── <canvas>  position:fixed  z-index:-10   ← sits BEHIND everything
    │
    └── <div#app>  position:relative  z-index:0  background:white
          │  (solid white background ensures sections don't bleed into canvas)
          │
          ├── <Navbar>   position:sticky  top:0  z-index:50
          │              Lives IN normal flow — scrolls with page until top
          │
          └── <main>     Normal block layout — zero absolute positioning
                ├── <HeroSection>       py-32/44  — tall standalone block
                ├── <hr divider>        1px gradient line
                ├── <FeaturesSection>   py-24     — independent block
                ├── <hr divider>
                ├── <ResourcesSection>  py-24 bg-slate-50/70
                ├── <hr divider>
                └── <DownloadSection>   py-24
          └── <Footer>  Normal block after main

  WHY THIS WORKS:
  - Canvas is fixed → it NEVER pushes content or creates document height
  - App div is solid white → sections are never "see-through" into canvas
  - Navbar is sticky (not fixed) → it occupies its natural flow height
  - All sections are standard block elements with vertical padding
  - No hardcoded heights that could cause collapse or overflow
  - No absolute-positioned text blocks that could overlap siblings
*/

function Divider() {
  return (
    <div className="px-6 md:px-12" aria-hidden="true">
      <div
        className="h-px max-w-7xl mx-auto"
        style={{
          background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)',
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      {/* ── Fixed particle canvas — position:fixed z-index:-10 ── */}
      <ParticleCanvas />

      {/*
        ── Page shell ──────────────────────────────────────────────
        position:relative  → establishes stacking context above canvas
        bg-white           → solid white prevents sections bleeding into canvas
        min-h-screen       → page always fills the viewport height
        z-index:0 (default) → sits above the canvas (z:-10) naturally
      */}
      <div
        id="app"
        className="relative bg-white min-h-screen"
      >

        {/* Sticky navbar — in document flow, scrolls up to stick */}
        <Navbar />

        {/* Main content — every section is a direct block child */}
        <main id="main-content">

          <HeroSection />

          <Divider />

          <FeaturesSection />

          <Divider />

          <ResourcesSection />

          <Divider />

          <DownloadSection />

        </main>

        {/* Footer — standard block after main */}
        <Footer />

      </div>
    </>
  );
}
