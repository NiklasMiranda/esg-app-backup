import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from './CircularProgress';
import groupTitles from '../data/groupTitles';

const navSteps = [
  { key: 'dvaInfo', title: 'Intro' },
  { key: 'E1', title: 'E1: Klimaforandringer' },
  { key: 'E2', title: 'E2: Forurening' },
  { key: 'E3', title: 'E3: Vand- og havressourcer' },
  { key: 'E4', title: 'E4: Biodiversitet og økosystemer' },
  { key: 'E5', title: 'E5: Ressourceanvendelse og cirkulær økonomi' },
  { key: 'S1', title: 'S1: Egen arbejdsstyrke' },
  { key: 'S2', title: 'S2: Arbejdstagere i værdikæden' },
  { key: 'S3', title: 'S3: Berørte samfund' },
  { key: 'S4', title: 'S4: Forbrugere og slutbrugere' },
  { key: 'G1', title: 'G1: God forretningsskik' },
  { key: 'matrix', title: 'Resultater' },
  { key: 'matrixQuestions', title: 'Matrix Spørgsmål' },
];

function Navigation({ activeGroup, onNavigate, categoryCompletionStatus, esgCategoryCompletionStatus, activeSection, onSectionChange, matrixQuestions, questionGroups }) {
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [isDvaCollapsed, setDvaCollapsed] = useState(false);
  const [isEsgCollapsed, setEsgCollapsed] = useState(true);
  const listRef = useRef(null);
  const [indicatorTop2, setIndicatorTop2] = useState(0);
  const listRef2 = useRef(null);

  useEffect(() => {
    if (activeSection === 'del1') {
      setDvaCollapsed(false);
      setEsgCollapsed(true);
    } else if (activeSection === 'del2') {
      setDvaCollapsed(true);
      setEsgCollapsed(false);
    }
  }, [activeSection]);

  const currentActive = activeGroup;

  useEffect(() => {
    if (activeSection === 'del1' && listRef.current) {
      const activeElement = listRef.current.querySelector('.nav-category-item.active');
      if (activeElement) {
        setIndicatorTop(activeElement.offsetTop);
      }
    } else if (activeSection === 'del2' && listRef2.current) {
      const activeElement = listRef2.current.querySelector('.nav-category-item.active');
      if (activeElement) {
        setIndicatorTop2(activeElement.offsetTop);
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

  const del2NavSteps = [
    { key: 'esgInfo', title: 'Intro' },
    ...questionGroups.map(groupKey => ({ key: groupKey, title: `${groupKey}: ${groupTitles[groupKey] || ''}` })),
    { key: 'del2Results', title: 'Score' },
  ];

  const del1Steps = navSteps.filter(step => !['matrixQuestions'].includes(step.key));

  return (
    <div className="esg-bg-[#0b3954] esg-text-white esg-mt-[5px] esg-mb-[5px] esg-ml-[5px]">
      <h1 className="esg-text-xl esg-font-bold esg-p-4">ESG-beregneren</h1>
      
      <div>
        <h2 
          className={`esg-text-lg esg-font-bold esg-py-2 esg-px-4 esg-cursor-pointer ${activeSection === 'del1' ? 'esg-text-white' : ''}`}
          onClick={() => handleSectionToggle('del1')}
        >
          DVA
        </h2>
        <ul 
          className={`esg-relative esg-pl-4 esg-transition-[max-height] esg-duration-500 esg-ease-in-out esg-overflow-hidden esg-bg-[#0b3954] ${!isDvaCollapsed ? 'esg-max-h-[1000px]' : 'esg-max-h-0'}`}
          ref={listRef}
        >
          <div className="esg-absolute esg-left-0 esg-w-[3px] esg-h-10 esg-bg-[#bd822e] esg-transition-transform esg-duration-300 esg-ease-in-out" style={{ transform: `translateY(${indicatorTop}px)` }} />
          {del1Steps.map(step => (
            <li
              key={step.key}
              onClick={() => {
                onNavigate('del1', step.key);
              }}
              className={`nav-category-item esg-py-2 esg-px-4 esg-cursor-pointer esg-flex esg-items-center esg-gap-3 esg-h-10 hover:esg-bg-slate-500 ${currentActive === step.key ? 'active esg-bg-slate-500 esg-text-white esg-font-bold' : 'esg-text-white'}`}
            >
              {step.key !== 'matrix' && step.key !== 'dvaInfo' && (
                <CircularProgress percentage={categoryCompletionStatus[step.key] || 0} size={20} />
              )}
              <span className="esg-flex-grow">{step.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 
          className={`esg-text-lg esg-font-bold esg-py-2 esg-px-4 esg-cursor-pointer ${activeSection === 'del2' ? 'esg-text-white esg-bg-[#0b3954]' : ''}`}
          onClick={() => handleSectionToggle('del2')}
        >
          ESG-score
        </h2>
        <ul className={`esg-relative esg-pl-4 esg-transition-[max-height] esg-duration-500 esg-ease-in-out esg-overflow-hidden esg-bg-[#0b3954] ${!isEsgCollapsed ? 'esg-max-h-[1000px]' : 'esg-max-h-0'}`} ref={listRef2}>
          <div className="esg-absolute esg-left-0 esg-w-[3px] esg-h-10 esg-bg-[#bd822e] esg-transition-transform esg-duration-300 esg-ease-in-out" style={{ transform: `translateY(${indicatorTop2}px)` }} />
          {del2NavSteps.map(step => (
            <li
              key={step.key}
              onClick={() => {
                onNavigate('del2', step.key);
              }}
              className={`nav-category-item esg-py-2 esg-px-4 esg-cursor-pointer esg-flex esg-items-center esg-gap-3 esg-h-10 hover:esg-bg-slate-500 ${currentActive === step.key ? 'active esg-bg-slate-500 esg-text-white esg-font-bold' : 'esg-text-white'}`}
            >
              <span className="esg-flex-grow">{step.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
