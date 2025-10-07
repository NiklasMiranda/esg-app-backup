import React from 'react';
import InfoIcon from './InfoIcon';
import './QuestionCard.css';

function QuestionCard({ question, answer, onAnswerChange, onInfoClick }) {
  return (
    <div className="question-card-container">
      <div className="question-row">
        <InfoIcon onClick={onInfoClick} />
        <p className="question-text">
          {question.text.includes(' – ') ? question.text.split(' – ')[1] : question.text}
        </p>
      </div>
      <div className="button-row">
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
