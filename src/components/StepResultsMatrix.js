import React, { useMemo } from 'react';
import { dvaQuestions } from '../data/dvaQuestions'; // Adjust path if necessary

const axisLabels = ["Ikke relevant", "Lav", "Middel", "Moderat", "Høj", "Meget høj"];

// A simple map for titles, can be expanded (copied from StepDVA for consistency)
const groupTitles = {
  E1: 'Klimaforandringer',
  E2: 'Forurening',
  E3: 'Vand- og havressourcer',
  E4: 'Biodiversitet og økosystemer',
  E5: 'Ressourceanvendelse og cirkulær økonomi',
  S1: 'Egen arbejdsstyrke',
  S2: 'Arbejder i værdikæden',
  S3: 'Påvirkede samfund',
  S4: 'Forbrugere og slutbrugere',
  G1: 'Forretningsetik',
};

function StepResultsMatrix({ answers, criteriaWeights, impactFinansielCounts, onNext }) {
  const { plottedCoordinates } = useMemo(() => {
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

    const rawCoordinates = []; // Store raw coordinates as an array
    Object.entries(results).forEach(([label, d]) => {
      rawCoordinates.push({
        label,
        impact: Math.min(d.impact, 5),
        finansiel: Math.min(d.finansiel, 5)
      });
    });

    // Group coordinates to handle overlaps
    const groupedCoords = rawCoordinates.reduce((acc, curr) => {
      const key = `${curr.impact}-${curr.finansiel}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});

    const finalPlottedCoordinates = [];
    const offsetAmount = 0.1; // Small offset for overlapping points

    Object.values(groupedCoords).forEach(group => {
      if (group.length === 1) {
        finalPlottedCoordinates.push(group[0]);
      } else {
        // Apply offset for overlapping points
        group.forEach((coord, index) => {
          finalPlottedCoordinates.push({
            ...coord,
            impact: coord.impact + (index * offsetAmount) - ((group.length - 1) * offsetAmount / 2), // Center the group
            finansiel: coord.finansiel + (index * offsetAmount) - ((group.length - 1) * offsetAmount / 2),
          });
        });
      }
    });

    return { plottedCoordinates: finalPlottedCoordinates };
  }, [answers]);

  return (
    <div className="esg-p-4">
      <h1 className="esg-text-3xl esg-mb-6">Væsentlighedsmatrix</h1>

      {/* Coordinate System (Graph) */}
      <div className="esg-mb-12 esg-relative esg-h-[500px] esg-w-[500px] esg-mx-auto"> {/* Adjusted for square cells and centered */}
        <h2 className="esg-text-2xl esg-mb-4">Dobbelt Væsentlighedsmatrix (Graf)</h2>
        
        {/* Impact label (above graph) */}
        <div className="esg-absolute esg-top-0 esg-left-1/2 esg-transform esg--translate-x-1/2 esg--translate-y-full esg-text-sm">Impact</div>

        <div className="esg-relative esg-w-full esg-h-full esg-border esg-border-gray-400 esg-grid esg-grid-cols-6 esg-grid-rows-6 esg-gap-px esg-bg-gray-200">
          {/* Grid cells for background */}
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200"></div>
          ))}

          {/* Y-axis labels (Finansiel) */}
          <div className="esg-absolute esg-left-0 esg-top-0 esg-h-full esg-flex esg-flex-col esg-justify-around esg-items-center esg-transform esg--translate-x-full esg-pr-2 esg-text-sm">
            {axisLabels.slice().reverse().map((label, index) => (
              <span key={index} className="h-1/6 flex items-center">{label}</span>
            ))}
          </div>

          {/* X-axis labels (Impact) */}
          <div className="esg-absolute esg-bottom-0 esg-left-0 esg-w-full esg-flex esg-justify-around esg-items-center esg-transform esg-translate-y-full esg-pt-2 esg-text-sm">
            {axisLabels.map((label, index) => (
              <span key={index} className="w-1/6 text-center">{label}</span>
            ))}
          </div>

          {/* Plotting points */}
          {plottedCoordinates.map((item) => (
            <div
              key={item.label}
              className="esg-absolute esg-flex esg-items-center esg-justify-center esg-text-xs esg-bg-blue-500 esg-text-white esg-rounded-full"
              style={{
                left: `calc(${(item.impact + 0.5) * (100 / 6)}% - 10px)`,
                bottom: `calc(${(item.finansiel + 0.5) * (100 / 6)}% - 10px)`,
                width: '20px',
                height: '20px',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        
        {/* Finansiel label (right of graph) */}
        <div className="esg-absolute esg-right-0 esg-top-1/2 esg-transform esg-translate-x-1/2 esg--translate-y-1/2 esg-rotate-90 esg-text-sm esg-whitespace-nowrap">Finansiel</div>
      </div>

      {/* Table Form */}
      <div className="esg-mb-8">
        <h2 className="esg-text-2xl esg-mb-4">Vægtning af Kriterier</h2>
        <table className="esg-min-w-full esg-bg-white esg-border esg-border-gray-300">
          <thead>
            <tr>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-left">Kriterie</th>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Impact</th>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Finansiel</th>
              <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Vægtning</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(criteriaWeights).map(([label, weight]) => (
              <tr key={label}>
                <td className="esg-py-2 esg-px-4 esg-border-b">{label}: {groupTitles[label]}</td>
                <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{impactFinansielCounts[label]?.impact || 0}</td>
                <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{impactFinansielCounts[label]?.finansiel || 0}</td>
                <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="esg-flex esg-justify-end esg-mt-4">
        <button
          onClick={onNext}
          className="btn-primary"
        >
          Gå til Del 2
        </button>
      </div>
    </div>
  );
}

export default StepResultsMatrix;