import CustomPolarChart from './CustomPolarChart';


import groupTitles from '../data/groupTitles';



function Del2Results({ finalScores, totalScore, indicatorPoints, maxScores, esgLevel, polarBarChartData, criterionColors, onPrev }) {


  return (
    <div className="esg-p-4">


    <div>
      {/* First Row */}
      <div className="esg-flex esg-gap-8 esg-mb-8">
        {/* Left: Explanation for first graph */}
        <div className="esg-flex-1 esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-2xl esg-mb-4">Samlet ESG Score: {totalScore.toFixed(2)}</h2>
        </div>

        {/* Right: First Graph */}
        <div className="esg-flex-[2] esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
          <div className="esg-mb-8 esg-w-full esg-h-auto esg-aspect-square esg-mx-auto esg-relative">
            <CustomPolarChart
              data={polarBarChartData}
              totalScore={totalScore}
              esgLevel={esgLevel}
              criterionColors={criterionColors}
            />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="esg-flex esg-gap-8 esg-mb-8">
        {/* Left: Explanation for table */}
        <div className="esg-flex-1 esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
          <h2 className="esg-text-2xl esg-mb-4">Detaljeret Score per Kriterie:</h2>
        </div>

        {/* Right: Table */}
        <div className="esg-flex-[2] esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
          <table className="esg-min-w-full esg-bg-white esg-rounded-lg esg-overflow-hidden">
            <thead>
              <tr className="esg-bg-[#f4f4f4]">
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