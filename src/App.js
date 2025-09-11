import { useState, useEffect } from 'react';
import { dvaQuestions } from './data/dvaQuestions';
import Navigation from './components/Navigation';
import Intro from './components/Intro';
import StepDVA from './components/StepDVA';
import StepMatrix from './components/StepMatrix';
import StepResults from './components/StepResults';

const questionGroups = ['E1', 'E2', 'E3', 'E4', 'E5', 'S1', 'S2', 'S3', 'S4', 'G1'];

function App() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [groupIndex, setGroupIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // New state for answers
  const [categoryCompletionStatus, setCategoryCompletionStatus] = useState({});

  useEffect(() => {
    const newCompletionStatus = {};
    questionGroups.forEach(groupLabel => {
      const questionsInGroup = dvaQuestions.filter(q => q.label === groupLabel);
      const allAnswered = questionsInGroup.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
      newCompletionStatus[groupLabel] = allAnswered;
    });
    setCategoryCompletionStatus(newCompletionStatus);
  }, [answers, questionGroups]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleNextGroup = () => {
    if (groupIndex < questionGroups.length - 1) {
      setGroupIndex(groupIndex + 1);
    } else {
      // Finished last group, move to matrix
      setCurrentStep('matrix');
    }
  };

  const handlePrevGroup = () => {
    if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
    } else {
      setCurrentStep('intro');
    }
  };

  const navigateTo = (stepKey) => {
    const groupIdx = questionGroups.indexOf(stepKey);
    if (groupIdx !== -1) {
      // It's a question group like 'E1', 'S2', etc.
      setGroupIndex(groupIdx);
      setCurrentStep('stepDVA');
    } else {
      // It's a main step like 'intro', 'matrix', etc.
      setCurrentStep(stepKey);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return <Intro onStartClick={() => navigateTo('E1')} />;
      case 'stepDVA':
        return (
          <StepDVA
            group={questionGroups[groupIndex]}
            onNext={handleNextGroup}
            onPrev={handlePrevGroup}
            isLast={groupIndex === questionGroups.length - 1}
            answers={answers} // Pass answers
            onAnswerChange={handleAnswerChange} // Pass handler
          />
        );
      case 'matrix':
        return <StepMatrix answers={answers} />;
      case 'results':
        return <StepResults />;
      default:
        return <Intro onStartClick={() => navigateTo('E1')} />;
    }
  };

  let activeGroup;
  if (currentStep === 'stepDVA') {
    activeGroup = questionGroups[groupIndex];
  } else {
    activeGroup = currentStep;
  }

  return (
    <div className="esg-flex esg-h-screen esg-bg-gray-100">
      <div className="esg-w-1/6 esg-bg-white esg-p-4">
        <Navigation activeGroup={activeGroup} onNavigate={navigateTo} categoryCompletionStatus={categoryCompletionStatus} />
      </div>

      <div className="esg-w-3/4 esg-p-8 esg-bg-gray-100 esg-overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
}

export default App;
