import React from 'react';

function LandingPage() {
  return (
    <div className="esg-flex esg-flex-col esg-bg-gray-100">
      {/* Hero Section */}
      <section className="esg-bg-gradient-to-r esg-from-blue-500 esg-to-teal-500 esg-text-white esg-py-20 esg-px-4 esg-text-center esg-h-screen items-center">
        <div className="esg-container esg-mx-auto">
          <h1 className="esg-text-5xl esg-font-extrabold esg-mb-4">ESG Analyse - Din Partner for Bæredygtighed</h1>
          <p className="esg-text-xl esg-mb-8">
            Analyser, rapporter, og forbedr din virksomheds indsats inden for miljø, sociale forhold og god selskabsledelse.
          </p>
          <a
            href="#intro-section" // Link to the intro section below
            className="esg-bg-white esg-text-blue-600 esg-px-8 esg-py-3 esg-rounded-full esg-font-semibold esg-text-lg hover:esg-bg-gray-100 esg-transition-colors esg-duration-300"
          >
            Lær mere
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