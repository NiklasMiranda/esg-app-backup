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
    const offsetAmount = 0.3; // Spacing between points
    const pointsPerLine = 2; // How many points fit on one line before wrapping
    const lineOffsetAmount = 0.3; // Spacing between lines

    Object.values(groupedCoords).forEach(group => {
      if (group.length === 1) {
        finalPlottedCoordinates.push(group[0]);
      } else {
        group.forEach((coord, index) => {
          const xOffset = (index % pointsPerLine) * offsetAmount;
          const yOffset = Math.floor(index / pointsPerLine) * lineOffsetAmount;

          finalPlottedCoordinates.push({
            ...coord,
            impact: coord.impact + xOffset - ((Math.min(group.length, pointsPerLine) - 1) * offsetAmount / 2), // Center the line horizontally
            finansiel: coord.finansiel + yOffset - ((Math.ceil(group.length / pointsPerLine) - 1) * lineOffsetAmount / 2), // Center the group vertically
          });
        });
      }
    });

    return { plottedCoordinates: finalPlottedCoordinates };
  }, [answers]);

  return (
    <div className="font-raleway">
      <div className="esg-flex esg-gap-8 esg-mb-8">
        {/* Left Box: Heading and Description */}
        <div className="esg-flex-1 esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-2xl esg-font-bold esg-mb-4">Væsentlighedsmatrix</h2>
          <p className="esg-text-gray-700">
            Her kan du se en visuel repræsentation af din væsentlighedsmatrix, baseret på dine besvarelser.
            Akserne repræsenterer henholdsvis Impact og Finansiel væsentlighed.
          </p>
        </div>

        {/* Right Box: Matrix Chart */}
        <div className="esg-flex-[2] esg-bg-white esg-p-14 esg-rounded-lg esg-shadow-md esg-relative">
          <div className="esg-relative esg-w-full esg-max-w-xl esg-h-auto esg-aspect-square esg-mx-auto">
            
            {/* Impact label (above graph) */}
            <div className="esg-absolute esg-top-0 esg-left-1/2 esg-transform esg--translate-x-1/2 esg--translate-y-6 esg-text-xs sm:esg-text-sm">Impact</div>

            {/* Y-axis labels (Finansiel) */}
            <div className="esg-absolute esg-left-0 esg-top-0 esg-h-full esg-flex esg-flex-col esg-justify-around esg-items-center esg-pr-2 esg-text-xs sm:esg-text-sm esg-w-20 esg-text-right esg--translate-x-full">
              {axisLabels.slice().reverse().map((label, index) => (
                <span key={index} className="esg-h-1/6 esg-flex esg-items-center esg-justify-end">{label}</span>
              ))}
            </div>

            {/* X-axis labels (Impact) */}
            <div className="esg-absolute esg-bottom-0 esg-left-0 esg-w-full esg-flex esg-justify-around esg-items-center esg-pt-2 esg-text-xs sm:esg-text-sm esg-h-10 esg-translate-y-full">
              {axisLabels.map((label, index) => (
                <span key={index} className="esg-w-1/6 esg-text-center">{label}</span>
              ))}
            </div>

            <div className="esg-relative esg-w-full esg-h-full esg-border esg-border-gray-400 esg-grid esg-grid-cols-6 esg-grid-rows-6 esg-gap-px esg-bg-gray-200 esg-rounded-lg esg-overflow-hidden">
              {/* Grid cells for background */}
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="esg-bg-white esg-border esg-border-gray-200"></div>
              ))}

              {/* Plotting points */}
              {plottedCoordinates.map((item) => (
                <div
                  key={item.label}
                  className="esg-absolute esg-flex esg-items-center esg-justify-center esg-text-xxs sm:esg-text-xs esg-bg-blue-500 esg-text-white esg-rounded-full"
                  style={{
                    left: `calc(${(item.impact + 0.5) * (100 / 6)}% - 10px)`,
                    bottom: `calc(${(item.finansiel + 0.5) * (100 / 6)}% - 10px)`,
                    width: '30px',
                    height: '30px',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
            
            {/* Finansiel label (right of graph) */}
            <div className="esg-absolute esg-right-3 esg-top-1/2 esg-transform esg-translate-x-full esg--translate-y-1/2 esg-rotate-90 esg-text-xs sm:esg-text-sm esg-whitespace-nowrap">Finansiel</div>
          </div>
        </div>
      </div>

            <div className="esg-flex esg-gap-8 esg-mb-8">
              {/* Left Box: Heading and Description */}
              <div className="esg-flex-1 esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
                <h2 className="esg-text-2xl esg-font-bold esg-mb-4">Vægtning af Kriterier</h2>
                <p className="esg-text-gray-700">
                  Her kan du justere vægtningen af de forskellige kriterier for at afspejle deres relative betydning for din virksomhed.
                </p>
              </div>
      
              {/* Right Box: Table Form */}
              <div className="esg-flex-[2] esg-bg-white esg-p-14 esg-rounded-lg esg-shadow-md esg-overflow-x-auto">
                <table className="esg-min-w-full esg-bg-white esg-border esg-border-gray-300 esg-rounded-lg esg-overflow-hidden">
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
            </div>
      <div className="esg-flex esg-justify-end esg-mt-4">
        <button
          onClick={() => onNext('del2', 'E1')}
          className="btn-primary"
        >
          Gå til Del 2
        </button>
      </div>
    </div>
  );
}

export default StepResultsMatrix;