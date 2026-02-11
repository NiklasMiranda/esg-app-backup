import React, { useState, useEffect } from 'react';
import CircularProgress from './CircularProgress'; // Assuming this might still be used for category completion, but will remove if not needed for horizontal nav
import groupTitles from '../data/groupTitles';
import { FaPlus } from "react-icons/fa"; // For adding new year
import { LuWeight, LuFileText } from "react-icons/lu"; // Keep DVA/IA icons
function ESGCalculatorNav({
  availableYears = [], // Default to empty array to prevent issues
  currentYear,
  onSelectYear,
  onAddNewYear,
  activeGroup,
  onNavigate,
  categoryCompletionStatus = {}, // Default to empty object
  questionGroups = [], // Default to empty array
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

  return (
    <nav className="esg-bg-gray-200 esg-text-gray-800 esg-p-4 esg-shadow-md">
      {/* Year Selection */}
      <div className="esg-flex esg-items-center esg-justify-center esg-mb-4 esg-gap-2 esg-overflow-x-auto esg-pb-2 esg-border-b esg-border-gray-300">
        <span className="esg-text-lg esg-font-semibold esg-mr-2 esg-flex-shrink-0">År:</span>
        {availableYears.map(year => (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex-shrink-0 ${
              year === currentYear ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
            }`}
          >
            {year}
          </button>
        ))}
        <button
          onClick={onAddNewYear}
          className="esg-px-3 esg-py-1 esg-rounded-full esg-bg-green-600 hover:esg-bg-green-700 esg-text-sm esg-flex esg-items-center esg-flex-shrink-0"
        >
          <FaPlus className="esg-mr-1" /> Nyt år
        </button>
      </div>

      <div className="esg-flex esg-flex-col esg-gap-4">
        {/* DVA Section */}
        <div className={`esg-flex esg-flex-col esg-items-center esg-gap-2 esg-rounded-md esg-p-2 ${activeSection === 'del1' ? 'esg-border-blue-600 esg-border-2' : ''}`}>
          <button
            onClick={() => onNavigate('del1', 'dvaInfo')}
            className={`esg-py-2 esg-px-3 esg-rounded-md esg-flex esg-items-center esg-gap-2 ${
              activeSection === 'del1' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'hover:esg-bg-gray-300 esg-text-gray-700'
            }`}
          >
            <LuWeight /> DVA
          </button>
          <div className="esg-flex esg-flex-wrap esg-justify-center esg-gap-2 esg-py-2 esg-overflow-x-auto">
            {del1Steps.filter(step => questionGroups.includes(step.key)).map(step => (
              <button
                key={step.key}
                onClick={() => onNavigate('del1', step.key)}
                className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex esg-items-center esg-gap-1 ${
                  activeGroup === step.key ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
                }`}
              >
                {questionGroups.includes(step.key) && (
                  <CircularProgress percentage={categoryCompletionStatus[step.key] || 0} size={16} />
                )}
                {step.key}
              </button>
            ))}
            {/* Intro and Results for DVA */}
            <button
                onClick={() => onNavigate('del1', 'dvaInfo')}
                className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex esg-items-center esg-gap-1 ${
                    activeGroup === 'dvaInfo' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
                }`}
            >
                Introduktion
            </button>
            <button
                onClick={() => onNavigate('del1', 'dvaResults')}
                className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex esg-items-center esg-gap-1 ${
                    activeGroup === 'dvaResults' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
                }`}
            >
                Resultater
            </button>
          </div>
        </div>

        {/* IA Section */}
        <div className={`esg-flex esg-flex-col esg-items-center esg-gap-2 esg-rounded-md esg-p-2 ${activeSection === 'del2' ? 'esg-border-blue-600 esg-border-2' : ''}`}>
          <button
            onClick={() => onNavigate('del2', 'esgInfo')}
            className={`esg-py-2 esg-px-3 esg-rounded-md esg-flex esg-items-center esg-gap-2 ${
              activeSection === 'del2' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'hover:esg-bg-gray-300 esg-text-gray-700'
            }`}
          >
            <LuFileText /> IA
          </button>
          <div className="esg-flex esg-flex-wrap esg-justify-center esg-gap-2 esg-py-2 esg-overflow-x-auto">
            {del2NavSteps.filter(step => questionGroups.includes(step.key)).map(step => (
              <button
                key={step.key}
                onClick={() => onNavigate('del2', step.key)}
                className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex-shrink-0 ${
                  activeGroup === step.key ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
                }`}
              >
                {step.key}
              </button>
            ))}
            {/* Intro and Results for IA */}
            <button
                onClick={() => onNavigate('del2', 'esgInfo')}
                className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex esg-items-center esg-gap-1 ${
                    activeGroup === 'esgInfo' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
                }`}
            >
                Introduktion
            </button>
            <button
                onClick={() => onNavigate('del2', 'del2Results')}
                className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex esg-items-center esg-gap-1 ${
                    activeGroup === 'del2Results' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
                }`}
            >
                Resultater
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className={`esg-flex esg-flex-col esg-items-center esg-gap-2 esg-rounded-md esg-p-2 ${activeGroup === 'dvaResults' || activeGroup === 'del2Results' ? 'esg-border-blue-600 esg-border-2' : ''}`}>
          <button
            onClick={() => onNavigate('del2', 'del2Results')} // Defaulting to IA results for main click
            className={`esg-py-2 esg-px-3 esg-rounded-md esg-flex esg-items-center esg-gap-2 ${
              activeGroup === 'dvaResults' || activeGroup === 'del2Results' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'hover:esg-bg-gray-300 esg-text-gray-700'
            }`}
          >
            Resultater
          </button>
          <div className="esg-flex esg-flex-wrap esg-justify-center esg-gap-2 esg-py-2 esg-overflow-x-auto">
            <button
                onClick={() => onNavigate('del1', 'dvaResults')}
                className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex esg-items-center esg-gap-1 ${
                    activeGroup === 'dvaResults' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
                }`}
            >
                DVA Resultater
            </button>
            <button
                onClick={() => onNavigate('del2', 'del2Results')}
                className={`esg-px-3 esg-py-1 esg-rounded-full esg-text-sm esg-flex esg-items-center esg-gap-1 ${
                    activeGroup === 'del2Results' ? 'esg-border-blue-600 esg-border-2 esg-text-blue-600 esg-font-bold' : 'esg-bg-gray-300 hover:esg-bg-gray-400 esg-text-gray-700'
                }`}
            >
                IA Resultater
            </button>
          </div>
        </div>
      </div>
    </nav>  
  );  
};

export default ESGCalculatorNav;