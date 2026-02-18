import React, { useState, useMemo, useEffect } from 'react';

import InfoIcon from '../layout/InfoIcon';
import Drawer from '../layout/Drawer';
import CustomPolarChart from '../charts/CustomPolarChart';
import NivoLikeMarimekkoChart from '../charts/NivoLikeMarimekkoChart';
import groupTitles from '../../data/groupTitles';
import { categoryDescriptions } from '../../data/descriptions'; // Ensure this is imported

function StepInitiativanalyse({ activeIaGroup, iaAnswers, onIaAnswerChange, onNext, onPrev, isFirst, isLast, onShowResults, polarBarChartData, totalScore, esgLevel, criterionColors, marimekkoData, iaQuestions }) {
  console.log('DEBUG StepInitiativanalyse: iaQuestions prop:', iaQuestions);
  console.log('DEBUG StepInitiativanalyse: activeIaGroup prop:', activeIaGroup);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const groupedQuestionsBySecondSubcategory = useMemo(() => {
    const filtered = iaQuestions
      .filter(q => q.sub_category.label === activeIaGroup) // Correct filtering logic
      .reduce((acc, question) => {
        (acc[question.topic] = acc[question.topic] || []).push(question);
        return acc;
      }, {});
    console.log('DEBUG StepInitiativanalyse: groupedQuestionsBySecondSubcategory:', filtered);
    console.log('DEBUG StepInitiativanalyse: Object.entries(groupedQuestionsBySecondSubcategory).length:', Object.entries(filtered).length);
    return filtered;
  }, [activeIaGroup, iaQuestions]);

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

  const filteredMarimekkoData = useMemo(() => {
    if (!marimekkoData || marimekkoData.length === 0 || !iaQuestions || iaQuestions.length === 0) {
      return [];
    }

    // Build a map from topic (e.g., "1.1 CO2 udledninger") to sub_category.label (e.g., "E1")
    const topicToSubCategoryMap = {};
    iaQuestions.forEach(q => {
      if (q.topic && q.sub_category && q.sub_category.label) {
        topicToSubCategoryMap[q.topic] = q.sub_category.label;
      }
    });

    const filtered = marimekkoData.filter(item => {
      const subCategoryLabelForTopic = topicToSubCategoryMap[item.subcategory];
      return subCategoryLabelForTopic === activeIaGroup;
    });
    
    return filtered;
  }, [marimekkoData, activeIaGroup, iaQuestions]);

  return (
    <div className="esg-flex esg-flex-col lg:esg-flex-row esg-gap-8">
      <div className="esg-w-full lg:esg-w-8/12">
        <div className="esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
          <h1 className="esg-text-xl esg-font-bold esg-mb-6 esg-flex esg-items-center">
            {activeIaGroup}: {groupTitles[activeIaGroup]}
            <InfoIcon onClick={handleCategoryInfoClick} />
          </h1>

          {Object.entries(groupedQuestionsBySecondSubcategory).map(([topic, questions]) => (
            <div key={topic} className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg">
              <button
                className="esg-flex esg-justify-between esg-items-center esg-w-full esg-p-4 esg-text-lg esg-font-bold esg-bg-gray-50 esg-rounded-t-lg focus:esg-outline-none"
                onClick={() => toggleSection(topic)}
              >
                <span>{topic}</span>
                <svg
                  className={`esg-w-5 esg-h-5 esg-transition-transform esg-duration-300 ${
                    openSections[topic] ? 'esg-rotate-180' : ''
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
                  openSections[topic] ? 'esg-max-h-[5000px] esg-opacity-100' : 'esg-max-h-0 esg-opacity-0'
                }`}
              >
                <div className="esg-p-4 esg-grid esg-grid-cols-1 md:esg-grid-cols-2 xl:esg-grid-cols-3 esg-gap-6">
                  {questions.map(q => (
                    <div key={q.id} className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md esg-flex esg-flex-col esg-justify-between esg-items-start">
                      <div> {/* Container for number and text */}
                        <p className="esg-font-bold esg-mb-2">{q.number}.</p>
                        <p className="esg-text-base esg-mb-4">{q.text}</p>
                      </div>
                      <div className="esg-flex esg-justify-between esg-items-center esg-w-full">
                        <input
                          type="checkbox"
                          checked={iaAnswers[q.id] && iaAnswers[q.id].is_answered || false}
                          onChange={(e) => onIaAnswerChange(q.id, e.target.checked)}
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
        <Drawer isOpen={isCategoryDrawerOpen} onClose={closeDrawer} title={`${activeIaGroup}: ${groupTitles[activeIaGroup]}`}>
          <p>{categoryDescriptions[activeIaGroup]?.description || 'Ingen beskrivelse tilgængelig.'}</p>
        </Drawer>
      </div>
      <div className="esg-w-full lg:esg-w-4/12">
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
            <NivoLikeMarimekkoChart data={filteredMarimekkoData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepInitiativanalyse;