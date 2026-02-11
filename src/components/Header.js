import React from 'react';
import { FaCalculator } from "react-icons/fa6";

function Header({ isLoggedIn, onLogout, onNavigateToLogin, onNavigateToHome }) {
  return (
    <header className="esg-bg-[#0b3954] esg-p-4 esg-text-white esg-shadow-md">
      <div className="esg-container esg-mx-auto esg-flex esg-justify-between esg-items-center">
        <div className="esg-flex esg-items-center esg-cursor-pointer" onClick={onNavigateToHome}>
          <FaCalculator className="esg-mr-2 esg-text-2xl" />
          <h1 className="esg-text-2xl esg-font-bold">ESG App</h1>
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
