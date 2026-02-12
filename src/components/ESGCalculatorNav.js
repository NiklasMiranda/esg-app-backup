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

  const yearPlaceholders = Array.from({ length: Math.max(0, 10 - availableYears.length) });

  const activeContentStyles = 'esg-bg-white esg-text-black esg-font-extrabold';
  const inactiveContentStyles = 'hover:esg-bg-white esg-text-gray-700';
  const activeBorderColor = 'esg-border-[#0b3954]';
  const inactiveBorderColor = 'esg-border-gray-300';
  const baseButtonFlex = 'esg-flex-grow esg-basis-0 esg-py-2 esg-px-3 esg-text-sm esg-flex esg-items-center esg-justify-center esg-gap-1';

  return (
    <nav className="esg-bg-[#f4f4f4] esg-text-gray-800 esg-shadow-md">
      {/* Year Selection */}
      <div className={`esg-flex esg-items-center esg-border-b-[1px] ${inactiveBorderColor}`}>
        <span className={`esg-text-lg esg-font-semibold esg-px-2 esg-flex-shrink-0 esg-border-r-[1px] ${inactiveBorderColor}`}>År:</span>
        <div className="esg-flex esg-flex-grow">
          {availableYears.map((year, index) => {
            const isActive = year === currentYear;
            const hasRightNeighbour = index < availableYears.length - 1 || yearPlaceholders.length > 0;
            return (
              <button
                key={year}
                onClick={() => onSelectYear(year)}
                className={`
                  ${baseButtonFlex}
                  ${isActive
                    ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                    : inactiveContentStyles
                  }
                  ${!isActive && hasRightNeighbour ? `esg-border-r-[1px] ${inactiveBorderColor}` : ''}
                `}
              >
                {year}
              </button>
            );
          })}
          {yearPlaceholders.map((_, index) => (
            <div key={`placeholder-${index}`} className={`esg-flex-grow esg-basis-0 esg-py-2 esg-px-3 ${index < yearPlaceholders.length - 1 ? `esg-border-r-[1px] ${inactiveBorderColor}` : ''}`}></div>
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
            className={`esg-py-2 esg-px-3 esg-flex esg-items-center esg-justify-center esg-gap-2 ${
              activeSection === 'del1'
                ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                : `${inactiveContentStyles} esg-border-r-[1px] ${inactiveBorderColor}`
            }`}
          >
            <LuWeight /> DOBBELTVÆSENTLIGHEDSANALYSE
          </button>
          <button
            onClick={() => onNavigate('del2', 'esgInfo')}
            className={`esg-py-2 esg-px-3 esg-flex esg-items-center esg-justify-center esg-gap-2 ${
              activeSection === 'del2'
                ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                : inactiveContentStyles
            }`}
          >
            <LuFileText /> INITIATIVANALYSE
          </button>
        </div>

        {/* Question Groups */}
        <div className={`esg-grid esg-grid-cols-2 esg-border-b-[1px] ${inactiveBorderColor}`}>
          {/* DVA Question Groups */}
          <div className={`esg-flex esg-flex-row esg-items-center esg-overflow-x-auto esg-border-r-[1px] ${activeSection === 'del1' ? activeBorderColor : inactiveBorderColor}`}>
            <div className="esg-flex esg-justify-start esg-flex-grow">
              {del1Steps.filter(step => questionGroups.includes(step.key)).map((step, index, arr) => {
                const isActive = activeGroup === step.key && activeSection === 'del1';
                const hasRight = index < arr.length - 1;
                return (
                  <button
                    key={step.key}
                    onClick={() => onNavigate('del1', step.key)}
                    className={`
                      ${baseButtonFlex}
                      ${isActive
                        ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                        : `${inactiveContentStyles} ${hasRight ? `esg-border-r-[1px] ${inactiveBorderColor}` : ''}`
                      }
                    `}
                  >
                    <CircularProgress percentage={categoryCompletionStatus[step.key] || 0} size={24} />
                    {step.key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* IA Question Groups */}
          <div className="esg-flex esg-flex-row esg-items-center esg-overflow-x-auto">
            <div className="esg-flex esg-justify-start esg-flex-grow">
              {del2NavSteps.filter(step => questionGroups.includes(step.key)).map((step, index, arr) => {
                const isActive = activeGroup === step.key && activeSection === 'del2';
                const hasRight = index < arr.length - 1;
                return (
                  <button
                    key={step.key}
                    onClick={() => onNavigate('del2', step.key)}
                    className={`
                      ${baseButtonFlex}
                      ${isActive
                        ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                        : `${inactiveContentStyles} ${hasRight ? `esg-border-r-[1px] ${inactiveBorderColor}` : ''}`
                      }
                    `}
                  >
                    {step.key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="esg-grid esg-grid-cols-2">
          <button
            onClick={() => onNavigate('del1', 'dvaResults')}
            className={`esg-py-2 esg-px-3 esg-text-sm esg-flex esg-items-center esg-justify-center ${
              activeGroup === 'dvaResults'
                ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                : `${inactiveContentStyles} esg-border-r-[1px] ${inactiveBorderColor}`
            }`}
          >
            DVA Resultater
          </button>
          <button
            onClick={() => onNavigate('del2', 'del2Results')}
            className={`esg-py-2 esg-px-3 esg-text-sm esg-flex esg-items-center esg-justify-center ${
              activeGroup === 'del2Results'
                ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                : inactiveContentStyles
            }`}
          >
            IA Resultater
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ESGCalculatorNav;