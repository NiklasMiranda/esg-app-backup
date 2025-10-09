import React, { useState, useMemo, useEffect } from 'react';
import { matrixQuestions } from '../data/matrixQuestions';
import InfoIcon from './InfoIcon';
import Drawer from './Drawer';
import CustomPolarChart from './CustomPolarChart';
import NivoLikeMarimekkoChart from './NivoLikeMarimekkoChart';
import groupTitles from '../data/groupTitles';

function StepMatrixQuestions({ activeMatrixGroup, matrixAnswers, onMatrixAnswerChange, onNext, onPrev, isFirst, isLast, onShowResults, categoryDescriptions, polarBarChartData, totalScore, esgLevel, criterionColors, marimekkoData }) {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const groupedQuestionsBySecondSubcategory = useMemo(() =>
    matrixQuestions
      .filter(q => q.label === activeMatrixGroup)
      .reduce((acc, question) => {
        (acc[question.secondSubcategory] = acc[question.secondSubcategory] || []).push(question);
        return acc;
      }, {}),
    [activeMatrixGroup]
  );

  useEffect(() => {
    setOpenSections(
      Object.keys(groupedQuestionsBySecondSubcategory).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
  }, [groupedQuestionsBySecondSubcategory]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryInfoClick = () => {
    setIsCategoryDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsCategoryDrawerOpen(false);
  };

  

    return (
    <div className="esg-flex esg-gap-8">
      <div className="esg-w-9/12">
        <div className="esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
          <h1 className="esg-text-xl esg-font-bold esg-mb-6 esg-flex esg-items-center">
            {activeMatrixGroup}: {groupTitles[activeMatrixGroup]}
            <InfoIcon onClick={handleCategoryInfoClick} />
          </h1>

          {Object.entries(groupedQuestionsBySecondSubcategory).map(([secondSubcategory, questions]) => (
            <div key={secondSubcategory} className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg">
              <button
                className="esg-flex esg-justify-between esg-items-center esg-w-full esg-p-4 esg-text-lg esg-font-bold esg-bg-gray-50 esg-rounded-t-lg focus:esg-outline-none"
                onClick={() => toggleSection(secondSubcategory)}
              >
                <span>{secondSubcategory}</span>
                <svg
                  className={`esg-w-5 esg-h-5 esg-transition-transform esg-duration-300 ${
                    openSections[secondSubcategory] ? 'esg-rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div
                className={`esg-overflow-hidden esg-transition-all esg-duration-500 esg-ease-in-out ${
                  openSections[secondSubcategory] ? 'esg-max-h-screen esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'
                }`}
              >
                <div className="esg-p-4 esg-grid esg-grid-cols-3 esg-gap-6">
                  {questions.map(q => (
                    <div key={q.id} className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md esg-flex esg-flex-col esg-justify-between esg-items-start">
                      <div> {/* Container for number and text */}
                        <p className="esg-font-bold esg-mb-2">{q.number}.</p>
                        <p className="esg-text-base esg-mb-4">{q.text}</p>
                      </div>
                      <div className="esg-flex esg-justify-between esg-items-center esg-w-full">
                        <input
                          type="checkbox"
                          checked={matrixAnswers[q.id] || false}
                          onChange={(e) => onMatrixAnswerChange(q.id, e.target.checked)}
                          className="esg-form-checkbox esg-h-5 esg-w-5 esg-text-blue-600 esg-mt-2"
                        />
                        {q.points && (
                          <div className="esg-flex esg-items-center esg-text-gray-600 esg-text-sm esg-mt-2">
                            <span className="esg-mr-1">{q.points}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="esg-h-4 esg-w-4 esg-text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.695h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.695l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="esg-flex esg-justify-between esg-mt-8">
            <button
              onClick={onPrev}
              disabled={isFirst}
              className="btn-secondary"
            >
              Forrige
            </button>
            {isLast ? (
              <button
                onClick={onShowResults}
                className="btn-primary"
              >
                Vis Resultater
              </button>
            ) : (
              <button
                onClick={onNext}
                className="btn-primary"
              >
                Næste
              </button>
            )}
          </div>
        </div>
        <Drawer isOpen={isCategoryDrawerOpen} onClose={closeDrawer} title={`${activeMatrixGroup}: ${groupTitles[activeMatrixGroup]}`}>
          <p>{categoryDescriptions[activeMatrixGroup]?.description || 'Ingen beskrivelse tilgængelig.'}</p>
        </Drawer>
      </div>
      <div className="esg-w-5/12">
        <div className="esg-sticky esg-top-8">
          <div className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md">
            <CustomPolarChart
              data={polarBarChartData}
              totalScore={totalScore}
              esgLevel={esgLevel}
              criterionColors={criterionColors}
            />
          </div>
          <div className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md esg-mt-8">
            <NivoLikeMarimekkoChart data={marimekkoData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepMatrixQuestions;