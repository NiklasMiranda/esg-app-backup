import React, { useState, useMemo } from 'react';
import { dvaQuestions } from '../data/dvaQuestions';
import { categoryDescriptions, questionDescriptions } from '../data/descriptions';
import QuestionCard from './QuestionCard';
import Modal from './Modal';
import InfoIcon from './InfoIcon';
import CircularProgress from './CircularProgress';
import './StepDVA.css';

function StepDVA({ group, onNext, onPrev, isLast, answers, onAnswerChange }) {
  const [modalContent, setModalContent] = useState(null);
  const [modalPosition, setModalPosition] = useState('center');

  const allQuestionsForGroup = useMemo(() => dvaQuestions.filter(q => q.label === group), [group]);
  const impactQuestions = useMemo(() => allQuestionsForGroup.filter(q => q.purpose === 'impact'), [allQuestionsForGroup]);
  const finansielQuestions = useMemo(() => allQuestionsForGroup.filter(q => q.purpose === 'finansiel'), [allQuestionsForGroup]);

  const categoryInfo = categoryDescriptions[group] || {};

  const categoryCompletion = useMemo(() => {
    const totalQuestions = allQuestionsForGroup.length;
    if (totalQuestions === 0) return 0;
    const answeredQuestions = allQuestionsForGroup.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length;
    return (answeredQuestions / totalQuestions) * 100;
  }, [allQuestionsForGroup, answers]);

  const openModal = (content, position) => {
    setModalContent(content);
    setModalPosition(position);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const handleCategoryInfoClick = () => {
    openModal(
      <div>
        <h2>{categoryInfo.title}</h2>
        <p>{categoryInfo.description}</p>
      </div>,
      'right'
    );
  };

  const handleQuestionInfoClick = (questionId) => {
    const questionInfo = questionDescriptions[questionId] || {};
    openModal(
      <div>
        <h2>Spørgsmålsinformation</h2>
        <p>{questionInfo.description}</p>
        <h3>Typiske brancher:</h3>
        <p>{questionInfo.typicalIndustry}</p>
      </div>,
      'center'
    );
  };

  return (
    <div className="step-dva-container-flex">
      <div className="questions-area">
        <div className="white-box">
          <h1 className="category-title">
            {categoryInfo.title}
            <InfoIcon onClick={handleCategoryInfoClick} />
          </h1>

          {impactQuestions.length > 0 && (
            <div className="question-section">
              <h2 className="section-title">Impact</h2>
              <div className="question-grid">
                {impactQuestions.map(question => (
                  <div key={question.id} className="question-grid-item">
                    <QuestionCard
                      question={question}
                      answer={answers[question.id]}
                      onAnswerChange={onAnswerChange}
                      onInfoClick={() => handleQuestionInfoClick(question.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {finansielQuestions.length > 0 && (
            <div className="question-section">
              <h2 className="section-title">Finansiel</h2>
              <div className="question-grid">
                {finansielQuestions.map(question => (
                  <div key={question.id} className="question-grid-item">
                    <QuestionCard
                      question={question}
                      answer={answers[question.id]}
                      onAnswerChange={onAnswerChange}
                      onInfoClick={() => handleQuestionInfoClick(question.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="navigation-buttons">
          <button onClick={onPrev} className="btn-secondary">Forrige</button>
          <button onClick={onNext} className="btn-primary">Næste</button>
        </div>
      </div>

      <div className="sticky-progress-area">
        <div className="progress-box">
          <CircularProgress percentage={categoryCompletion} size={150} />
          <p className="progress-text">
            Så langt er du nået med spørgsmålene til {categoryInfo.title}
          </p>
        </div>
      </div>

      <Modal isOpen={!!modalContent} onClose={closeModal} position={modalPosition}>
        {modalContent}
      </Modal>
    </div>
  );
}

export default StepDVA;