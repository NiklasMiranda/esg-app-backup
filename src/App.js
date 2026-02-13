import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ESGCalculatorNav from './components/ESGCalculatorNav';
import StepDVA from './components/StepDVA';
import StepResultsDVA from './components/StepResultsDVA';
import StepInitiativanalyse from './components/StepInitiativanalyse';
import Del2Results from './components/Del2Results';
import CircularProgress from './components/CircularProgress';
import StepDVAInfo from './components/StepDVAInfo';
import { categoryDescriptions, questionDescriptions } from './data/descriptions';
import StepESGInfo from './components/StepESGInfo';
import { fetchUserData, saveUserData, fetchDvaQuestionsFromApi, fetchIaQuestionsFromApi, fetchCalculationResultsFromApi, logoutUser, fetchPdfReport } from './api';
import Login from './components/Login'; // Import the Login component
import LandingPage from './components/LandingPage'; // Import the LandingPage component
import Header from './components/Header'; // Import the Header component
import DashboardHeader from './components/DashboardHeader'; // Import the DashboardHeader component
import DashboardSidebar from './components/DashboardSidebar'; // Import the DashboardSidebar component
import CompanyFigures from './components/CompanyFigures'; // Import the CompanyFigures component
import ExtendedModule from './components/ExtendedModule'; // Import the ExtendedModule component

const questionGroups = ['E1', 'E2', 'E3', 'E4', 'E5', 'S1', 'S2', 'S3', 'S4', 'G1'];
const iaQuestionGroups = ['E1', 'E2', 'E3', 'E4', 'E5', 'S1', 'S2', 'S3', 'S4', 'G1'];

const criterionColors = {
  E1: '#565e39', 
  E2: '#6c7d47', 
  E3: '#7f8c6f', 
  E4: '#9fad86', 
  E5: '#cde2b4',
  S1: '#631528', 
  S2: '#7c132c', 
  S3: '#9e1240', 
  S4: '#ce4a73', 
  G1: '#0b3954', 
};

const categoryPercentages = {
  E: 40,
  S: 30,
  G: 30,
};



function App() {
    // --- ALL STATE HOOKS DECLARED FIRST AND UNCONDITIONALLY ---
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
    const [userCompanyId, setUserCompanyId] = useState(null);
    const [currentYear, setCurrentYear] = useState(2026);
    const [showLandingPage, setShowLandingPage] = useState(true);

    const [currentDel1Step, setCurrentDel1Step] = useState('intro');
    const [iaGroupIndex, setIaGroupIndex] = useState(0);
    const [currentDel2Step, setCurrentDel2Step] = useState(iaQuestionGroups[iaGroupIndex]);
    const [activeSection, setActiveSection] = useState('del1');
    const [groupIndex, setGroupIndex] = useState(0);
    const [answers, setAnswers] = useState(() => {
      try {
        const savedAnswers = localStorage.getItem('esgAppAnswers');
        return savedAnswers ? JSON.parse(savedAnswers) : {};
      } catch (error) {
        console.error("Error parsing saved answers from localStorage:", error);
        return {};
      }
    });
    const [iaAnswers, setIaAnswers] = useState({});
    const [polarChartImage, setPolarChartImage] = useState(null);

    const [dvaQuestions, setDvaQuestions] = useState([]);
    const [iaQuestions, setIaQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [calculationResults, setCalculationResults] = useState({});

    const [categoryCompletionStatus, setCategoryCompletionStatus] = useState({});
    const [esgCategoryCompletionStatus, setEsgCategoryCompletionStatus] = useState({});
    const [totalCompletionPercentage, setTotalCompletionPercentage] = useState(0);
    const [isNavOpen, setIsNavOpen] = useState(true); // State to control sidebar visibility
    const [activeView, setActiveView] = useState('dashboard'); // New state for main content view

    // --- ALL EFFECT, MEMO, AND CALLBACK HOOKS DECLARED AFTER STATE HOOKS ---

    // Callback to toggle sidebar visibility
    const toggleNav = useCallback(() => setIsNavOpen(prev => !prev), []);

    const handleMainNavigation = useCallback((view) => {
      setActiveView(view);
      // If navigating to ESG Calculator, set activeSection to 'del1' as default
      if (view === 'esgCalculator') {
        setActiveSection('del1');
      }
      // Optionally close the sidebar after navigation on smaller screens
      // setIsNavOpen(false);
    }, [setActiveSection]);

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

    useEffect(() => {
      if (isLoggedIn && !userCompanyId) {
        setUserCompanyId(1);
        setShowLandingPage(false); // If already logged in, skip landing page
      }
    }, [isLoggedIn, userCompanyId]);


    useEffect(() => {
      const loadAllData = async () => {
        if (!isLoggedIn || !userCompanyId) return;

        try {
          setLoadingQuestions(true);
          const [fetchedDvaQuestions, fetchedIaQuestionsRaw, userDataRaw, fetchedCalculationResults] = await Promise.all([
            fetchDvaQuestionsFromApi(),
            fetchIaQuestionsFromApi(),
            fetchUserData(userCompanyId, currentYear),
            fetchCalculationResultsFromApi(userCompanyId, currentYear)
          ]);

          const filteredIaQuestions = fetchedIaQuestionsRaw.filter(q => q.question_type === 'IA');
          setDvaQuestions(fetchedDvaQuestions);
          setIaQuestions(filteredIaQuestions);
          // console.log("DEBUG: filteredIaQuestions after setting iaQuestions:", filteredIaQuestions); // Removed debug log

          if (userDataRaw) {
            let processedIaAnswers = {};
            if (filteredIaQuestions.length > 0) {
                const validIaQuestionIds = new Set(filteredIaQuestions.map(q => q.id.toString()));
                processedIaAnswers = Object.fromEntries(
                    Object.entries(userDataRaw.iaAnswers || {}).filter(([questionId, answer]) =>
                        validIaQuestionIds.has(questionId) &&
                        answer && typeof answer === 'object' && answer.is_answered
                    )
                );
            }
            if (userDataRaw.dvaAnswers) setAnswers(userDataRaw.dvaAnswers);
            setIaAnswers(processedIaAnswers);
          } else {
            setIaAnswers({});
          }
          if (fetchedCalculationResults) {
            setCalculationResults(fetchedCalculationResults);
          }
        } catch (error) {
          console.error("Failed to load initial data:", error);
          if (error.message.includes('401')) {
            handleLogout();
          }
        } finally {
          setLoadingQuestions(false);
        }
      };
      loadAllData();
    }, [isLoggedIn, userCompanyId, currentYear]);

    useEffect(() => {
        if (!isLoggedIn || !userCompanyId || loadingQuestions) return;

        const handler = setTimeout(async () => {
            try {
                // console.log("DEBUG: iaQuestions at save time:", iaQuestions); // Removed debug log

                const validIaQuestionIds = new Set(iaQuestions.map(q => q.id.toString()));
                // console.log("DEBUG: validIaQuestionIds at save time:", Array.from(validIaQuestionIds)); // Removed debug log
                const filteredIaAnswers = Object.fromEntries(
                    Object.entries(iaAnswers).filter(([questionId, answer]) =>
                        validIaQuestionIds.has(questionId) &&
                        answer && typeof answer === 'object' && answer.is_answered
                    )
                );

                const dataToSave = {
                    dvaAnswers: answers,
                    iaAnswers: filteredIaAnswers,
                };
                // console.log("DEBUG: iaAnswers state before saveUserData:", iaAnswers); // Removed debug log
                // console.log("DEBUG: filteredIaAnswers being sent:", filteredIaAnswers); // Removed debug log
                // console.log("DEBUG App.js: saveUserData triggered with dataToSave:", dataToSave); // Removed debug log

                const saveResponse = await saveUserData(userCompanyId, currentYear, dataToSave);
                // console.log('DEBUG App.js: saveUserData response:', saveResponse); // Removed debug log
                // console.log('User data (answers) saved successfully!'); // Removed debug log
            } catch (error) {
                console.error("Failed to save user data:", error);
            }
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [answers, iaAnswers, iaQuestions, saveUserData, userCompanyId, currentYear, isLoggedIn, loadingQuestions]);
    
    const descriptions = {
      ...categoryDescriptions,
      ...questionDescriptions,
    };

    const memoizedCompletion = useMemo(() => {
        const calculatedCategoryCompletionStatus = {};
        questionGroups.forEach(groupKey => {
            const questionsInGroup = dvaQuestions.filter(q => q.sub_category.label === groupKey);
            const totalQuestions = questionsInGroup.length;
            if (totalQuestions === 0) {
                calculatedCategoryCompletionStatus[groupKey] = 0;
                return;
            }
            const answeredQuestions = questionsInGroup.filter(q => answers[q.id] !== undefined && answers[q.id] !== null).length;
            calculatedCategoryCompletionStatus[groupKey] = (answeredQuestions / totalQuestions) * 100;
        });

        const totalAnsweredCount = Object.values(calculatedCategoryCompletionStatus).filter(p => p > 0).length;
        const totalQuestionGroups = questionGroups.length;
        const calculatedTotalCompletionPercentage = totalQuestionGroups > 0 ? (totalAnsweredCount / totalQuestionGroups) * 100 : 0;

        return { newCategoryCompletionStatus: calculatedCategoryCompletionStatus, newTotalCompletionPercentage: calculatedTotalCompletionPercentage };
    }, [answers, dvaQuestions, questionGroups]);

    const newCategoryCompletionStatus = memoizedCompletion.newCategoryCompletionStatus;
    const newTotalCompletionPercentage = memoizedCompletion.newTotalCompletionPercentage;

    useEffect(() => {
      setCategoryCompletionStatus(newCategoryCompletionStatus);
      setTotalCompletionPercentage(newTotalCompletionPercentage);
  }, [newCategoryCompletionStatus, newTotalCompletionPercentage]); // ← Rettet!

    // --- HELPER FUNCTIONS DECLARED HERE ---
    const handleAnswerChange = (questionId, answer) => {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: answer,
      }));
    };

    const handleIaAnswerChange = (questionId, isSelected) => {
      // console.log("DEBUG: handleIaAnswerChange called for questionId:", questionId, "with isSelected:", isSelected, "and iaQuestions from scope:", iaQuestions); // Removed debug log

      const isValidIaQuestion = iaQuestions.some(q => q.id.toString() === questionId.toString());

      if (!isValidIaQuestion) {
        console.warn(`Attempted to change answer for non-IA question ID: ${questionId}. Ignoring.`);
        return;
      }

      setIaAnswers(prevIaAnswers => {
        const newIaAnswers = { ...prevIaAnswers };
        if (isSelected) {
          newIaAnswers[questionId] = {
            is_answered: true,
            metric_value: prevIaAnswers[questionId]?.metric_value || '',
          };
        } else {
          delete newIaAnswers[questionId];
        }
        return newIaAnswers;
      });
    };

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
      }
      else {
        setCurrentDel2Step('esgInfo');
      }
    };

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

    const handleLoginSuccess = (token, companyId) => {
      setIsLoggedIn(true);
      setUserCompanyId(companyId);
      setShowLandingPage(false); // Hide landing page on successful login
    };

    const handleLogout = async () => {
      try {
        await logoutUser();
        setIsLoggedIn(false);
        setUserCompanyId(null);
        setAnswers({}); // Clear answers on logout
        setIaAnswers({}); // Clear IA answers on logout
        setCalculationResults({}); // Clear calculation results
        setShowLandingPage(true); // Go back to landing page after logout
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    const handleNavigateToLogin = () => {
      setShowLandingPage(false); // Transition from landing page to login form
    };

    const handleNavigateToHome = () => {
      setShowLandingPage(true); // Go to the landing page
      setIsLoggedIn(false); // Ensure not logged in state
      setUserCompanyId(null); // Clear user company ID
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
                <h1 className="esg-text-3xl esg-font-bold esg-mb-8">Velkommen til Djurs Consults ESG-beregner</h1>
                <div className="esg-grid esg-grid-cols-1 md:esg-grid-cols-2 esg-gap-8">
                  {/* Main Info Box */}
                  <div className="md:esg-col-span-2 esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
                    <h2 className="esg-text-xl esg-font-bold esg-mb-4">Sådan fungerer ESG-beregneren</h2>
                    <p className="esg-text-gray-700">
                      ESGScore-beregneren er udviklet for at gøre arbejdet med ESG konkret, målbart og sammenligneligt. 
                      I stedet for at basere vurderinger på subjektive analyser eller brede fortællinger, 
                      bygger beregningen på en struktureret metode, hvor hvert spørgsmål og kriterium har en klar, dokumenterbar vægt.
                      <br></br><br></br>
                      Formålet er at skabe et retvisende billede af virksomhedens bæredygtighedsindsats, 
                      uanset størrelse eller branche. Beregneren tager højde for, at en mindre håndværksvirksomhed 
                      og en stor industriproducent har vidt forskellige forudsætninger – men begge kan arbejde systematisk med ESG 
                      og forbedre sig over tid.
                      <br></br><br></br>            
                      Den samlede ESG-score udregnes på baggrund af tre hovedområder:
                      <br></br><br></br>
                      E (Environment) – miljø og ressourceanvendelse (40 %)
                      <br></br>
                      S (Social) – sociale forhold og medarbejdervilkår (30 %)
                      <br></br>
                      G (Governance) – ledelse og ansvarlig forretningsskik (30 %)
                      <br></br><br></br>
                      Inden for hvert område vægtes en række underkategorier og indikatorer, 
                      som tilsammen danner et objektivt billede af virksomhedens indsats. 
                      Spørgsmålene er binære – ja eller nej – så vurderingen bliver så faktuel som muligt.                      
                      Ved at kombinere kvantitative data med kvalitativ dokumentation sikrer beregneren både troværdighed og gennemsigtighed.
                      <br></br><br></br>
                      Samtidig kan vægtningen justeres efter dobbelt væsentlighed, 
                      så de mest relevante ESG-områder for den enkelte virksomhed får størst betydning for scoren.
                      Målet er ikke blot at give en karakter, men at skabe et styringsværktøj, der hjælper virksomheder med at prioritere deres bæredygtighedsindsats – og dokumentere den på en måde, der kan forstås og genbruges i rapportering, dialog med kunder og grøn finansiering.
                    </p>
                  </div>
                  {/* DVA Info Box */}
                  <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
                    <h2 className="esg-text-xl esg-font-bold esg-mb-4">Del 1: Dobbeltvæsentlighedsanalyse (DVA)</h2>
                    <p className="esg-text-gray-700">
                      I første del af værktøjet identificeres de ESG-emner, der er væsentlige for jeres virksomhed. Dette sker gennem en analyse, der både tager højde for, hvordan jeres virksomhed påvirker samfundet og miljøet (virkningsvæsentlighedsperspektiv), og hvordan bæredygtighedsforhold kan påvirke jeres økonomi (finansiel væsentlighedsperspektiv).
                    </p>
                  </div>
                  {/* ESG Data Info Box */}
                  <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
                    <h2 className="esg-text-xl esg-font-bold esg-mb-4">Del 2: Initiativanalyse</h2>
                    <p className="esg-text-gray-700">
                      Anden del fokuserer på indsamling af specifikke data baseret på resultaterne fra DVA'en. Værktøjet hjælper med at strukturere dataindsamlingen, så I kan måle og rapportere jeres performance på de væsentligste områder. Dette danner grundlaget for jeres bæredygtighedsrapport.
                    </p>
                  </div>
                </div>
                <div className="esg-flex esg-justify-end esg-mt-8">
                  <button onClick={() => setCurrentDel1Step('dvaInfo')} className="btn-primary">
                    Start del 1
                  </button>
                </div>
              </div>
            );
          case 'stepDVA':          return (
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
          return <StepResultsDVA answers={answers} criteriaWeights={calculationResults.criteriaWeights} impactFinansielCounts={calculationResults.impactFinansielCounts} dvaQuestions={dvaQuestions} criterionColors={criterionColors} onNext={() => {
            setActiveSection('del2');
            setCurrentDel2Step('esgInfo');
          }} onPrev={() => setCurrentDel1Step(questionGroups[questionGroups.length - 1])} />;
        case 'dvaInfo':
          return <StepDVAInfo onNext={() => setCurrentDel1Step(questionGroups[0])} onPrev={() => setCurrentDel1Step('intro')} />;
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
      const currentIaGroup = iaQuestionGroups.includes(currentDel2Step) ? currentDel2Step : iaQuestionGroups[0];
      switch (currentDel2Step) {
        case 'esgInfo':
          return <StepESGInfo onNext={() => setCurrentDel2Step(iaQuestionGroups[0])} />;
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
          return <StepInitiativanalyse
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
          />;
        case 'del2Results':
          return <Del2Results
            finalScores={calculationResults.finalScores}
            totalScore={calculationResults.totalScore}
            indicatorPoints={calculationResults.indicatorPoints}
            maxScores={calculationResults.maxScores}
            esgLevel={calculationResults.esgLevel}
            polarBarChartData={calculationResults.polarBarChartData}
            criterionColors={criterionColors}
            onPrev={() => setCurrentDel2Step(iaQuestionGroups[iaGroupIndex - 1])}
            onCapture={saveImage}
            onGeneratePdf={() => fetchPdfReport(userCompanyId, currentYear)} // New prop
          />;
        default:
          return <StepInitiativanalyse
            activeIaGroup={currentIaGroup}
            iaQuestions={iaQuestions}
            iaAnswers={iaAnswers}
            onIaAnswerChange={handleIaAnswerChange}
            onNext={handleNextIaGroup}
            onPrev={handlePrevIaGroup}
            isFirst={iaGroupIndex === 0}
            isLast={iaGroupIndex === iaQuestionGroups.length - 1}
            onShowResults={() => setCurrentDel2Step('del2Results')}
          />;
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
            <h1 className="esg-text-3xl esg-font-bold esg-mb-4">Velkommen til dit Dashboard</h1>
            <p className="esg-text-gray-700">Her kan du se en oversigt over dine ESG-data.</p>
          </div>
        );
      } else if (activeView === 'companyFigures') {
        mainContent = (
          <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg">
            <CompanyFigures />
          </div>
        );
      } else if (activeView === 'extendedModule') {
        mainContent = (
          <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg">
            <ExtendedModule />
          </div>
        );
      } else if (activeView === 'esgCalculator') {
        mainContent = (
          <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-rounded-lg">
            <ESGCalculatorNav
              availableYears={[2024, 2025, 2026]}
              currentYear={currentYear}
              onSelectYear={setCurrentYear}
              onAddNewYear={() => console.log('Add new year')}
              activeGroup={activeGroup}
              onNavigate={navigateTo}
              categoryCompletionStatus={categoryCompletionStatus}
              questionGroups={questionGroups}
              activeSection={activeSection}
            />
            <div className="esg-p-4">
              {renderStep()}
            </div>
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
      <div className="esg-min-h-screen esg-flex esg-flex-col esg-relative"> {/* Added esg-relative to be positioning context */}
        {isLoggedIn ? (
          <DashboardHeader
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            newTotalCompletionPercentage={newTotalCompletionPercentage} // Pass completion percentage to dashboard header
            onToggleNav={toggleNav} // Pass toggle function
            userCompanyName={"Din Virksomhed"} // Placeholder for company name
            isNavOpen={isNavOpen} // Pass isNavOpen state
          />
        ) : (
          <div className="esg-absolute esg-top-0 esg-left-0 esg-right-0 esg-z-20"> {/* Absolute positioning for front page header */}
            <div className="esg-max-w-7xl esg-mx-auto"> {/* Wrapper for width and centering */}
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

  };

  

  export default App;