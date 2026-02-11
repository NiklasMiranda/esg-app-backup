import React from 'react';
import ESGLogo from '../assets/images/ESGScore logo.png';
import CircularProgress from './CircularProgress';

function DashboardHeader({ isLoggedIn, onLogout, newTotalCompletionPercentage }) {
  return (
    <div className="esg-bg-[#0b3954] esg-p-2 esg-flex-shrink-0">
      <div className="esg-flex esg-justify-between esg-items-center esg-mb-4">
        <div className="esg-flex esg-items-center">
          <img src={ESGLogo} alt="ESG Score Logo" className="esg-h-8 esg-mr-2" />
        </div>
        <div className="esg-flex esg-items-center">
          <CircularProgress percentage={newTotalCompletionPercentage} />
          {isLoggedIn && (
            <button onClick={onLogout} className="btn-primary esg-ml-4 esg-text-white esg-bg-red-600 hover:esg-bg-red-700">Logout</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;