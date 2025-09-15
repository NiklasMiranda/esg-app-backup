import React from 'react';
import { matrixQuestions } from '../data/matrixQuestions';

function StepMatrixQuestions({ activeMatrixGroup, matrixAnswers, onMatrixAnswerChange, onNext, onPrev, isFirst, isLast, onShowResults }) {
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

  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-mb-6">Del 2: Matrix Spørgsmål</h1>

      {Object.entries(groupedQuestions).map(([label, subcategories]) => (
        <div key={label} className="esg-mb-8">
          <h2 className="esg-text-2xl esg-mb-4">{label}</h2>
          {Object.entries(subcategories).map(([subcategory, secondSubcategories]) => (
            <div key={subcategory} className="esg-mb-6 esg-ml-4">
              <h3 className="esg-text-xl esg-mb-3">{subcategory}</h3>
              {Object.entries(secondSubcategories).map(([secondSubcategory, questions]) => (
                <div key={secondSubcategory} className="esg-mb-4 esg-ml-4">
                  <h4 className="esg-text-lg esg-mb-2">{secondSubcategory}</h4>
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
          ))}
        </div>
      ))}

      <div className="esg-flex esg-justify-between esg-mt-8">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="esg-bg-gray-300 esg-hover:bg-gray-400 esg-text-gray-800 esg-py-2 esg-px-4 esg-rounded disabled:esg-opacity-50 disabled:esg-cursor-not-allowed"
        >
          Forrige
        </button>
        {isLast ? (
          <button
            onClick={onShowResults}
            className="esg-px-6 esg-py-2 esg-bg-blue-500 esg-text-white esg-rounded-lg esg-hover:bg-blue-600"
          >
            Vis Resultater
          </button>
        ) : (
          <button
            onClick={onNext}
            className="esg-px-6 esg-py-2 esg-bg-blue-500 esg-text-white esg-rounded-lg esg-hover:bg-blue-600"
          >
            Næste
          </button>
        )}
      </div>
    </div>
  );
}

export default StepMatrixQuestions;