import CircularProgress from './CircularProgress';
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
  { key: 'matrix', title: 'Resultater' },
  { key: 'matrixQuestions', title: 'Matrix Spørgsmål' },
];

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

function Navigation({ activeGroup, onNavigate, categoryCompletionStatus, activeSection, onSectionChange, matrixQuestions }) {
  // Set 'intro' as active if no group is active yet
  const currentActive = activeGroup || 'intro';

  // Dynamically generate Del 2 nav steps
  const del2NavSteps = [];
  const groupedMatrixQuestions = {};

  matrixQuestions.forEach(q => {
    if (!groupedMatrixQuestions[q.label]) {
      groupedMatrixQuestions[q.label] = {};
    }
    if (!groupedMatrixQuestions[q.label][q.subcategory]) {
      groupedMatrixQuestions[q.label][q.subcategory] = [];
    }
    groupedMatrixQuestions[q.label][q.subcategory].push(q);
  });

  Object.entries(groupedMatrixQuestions).forEach(([label, subcategories]) => {
    del2NavSteps.push({ key: label, title: `${label}: ${groupTitles[label] || ''}` }); // Main category title
  });
  del2NavSteps.push({ key: 'del2Results', title: 'Del 2 Resultater' });

  const del1Steps = navSteps.filter(step => !['matrixQuestions'].includes(step.key));

  return (
    <div className="esg-sticky esg-top-0 esg-z-50 esg-bg-gray-100 esg-p-4">
      <div className="esg-flex esg-justify-around esg-mb-4">
        <button
          onClick={() => onSectionChange('del1')}
          className={`esg-px-4 esg-py-2 esg-rounded-lg esg-transition-colors esg-duration-200
            ${activeSection === 'del1' ? 'esg-bg-blue-500 esg-text-white' : 'esg-bg-gray-200 esg-text-gray-800 esg-hover:bg-blue-200'}
          `}
        >
          Del 1
        </button>
        <button
          onClick={() => onSectionChange('del2')}
          className={`esg-px-4 esg-py-2 esg-rounded-lg esg-transition-colors esg-duration-200
            ${activeSection === 'del2' ? 'esg-bg-blue-500 esg-text-white' : 'esg-bg-gray-200 esg-text-gray-800 esg-hover:bg-blue-200'}
          `}
        >
          Del 2
        </button>
      </div>

      <ul className="esg-space-y-2">
        {(activeSection === 'del1' ? del1Steps : del2NavSteps).map(step => (
          <li
            key={step.key}
            onClick={() => onNavigate(activeSection, step.key)}
            className={`
              esg-p-2 esg-rounded esg-cursor-pointer
              ${currentActive === step.key
                ? 'esg-border-2 esg-border-blue-500 esg-text-blue-700'
                : 'esg-hover:bg-gray-200'
              }
              ${step.isSubcategory ? 'esg-ml-4 esg-font-semibold' : ''}
              ${step.isQuestion ? 'esg-ml-8 esg-text-sm' : ''}
            `}
          >
            <div className="esg-flex esg-items-center esg-justify-between esg-w-full">
              <span>{step.title}</span>
              {activeSection === 'del1' && categoryCompletionStatus[step.key] !== undefined && categoryCompletionStatus[step.key] !== null &&
                <CircularProgress percentage={categoryCompletionStatus[step.key]} />
              }
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navigation;