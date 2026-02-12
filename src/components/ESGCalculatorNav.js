import React, { useState, useEffect } from 'react';
import CircularProgress from './CircularProgress';
import groupTitles from '../data/groupTitles';
import { FaPlus } from "react-icons/fa";
import { LuWeight, LuFileText } from "react-icons/lu";

function ESGCalculatorNav({
  availableYears = [],
  currentYear,
  onSelectYear,
  onAddNewYear,
  activeGroup,
  onNavigate,
  categoryCompletionStatus = {},
  questionGroups = [],
  activeSection,
}) {
  const del2NavSteps = [
    { key: 'esgInfo', title: 'Introduktion til Initiativanalyse' },
    ...questionGroups.map(groupKey => ({ key: groupKey, title: `${groupKey}: ${groupTitles[groupKey] || ''}` })),
    { key: 'del2Results', title: 'Endelige resultater' },
  ];

  const del1Steps = [
    { key: 'dvaInfo', title: 'Introduktion til DVA' },
    ...questionGroups.map(groupKey => ({ key: groupKey, title: `${groupKey}: ${groupTitles[groupKey] || ''}` })),
    { key: 'dvaResults', title: 'Resultater' },
  ];

  // Create placeholders for the year selection
  const yearPlaceholders = Array.from({ length: Math.max(0, 10 - availableYears.length) });
  
  // Redefine active and inactive content styles (without borders)
  const activeContentStyles = 'esg-bg-white esg-text-black esg-font-extrabold';
  const inactiveContentStyles = 'hover:esg-bg-white esg-text-gray-700';

  // Define border colors
  const activeBorderColor = 'esg-border-[#0b3954]';
  const inactiveBorderColor = 'esg-border-gray-300';
  const baseButtonFlex = 'esg-flex-grow esg-basis-0 esg-py-2 esg-px-3 esg-text-sm esg-flex esg-items-center esg-justify-center esg-gap-1';

  return (
    <nav className="esg-bg-[#f4f4f4] esg-text-gray-800 esg-shadow-md">
      {/* Year Selection */}
      <div className={`esg-flex esg-items-center esg-border-b-[1px] ${inactiveBorderColor}`}>
        <span className={`esg-text-lg esg-font-semibold esg-px-2 esg-flex-shrink-0 esg-border-r-[1px] ${inactiveBorderColor}`}>År:</span>
        <div className="esg-flex esg-flex-grow">
          {availableYears.map((year, index) => (
            <button
              key={year}
              onClick={() => onSelectYear(year)}
              className={`${baseButtonFlex} esg-border-t-0 esg-border-b-0 esg-border-l-0 ${
                year === currentYear ? activeContentStyles + ' ' + activeBorderColor : inactiveContentStyles + ' ' + inactiveBorderColor
              } ${index < availableYears.length - 1 || yearPlaceholders.length > 0 ? `esg-border-r-[1px] ${year === currentYear ? activeBorderColor : inactiveBorderColor}` : ''}`}
            >
              {year}
            </button>
          ))}
          {yearPlaceholders.map((_, index) => (
            <div key={`placeholder-${index}`} className={`esg-flex-grow esg-basis-0 esg-py-2 esg-px-3 esg-border-t-0 esg-border-b-0 esg-border-l-0 ${index < yearPlaceholders.length - 1 ? `esg-border-r-[1px] ${inactiveBorderColor}` : ''}`}></div>
          ))}
        </div>
        <button
          onClick={onAddNewYear}
          className="esg-px-3 esg-py-2 esg-bg-green-600 hover:esg-bg-green-700 esg-text-white esg-text-sm esg-flex esg-items-center esg-flex-shrink-0"
        >
          <FaPlus className="esg-mr-1" /> Nyt år
        </button>
      </div>

      <div className="esg-flex esg-flex-col">
        {/* DVA and IA Buttons */}
        <div className={`esg-grid esg-grid-cols-2 esg-border-b-[1px] ${inactiveBorderColor}`}>
          <button
            onClick={() => onNavigate('del1', 'dvaInfo')}
            className={`esg-py-2 esg-px-3 esg-flex esg-items-center esg-justify-center esg-gap-2 esg-border-t-0 esg-border-b-0 esg-border-l-0 ${
              activeSection === 'del1' ? activeContentStyles + ' ' + activeBorderColor : inactiveContentStyles + ' ' + inactiveBorderColor
            } esg-border-r-[1px] ${activeSection === 'del1' ? activeBorderColor : inactiveBorderColor}`}
          >
            <LuWeight /> DOBBELTVÆSENTLIGHEDSANALYSE
          </button>
          <button
            onClick={() => onNavigate('del2', 'esgInfo')}
            className={`esg-py-2 esg-px-3 esg-flex esg-items-center esg-justify-center esg-gap-2 esg-border-t-0 esg-border-b-0 esg-border-l-0 ${
              activeSection === 'del2' ? activeContentStyles + ' ' + activeBorderColor : inactiveContentStyles + ' ' + inactiveBorderColor
            }`}
          >
            <LuFileText /> INITIATIVANALYSE
          </button>
        </div>

        {/* Question Groups */}
        <div className={`esg-grid esg-grid-cols-2 esg-border-b-[1px] ${inactiveBorderColor}`}>
          {/* DVA Question Groups */}
          <div className={`esg-flex esg-flex-row esg-items-center esg-overflow-x-auto esg-border-t-[1px] ${activeSection === 'del1' ? activeBorderColor : inactiveBorderColor} esg-border-r-[1px] ${activeSection === 'del1' ? activeBorderColor : inactiveBorderColor}`}>
            <div className="esg-flex esg-justify-start esg-flex-grow">
              {del1Steps.filter(step => questionGroups.includes(step.key)).map((step, index, arr) => (
                <button
                  key={step.key}
                  onClick={() => onNavigate('del1', step.key)}
                  className={`${baseButtonFlex} esg-border-t-0 esg-border-b-0 esg-border-l-0 ${
                    activeGroup === step.key && activeSection ==='del1' ? activeContentStyles + ' ' + activeBorderColor : inactiveContentStyles + ' ' + inactiveBorderColor
                  } ${index < arr.length - 1 ? `esg-border-r-[1px] ${activeGroup === step.key && activeSection ==='del1' ? activeBorderColor : inactiveBorderColor}` : ''}`}
                >
                  <CircularProgress percentage={categoryCompletionStatus[step.key] || 0} size={24} />
                  {step.key}
                </button>
              ))}
            </div>
          </div>

          {/* IA Question Groups */}
          <div className={`esg-flex esg-flex-row esg-items-center esg-overflow-x-auto esg-border-t-[1px] ${activeSection === 'del2' ? activeBorderColor : inactiveBorderColor}`}>
            <div className="esg-flex esg-justify-start esg-flex-grow">
              {del2NavSteps.filter(step => questionGroups.includes(step.key)).map((step, index, arr) => (
                <button
                  key={step.key}
                  onClick={() => onNavigate('del2', step.key)}
                  className={`${baseButtonFlex} esg-border-t-0 esg-border-b-0 esg-border-l-0 ${
                    activeGroup === step.key && activeSection === 'del2' ? activeContentStyles + ' ' + activeBorderColor : inactiveContentStyles + ' ' + inactiveBorderColor
                  } ${index < arr.length - 1 ? `esg-border-r-[1px] ${activeGroup === step.key && activeSection ==='del2' ? activeBorderColor : inactiveBorderColor}` : ''}`}
                >
                  {step.key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="esg-grid esg-grid-cols-2">
          <button
            onClick={() => onNavigate('del1', 'dvaResults')}
            className={`esg-py-2 esg-px-3 esg-text-sm esg-flex esg-items-center esg-justify-center esg-border-l-0 ${
              activeGroup === 'dvaResults' ? activeContentStyles + ' ' + activeBorderColor : inactiveContentStyles + ' ' + inactiveBorderColor
            } esg-border-t-[1px] esg-border-b-[1px] esg-border-r-[1px] ${activeGroup === 'dvaResults' ? activeBorderColor : inactiveBorderColor}`}
          >
            DVA Resultater
          </button>
          <button
            onClick={() => onNavigate('del2', 'del2Results')}
            className={`esg-py-2 esg-px-3 esg-text-sm esg-flex esg-items-center esg-justify-center esg-border-l-0 ${
              activeGroup === 'del2Results' ? activeContentStyles + ' ' + activeBorderColor : inactiveContentStyles + ' ' + inactiveBorderColor
            } esg-border-t-[1px] esg-border-b-[1px] ${activeGroup === 'del2Results' ? activeBorderColor : inactiveBorderColor}`}
          >
            IA Resultater
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ESGCalculatorNav;