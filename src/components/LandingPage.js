import React from 'react';

function LandingPage({ onNavigateToLogin }) {
  return (
    <div className="esg-min-h-screen esg-flex esg-flex-col esg-items-center esg-justify-center esg-bg-gray-100 esg-p-4">
      <div className="esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-lg esg-max-w-md esg-w-full esg-text-center">
        <h1 className="esg-text-4xl esg-font-bold esg-text-gray-800 esg-mb-4">Velkommen til ESG Analyse</h1>
        <p className="esg-text-gray-600 esg-mb-6">
          Din platform for at analysere, rapportere og forbedre din virksomheds indsats inden for miljø, sociale forhold og god selskabsledelse.
        </p>
        <button
          onClick={onNavigateToLogin}
          className="esg-bg-blue-600 esg-text-white esg-px-6 esg-py-3 esg-rounded-md esg-text-lg esg-font-semibold hover:esg-bg-blue-700 focus:esg-outline-none focus:esg-ring-2 focus:esg-ring-blue-500 focus:esg-ring-opacity-50"
        >
          Login for at fortsætte
        </button>
      </div>
    </div>
  );
}

export default LandingPage;