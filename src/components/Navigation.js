import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from './CircularProgress';
import './Navigation.css';

const navSteps = [
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
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [isDvaCollapsed, setDvaCollapsed] = useState(false);
  const [isEsgCollapsed, setEsgCollapsed] = useState(true);
  const listRef = useRef(null);

  const currentActive = activeGroup;

  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector('.nav-category-item.active');
      if (activeElement) {
        setIndicatorTop(activeElement.offsetTop);
      }
    }
  }, [activeGroup, activeSection]);

  const handleSectionToggle = (section) => {
    if (section === 'del1') {
      if (activeSection === 'del1') {
        setDvaCollapsed(!isDvaCollapsed);
      } else {
        onSectionChange('del1');
        setDvaCollapsed(false);
        setEsgCollapsed(true);
      }
    } else if (section === 'del2') {
      if (activeSection === 'del2') {
        setEsgCollapsed(!isEsgCollapsed);
      } else {
        onSectionChange('del2');
        setDvaCollapsed(true);
        setEsgCollapsed(false);
      }
    }
  };

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
    del2NavSteps.push({ key: label, title: `${label}: ${groupTitles[label] || ''}` });
  });
  del2NavSteps.push({ key: 'del2Results', title: 'Del 2 Resultater' });

  const del1Steps = navSteps.filter(step => !['matrixQuestions', 'intro'].includes(step.key));

  return (
    <div className="nav-container">
      <h1>ESG-beregneren</h1>
      
      <div>
        <h2 
          className={`nav-section-header ${activeSection === 'del1' ? 'active' : ''}`}
          onClick={() => handleSectionToggle('del1')}
        >
          DVA
        </h2>
        <ul 
          className={`nav-category-list ${!isDvaCollapsed ? 'nav-category-list-open' : 'nav-category-list-closed'}`}
          ref={listRef}
        >
          <div className="active-indicator" style={{ transform: `translateY(${indicatorTop}px)` }} />
          {del1Steps.map(step => (
            <li
              key={step.key}
              onClick={() => onNavigate('del1', step.key)}
              className={`nav-category-item ${currentActive === step.key ? 'active' : ''}`}
            >
              <CircularProgress percentage={categoryCompletionStatus[step.key] || 0} size={20} />
              <span className="category-title-text">{step.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 
          className={`nav-section-header ${activeSection === 'del2' ? 'active' : ''}`}
          onClick={() => handleSectionToggle('del2')}
        >
          ESG-score
        </h2>
        <ul className={`nav-category-list ${!isEsgCollapsed ? 'nav-category-list-open' : 'nav-category-list-closed'}`}>
          {del2NavSteps.map(step => (
            <li
              key={step.key}
              onClick={() => onNavigate('del2', step.key)}
              className={`nav-category-item ${currentActive === step.key ? 'active' : ''}`}
            >
              {step.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
