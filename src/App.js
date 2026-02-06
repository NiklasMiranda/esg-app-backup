import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Navigation from './components/Navigation';
import StepDVA from './components/StepDVA';
import StepResultsDVA from './components/StepResultsDVA';
import StepInitiativanalyse from './components/StepInitiativanalyse';
import Del2Results from './components/Del2Results';
import CircularProgress from './components/CircularProgress';
import StepDVAInfo from './components/StepDVAInfo';
import { categoryDescriptions, questionDescriptions } from './data/descriptions';
import StepESGInfo from './components/StepESGInfo';
import { fetchUserData, saveUserData, fetchDvaQuestionsFromApi, fetchIaQuestionsFromApi, fetchCalculationResultsFromApi } from './api';

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
    // const chartRef = useRef(null); // No longer needed here
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
    const [polarChartImage, setPolarChartImage] = useState(null); // State for a gemme graf-billede

    // State for questions fetched from API
    const [dvaQuestions, setDvaQuestions] = useState([]);
    const [iaQuestions, setIaQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    // State for calculation results fetched from API
    const [calculationResults, setCalculationResults] = useState({});

    // Funktion til at POSTe billedet til WordPress 
    const saveImage = useCallback(async (imageDataUrl) => {
      if (!window.esgConfig) return;
      const { apiUrl, userId, nonce } = window.esgConfig;

      try {
        const response = await fetch(`${apiUrl}data/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain', // Send som plain text, ikke JSON
            'X-WP-Nonce': nonce,
          },
          body: imageDataUrl, // Send den rå base64 string direkte
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
    }, []); // Empty dependency array as it only uses window scope
    const [categoryCompletionStatus, setCategoryCompletionStatus] = useState({});
    const [esgCategoryCompletionStatus, setEsgCategoryCompletionStatus] = useState({});
    const [totalCompletionPercentage, setTotalCompletionPercentage] = useState(0);

    // Fetch questions and user data on component mount
    useEffect(() => {
      const loadAllData = async () => {
        try {
          setLoadingQuestions(true);
          const [fetchedDvaQuestions, fetchedIaQuestions, userData, fetchedCalculationResults] = await Promise.all([
            fetchDvaQuestionsFromApi(),
            fetchIaQuestionsFromApi(),
            fetchUserData(), // Use the updated fetchUserData
            fetchCalculationResultsFromApi(1, 2026) // companyId=1, year=2026 (hardcoded for now)
          ]);
          setDvaQuestions(fetchedDvaQuestions);
          setIaQuestions(fetchedIaQuestions);
          if (userData) {
            if (userData.dvaAnswers) setAnswers(userData.dvaAnswers);
            if (userData.iaAnswers) setIaAnswers(userData.iaAnswers);
          }
          if (fetchedCalculationResults) {
            setCalculationResults(fetchedCalculationResults);
          }
        } catch (error) {
          console.error("Failed to load initial data:", error);
        } finally {
          setLoadingQuestions(false);
        }
      };
      loadAllData();
    }, []); // Empty dependency array means this runs once on mount

    // Save answers to backend when they change
    useEffect(() => {
        const handler = setTimeout(async () => {
            try {
                // Combine all relevant data to save
                const dataToSave = {
                    dvaAnswers: answers,
                    iaAnswers: iaAnswers,
                };
                await saveUserData(dataToSave);
                console.log('User data (answers) saved successfully!');
            } catch (error) {
                console.error("Failed to save user data:", error);
            }
        }, 1000); // Debounce by 1 second

        return () => {
            clearTimeout(handler);
        };
    }, [answers, iaAnswers, saveUserData]);
    
    // const iaQuestions = useMemo(() => importedIaQuestions, []); // Removed
    // const dvaQuestions = useMemo(() => importedDvaQuestions, []); // Removed
    const descriptions = {
      ...categoryDescriptions,
      ...questionDescriptions,
    };

    const { newCategoryCompletionStatus, newTotalCompletionPercentage } = useMemo(() => {
        const calculatedCategoryCompletionStatus = {};
        questionGroups.forEach(groupKey => {
            const questionsInGroup = dvaQuestions.filter(q => q.label === groupKey);
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

    // Update state variables based on useMemo results
    useEffect(() => {
        setCategoryCompletionStatus(newCategoryCompletionStatus);
        setTotalCompletionPercentage(newTotalCompletionPercentage);
    }, [newCategoryCompletionStatus, newTotalCompletionPercentage]);

    const handleAnswerChange = (questionId, answer) => {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionId]: answer,
      }));
    };

    const handleIaAnswerChange = (questionId, isSelected) => {
      setIaAnswers(prevIaAnswers => ({
        ...prevIaAnswers,
        [questionId]: isSelected,
      }));
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

    const renderStep = () => {
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
          return <Del2Results finalScores={calculationResults.finalScores} totalScore={calculationResults.totalScore} indicatorPoints={calculationResults.indicatorPoints} maxScores={calculationResults.maxScores} esgLevel={calculationResults.esgLevel} polarBarChartData={calculationResults.polarBarChartData} criterionColors={criterionColors} onPrev={() => setCurrentDel2Step(iaQuestionGroups[iaQuestionGroups.length - 1])} onCapture={saveImage} />;
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

  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="esg-bg-[#0b3954] esg-min-h-screen esg-flex esg-flex-col esg-pb-4">
      <div className="esg-bg-[#0b3954] esg-p-2 esg-flex-shrink-0">
        <div className="esg-flex esg-justify-between esg-items-center esg-mb-4 md:esg-hidden">
          <h1 className="esg-text-xl esg-font-bold">ESG App</h1>
          <div className="esg-flex esg-items-center">
            <CircularProgress percentage={newTotalCompletionPercentage} />
            <button onClick={toggleNav} className="esg-text-gray-800 focus:esg-outline-none esg-ml-4">
              <svg className="esg-h-6 esg-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isNavOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin={"round"} strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="esg-flex-grow esg-flex">
        <div className={`navigation-wrapper md:esg-w-1/4 lg:esg-w-1/5 esg-bg-[#0b3954] ${isNavOpen ? 'esg-block' : 'esg-hidden md:esg-block'}`}>
          <Navigation activeGroup={activeGroup} onNavigate={navigateTo} categoryCompletionStatus={categoryCompletionStatus} esgCategoryCompletionStatus={esgCategoryCompletionStatus} activeSection={activeSection} onSectionChange={setActiveSection} iaQuestions={iaQuestions} questionGroups={questionGroups} iaQuestionGroups={iaQuestionGroups} />
        </div>

        <div className="esg-flex-1 esg-p-4 esg-bg-[#f4f4f4] esg-rounded-lg">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default App;