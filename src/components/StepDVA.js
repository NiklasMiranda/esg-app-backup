import { dvaQuestions } from '../data/dvaQuestions';
import QuestionCard from './QuestionCard';

// A simple map for titles, can be expanded
const groupTitles = {
  E1: 'Klimaforandringer',
  E2: 'Forurening',
  E3: 'Vand- og havressourcer',
  E4: 'Biodiversitet og økosystemer',
  E5: 'Ressourceanvendelse og cirkulær økonomi',
  S1: 'Egen arbejdsstyrke',
  S2: 'Arbejdere i værdikæden',
  S3: 'Påvirkede samfund',
  S4: 'Forbrugere og slutbrugere',
  G1: 'Forretningsetik',
};

function StepDVA({ group, onNext, onPrev, isLast, answers, onAnswerChange }) {
  const allQuestionsForGroup = dvaQuestions.filter(q => q.label === group);

  const impactQuestions = allQuestionsForGroup.filter(q => q.purpose === 'impact');
  const finansielQuestions = allQuestionsForGroup.filter(q => q.purpose === 'finansiel');

  const title = groupTitles[group] || 'Spørgsmål';

  const handleAnswerNext5 = (answer, purpose) => {
    const questionsToFilter = purpose === 'impact' ? impactQuestions : finansielQuestions;
    const unansweredQuestions = questionsToFilter.filter(q => !answers.hasOwnProperty(q.id) || answers[q.id] === null);
    const next5Questions = unansweredQuestions.slice(0, 5);
    next5Questions.forEach(q => {
        onAnswerChange(q.id, answer);
    });
  };

  return (
    <div>
      <h1 className="esg-text-3xl esg-mb-4">{group}: {title}</h1>
      
      {impactQuestions.length > 0 && (
        <>
          <h2 className="esg-text-2xl esg-mt-6 esg-mb-3">Impact</h2>
          <div className="esg-flex esg-justify-end esg-mb-4">
              <button
                  onClick={() => handleAnswerNext5('yes', 'impact')}
                  className="esg-bg-green-500 esg-hover:bg-green-700 esg-text-white esg-font-bold esg-py-2 esg-px-4 esg-rounded esg-mr-2"
              >
                  Svar ja til 5
              </button>
              <button
                  onClick={() => handleAnswerNext5('no', 'impact')}
                  className="esg-bg-red-500 esg-hover:bg-red-700 esg-text-white esg-font-bold esg-py-2 esg-px-4 esg-rounded"
              >
                  Svar nej til 5
              </button>
          </div>
          <div>
            {impactQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answers[question.id]}
                onAnswerChange={onAnswerChange}
              />
            ))}
          </div>
        </>
      )}

      {finansielQuestions.length > 0 && (
        <>
          <h2 className="esg-text-2xl esg-mt-6 esg-mb-3">Finansiel</h2>
          <div className="esg-flex esg-justify-end esg-mb-4">
              <button
                  onClick={() => handleAnswerNext5('yes', 'finansiel')}
                  className="esg-bg-green-500 esg-hover:bg-green-700 esg-text-white esg-font-bold esg-py-2 esg-px-4 esg-rounded esg-mr-2"
              >
                  Svar ja til 5
              </button>
              <button
                  onClick={() => handleAnswerNext5('no', 'finansiel')}
                  className="esg-bg-red-500 esg-hover:bg-red-700 esg-text-white esg-font-bold esg-py-2 esg-px-4 esg-rounded"
              >
                  Svar nej til 5
              </button>
          </div>
          <div>
            {finansielQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answers[question.id]}
                onAnswerChange={onAnswerChange}
              />
            ))}
          </div>
        </>
      )}

      <div className="esg-flex esg-justify-between esg-mt-8">
        <button 
          onClick={onPrev}
          className="esg-bg-gray-300 esg-hover:bg-gray-400 esg-text-gray-800 esg-font-bold esg-py-2 esg-px-4 esg-rounded"
        >
          Forrige
        </button>
        <button 
          onClick={onNext}
          disabled={isLast}
          className="esg-bg-blue-500 esg-hover:bg-blue-700 esg-text-white esg-font-bold esg-py-2 esg-px-4 esg-rounded disabled:esg-opacity-50 disabled:esg-cursor-not-allowed"
        >
          Næste
        </button>
      </div>
    </div>
  );
}

export default StepDVA;