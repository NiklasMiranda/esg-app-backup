import React from 'react';
// import ESGPieChart from './ESGPieChart';

const groupTitles = {
  E1: 'Klimaforandringer',
  E2: 'Forurening',
  E3: 'Vand- og havressourcer',
  E4: 'Biodiversitet og økosystemer',
  E5: 'Ressourceanvendelse og cirkulær økonomi',
  S1: 'Egen arbejdsstyrke',
  S2: 'Arbejdere i værdikæden',
  S3: 'Påvirkede samfund',
  S4: 'Forbrugere',
  G1: 'Forretningsetik',
};

function Del2Results({ finalScores, totalScore, indicatorPoints, maxScores }) {
  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-mb-6">Del 2 Resultater</h1>

      <div className="esg-mb-8">
        <h2 className="esg-text-2xl esg-mb-4">Samlet ESG Score: {totalScore.toFixed(2)}</h2>
      </div>

      {/* Pie Chart */}
      {/* <div className="esg-mb-8">
        <ESGPieChart finalScores={finalScores} totalScore={totalScore} indicatorPoints={indicatorPoints} />
      </div> */}

      <div className="esg-mb-8">
        <h2 className="esg-text-2xl esg-mb-4">Detaljeret Score per Kriterie:</h2>
        <table className="esg-min-w-full esg-bg-white esg-border esg-border-gray-300">
          <thead>
            <tr>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-left">Kriterie</th>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Point (Optjent)</th>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Point (Maks)</th>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Vægtet score (Maks)</th>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Vægtet score (Endelig)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(finalScores).map(([label, finalScore]) => (
              <tr key={label}>
                <td className="esg-py-2 esg-px-4 esg-border-b">{label}: {groupTitles[label]}</td>
                <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{indicatorPoints[label] || 0}</td>
                <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">100</td>
                <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{maxScores[label]?.toFixed(2) || 0}</td>
                <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{finalScore.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Del2Results;