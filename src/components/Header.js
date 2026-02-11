import React from 'react';
import ESGLogo from '../assets/images/ESGScore logo.png'; // Import the logo image
// FaCalculator is no longer needed, so it can be removed if not used elsewhere in this component.

function Header({ isLoggedIn, onLogout, onNavigateToLogin, onNavigateToHome }) {
  return (
    <header className="esg-bg-gray-400 esg-p-4 esg-text-gray-800 esg-shadow-md esg-rounded-full esg-bg-opacity-10 esg-backdrop-blur-sm esg-mt-8 esg-border esg-border-gray-400"> {/* Changed text to gray for better contrast with frosted background */}
      <div className="esg-container esg-mx-auto esg-flex esg-justify-between esg-items-center">
        <div className="esg-flex esg-items-center esg-cursor-pointer" onClick={onNavigateToHome}>
          <img src={ESGLogo} alt="ESG Score Logo" className="esg-h-14 esg-mr-2" /> {/* Adjust height as needed */}
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
              className="esg-bg-blue-600 esg-text-white esg-px-4 esg-py-2 esg-rounded-md hover:esg-bg-blue-700 esg-transition-colors"
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
