import CustomPolarChart from './CustomPolarChart';
import groupTitles from '../data/groupTitles';

// 1. Modtag onCapture som en prop
function Del2Results({ finalScores, totalScore, indicatorPoints, maxScores, esgLevel, polarBarChartData, criterionColors, onPrev, onCapture }) {

  return (
    <div className="esg-p-4">
      <div>
        {/* First Row */}
        <div className="esg-flex esg-gap-8 esg-mb-8">
          {/* Left: Explanation for first graph */}
          <div className="esg-flex-1 esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
            <h2 className="esg-text-2xl esg-mb-4">Din samlede ESG-score</h2>
            <p className="esg-text-gray-700 esg-font-bold">Din samlede ESG-score er: {totalScore.toFixed(2)}</p>
            <p className="esg-text-gray-700 esg-font-bold">Din placering i vores niveauopdeling er: {esgLevel}</p>
            <p className="esg-text-gray-700 esg-mt-4">
              Din samlede ESG-score er beregnet på baggrund af dine besvarelser i initiativanalysen, vægtet i forhold til din dobbeltvæsentlighedsanalyse.
              Score-niveauet indikerer din virksomheds nuværende modenhed inden for bæredygtighed:
            </p>
            <ul className="esg-list-disc esg-list-inside esg-text-gray-700 esg-mt-2">
              <li><b>Platin:</b> 80-100 (Fremragende)</li>
              <li><b>Guld:</b> 65-79 (Meget god)</li>
              <li><b>Sølv:</b> 50-64 (God)</li>
              <li><b>Bronze:</b> 35-49 (Grundlæggende)</li>
              <li><b>Ikke bestået:</b> 0-34 (Utilstrækkelig)</li>
            </ul>
            <p className="esg-text-gray-700 esg-mt-4">
              Brug scoren som et internt redskab til at identificere styrker og svagheder. Får du dine resultater verificeret hos os, kan du også på sigt bruge den som et eksternt kommunikationsværktøj over for kunder, investorer og andre interessenter.
            </p>
          </div>

          {/* Right: First Graph */}
          <div className="esg-flex-[2] esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
            <div className="esg-mb-8 esg-w-full esg-h-auto esg-aspect-square esg-mx-auto esg-relative">
              <CustomPolarChart
                data={polarBarChartData}
                totalScore={totalScore}
                esgLevel={esgLevel}
                criterionColors={criterionColors}
                onCapture={onCapture}
              />
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="esg-flex esg-gap-8 esg-mb-8">
          {/* Left: Explanation for table */}
          <div className="esg-flex-1 esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
            <h2 className="esg-text-2xl esg-mb-4">Detaljeret score per kriterie:</h2>
            <p className="esg-text-gray-700">
              Tabellen viser en detaljeret oversigt over din score for hvert enkelt ESG-kriterie. Her kan du se de optjente point, den maksimale mulige score og den endelige vægtede score, der bidrager til din samlede ESG-score.
            </p>
          </div>

          {/* Right: Table */}
          <div className="esg-flex-[2] esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
            <table className="esg-min-w-full esg-bg-white esg-rounded-lg esg-overflow-hidden">
              <thead>
                <tr className="esg-bg-[#f4f4f4]">
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-left">Kriterie</th>
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Point (optjent)</th>
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Point (maks)</th>
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Vægtet score (maks)</th>
                  <th className="esg-py-2 esg-px-4 esg-border-b esg-text-right">Vægtet score (endelig)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(finalScores).map(([label, finalScore]) => (
                  <tr key={label}>
                    <td className="esg-py-2 esg-px-4 esg-border-b">{label}: {groupTitles[label]}</td>
                    <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{(indicatorPoints[label] || 0).toFixed(2)}</td>
                    <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">100</td>
                    <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{maxScores[label]?.toFixed(2) || 0}</td>
                    <td className="esg-py-2 esg-px-4 esg-border-b esg-text-right">{finalScore.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="esg-flex esg-justify-start esg-mt-4">
          <button
            onClick={onPrev}
            className="btn-secondary"
          >
            Forrige
          </button>
        </div>
      </div>
    </div>
  );
}

export default Del2Results;