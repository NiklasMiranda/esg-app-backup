import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCalculationResultsFromApi, fetchPdfReport } from './api';
import DashboardHeader from './app/layout/DashboardHeader'; // Import the DashboardHeader component
import DashboardSidebar from './app/layout/DashboardSidebar'; // Import the DashboardSidebar component
import Header from './app/layout/Header'; // Import the Header component
import {
  categoryDescriptions,
  questionDescriptions,
} from './data/descriptions';
import LandingPage from './features/auth/pages/LandingPage'; // Import the LandingPage component
import Login from './features/auth/pages/Login';
import CompanyFigures from './features/company/components/CompanyFigures';
import ExtendedModule from './features/company/components/ExtendedModule';
import Del2Results from './features/esg-calculator/components/Del2Results';
import ESGCalculatorNav from './features/esg-calculator/components/ESGCalculatorNav';
import StepDVA from './features/esg-calculator/components/StepDVA';
import StepDVAInfo from './features/esg-calculator/components/StepDVAInfo';
import StepESGInfo from './features/esg-calculator/components/StepESGInfo';
import StepInitiativanalyse from './features/esg-calculator/components/StepInitiativanalyse';
import StepResultsDVA from './features/esg-calculator/components/StepResultsDVA';
import {
  iaQuestionGroups,
  questionGroups,
} from './features/esg-calculator/constants/questionGroups';
import YearlyChartsSection from './shared/components/charts/YearlyChartsSection';
import YearSelector from './shared/components/forms/YearSelector'; // Import the YearSelector component

import { criterionColors } from './features/esg-calculator/constants/criterionColors';

import useYears from './features/years/hooks/useYears';

import useAuth from './features/auth/hooks/useAuth';

import useAutosave from './features/esg-calculator/hooks/useAutosave';

import useQuestionLoader from './features/esg-calculator/hooks/useQuestionLoader';

import useDashboardNavigation from './features/dashboard/hooks/useDashboardNavigation';

import useEsgAnswers from './features/esg-calculator/hooks/useEsgAnswers';

function App() {
  // --- ALL STATE HOOKS DECLARED FIRST AND UNCONDITIONALLY ---

  const {
    isLoggedIn,
    userCompanyId,
    showLandingPage,

    handleLoginSuccess,
    handleLogout,

    handleNavigateToLogin,
    handleNavigateToHome,
  } = useAuth();

  const {
    currentYear,
    setCurrentYear,

    availableYears,

    showAddYearInput,
    newYearValue,
    addYearError,

    onAddNewYear,
    handleYearInputChange,
    handleYearInputConfirm,
    handleYearInputCancel,
  } = useYears({
    isLoggedIn,
    userCompanyId,
  });

  const {
    isNavOpen,
    activeView,
    activeSection,

    setActiveSection,

    toggleNav,
    handleMainNavigation,
  } = useDashboardNavigation();

  const [iaQuestions, setIaQuestions] = useState([]);

  const {
    answers,
    setAnswers,

    iaAnswers,
    setIaAnswers,

    handleAnswerChange,
    handleIaAnswerChange,
  } = useEsgAnswers({
    iaQuestions,
    userCompanyId,
    currentYear,
  });

  const [currentDel1Step, setCurrentDel1Step] = useState('intro');
  const [iaGroupIndex, setIaGroupIndex] = useState(0);
  const [currentDel2Step, setCurrentDel2Step] = useState(
    iaQuestionGroups[iaGroupIndex],
  );
  const [groupIndex, setGroupIndex] = useState(0);

  const [polarChartImage, setPolarChartImage] = useState(null);

  const [dvaQuestions, setDvaQuestions] = useState([]);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [calculationResults, setCalculationResults] = useState({});

  const [categoryCompletionStatus, setCategoryCompletionStatus] = useState({});
  const [esgCategoryCompletionStatus, setEsgCategoryCompletionStatus] =
    useState({});
  const [totalCompletionPercentage, setTotalCompletionPercentage] = useState(0);

  // --- ALL EFFECT, MEMO, AND CALLBACK HOOKS DECLARED AFTER STATE HOOKS ---

  const saveImage = useCallback(async (imageDataUrl) => {
    if (!window.esgConfig) return;
    const { apiUrl, userId, nonce } = window.esgConfig;

    try {
      const response = await fetch(`${apiUrl}data/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'X-WP-Nonce': nonce,
        },
        body: imageDataUrl,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Serveren kunne ikke gemme billedet: ${errorText}`);
      }

      const result = await response.json();
      console.log('ESG-graf gemt via /data/ endpoint (text/plain):', result);
    } catch (err) {
      console.error('Kunne ikke gemme ESG-graf:', err);
    }
  }, []);

  const fetchAndSetCalculationResults = useCallback(async (companyId, year) => {
    if (!companyId || !year) return;
    try {
      const results = await fetchCalculationResultsFromApi(companyId, year);
      if (results) {
        setCalculationResults(results);
      }
    } catch (error) {
      console.error('Failed to fetch calculation results:', error);
    }
  }, []);

  useAutosave({
    answers,
    iaAnswers,
    iaQuestions,

    userCompanyId,
    currentYear,

    isLoggedIn,
    loadingQuestions,

    fetchAndSetCalculationResults,

    setIaAnswers,
  });

  useQuestionLoader({
    isLoggedIn,
    userCompanyId,
    currentYear,

    setLoadingQuestions,

    setDvaQuestions,
    setIaQuestions,

    setAnswers,
    setIaAnswers,

    fetchAndSetCalculationResults,

    handleLogout,
  });

  const navigateTo = (section, stepKey) => {
    console.log('navigateTo called:', { section, stepKey });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection(section);
    if (section === 'del1') {
      const groupIdx = questionGroups.indexOf(stepKey);
      if (groupIdx !== -1) {
        setGroupIndex(groupIdx);
        setCurrentDel1Step('stepDVA');
      } else {
        setCurrentDel1Step(stepKey);
      }
    } else if (section === 'del2') {
      const groupIdx = iaQuestionGroups.indexOf(stepKey);
      if (groupIdx !== -1) {
        setIaGroupIndex(groupIdx);
        setCurrentDel2Step(stepKey);
      } else {
        setCurrentDel2Step(stepKey);
      }
    }
  };

  const descriptions = {
    ...categoryDescriptions,
    ...questionDescriptions,
  };

  const memoizedCompletion = useMemo(() => {
    const calculatedCategoryCompletionStatus = {};
    questionGroups.forEach((groupKey) => {
      const questionsInGroup = dvaQuestions.filter(
        (q) => q.sub_category.label === groupKey,
      );
      const totalQuestions = questionsInGroup.length;
      if (totalQuestions === 0) {
        calculatedCategoryCompletionStatus[groupKey] = 0;
        return;
      }
      const answeredQuestions = questionsInGroup.filter(
        (q) => answers[q.id] !== undefined && answers[q.id] !== null,
      ).length;
      calculatedCategoryCompletionStatus[groupKey] =
        (answeredQuestions / totalQuestions) * 100;
    });

    const totalAnsweredCount = Object.values(
      calculatedCategoryCompletionStatus,
    ).filter((p) => p > 0).length;
    const totalQuestionGroups = questionGroups.length;
    const calculatedTotalCompletionPercentage =
      totalQuestionGroups > 0
        ? (totalAnsweredCount / totalQuestionGroups) * 100
        : 0;

    return {
      newCategoryCompletionStatus: calculatedCategoryCompletionStatus,
      newTotalCompletionPercentage: calculatedTotalCompletionPercentage,
    };
  }, [answers, dvaQuestions, questionGroups]);

  const newCategoryCompletionStatus =
    memoizedCompletion.newCategoryCompletionStatus;
  const newTotalCompletionPercentage =
    memoizedCompletion.newTotalCompletionPercentage;

  useEffect(() => {
    setCategoryCompletionStatus(newCategoryCompletionStatus);
    setTotalCompletionPercentage(newTotalCompletionPercentage);
  }, [newCategoryCompletionStatus, newTotalCompletionPercentage]); // ← Rettet!

  // --- HELPER FUNCTIONS DECLARED HERE ---

  const handleNextGroup = () => {
    if (groupIndex < questionGroups.length - 1) {
      setGroupIndex(groupIndex + 1);
    } else {
      setCurrentDel1Step('dvaResults');
    }
  };

  const handlePrevGroup = () => {
    if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
    } else {
      setCurrentDel1Step('dvaInfo');
    }
  };

  const handleNextIaGroup = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (iaGroupIndex < iaQuestionGroups.length - 1) {
      setIaGroupIndex(iaGroupIndex + 1);
      setCurrentDel2Step(iaQuestionGroups[iaGroupIndex + 1]);
    } else {
      setCurrentDel2Step('del2Results');
    }
  };

  const handlePrevIaGroup = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (iaGroupIndex > 0) {
      setIaGroupIndex(iaGroupIndex - 1);
      setCurrentDel2Step(iaQuestionGroups[iaGroupIndex - 1]);
    } else {
      setCurrentDel2Step('esgInfo');
    }
  };

  let activeGroup;
  if (activeSection === 'del1') {
    if (['intro', 'dvaResults', 'dvaInfo'].includes(currentDel1Step)) {
      activeGroup = currentDel1Step;
    } else {
      activeGroup = questionGroups[groupIndex];
    }
  } else if (activeSection === 'del2') {
    activeGroup = currentDel2Step;
  }

  const renderStep = () => {
    // console.log('DEBUG: renderStep - activeSection:', activeSection, 'currentDel1Step:', currentDel1Step, 'currentDel2Step:', currentDel2Step); // Removed debug log
    if (activeSection === 'del1') {
      switch (currentDel1Step) {
        case 'intro':
          return (
            <div className="esg-p-4">
              <h1 className="esg-text-3xl esg-font-bold esg-mb-8">
                Velkommen til Djurs Consults ESG-beregner
              </h1>
              <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-8">
                {/* Main Info Box */}
                <div className="md:esg-col-span-2 esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
                  <h2 className="esg-text-xl esg-font-bold esg-mb-4">
                    Sådan fungerer ESG-beregneren
                  </h2>
                  <p className="esg-text-gray-700">
                    ESGScore-beregneren er udviklet for at gøre arbejdet med ESG
                    konkret, målbart og sammenligneligt. I stedet for at basere
                    vurderinger på subjektive analyser eller brede fortællinger,
                    bygger beregningen på en struktureret metode, hvor hvert
                    spørgsmål og kriterium har en klar, dokumenterbar vægt.
                    <br></br>
                    <br></br>
                    Formålet er at skabe et retvisende billede af virksomhedens
                    bæredygtighedsindsats, uanset størrelse eller branche.
                    Beregneren tager højde for, at en mindre håndværksvirksomhed
                    og en stor industriproducent har vidt forskellige
                    forudsætninger – men begge kan arbejde systematisk med ESG
                    og forbedre sig over tid.
                    <br></br>
                    <br></br>
                    Den samlede ESG-score udregnes på baggrund af tre
                    hovedområder:
                    <br></br>
                    <br></br>E (Environment) – miljø og ressourceanvendelse (40
                    %)
                    <br></br>S (Social) – sociale forhold og medarbejdervilkår
                    (30 %)
                    <br></br>G (Governance) – ledelse og ansvarlig
                    forretningsskik (30 %)
                    <br></br>
                    <br></br>
                    Inden for hvert område vægtes en række underkategorier og
                    indikatorer, som tilsammen danner et objektivt billede af
                    virksomhedens indsats. Spørgsmålene er binære – ja eller nej
                    – så vurderingen bliver så faktuel som muligt. Ved at
                    kombinere kvantitative data med kvalitativ dokumentation
                    sikrer beregneren både troværdighed og gennemsigtighed.
                    <br></br>
                    <br></br>
                    Samtidig kan vægtningen justeres efter dobbelt væsentlighed,
                    så de mest relevante ESG-områder for den enkelte virksomhed
                    får størst betydning for scoren. Målet er ikke blot at give
                    en karakter, men at skabe et styringsværktøj, der hjælper
                    virksomheder med at prioritere deres bæredygtighedsindsats –
                    og dokumentere den på en måde, der kan forstås og genbruges
                    i rapportering, dialog med kunder og grøn finansiering.
                  </p>
                </div>
                {/* DVA Info Box */}
                <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
                  <h2 className="esg-text-xl esg-font-bold esg-mb-4">
                    Del 1: Dobbeltvæsentlighedsanalyse (DVA)
                  </h2>
                  <p className="esg-text-gray-700">
                    I første del af værktøjet identificeres de ESG-emner, der er
                    væsentlige for jeres virksomhed. Dette sker gennem en
                    analyse, der både tager højde for, hvordan jeres virksomhed
                    påvirker samfundet og miljøet
                    (virkningsvæsentlighedsperspektiv), og hvordan
                    bæredygtighedsforhold kan påvirke jeres økonomi (finansiel
                    væsentlighedsperspektiv).
                  </p>
                </div>
                {/* ESG Data Info Box */}
                <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
                  <h2 className="esg-text-xl esg-font-bold esg-mb-4">
                    Del 2: Initiativanalyse
                  </h2>
                  <p className="esg-text-gray-700">
                    Anden del fokuserer på indsamling af specifikke data baseret
                    på resultaterne fra DVA'en. Værktøjet hjælper med at
                    strukturere dataindsamlingen, så I kan måle og rapportere
                    jeres performance på de væsentligste områder. Dette danner
                    grundlaget for jeres bæredygtighedsrapport.
                  </p>
                </div>
              </div>
              <div className="esg-flex esg-justify-end esg-mt-8">
                <button
                  onClick={() => setCurrentDel1Step('dvaInfo')}
                  className="btn-primary"
                >
                  Start del 1
                </button>
              </div>
            </div>
          );
        case 'stepDVA':
          return (
            <StepDVA
              group={questionGroups[groupIndex]}
              onNext={handleNextGroup}
              onPrev={handlePrevGroup}
              isLast={groupIndex === questionGroups.length - 1}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              dvaQuestions={dvaQuestions}
            />
          );
        case 'dvaResults':
          return (
            <StepResultsDVA
              answers={answers}
              criteriaWeights={calculationResults.criteriaWeights}
              impactFinansielCounts={calculationResults.impactFinansielCounts}
              dvaQuestions={dvaQuestions}
              criterionColors={criterionColors}
              onNext={() => {
                setActiveSection('del2');
                setCurrentDel2Step('esgInfo');
              }}
              onPrev={() =>
                setCurrentDel1Step(questionGroups[questionGroups.length - 1])
              }
            />
          );
        case 'dvaInfo':
          return (
            <StepDVAInfo
              onNext={() => setCurrentDel1Step(questionGroups[0])}
              onPrev={() => setCurrentDel1Step('intro')}
            />
          );
        default:
          return (
            <StepDVA
              group={questionGroups[groupIndex]}
              onNext={handleNextGroup}
              onPrev={handlePrevGroup}
              isLast={groupIndex === questionGroups.length - 1}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              dvaQuestions={dvaQuestions}
            />
          );
      }
    } else if (activeSection === 'del2') {
      const currentIaGroup = iaQuestionGroups.includes(currentDel2Step)
        ? currentDel2Step
        : iaQuestionGroups[0];
      switch (currentDel2Step) {
        case 'esgInfo':
          return (
            <StepESGInfo
              onNext={() => setCurrentDel2Step(iaQuestionGroups[0])}
            />
          );
        case 'E1':
        case 'E2':
        case 'E3':
        case 'E4':
        case 'E5':
        case 'S1':
        case 'S2':
        case 'S3':
        case 'S4':
        case 'G1':
          return (
            <StepInitiativanalyse
              activeIaGroup={currentIaGroup}
              iaQuestions={iaQuestions}
              iaAnswers={iaAnswers}
              onIaAnswerChange={handleIaAnswerChange}
              onNext={handleNextIaGroup}
              onPrev={handlePrevIaGroup}
              isFirst={iaGroupIndex === 0}
              isLast={iaGroupIndex === iaQuestionGroups.length - 1}
              onShowResults={() => setCurrentDel2Step('del2Results')}
              categoryDescriptions={categoryDescriptions}
              polarBarChartData={calculationResults.polarBarChartData}
              totalScore={calculationResults.totalScore}
              esgLevel={calculationResults.esgLevel}
              criterionColors={criterionColors}
              marimekkoData={calculationResults.marimekkoData}
              companyId={userCompanyId}
              year={currentYear}
            />
          );
        case 'del2Results':
          return (
            <Del2Results
              finalScores={calculationResults.finalScores}
              totalScore={calculationResults.totalScore}
              indicatorPoints={calculationResults.indicatorPoints}
              maxScores={calculationResults.maxScores}
              esgLevel={calculationResults.esgLevel}
              polarBarChartData={calculationResults.polarBarChartData}
              criterionColors={criterionColors}
              onPrev={() =>
                setCurrentDel2Step(iaQuestionGroups[iaGroupIndex - 1])
              }
              onCapture={saveImage}
              onGeneratePdf={() => fetchPdfReport(userCompanyId, currentYear)} // New prop
            />
          );
        default:
          return (
            <StepInitiativanalyse
              activeIaGroup={currentIaGroup}
              iaQuestions={iaQuestions}
              iaAnswers={iaAnswers}
              onIaAnswerChange={handleIaAnswerChange}
              onNext={handleNextIaGroup}
              onPrev={handlePrevIaGroup}
              isFirst={iaGroupIndex === 0}
              isLast={iaGroupIndex === iaQuestionGroups.length - 1}
              onShowResults={() => setCurrentDel2Step('del2Results')}
            />
          );
      }
    }
    return null;
  };

  // --- CONDITIONAL RENDERING (AFTER ALL HOOKS AND HELPER FUNCTIONS) ---
  // This ensures all hooks are called unconditionally before any early returns.
  // The Header will always be rendered.
  let content;
  if (!isLoggedIn && showLandingPage) {
    content = <LandingPage onNavigateToLogin={handleNavigateToLogin} />;
  } else if (!isLoggedIn && !showLandingPage) {
    content = <Login onLoginSuccess={handleLoginSuccess} />;
  } else {
    let mainContent;
    if (activeView === 'dashboard') {
      mainContent = (
        <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg esg-p-4">
          <h1 className="esg-text-3xl esg-font-bold esg-mb-4">
            Velkommen til dit Dashboard
          </h1>
          <p className="esg-text-gray-700 esg-mb-6">
            Her kan du se en oversigt over dine ESG-data.
          </p>
          <YearlyChartsSection
            availableYears={availableYears}
            currentYear={currentYear}
            onSelectYear={setCurrentYear}
            calculationResults={calculationResults}
            criterionColors={criterionColors}
            iaQuestions={iaQuestions}
            answers={answers}
            dvaQuestions={dvaQuestions}
          />
        </div>
      );
    } else if (activeView === 'companyFigures') {
      mainContent = (
        <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg">
          <YearSelector
            availableYears={availableYears}
            currentYear={currentYear}
            onSelectYear={setCurrentYear}
            onAddNewYear={onAddNewYear}
            showAddYearInput={showAddYearInput}
            newYearValue={newYearValue}
            handleYearInputChange={handleYearInputChange}
            handleYearInputConfirm={handleYearInputConfirm}
            handleYearInputCancel={handleYearInputCancel}
            addYearError={addYearError}
          />
          <CompanyFigures currentYear={currentYear} />
        </div>
      );
    } else if (activeView === 'extendedModule') {
      mainContent = (
        <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg">
          <YearSelector
            availableYears={availableYears}
            currentYear={currentYear}
            onSelectYear={setCurrentYear}
            onAddNewYear={onAddNewYear}
            showAddYearInput={showAddYearInput}
            newYearValue={newYearValue}
            handleYearInputChange={handleYearInputChange}
            handleYearInputConfirm={handleYearInputConfirm}
            handleYearInputCancel={handleYearInputCancel}
            addYearError={addYearError}
          />
          <ExtendedModule currentYear={currentYear} />
        </div>
      );
    } else if (activeView === 'esgCalculator') {
      mainContent = (
        <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg">
          <ESGCalculatorNav
            availableYears={availableYears}
            currentYear={currentYear}
            onSelectYear={setCurrentYear}
            onAddNewYear={onAddNewYear}
            showAddYearInput={showAddYearInput}
            newYearValue={newYearValue}
            handleYearInputChange={handleYearInputChange}
            handleYearInputConfirm={handleYearInputConfirm}
            handleYearInputCancel={handleYearInputCancel}
            addYearError={addYearError}
            activeGroup={activeGroup}
            onNavigate={navigateTo}
            categoryCompletionStatus={categoryCompletionStatus}
            questionGroups={questionGroups}
            activeSection={activeSection}
          />
          <div className="esg-p-4">{renderStep()}</div>
        </div>
      );
    } else if (activeView === 'reportMeta') {
      mainContent = (
        <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg">
          <YearSelector
            availableYears={availableYears}
            currentYear={currentYear}
            onSelectYear={setCurrentYear}
            onAddNewYear={onAddNewYear}
            showAddYearInput={showAddYearInput}
            newYearValue={newYearValue}
            handleYearInputChange={handleYearInputChange}
            handleYearInputConfirm={handleYearInputConfirm}
            handleYearInputCancel={handleYearInputCancel}
            addYearError={addYearError}
          />
          <h1 className="esg-text-3xl esg-font-bold esg-mb-4">Metatekst</h1>
          <p className="esg-text-gray-700">
            Her kan du indtaste metatekst til din ESG-rapport for {currentYear}.
          </p>
          {/* TODO: Add Metatekst component here */}
        </div>
      );
    } else if (activeView === 'reportGenerate') {
      mainContent = (
        <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg">
          <YearSelector
            availableYears={availableYears}
            currentYear={currentYear}
            onSelectYear={setCurrentYear}
            onAddNewYear={onAddNewYear}
            showAddYearInput={showAddYearInput}
            newYearValue={newYearValue}
            handleYearInputChange={handleYearInputChange}
            handleYearInputConfirm={handleYearInputConfirm}
            handleYearInputCancel={handleYearInputCancel}
            addYearError={addYearError}
          />
          <h1 className="esg-text-3xl esg-font-bold esg-mb-4">
            Generer rapport
          </h1>
          <p className="esg-text-gray-700 esg-mb-6">
            Klik på knappen nedenfor for at generere din ESG-rapport som PDF for{' '}
            {currentYear}.
          </p>
          <button
            onClick={() => fetchPdfReport(userCompanyId, currentYear)}
            className="esg-bg-blue-600 hover:esg-bg-blue-700 esg-text-white esg-font-bold esg-py-2 esg-px-4 esg-rounded esg-transition-colors"
          >
            Generer PDF Rapport
          </button>
        </div>
      );
    }

    content = (
      <div className="esg-flex-grow esg-flex esg-relative">
        <DashboardSidebar
          isNavOpen={isNavOpen}
          onNavigate={handleMainNavigation}
          activeView={activeView}
          onSectionChange={setActiveSection}
        />
        {mainContent}
      </div>
    );
  }
  // --- END CONDITIONAL RENDERING ---

  // No isNavOpen or toggleNav for now. Will re-add after core functionality is stable.

  return (
    <div className="esg-min-h-screen esg-flex esg-flex-col esg-relative">
      {' '}
      {/* Added esg-relative to be positioning context */}
      {isLoggedIn ? (
        <DashboardHeader
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          newTotalCompletionPercentage={newTotalCompletionPercentage} // Pass completion percentage to dashboard header
          onToggleNav={toggleNav} // Pass toggle function
          userCompanyName={'Din Virksomhed'} // Placeholder for company name
          isNavOpen={isNavOpen} // Pass isNavOpen state
        />
      ) : (
        <div className="esg-absolute esg-top-0 esg-left-0 esg-right-0 esg-z-20">
          {' '}
          {/* Absolute positioning for front page header */}
          <div className="esg-max-w-7xl esg-mx-auto">
            {' '}
            {/* Wrapper for width and centering */}
            <Header
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              onNavigateToLogin={handleNavigateToLogin}
              onNavigateToHome={handleNavigateToHome}
            />
          </div>
        </div>
      )}
      {content}
    </div>
  );
}

export default App;
