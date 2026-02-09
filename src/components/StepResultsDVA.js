import React, { useMemo, useState } from 'react';
import { dvaQuestions } from '../data/dvaQuestions'; // Adjust path if necessary
import groupTitles from '../data/groupTitles';

const axisLabels = ["Ikke relevant", "Lav", "Middel", "Moderat", "Høj", "Meget høj"];

function StepResultsDVA({ answers, criteriaWeights, impactFinansielCounts, onNext, onPrev, criterionColors }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e, item) => {
    setHoveredItem(item);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

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

    const rawCoordinates = [];
    Object.entries(results).forEach(([label, d]) => {
      rawCoordinates.push({
        label,
        impact: Math.min(d.impact, 5),
        finansiel: Math.min(d.finansiel, 5),
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

    console.log('Plotted Coordinates:', JSON.stringify(jitteredCoordinates, null, 2)); // Debugging line
    console.log('Plotted Coordinates:', JSON.stringify(jitteredCoordinates, null, 2)); // Debugging line
    return { plottedCoordinates: jitteredCoordinates };
  }, [answers]);

  return (
    <>
      <div className="font-raleway">
        <div className="esg-flex esg-gap-8 esg-mb-8">
          {/* Left Box: Heading and Description */}
          <div className="esg-flex-1 esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
            <h2 className="esg-text-2xl esg-font-bold esg-mb-4">Væsentlighedsanalyse</h2>
            <p className="esg-text-gray-700">
              Her kan du se en visuel repræsentation af din væsentlighedsanalyse, baseret på dine besvarelser.
              Akserne repræsenterer henholdsvis virkningsvæsentlighed og finansiel væsentlighed.
            </p>
          </div>

          {/* Right Box: Chart */}
          <div className="esg-flex-[5] esg-bg-white esg-p-20 esg-rounded-lg esg-shadow-md esg-relative">
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
                    className="esg-absolute esg-flex esg-items-center esg-justify-center esg-text-white esg-rounded-full esg-cursor-pointer"
                    style={{
                      backgroundColor: criterionColors[item.originalLabels[0]] || '#ccc',
                      left: `calc(${(item.impact + 0.5) * (100 / 6)}%)`,
                      bottom: `calc(${(item.finansiel + 0.5) * (100 / 6)}%)`,
                      width: '25px',
                      height: '25px',
                      fontSize: '12px',
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseEnter={e => handleMouseEnter(e, item)}
                    onMouseLeave={handleMouseLeave}
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

            {/* Tooltip */}
            {hoveredItem && (
              <div
                className="esg-absolute esg-bg-gray-800 esg-text-white esg-text-xs esg-p-2 esg-rounded esg-shadow-lg esg-z-50"
                style={{ left: tooltipPosition.x + 10, top: tooltipPosition.y + 10 }}
              >
                {hoveredItem.originalLabels.map((label, idx) => (
                  <div key={idx}>{label}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vægtningstabel */}
        <div className="esg-flex esg-gap-8 esg-mb-8">
          <div className="esg-flex-1 esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
            <h2 className="esg-text-2xl esg-font-bold esg-mb-4">Vægtning af kriterier</h2>
            <p className="esg-text-gray-700">
              Her kan du få et overblik over de forskellige kriterier, der afspejler deres relative betydning for din virksomhed.
            </p>
          </div>

          <div className="esg-flex-[2] esg-bg-white esg-p-14 esg-rounded-lg esg-shadow-md esg-overflow-x-auto">
            <table className="esg-min-w-full esg-bg-white esg-border esg-border-[#f4f4f4] esg-rounded-lg esg-overflow-hidden">
              <thead>
                <tr className="esg-bg-[#f4f4f4]">
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-left">Kriterie</th>
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Virkningsvæsentlighed</th>
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Finansiel væsentlighed</th>
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Vægtning</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(criteriaWeights || {}).map(([label, weight]) => (
                  <tr key={label}>
                    <td className="esg-py-2 esg-px-4 esg-border-b">{label}: {groupTitles[label]}</td>
                    <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">
                      {impactFinansielCounts[label]?.impact || 0}
                    </td>
                    <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">
                      {impactFinansielCounts[label]?.finansiel || 0}
                    </td>
                    <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="esg-flex esg-justify-between esg-mt-4">
          <button onClick={onPrev} className="btn-secondary">
            Forrige
          </button>
          <button onClick={() => onNext('del2', 'E1')} className="btn-primary">
            Gå til Del 2
          </button>
        </div>
      </div>
    </>
  );
}

export default StepResultsDVA;
