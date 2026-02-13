import React from 'react';
import { FaTachometerAlt, FaBuilding, FaChartBar } from 'react-icons/fa'; // Icons for Dashboard, Company Figures, ESG Calculator

function DashboardSidebar({ isNavOpen, onNavigate, activeView, onSectionChange }) {
  const navigateToView = (viewName) => {
    onNavigate(viewName);
    // Potentially close sidebar here if on mobile, or handle within App.js
  };

  return (
    <div className={`esg-bg-[#0b3954] esg-text-white esg-h-full esg-flex-shrink-0 esg-transition-[width] esg-duration-300 esg-ease-in-out ${isNavOpen ? 'esg-w-64 esg-p-4' : 'esg-w-0 esg-overflow-hidden esg-p-0'}`}>
      <nav className="esg-mt-5">
        <ul>
          <li className="esg-mb-2">
            <button
              onClick={() => navigateToView('dashboard')}
              className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left ${
                activeView === 'dashboard' ? 'esg-bg-blue-700 esg-font-bold' : 'hover:esg-bg-gray-700'
              }`}
            >
              <FaTachometerAlt className="esg-mr-3" /> Dashboard
            </button>
          </li>
          <li className="esg-mb-2">
            <button
              onClick={() => navigateToView('companyFigures')}
              className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left ${
                activeView === 'companyFigures' ? 'esg-bg-blue-700 esg-font-bold' : 'hover:esg-bg-gray-700'
              }`}
            >
              <FaBuilding className="esg-mr-3" /> Basismodul
            </button>
          </li>
          <li className="esg-mb-2">
            <button
              onClick={() => {
                onSectionChange('del1'); // Set 'del1' as initial section for ESG Calculator
                navigateToView('esgCalculator');
              }}
              className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left ${
                activeView === 'esgCalculator' ? 'esg-bg-blue-700 esg-font-bold' : 'hover:esg-bg-gray-700'
              }`}
            >
              <FaChartBar className="esg-mr-3" /> ESG-beregneren
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default DashboardSidebar;