import React from 'react';
import InteractiveCanvas  from './components/InteractiveCanvas';
import Navbar             from './components/Navbar';
import HeroSection        from './components/HeroSection';
import FeaturesSection    from './components/FeaturesSection';
import ResourcesSection   from './components/ResourcesSection';
import DownloadSection    from './components/DownloadSection';
import Footer             from './components/Footer';

/*
  PAGE ARCHITECTURE
  ═════════════════

  <InteractiveCanvas/>  — position:fixed z-index:-10
                          Sits permanently behind EVERYTHING.
                          pointer-events:auto on canvas but window.mousemove
                          handles the physics regardless of which element is on top.

  <div id="page">       — position:relative z-index:0 bg-white
                          Solid white background ensures section text is always
                          readable over the canvas particles.

    <Navbar/>           — sticky top-0 z-50 (in document flow)

    <main>              — Pure block container, zero positioning tricks
      <HeroSection/>        relative min-h-screen flex-col justify-center items-center
      <hr/>                 gradient divider
      <FeaturesSection/>    py-32 relative (orbs + scroll parallax)
      <hr/>
      <ResourcesSection/>   py-32 bg-slate-50/70
      <hr/>
      <DownloadSection/>    py-32 flex-col items-center
    </main>

    <Footer/>           — standard block after main

  CRITICAL: No section uses negative margins or absolute positioning for layout.
            Every section is a self-contained rectangle in normal document flow.
*/

function Divider() {
  return (
    <div className="px-6 md:px-12" aria-hidden="true">
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #e2e8f0 30%, #e2e8f0 70%, transparent)', maxWidth: '80rem', margin: '0 auto' }} />
    </div>
  );
}

export default function App() {
  return (
    <>
      {/* Fixed physics canvas — behind everything */}
      <InteractiveCanvas />

      {/*
        Page shell:
        - position:relative creates stacking context (canvas z:-10 sits below)
        - bg-white makes every section fully readable over canvas particles
        - min-h-screen ensures the page always fills viewport
      */}
      <div id="page" className="relative bg-white min-h-screen">

        {/* Sticky navbar — in normal document flow */}
        <Navbar />

        {/* Main — stack of sections, zero collapsing possible */}
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
