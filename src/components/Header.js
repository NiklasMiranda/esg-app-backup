import React from 'react';
import ESGLogo from '../assets/images/ESGScore logo.png'; // Import the logo image
// FaCalculator is no longer needed, so it can be removed if not used elsewhere in this component.

function Header({ isLoggedIn, onLogout, onNavigateToLogin, onNavigateToHome }) {
  return (
    <header className="esg-w-full esg-mx-auto esg-bg-gray-400 esg-p-4 esg-text-gray-800 esg-shadow-md esg-rounded-full esg-bg-opacity-10 esg-backdrop-blur-sm esg-mt-8 esg-border esg-border-gray-400">
      <div className="esg-container esg-mx-auto esg-flex esg-justify-between esg-items-center">
        <div className="esg-flex esg-items-center">
          <div className="esg-flex esg-items-center esg-cursor-pointer" onClick={onNavigateToHome}>
            <img src={ESGLogo} alt="ESG Score Logo" className="esg-h-14 esg-mr-2" />
          </div>
          <nav className="esg-ml-8 esg-flex esg-space-x-6 esg-text-xl">
            <a href="#solutions" className="esg-text-white hover:esg-text-gray-200 esg-transition-colors">Løsninger</a>
            <a href="#pricing" className="esg-text-white hover:esg-text-gray-200 esg-transition-colors">Priser</a>
            <a href="#demo" className="esg-text-white hover:esg-text-gray-200 esg-transition-colors">Se demo</a>
          </nav>
        </div>
        <nav>
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="esg-bg-red-600 esg-text-white esg-px-4 esg-py-2 esg-rounded-md hover:esg-bg-red-700 esg-transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onNavigateToLogin}
              className="esg-bg-[#fff] esg-text-black esg-px-10 esg-py-3 esg-rounded-full esg-text-xl hover:esg-bg-[#bd822e] hover:esg-text-white esg-transition-colors esg-duration-300"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
