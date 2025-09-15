import React from 'react';

function StepResults({ finalScores, totalScore }) {
  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-mb-6">Resultater</h1>

      <div className="esg-mb-8">
        <h2 className="esg-text-2xl esg-mb-4">Samlet ESG Score: {totalScore.toFixed(2)}</h2>
      </div>

      <div className="esg-mb-8">
        <h2 className="esg-text-2xl esg-mb-4">Score per Kriterie:</h2>
        <table className="esg-min-w-full esg-bg-white esg-border esg-border-gray-300">
          <thead>
            <tr>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-left">Kriterie</th>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(finalScores).map(([label, score]) => (
              <tr key={label}>
                <td className="esg-py-2 esg-px-4 esg-border-b">{label}</td>
                <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StepResults;