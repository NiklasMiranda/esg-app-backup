import React from 'react';
import CircularProgress from './CircularProgress';
import groupTitles from '../data/groupTitles';
import { LuWeight, LuFileText } from "react-icons/lu";
import YearSelector from './YearSelector'; // Import YearSelector

function ESGCalculatorNav({
  activeGroup,
  onNavigate,
  categoryCompletionStatus = {},
  questionGroups = [],
  activeSection,
  // Year selection props, passed directly to YearSelector
  availableYears,
  currentYear,
  onSelectYear,
  onAddNewYear,
  showAddYearInput,
  newYearValue,
  handleYearInputChange,
  handleYearInputConfirm,
  handleYearInputCancel,
  addYearError,
}) {
  console.log('ESGCalculatorNav Render:');
  console.log('activeSection:', activeSection);
  console.log('activeGroup:', activeGroup);

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

  const activeContentStyles = 'esg-bg-white esg-text-black esg-font-extrabold';
  const inactiveContentStyles = 'hover:esg-bg-white esg-text-gray-700';
  const activeBorderColor = 'esg-border-[#0b3954]';
  const inactiveBorderColor = 'esg-border-gray-300';
  const baseButtonFlex = 'esg-flex-grow esg-basis-0 esg-py-2 esg-px-3 esg-text-sm esg-flex esg-items-center esg-justify-center esg-gap-1';

  const isDVAActive = activeSection === 'del1';
  const isIAActive = activeSection === 'del2';
  console.log('isDVAActive (DOBBELTVÆSENTLIGHEDSANALYSE):', isDVAActive);
  console.log('isIAActive (INITIATIVANALYSE):', isIAActive);

  return (
    <nav className="esg-bg-[#f4f4f4] esg-text-gray-800 esg-shadow-md esg-mb-0">
      {/* Year Selection */}
      <YearSelector
        availableYears={availableYears}
        currentYear={currentYear}
        onSelectYear={onSelectYear}
        onAddNewYear={onAddNewYear}
        showAddYearInput={showAddYearInput}
        newYearValue={newYearValue}
        handleYearInputChange={handleYearInputChange}
        handleYearInputConfirm={handleYearInputConfirm}
        handleYearInputCancel={handleYearInputCancel}
        addYearError={addYearError}
      />

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
          <div className={`esg-flex esg-flex-row esg-items-center esg-overflow-x-auto ${activeSection === 'del1' ? activeBorderColor : inactiveBorderColor}`}>
            <div className="esg-flex esg-justify-start esg-flex-grow">
              {del1Steps.filter(step => questionGroups.includes(step.key)).map((step, index, arr) => {
                const isActive = activeGroup === step.key && activeSection === 'del1';
                console.log(`DVA Subcategory: ${step.key}, isActive: ${isActive}`);
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
                console.log(`IA Subcategory: ${step.key}, isActive: ${isActive}`);
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
            className={`esg-py-2 esg-px-3 esg-flex esg-items-center esg-justify-center ${
              activeGroup === 'dvaResults'
                ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                : `${inactiveContentStyles} esg-border-r-[1px] ${inactiveBorderColor}`
            }`}
          >
            DVA-RESULTATER
          </button>
          <button
            onClick={() => onNavigate('del2', 'del2Results')}
            className={`esg-py-2 esg-px-3 esg-flex esg-items-center esg-justify-center ${
              activeGroup === 'del2Results'
                ? `${activeContentStyles} esg-border-[1px] ${activeBorderColor}`
                : inactiveContentStyles
            }`}
          >
            IA-RESULTATER
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ESGCalculatorNav;