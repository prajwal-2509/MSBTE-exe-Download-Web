import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ResourcesSection from './components/ResourcesSection';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main id="main-content">
        <HeroSection />

        {/* Divider */}
        <div className="gradient-line mx-auto max-w-5xl" aria-hidden="true" />

        <FeaturesSection />

        {/* Divider */}
        <div className="gradient-line mx-auto max-w-5xl" aria-hidden="true" />

        <ResourcesSection />

        {/* Divider */}
        <div className="gradient-line mx-auto max-w-5xl" aria-hidden="true" />

        <DownloadSection />
      </main>

      <Footer />
    </div>
  );
}
