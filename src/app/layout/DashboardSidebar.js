import { useState } from 'react';
import {
  FaBuilding,
  FaChartBar,
  FaChevronDown,
  FaFileAlt,
  FaTachometerAlt,
} from 'react-icons/fa'; // Icons for Dashboard, Company Figures, ESG Calculator

function DashboardSidebar({
  isNavOpen,
  onNavigate,
  activeView,
  onSectionChange,
}) {
  const [isCompanyInfoExpanded, setIsCompanyInfoExpanded] = useState(false);
  const [isReportExpanded, setIsReportExpanded] = useState(false);

  const navigateToView = (viewName) => {
    onNavigate(viewName);
    // Potentially close sidebar here if on mobile, or handle within App.js
  };

  return (
    <div
      className={`esg-bg-[#0b3954] esg-text-white esg-h-full esg-flex-shrink-0 esg-transition-[width] esg-duration-300 esg-ease-in-out ${isNavOpen ? 'esg-w-64 esg-p-4' : 'esg-w-0 esg-overflow-hidden esg-p-0'}`}
    >
      <nav className="esg-mt-5">
        <ul>
          <li className="esg-mb-2">
            <button
              onClick={() => navigateToView('dashboard')}
              className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left esg-justify-start esg-gap-2 align-items-center ${
                activeView === 'dashboard'
                  ? 'esg-bg-blue-700 esg-font-bold'
                  : 'hover:esg-bg-gray-700'
              }`}
            >
              <FaTachometerAlt className="esg-mr-3" /> Dashboard
            </button>
          </li>
          <li className="esg-mb-2">
            <button
              onClick={() => setIsCompanyInfoExpanded(!isCompanyInfoExpanded)}
              className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left esg-justify-start esg-gap-2 ${
                isCompanyInfoExpanded
                  ? 'esg-bg-blue-700 esg-font-bold'
                  : 'hover:esg-bg-gray-700'
              }`}
            >
              <FaBuilding className="esg-mr-3" /> Virksomhedsinfo
              <FaChevronDown
                className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isCompanyInfoExpanded ? 'esg-rotate-180' : ''}`}
              />
            </button>
            {isCompanyInfoExpanded && (
              <ul className="esg-pl-8 esg-mt-2">
                <li className="esg-mb-2">
                  <button
                    onClick={() => navigateToView('companyFigures')}
                    className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left esg-justify-start esg-gap-2 ${
                      activeView === 'companyFigures'
                        ? 'esg-bg-blue-700 esg-font-bold'
                        : 'hover:esg-bg-gray-700'
                    }`}
                  >
                    Basismodul
                  </button>
                </li>
                <li className="esg-mb-2">
                  <button
                    onClick={() => navigateToView('extendedModule')}
                    className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left esg-justify-start esg-gap-2 ${
                      activeView === 'extendedModule'
                        ? 'esg-bg-blue-700 esg-font-bold'
                        : 'hover:esg-bg-gray-700'
                    }`}
                  >
                    Udvidet modul
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li className="esg-mb-2">
            <button
              onClick={() => {
                onSectionChange('del1'); // Set 'del1' as initial section for ESG Calculator
                navigateToView('esgCalculator');
              }}
              className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left esg-justify-start esg-gap-2 ${
                activeView === 'esgCalculator'
                  ? 'esg-bg-blue-700 esg-font-bold'
                  : 'hover:esg-bg-gray-700'
              }`}
            >
              <FaChartBar className="esg-mr-3" /> ESG-beregneren
            </button>
          </li>
          <li className="esg-mb-2">
            <button
              onClick={() => setIsReportExpanded(!isReportExpanded)}
              className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left esg-justify-start esg-gap-2 ${
                isReportExpanded
                  ? 'esg-bg-blue-700 esg-font-bold'
                  : 'hover:esg-bg-gray-700'
              }`}
            >
              <FaFileAlt className="esg-mr-3" /> ESG-rapport
              <FaChevronDown
                className={`esg-ml-auto esg-transition-transform esg-duration-300 ${isReportExpanded ? 'esg-rotate-180' : ''}`}
              />
            </button>
            {isReportExpanded && (
              <ul className="esg-pl-8 esg-mt-2">
                <li className="esg-mb-2">
                  <button
                    onClick={() => navigateToView('reportMeta')}
                    className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left esg-justify-start esg-gap-2 ${
                      activeView === 'reportMeta'
                        ? 'esg-bg-blue-700 esg-font-bold'
                        : 'hover:esg-bg-gray-700'
                    }`}
                  >
                    Metatekst
                  </button>
                </li>
                <li className="esg-mb-2">
                  <button
                    onClick={() => navigateToView('reportGenerate')}
                    className={`esg-flex esg-items-center esg-px-4 esg-py-2 esg-rounded-md esg-w-full esg-text-left esg-justify-start esg-gap-2 ${
                      activeView === 'reportGenerate'
                        ? 'esg-bg-blue-700 esg-font-bold'
                        : 'hover:esg-bg-gray-700'
                    }`}
                  >
                    Generer rapport
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default DashboardSidebar;
