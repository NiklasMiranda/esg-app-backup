import React from 'react';
import Grainient from './Grainient'; // Import the Grainient component

function LandingPage() {
  return (
    <div className="esg-flex esg-flex-col esg-min-h-screen esg-bg-gray-100">
      {/* Hero Section */}
      <section className="esg-relative esg-py-20 esg-px-4 esg-text-center esg-overflow-hidden esg-h-screen esg-flex esg-items-center esg-justify-center">
        <div className="esg-absolute esg-inset-0 esg-z-0">
          <Grainient
            color1="#0b3954"
            color2="#000000"
            color3="#0b3954"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>
        <div className="esg-container esg-mx-auto esg-relative esg-z-10 esg-text-white esg-max-w-7xl">
          <h1 className="esg-text-5xl esg-font-extrabold esg-mb-4">ESGScore.dk - forbedring af ESG for virksomheder</h1>
          <p className="esg-text-2xl esg-mb-8">
            Få et tal på din virksomheds ESG-profil og arbejd strategisk med bæredygtighed. Intuitivt. Dokumenteret. Fremtidsorienteret.
          </p>
          <a
            href="#intro-section" // Link to the intro section below
            className="esg-bg-[#fff] esg-text-black esg-px-10 esg-py-3 esg-rounded-full esg-text-xl hover:esg-bg-[#bd822e] hover:esg-text-white esg-transition-colors esg-duration-300"
          >
            Læs mere
          </a>
        </div>
      </section>

      {/* Intro Section */}
      <section id="intro-section" className="esg-py-16 esg-px-4 esg-bg-white">
        <div className="esg-container esg-mx-auto esg-text-center">
          <h2 className="esg-text-4xl esg-font-bold esg-text-gray-800 esg-mb-8">Hvad vi tilbyder</h2>
          <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-3 esg-gap-8">
            <div className="esg-p-6 esg-shadow-lg esg-rounded-lg esg-bg-blue-50">
              <h3 className="esg-text-2xl esg-font-semibold esg-text-blue-700 esg-mb-4">Dybdegående Analyser</h3>
              <p className="esg-text-gray-700">
                Få indsigt i din virksomheds ESG-performance med vores avancerede analyseværktøjer.
              </p>
            </div>
            <div className="esg-p-6 esg-shadow-lg esg-rounded-lg esg-bg-green-50">
              <h3 className="esg-text-2xl esg-font-semibold esg-text-green-700 esg-mb-4">Nem Rapportering</h3>
              <p className="esg-text-gray-700">
                Generer omfattende ESG-rapporter med lethed, klar til interessenter.
              </p>
            </div>
            <div className="esg-p-6 esg-shadow-lg esg-rounded-lg esg-bg-purple-50">
              <h3 className="esg-text-2xl esg-font-semibold esg-text-purple-700 esg-mb-4">Forbedringsstrategier</h3>
              <p className="esg-text-gray-700">
                Identificer områder for forbedring og implementer effektive bæredygtighedsstrategier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for other content if needed */}
      <div className="esg-flex-grow esg-p-4">
        {/* Potentially more sections here */}
      </div>
    </div>
  );
}

export default LandingPage;