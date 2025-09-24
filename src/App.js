import { useState, useEffect, useMemo } from 'react';
import { dvaQuestions } from './data/dvaQuestions';
import { matrixQuestions } from './data/matrixQuestions';
import Navigation from './components/Navigation';
import Intro from './components/Intro';
import StepDVA from './components/StepDVA';
import StepResultsMatrix from './components/StepResultsMatrix';
import StepMatrixQuestions from './components/StepMatrixQuestions';
import Del2Results from './components/Del2Results'; // New component for Del 2 results
import CircularProgress from './components/CircularProgress';

const questionGroups = ['E1', 'E2', 'E3', 'E4', 'E5', 'S1', 'S2', 'S3', 'S4', 'G1'];
const matrixQuestionGroups = ['E1', 'E2', 'E3', 'E4', 'E5', 'S1', 'S2', 'S3', 'S4', 'G1'];

const categoryPercentages = {
  E: 40,
  S: 30,
  G: 30,
};

function App() {
  const [currentDel1Step, setCurrentDel1Step] = useState('intro');
  const [matrixGroupIndex, setMatrixGroupIndex] = useState(0);
  const [currentDel2Step, setCurrentDel2Step] = useState(matrixQuestionGroups[matrixGroupIndex]); // Assuming E1 is the first matrix group
  const [activeSection, setActiveSection] = useState('del1');
  const [groupIndex, setGroupIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matrixAnswers, setMatrixAnswers] = useState({});
  const [categoryCompletionStatus, setCategoryCompletionStatus] = useState({});
  const [totalCompletionPercentage, setTotalCompletionPercentage] = useState(0);

  // Load answers from localStorage on component mount
  useEffect(() => {
    const savedDvaAnswers = localStorage.getItem('dvaAnswers');
    const savedMatrixAnswers = localStorage.getItem('matrixAnswers');
    if (savedDvaAnswers) {
      setAnswers(JSON.parse(savedDvaAnswers));
    }
    if (savedMatrixAnswers) {
      setMatrixAnswers(JSON.parse(savedMatrixAnswers));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save DVA answers to localStorage whenever 'answers' state changes
  useEffect(() => {
    localStorage.setItem('dvaAnswers', JSON.stringify(answers));
  }, [answers]);

  // Save Matrix answers to localStorage whenever 'matrixAnswers' state changes
  useEffect(() => {
    localStorage.setItem('matrixAnswers', JSON.stringify(matrixAnswers));
  }, [matrixAnswers]);

  useEffect(() => {
    const newCompletionStatus = {};
    let totalAnsweredQuestions = 0;
    let totalPossibleQuestions = 0;

    questionGroups.forEach(groupLabel => {
      const questionsInGroup = dvaQuestions.filter(q => q.label === groupLabel);
      const totalQuestions = questionsInGroup.length;
      const answeredQuestions = questionsInGroup.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length;
      const percentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
      newCompletionStatus[groupLabel] = percentage;

      totalAnsweredQuestions += answeredQuestions;
      totalPossibleQuestions += totalQuestions;
    });
    setCategoryCompletionStatus(newCompletionStatus);

    if (totalPossibleQuestions > 0) {
      setTotalCompletionPercentage((totalAnsweredQuestions / totalPossibleQuestions) * 100);
    } else {
      setTotalCompletionPercentage(0);
    }
  }, [answers, questionGroups]);

  const { criteriaWeights, impactFinansielCounts, maxScores } = useMemo(() => {
    const results = {};
    [...new Set(dvaQuestions.map(q => q.label))].forEach(label => {
      results[label] = { impact: 0, finansiel: 0, label };
    });

    const selectedQuestions = new Set();
    for (const questionId in answers) {
      if (answers[questionId] === 'yes') {
        selectedQuestions.add(parseInt(questionId));
      }
    }

    dvaQuestions.forEach(q => {
      if (selectedQuestions.has(q.id)) {
        if (q.purpose === 'impact') results[q.label].impact++;
        else if (q.purpose === 'finansiel') results[q.label].finansiel++;
      }
    });

    const calculatedCriteriaWeights = {};
    const calculatedImpactFinansielCounts = {};
    Object.entries(results).forEach(([label, d]) => {
      calculatedCriteriaWeights[label] = Math.floor((d.impact + d.finansiel) / 2);
      calculatedImpactFinansielCounts[label] = { impact: d.impact, finansiel: d.finansiel };
    });

    // Calculate total weights for E, S, G categories
    const totalWeightE = Object.entries(calculatedCriteriaWeights)
      .filter(([label]) => label.startsWith('E'))
      .reduce((sum, [, weight]) => sum + weight, 0);
    const totalWeightS = Object.entries(calculatedCriteriaWeights)
      .filter(([label]) => label.startsWith('S'))
      .reduce((sum, [, weight]) => sum + weight, 0);
    const totalWeightG = Object.entries(calculatedCriteriaWeights)
      .filter(([label]) => label.startsWith('G'))
      .reduce((sum, [, weight]) => sum + weight, 0);

    const calculatedMaxScores = {};
    Object.entries(calculatedCriteriaWeights).forEach(([label, weight]) => {
      const category = label.charAt(0);
      let totalCategoryWeight = 0;
      let categoryPercentage = 0;

      if (category === 'E') {
        totalCategoryWeight = totalWeightE;
        categoryPercentage = categoryPercentages.E;
      } else if (category === 'S') {
        totalCategoryWeight = totalWeightS;
        categoryPercentage = categoryPercentages.S;
      } else if (category === 'G') {
        totalCategoryWeight = totalWeightG;
        categoryPercentage = categoryPercentages.G;
      }

      if (totalCategoryWeight > 0) {
        calculatedMaxScores[label] = (weight / totalCategoryWeight) * categoryPercentage;
      } else {
        calculatedMaxScores[label] = 0;
      }
    });

    return { criteriaWeights: calculatedCriteriaWeights, impactFinansielCounts: calculatedImpactFinansielCounts, maxScores: calculatedMaxScores };
  }, [answers, dvaQuestions]);

  const { finalScores, totalScore, indicatorPoints } = useMemo(() => {
    const indicatorPoints = {};
    // Initialize indicatorPoints for all labels in matrixQuestions
    [...new Set(matrixQuestions.map(q => q.label))].forEach(label => {
      indicatorPoints[label] = 0;
    });

    Object.entries(matrixAnswers).forEach(([questionId, isSelected]) => {
      if (isSelected) {
        const question = matrixQuestions.find(q => q.id === parseInt(questionId));
        if (question) {
          indicatorPoints[question.label] += question.points;
        }
      }
    });

    const calculatedFinalScores = {};
    let calculatedTotalScore = 0;

    Object.entries(indicatorPoints).forEach(([label, points]) => {
      if (maxScores[label] !== undefined) {
        calculatedFinalScores[label] = (points * maxScores[label]) / 100;
        calculatedTotalScore += calculatedFinalScores[label];
      }
    });

    return { finalScores: calculatedFinalScores, totalScore: calculatedTotalScore, indicatorPoints: indicatorPoints };
  }, [matrixAnswers, matrixQuestions, maxScores]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleMatrixAnswerChange = (questionId, isSelected) => {
    setMatrixAnswers(prevMatrixAnswers => ({
      ...prevMatrixAnswers,
      [questionId]: isSelected,
    }));
  };

  const handleNextGroup = () => {
    if (groupIndex < questionGroups.length - 1) {
      setGroupIndex(groupIndex + 1);
    } else {
      // Finished last DVA group, move to matrix results
      setCurrentDel1Step('matrix');
    }
  };

  const handlePrevGroup = () => {
    if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
    } else {
      setCurrentDel1Step('intro');
    }
  };

  const handleNextMatrixGroup = () => {
    if (matrixGroupIndex < matrixQuestionGroups.length - 1) {
      setMatrixGroupIndex(matrixGroupIndex + 1);
      setCurrentDel2Step(matrixQuestionGroups[matrixGroupIndex + 1]);
    } else {
      // Finished last matrix group, show results
      setCurrentDel2Step('del2Results');
    }
  };

  const handlePrevMatrixGroup = () => {
    if (matrixGroupIndex > 0) {
      setMatrixGroupIndex(matrixGroupIndex - 1);
      setCurrentDel2Step(matrixQuestionGroups[matrixGroupIndex - 1]);
    } else {
      // Go back to the start of Del 2 or a previous section if needed
      // For now, let's just stay on the first group
      setCurrentDel2Step(matrixQuestionGroups[0]);
    }
  };

  const navigateTo = (section, stepKey) => {
    if (section === 'del1') {
      const groupIdx = questionGroups.indexOf(stepKey);
      if (groupIdx !== -1) {
        setGroupIndex(groupIdx);
        setCurrentDel1Step('stepDVA');
      } else {
        setCurrentDel1Step(stepKey);
      }
    } else if (section === 'del2') {
      const groupIdx = matrixQuestionGroups.indexOf(stepKey);
      if (groupIdx !== -1) {
        setMatrixGroupIndex(groupIdx);
        setCurrentDel2Step(stepKey);
      } else {
        setCurrentDel2Step(stepKey);
      }
    }
  };

  const renderStep = () => {
    if (activeSection === 'del1') {
      switch (currentDel1Step) {
        case 'intro':
          return <Intro onStartClick={() => navigateTo('del1', 'E1')} />;
        case 'stepDVA':
          return (
            <StepDVA
              group={questionGroups[groupIndex]}
              onNext={handleNextGroup}
              onPrev={handlePrevGroup}
              isLast={groupIndex === questionGroups.length - 1}
              answers={answers} // Pass answers
              onAnswerChange={handleAnswerChange} // Pass handler
              dvaQuestions={dvaQuestions} // Pass parsed DVA questions
            />
          );
        case 'matrix':
          return <StepResultsMatrix answers={answers} criteriaWeights={criteriaWeights} impactFinansielCounts={impactFinansielCounts} dvaQuestions={dvaQuestions} onNext={() => {
            setActiveSection('del2');
            setCurrentDel2Step('E1'); // Set to the first matrix question group
          }} />;
        default:
          return <Intro onStartClick={() => navigateTo('del1', 'E1')} />;
      }

    } else if (activeSection === 'del2') {
      const currentMatrixGroup = matrixQuestionGroups.includes(currentDel2Step) ? currentDel2Step : matrixQuestionGroups[0];
      switch (currentDel2Step) {
        case 'E1':
        case 'E2':
        case 'E3':
        case 'E4':
        case 'E5':
        case 'S1':
        case 'S2':
        case 'S3':
        case 'S4':
        case 'G1':
          return <StepMatrixQuestions
            activeMatrixGroup={currentMatrixGroup}
            matrixQuestions={matrixQuestions}
            matrixAnswers={matrixAnswers}
            onMatrixAnswerChange={handleMatrixAnswerChange}
            onNext={handleNextMatrixGroup}
            onPrev={handlePrevMatrixGroup}
            isFirst={matrixGroupIndex === 0}
            isLast={matrixGroupIndex === matrixQuestionGroups.length - 1}
            onShowResults={() => setCurrentDel2Step('del2Results')}
          />;
        case 'del2Results':
          return <Del2Results finalScores={finalScores} totalScore={totalScore} indicatorPoints={indicatorPoints} maxScores={maxScores} />;
        default:
          return <StepMatrixQuestions
            activeMatrixGroup={currentMatrixGroup}
            matrixQuestions={matrixQuestions}
            matrixAnswers={matrixAnswers}
            onMatrixAnswerChange={handleMatrixAnswerChange}
            onNext={handleNextMatrixGroup}
            onPrev={handlePrevMatrixGroup}
            isFirst={matrixGroupIndex === 0}
            isLast={matrixGroupIndex === matrixQuestionGroups.length - 1}
            onShowResults={() => setCurrentDel2Step('del2Results')}
          />;
      }
    }
    return null; // Should not happen
  };

  let activeGroup;
  if (activeSection === 'del1') {
    activeGroup = currentDel1Step;
    if (currentDel1Step === 'stepDVA') {
      activeGroup = questionGroups[groupIndex];
    }
  } else if (activeSection === 'del2') {
    activeGroup = currentDel2Step;
  }

  const [isNavOpen, setIsNavOpen] = useState(false); // State for mobile navigation visibility

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="esg-flex esg-flex-col md:esg-flex-row esg-h-screen esg-bg-gray-100">
      {/* Mobile Header with Hamburger Menu */}
      <div className="esg-flex esg-justify-between esg-items-center esg-p-4 esg-bg-white md:esg-hidden">
        <h1 className="esg-text-xl esg-font-bold">ESG App</h1>
        <div className="esg-flex esg-items-center">
          <CircularProgress percentage={totalCompletionPercentage} />
          <button onClick={toggleNav} className="esg-text-gray-800 focus:esg-outline-none esg-ml-4">
            <svg className="esg-h-6 esg-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation - visible on md and up, or when isNavOpen is true on small screens */}
      <div className={`esg-w-full md:esg-w-1/6 esg-bg-white esg-p-4 esg-flex esg-flex-col esg-justify-center ${isNavOpen ? 'esg-block' : 'esg-hidden md:esg-block'}`}>
        <Navigation activeGroup={activeGroup} onNavigate={navigateTo} categoryCompletionStatus={categoryCompletionStatus} activeSection={activeSection} onSectionChange={setActiveSection} matrixQuestions={matrixQuestions} />
      </div>

      {/* Content Area */}
      <div className="esg-w-full md:esg-w-3/4 esg-p-8 esg-bg-gray-100 esg-overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
}

export default App;
