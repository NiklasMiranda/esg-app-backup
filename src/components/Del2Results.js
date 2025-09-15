import React, { useMemo } from 'react';
import { ResponsivePolarBar } from '@nivo/polar-bar';

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
  E1: '#e0ac2b', // Yellow-Orange
  E2: '#e85252', // Red
  E3: '#9bde74', // Light Green
  E4: '#4a90e2', // Blue
  E5: '#a94442', // Dark Red
  S1: '#5cb85c', // Green
  S2: '#f0ad4e', // Orange
  S3: '#5bc0de', // Light Blue
  S4: '#777777', // Gray
  G1: '#6f42c1', // Purple
};

const reversedCriterionColors = Object.fromEntries(
  Object.entries(criterionColors).reverse()
);

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

      {/* Nivo Radar Chart */}
      <div className="esg-mb-8 esg-h-[800px] esg-w-[1200px] esg-mx-auto esg-relative">
        <h2 className="esg-text-2xl esg-mb-4">ESG Kriterie Sammenligning</h2>
        <ResponsivePolarBar
          data={polarBarChartData}
          keys={['Point (Optjent)']}
          indexBy="criterion"
          valueSteps={5}
          valueFormat=">-.0f"
          margin={{ top: 30, right: 20, bottom: 70, left: 20 }}
          innerRadius={0.25}
          cornerRadius={2}
          colors={({ index }) => reversedCriterionColors[index] || '#cccccc'}
          fillOpacity={0.8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [ ['darker', 0.2] ] }}
          arcLabelsSkipRadius={28}
          radialAxis={{ angle: 180, ticksPosition: 'after', tickSize: 5, tickPadding: 5, tickRotation: 0 }}
          circularAxisOuter={{ tickSize: 5, tickPadding: 15, tickRotation: 0 }}
          legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 50,
                itemWidth: 90,
                itemHeight: 16,
                symbolShape: 'circle'
            }
          ]}
        />
        <div className="esg-absolute esg-top-1/2 esg-left-1/2 esg-transform esg--translate-x-1/2 esg--translate-y-1/2 esg-flex esg-flex-col esg-items-center esg-justify-center esg-pointer-events-none">
          <p className="esg-text-4xl esg-font-bold esg-text-gray-800">{totalScore.toFixed(2)}</p>
          <p className="esg-text-xl esg-text-gray-600">{esgLevel}</p>
        </div>
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