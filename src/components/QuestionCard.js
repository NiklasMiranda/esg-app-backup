import { useState } from 'react'; // Import useState

function QuestionCard({ question, answer, onAnswerChange }) {
  const [isExpanded, setIsExpanded] = useState(false); // New state for expand/collapse

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Placeholder content for description and typical industries
  // This data should ideally come from your dvaQuestions.js file
  const description = "Dette er en generisk beskrivelse af spørgsmålet. Du kan tilføje mere detaljeret information her, som hjælper brugeren med at forstå spørgsmålets relevans og kontekst.";
  const typicalIndustries = "Typiske brancher, der er relevante for dette spørgsmål, inkluderer: Produktion, Transport, Energi, Landbrug.";

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
        </div>
      </div>
      
      {/* Expandable content with transition */}
      <div
        className={`
          esg-overflow-hidden esg-transition-all esg-duration-300 esg-ease-in-out
          ${isExpanded ? 'esg-max-h-96 esg-p-2 esg-mt-2' : 'esg-max-h-0'}
        `}
      >
        <div className="esg-flex esg-space-x-4">
          <div className="esg-flex-1 esg-bg-white esg-p-2 esg-rounded">
            <h4 className="esg-mb-1">Beskrivelse:</h4>
            <p className="esg-text-sm">{description}</p>
          </div>
          <div className="esg-flex-1 esg-bg-white esg-p-2 esg-rounded">
            <h4 className="esg-mb-1">Typiske brancher:</h4>
            <p className="esg-text-sm">{typicalIndustries}</p>
          </div>
        </div>
      </div>

      <div className="esg-flex esg-justify-center esg-mt-2">
        <button onClick={toggleExpand} className="btn-icon">
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="esg-h-5 esg-w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="esg-h-5 esg-w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuestionCard;
