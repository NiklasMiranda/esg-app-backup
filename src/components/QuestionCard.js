import React from 'react';
import InfoIcon from './InfoIcon';


function QuestionCard({ question, answer, onAnswerChange, onInfoClick }) {
  return (
    <div className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md esg-mb-4 esg-min-h-[150px] esg-flex esg-flex-col esg-justify-between">
      <div className="esg-flex esg-justify-start esg-mb-2">
        <InfoIcon onClick={onInfoClick} />
      </div>
      <div className="esg-flex esg-items-start esg-gap-2 esg-mb-4">
        <p className="esg-flex-grow">
          {question.text.includes(' – ') ? question.text.split(' – ')[1] : question.text}
        </p>
      </div>
      <div className="esg-flex esg-justify-start esg-gap-2">
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
      </div>
    </div>
  );
}

export default QuestionCard;
