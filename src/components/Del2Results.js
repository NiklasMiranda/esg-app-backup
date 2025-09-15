import React, { useMemo } from 'react';
import CustomPolarChart from './CustomPolarChart';


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

const criterionColors = {
  E1: '#006400', // Yellow-Orange
  E2: '#2e8b57', // Red
  E3: '#228b22', // Light Green
  E4: '#006400', // Blue
  E5: '#004d00', // Dark Red
  S1: '#8b0000', // Green
  S2: '#b22222', // Orange
  S3: '#800000', // Light Blue
  S4: '#9b111e', // Gray
  G1: '#1e3a5f', // Purple
};



function getESGLevel(score) {
  if (score < 35) return 'Ikke bestået';
  else if (score < 50) return 'Bronze';
  else if (score < 65) return 'Sølv';
  else if (score < 80) return 'Guld';
  else return 'Platin';
}

function Del2Results({ finalScores, totalScore, indicatorPoints, maxScores }) {
  const polarBarChartData = useMemo(() => {
    return Object.entries(finalScores).map(([label, finalScore]) => ({
      criterion: label.trim(), // Ensure no whitespace
      "Point (Optjent)": parseFloat(indicatorPoints[label]?.toFixed(2)) || 0,
    }));
  }, [finalScores, indicatorPoints]);

  const esgLevel = useMemo(() => getESGLevel(totalScore), [totalScore]);

  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-mb-6">Del 2 Resultater</h1>

      <div className="esg-mb-8">
        <h2 className="esg-text-2xl esg-mb-4">Samlet ESG Score: {totalScore.toFixed(2)}</h2>
      </div>

      {/* Custom Inverted Polar Chart */}
      <div className="esg-mb-8 esg-h-[800px] esg-w-[1200px] esg-mx-auto esg-relative">
        <h2 className="esg-text-2xl esg-mb-4">ESG Kriterie Sammenligning (Custom Inverted)</h2>
        <CustomPolarChart
          data={polarBarChartData}
          totalScore={totalScore}
          esgLevel={esgLevel}
          criterionColors={criterionColors}
        />
      </div>

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