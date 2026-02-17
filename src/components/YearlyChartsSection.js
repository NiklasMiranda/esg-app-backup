import React, { useState, useEffect, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CustomPolarChart from './CustomPolarChart';
import DVAWeightingChart from './DVAWeightingChart';

import groupTitles from '../data/groupTitles';

function YearlyChartsSection({ availableYears = [], currentYear, onSelectYear, calculationResults, criterionColors, iaQuestions, answers, dvaQuestions }) {
  // Ensure calculationResults and iaQuestions are never undefined for useMemo dependencies
  const safeCalculationResults = calculationResults || {};
  const safeIaQuestions = iaQuestions || [];

  const { totalScore, esgLevel, polarBarChartData } = safeCalculationResults;

  const currentYearIndex = availableYears.indexOf(currentYear);

  const handlePrevYear = () => {
    if (currentYearIndex > 0) {
      onSelectYear(availableYears[currentYearIndex - 1]);
    }
  };

  const handleNextYear = () => {
    if (currentYearIndex < availableYears.length - 1) {
      onSelectYear(availableYears[currentYearIndex + 1]);
    }
  };

  const hasDataForCurrentYear = Object.keys(safeCalculationResults).length > 0;

  return (
    <div className="esg-p-4 esg-bg-white esg-rounded-lg esg-shadow-md esg-mb-6">
      <div className="esg-flex esg-items-center esg-justify-between esg-mb-4">
        <button
          onClick={handlePrevYear}
          disabled={currentYearIndex <= 0}
          className="esg-p-2 esg-rounded-full esg-bg-gray-200 hover:esg-bg-gray-300 disabled:esg-opacity-50"
        >
          <FaChevronLeft />
        </button>
        <h2 className="esg-text-2xl esg-font-bold">{currentYear}</h2>
        <button
          onClick={handleNextYear}
          disabled={currentYearIndex >= availableYears.length - 1}
          className="esg-p-2 esg-rounded-full esg-bg-gray-200 hover:esg-bg-gray-300 disabled:esg-opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>

      {!hasDataForCurrentYear ? (
        <div className="esg-text-center esg-py-10 esg-text-gray-500">
          Ingen data tilgængelig for {currentYear}.
        </div>
      ) : (
        <>
          <div className="esg-flex esg-justify-center esg-mb-16"> {/* Added esg-mb-6 */}
            <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md esg-w-full esg-max-w-xl"> {/* Adjust max-w to control width */}
              <h3 className="esg-text-xl esg-font-semibold esg-mb-4 esg-text-center">Din ESGScore</h3>
              <div className="esg-w-full esg-h-164 esg-mx-auto">
                {polarBarChartData && Object.keys(polarBarChartData).length > 0 ? (
                  <CustomPolarChart
                    data={polarBarChartData}
                    totalScore={totalScore}
                    esgLevel={esgLevel}
                    criterionColors={criterionColors}
                  />
                ) : (
                  <div className="esg-text-center esg-py-10 esg-text-gray-500">Ingen Polar Chart data tilgængelig.</div>
                )}
              </div>
            </div>
          </div>
          <DVAWeightingChart
            dvaQuestions={dvaQuestions}
            answers={answers}
            criterionColors={criterionColors}
            className="esg-mb-6" /* Added esg-mb-6 here */
          />
        </>
      )}
    </div>
  );
}

export default YearlyChartsSection;
