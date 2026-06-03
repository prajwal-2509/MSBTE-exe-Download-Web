import React from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar         from './components/Navbar';
import HeroSection    from './components/HeroSection';
import FeaturesSection  from './components/FeaturesSection';
import ResourcesSection from './components/ResourcesSection';
import DownloadSection  from './components/DownloadSection';
import Footer           from './components/Footer';

export default function App() {
  return (
    <>
      {/* Fixed particle canvas — sits behind everything at z-[-1] */}
      <ParticleCanvas />

      {/* Page shell */}
      <div className="relative min-h-screen bg-white/92">
        <Navbar />

        <main id="main-content">
          <HeroSection />

          {/* Thin divider */}
          <div className="max-w-5xl mx-auto px-6" aria-hidden="true">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          <FeaturesSection />

          <div className="max-w-5xl mx-auto px-6" aria-hidden="true">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          <ResourcesSection />

          <div className="max-w-5xl mx-auto px-6" aria-hidden="true">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          <DownloadSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
