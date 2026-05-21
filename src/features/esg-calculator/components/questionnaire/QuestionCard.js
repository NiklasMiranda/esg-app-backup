import InfoIcon from 'shared/components/ui/InfoIcon';

function QuestionCard({
  question,
  answer,
  onAnswerChange,
  onInfoClick,
  showPoints,
}) {
  return (
    <div className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md esg-mb-4 esg-flex esg-flex-col esg-justify-between esg-h-full">
      <div>
        {' '}
        {/* Container for number, info, and text */}
        <div className="esg-flex esg-items-center esg-mb-2">
          {' '}
          {/* Question number and InfoIcon */}
          <p className="esg-font-bold esg-mr-2">{question.number}</p>
          <InfoIcon onClick={onInfoClick} />
        </div>
        <p className="esg-mb-4">
          {' '}
          {/* Question text */}
          {question.text}
        </p>
      </div>
      <div className="esg-flex esg-justify-between esg-items-center">
        <div className="esg-flex esg-justify-start esg-gap-2">
          <button
            onClick={() =>
              onAnswerChange(question.id, answer === 'yes' ? null : 'yes')
            }
            className={`btn-nav ${answer === 'yes' ? 'btn-nav-active' : ''}`}
          >
            Ja
          </button>
          <button
            onClick={() =>
              onAnswerChange(question.id, answer === 'no' ? null : 'no')
            }
            className={`btn-nav ${answer === 'no' ? 'btn-nav-active' : ''}`}
          >
            Nej
          </button>
        </div>
        {showPoints && question.points && (
          <div className="esg-flex esg-items-center esg-text-gray-600 esg-text-sm">
            <span className="esg-mr-1">{question.points}</span>
            <span>⭐</span>
          </div>
        )}
      </div>{' '}
    </div>
  );
}

export default QuestionCard;
