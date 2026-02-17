import React, { useMemo } from 'react';
import groupTitles from '../data/groupTitles';

const axisLabels = ["Ikke relevant", "Lav", "Middel", "Moderat", "Høj", "Meget høj"];

function DVAWeightingChart({ dvaQuestions, answers, criterionColors }) {
    const { plottedCoordinates } = useMemo(() => {
        const results = {};
        // Initialize results for all sub_categories present in dvaQuestions
        [...new Set(dvaQuestions.map(q => q.sub_category.label))].forEach(label => {
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
            if (q.purpose === 'impact') results[q.sub_category.label].impact++;
            else if (q.purpose === 'finansiel') results[q.sub_category.label].finansiel++;
          }
        });
      
      const rawCoordinates = [];
      Object.entries(results).forEach(([label, d]) => {
        rawCoordinates.push({
          label,
          impact: Math.min(d.impact, 5), // Cap at 5 for axis display
          finansiel: Math.min(d.finansiel, 5), // Cap at 5 for axis display
        });
      });
  
      // Jitter logic to handle overlapping points
      const jitteredCoordinates = rawCoordinates.map((coord, index, self) => {
        const sameCoords = self.filter(
          (c, i) =>
            i < index &&
            c.impact === coord.impact &&
            c.finansiel === coord.finansiel
        );
        const jitterAmount = sameCoords.length * 0.1; // Adjust this value for more/less jitter
        return {
          ...coord,
          displayLabel: coord.label,
          originalLabels: [coord.label],
          count: 1,
          impact: coord.impact + jitterAmount,
          finansiel: coord.finansiel + jitterAmount,
        };
      });
  
      return { plottedCoordinates: jitteredCoordinates };
    }, [answers, dvaQuestions]);
  
    // Conditional rendering if no data
    if (!dvaQuestions || dvaQuestions.length === 0 || Object.keys(answers).length === 0) {
      return (
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md esg-mt-6">
          <h3 className="esg-text-xl esg-font-semibold esg-mb-4">Væsentlighedsanalyse</h3>
          <div className="esg-text-center esg-py-10 esg-text-gray-500">
            Ingen DVA data tilgængelig for at vise vægtning.
          </div>
        </div>
      );
    }


    return (
      <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md esg-mt-6">
        <h3 className="esg-text-xl esg-font-semibold esg-mb-4">Væsentlighedsanalyse</h3>
        <div className="esg-relative esg-w-full esg-max-w-xl esg-h-auto esg-aspect-square esg-mx-auto">
          {/* Virkningsvæsentlighed label */}
          <div className="esg-absolute esg-top-0 esg-left-1/2 esg-transform esg--translate-x-1/2 esg--translate-y-6 esg-text-xs sm:esg-text-sm">
            Virkningsvæsentlighed
          </div>

          {/* Y-axis labels */}
          <div className="esg-absolute esg-left-0 esg-top-0 esg-h-full esg-flex esg-flex-col esg-justify-around esg-pr-2 esg-text-xs sm:esg-text-sm esg-w-20 esg-text-right esg--translate-x-full">
            {axisLabels.slice().reverse().map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="esg-absolute esg-bottom-0 esg-left-0 esg-w-full esg-flex esg-justify-around esg-items-center esg-pt-2 esg-text-xs sm:esg-text-sm esg-h-10 esg-translate-y-full">
            {axisLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>

          {/* Grid */}
          <div className="esg-relative esg-w-full esg-h-full esg-border esg-border-gray-400 esg-grid esg-grid-cols-6 esg-grid-rows-6 esg-gap-px esg-bg-gray-200 esg-rounded-lg">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="esg-bg-white esg-border esg-border-gray-200"></div>
            ))}

            {plottedCoordinates.map(item => (
              <div
                key={item.label}
                className="esg-absolute esg-flex esg-items-center esg-justify-center esg-text-white esg-rounded-full"
                style={{
                  backgroundColor: criterionColors[item.originalLabels[0]] || '#ccc',
                  left: `calc(${(item.impact + 0.5) * (100 / 6)}%)`,
                  bottom: `calc(${(item.finansiel + 0.5) * (100 / 6)}%)`,
                  width: '25px',
                  height: '25px',
                  fontSize: '12px',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {item.displayLabel}
              </div>
            ))}
          </div>

          {/* Finansiel væsentlighed label */}
          <div className="esg-absolute esg-right-3 esg-top-1/2 esg-transform esg-translate-x-full esg--translate-y-1/2 esg-rotate-90 esg-text-xs sm:esg-text-sm esg-whitespace-nowrap">
            Finansiel væsentlighed
          </div>
        </div>
      </div>
    );
}

export default DVAWeightingChart;
