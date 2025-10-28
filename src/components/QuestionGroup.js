import React, { useState } from 'react';
import QuestionCard from './QuestionCard';


function QuestionGroup({ title, questions, answers, onAnswerChange, handleQuestionInfoClick }) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const impactQuestions = questions.filter(q => q.purpose === 'impact');
  const finansielQuestions = questions.filter(q => q.purpose === 'finansiel');

  return (
    <div className="esg-mb-6 esg-border esg-border-gray-200 esg-rounded-lg esg-overflow-hidden">
      <div className="esg-bg-gray-50 esg-p-4 esg-cursor-pointer esg-flex esg-justify-between esg-items-center esg-font-bold esg-text-lg" onClick={toggleExpand}>
        <h3>{title}</h3>
        <span className="esg-text-sm esg-ml-4">{isExpanded ? '▲' : '▼'}</span>
      </div>
      <div className={`esg-transition-[max-height] esg-duration-500 esg-ease-in-out esg-overflow-hidden ${isExpanded ? 'esg-max-h-[2000px] esg-p-4' : 'esg-max-h-0'}`}>
        {impactQuestions.length > 0 && (
          <div className="esg-mt-4 first:esg-mt-0">
            <h4 className="esg-font-bold esg-text-base esg-mb-2 esg-border-b esg-border-gray-200 esg-pb-1">Virkningsvæsentlighed</h4>
            <div className="question-grid">
              {impactQuestions.map(question => (
                <div key={question.id} className="question-grid-item">
                  <QuestionCard
                    question={question}
                    answer={answers[question.id]}
                    onAnswerChange={onAnswerChange}
                    onInfoClick={() => handleQuestionInfoClick(question.id)}
                    showPoints={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {finansielQuestions.length > 0 && (
          <div className="esg-mt-4 first:esg-mt-0">
            <h4 className="esg-font-bold esg-text-base esg-mb-2 esg-border-b esg-border-gray-200 esg-pb-1">Finansiel væsentlighed</h4>
            <div className="question-grid">
              {finansielQuestions.map(question => (
                <div key={question.id} className="question-grid-item">
                  <QuestionCard
                    question={question}
                    answer={answers[question.id]}
                    onAnswerChange={onAnswerChange}
                    onInfoClick={() => handleQuestionInfoClick(question.id)}
                    showPoints={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionGroup;
