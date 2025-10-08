import React, { useState } from 'react';
import { matrixQuestions } from '../data/matrixQuestions';
import InfoIcon from './InfoIcon';
import Drawer from './Drawer';
import groupTitles from '../data/groupTitles';

function StepMatrixQuestions({ activeMatrixGroup, matrixAnswers, onMatrixAnswerChange, onNext, onPrev, isFirst, isLast, onShowResults, categoryDescriptions }) {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryInfoClick = () => {
    setIsCategoryDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsCategoryDrawerOpen(false);
  };

  // Group questions by label, subcategory, and secondSubcategory
  const groupedQuestions = matrixQuestions
    .filter(q => q.label === activeMatrixGroup) // Filter by activeMatrixGroup
    .reduce((acc, question) => {
    if (!acc[question.label]) {
      acc[question.label] = {};
    }
    if (!acc[question.label][question.subcategory]) {
      acc[question.label][question.subcategory] = {};
    }
    if (!acc[question.label][question.subcategory][question.secondSubcategory]) {
      acc[question.label][question.subcategory][question.secondSubcategory] = [];
    }
    acc[question.label][question.subcategory][question.secondSubcategory].push(question);
    return acc;
  }, {});

  const handleSelectAll = (questions, checked) => {
    questions.forEach(q => {
        onMatrixAnswerChange(q.id, checked);
    });
  };

  return (
    <div className="esg-p-4">
      <div className="esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
        <h1 className="esg-text-xl esg-font-bold esg-mb-6 esg-flex esg-items-center">
          {activeMatrixGroup}: {groupTitles[activeMatrixGroup]}
          <InfoIcon onClick={handleCategoryInfoClick} />
        </h1>

        {Object.entries(groupedQuestions).map(([label, subcategories]) => (
          <div key={label}>
            {Object.entries(subcategories).map(([subcategory, secondSubcategories]) => (
              <div key={subcategory} className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg">
                <button
                  className="esg-flex esg-justify-between esg-items-center esg-w-full esg-p-4 esg-text-lg esg-font-bold esg-bg-gray-50 esg-rounded-t-lg focus:esg-outline-none"
                  onClick={() => toggleSection(subcategory)}
                >
                  <span>{subcategory}</span>
                  <svg
                    className={`esg-w-5 esg-h-5 esg-transition-transform esg-duration-300 ${
                      openSections[subcategory] ? 'esg-rotate-180' : ''
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
                    openSections[subcategory] ? 'esg-max-h-screen esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'
                  }`}
                >
                  {Object.entries(secondSubcategories).map(([secondSubcategory, questions]) => (
                    <div key={secondSubcategory} className="esg-p-4 esg-grid esg-grid-cols-1 esg-gap-4">
                      <h4 className="esg-text-lg esg-font-bold esg-mb-2">{secondSubcategory}</h4>
                      <div className="esg-grid esg-grid-cols-1 esg-gap-4">
                        {questions.map(q => (
                          <div key={q.id} className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md esg-flex esg-items-center esg-justify-between">
                            <p className="esg-text-base">{q.number}: {q.text} (Points: {q.points})</p>
                            <input
                              type="checkbox"
                              checked={matrixAnswers[q.id] || false}
                              onChange={(e) => onMatrixAnswerChange(q.id, e.target.checked)}
                              className="esg-form-checkbox esg-h-5 esg-w-5 esg-text-blue-600"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
  );
}

export default StepMatrixQuestions;