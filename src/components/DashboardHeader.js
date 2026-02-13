import React, { useState } from 'react'; // Added useState
import ESGLogo from '../assets/images/ESGScore logo.png';
import CircularProgress from './CircularProgress';
import { HiMenu, HiX } from 'react-icons/hi'; // Added HiX icon

function DashboardHeader({ isLoggedIn, onLogout, newTotalCompletionPercentage, onToggleNav, userCompanyName, isNavOpen }) { // Added onToggleNav, userCompanyName, isNavOpen
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="esg-bg-[#0b3954] esg-p-2 esg-flex-shrink-0 esg-border-b-2 esg-border-white">
      <div className="esg-flex esg-justify-between esg-items-center esg-px-4 esg-py-2"> {/* Adjusted padding */}
        {/* Left section: Logo and Toggle Button */}
        <div className="esg-flex esg-items-center">
          <img src={ESGLogo} alt="ESG Score Logo" className="esg-h-14 esg-mr-4" /> {/* Logo */}
          <button onClick={onToggleNav} className="esg-text-white focus:esg-outline-none esg-transition-transform esg-duration-300 esg-ease-in-out">
            {isNavOpen ? <HiX className="esg-h-6 esg-w-6" /> : <HiMenu className="esg-h-6 esg-w-6" />} {/* Hamburger/Cross menu icon */}
          </button>
        </div>

        {/* Right section: Company Name and Dropdown */}
        <div className="esg-relative">
          <button
            onClick={handleDropdownToggle}
            className="esg-flex esg-items-center esg-text-white esg-px-4 esg-pt-2.5 esg-pb-1.5 esg-rounded-md hover:esg-bg-blue-700 focus:esg-outline-none"
          >
            <span className="esg-mr-2">{userCompanyName || 'Din Virksomhed'}</span> {/* Company Name */}
            <svg
              className={`esg-w-4 esg-h-4 esg-transform ${dropdownOpen ? 'esg-rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {dropdownOpen && (
            <div className="esg-absolute esg-right-0 esg-mt-2 esg-w-48 esg-bg-white esg-rounded-md esg-shadow-lg esg-z-30">
              <button
                onClick={onLogout}
                className="esg-block esg-w-full esg-text-left esg-px-4 esg-py-2 esg-text-gray-800 hover:esg-bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;