import React from 'react';
import InfoIcon from './InfoIcon';

function QuestionCard({ question, answer, onAnswerChange, onInfoClick }) {
  return (
    <div className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md esg-mb-1">
      <div className="esg-flex esg-justify-between esg-items-start esg-mb-2">
        <p className="esg-text-base esg-mr-4">
          {question.text.includes(' – ') ? question.text.split(' – ')[1] : question.text}
        </p>
        <div className="esg-flex esg-space-x-2 esg-flex-shrink-0">
          <button
            onClick={() => onAnswerChange(question.id, answer === 'yes' ? null : 'yes')}
            className={`btn-nav ${answer === 'yes' ? 'btn-nav-active' : ''}`}
          >
            Ja
          </button>
          <button
            onClick={() => onAnswerChange(question.id, answer === 'no' ? null : 'no')}
            className={`btn-nav ${answer === 'no' ? 'btn-nav-active' : ''}`}
          >
            Nej
          </button>
          <InfoIcon onClick={onInfoClick} />
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;