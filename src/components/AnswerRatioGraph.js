import React from 'react';

const AnswerRatioGraph = ({ yesCount, noCount }) => {
  const totalAnswers = yesCount + noCount;

  if (totalAnswers === 0) {
    return (
      <div className="esg-mt-4 esg-text-sm esg-text-gray-500 esg-text-center">
        Ingen besvarede spørgsmål endnu.
      </div>
    );
  }

  const yesPercentage = (yesCount / totalAnswers) * 100;
  const noPercentage = (noCount / totalAnswers) * 100;

  return (
    <div className="esg-mt-6 esg-w-full esg-max-w-xs">
      <div className="esg-flex esg-h-6 esg-rounded-md esg-overflow-hidden esg-bg-gray-200">
        <div
          className="esg-h-full esg-bg-blue-400 esg-transition-all esg-duration-500 esg-ease-in-out"
          style={{ width: `${yesPercentage}%` }}
        ></div>
        <div
          className="esg-h-full esg-bg-gray-400 esg-transition-all esg-duration-500 esg-ease-in-out"
          style={{ width: `${noPercentage}%` }}
        ></div>
      </div>
      <div className="esg-flex esg-justify-between esg-mt-2 esg-text-xs esg-text-gray-600">
        <span>Ja: {yesCount} ({yesPercentage.toFixed(0)}%)</span>
        <span>Nej: {noCount} ({noPercentage.toFixed(0)}%)</span>
      </div>
    </div>
  );
};

export default AnswerRatioGraph;
