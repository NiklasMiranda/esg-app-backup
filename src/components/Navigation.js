// This list should ideally be in a shared constants file, but for now, it's here.
const navSteps = [
  { key: 'intro', title: 'Intro' },
  { key: 'E1', title: 'E1: Klimaforandringer' },
  { key: 'E2', title: 'E2: Forurening' },
  { key: 'E3', title: 'E3: Vand- og havressourcer' },
  { key: 'E4', title: 'E4: Biodiversitet' },
  { key: 'E5', title: 'E5: Cirkulær økonomi' },
  { key: 'S1', title: 'S1: Egen arbejdsstyrke' },
  { key: 'S2', title: 'S2: Arbejdere i værdikæden' },
  { key: 'S3', title: 'S3: Påvirkede samfund' },
  { key: 'S4', title: 'S4: Forbrugere' },
  { key: 'G1', title: 'G1: Forretningsetik' },
  { key: 'matrix', title: 'Væsentlighedsmatrix' },
  { key: 'results', title: 'Resultater' },
];

function Navigation({ activeGroup, onNavigate, categoryCompletionStatus }) {
  // Set 'intro' as active if no group is active yet
  const currentActive = activeGroup || 'intro';

  return (
    <div className="esg-sticky esg-top-0 esg-z-50 esg-bg-gray-100 esg-p-4">
      <h2 className="esg-mb-4">Fremgang</h2>
      <ul className="esg-space-y-2">
        {navSteps.map(step => (
          <li
            key={step.key}
            onClick={() => onNavigate(step.key)}
            className={`
              esg-p-2 esg-rounded esg-cursor-pointer
              ${currentActive === step.key
                ? 'esg-bg-blue-500 esg-text-white'
                : 'esg-hover:bg-gray-200'
              }
            `}
          >
            {step.title}
            {categoryCompletionStatus[step.key] && <span className="esg-ml-2">✓</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navigation;