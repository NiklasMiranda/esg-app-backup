import Drawer from 'app/layout/Drawer';
import { categoryDescriptions, questionDescriptions } from 'data/descriptions';
import QuestionCard from 'features/esg-calculator/components/questionnaire/QuestionCard';
import { useMemo, useState } from 'react';
import AnswerRatioGraph from 'shared/components/charts/AnswerRatioGraph';
import CircularProgress from 'shared/components/charts/CircularProgress';
import InfoIcon from 'shared/components/ui/InfoIcon';
import Modal from 'shared/components/ui/Modal';

function StepDVA({
  group,
  onNext,
  onPrev,
  isLast,
  answers,
  onAnswerChange,
  dvaQuestions,
}) {
  console.log('DEBUG StepDVA: dvaQuestions prop:', dvaQuestions);
  console.log('DEBUG StepDVA: group prop:', group);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPosition, setModalPosition] = useState('center');
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [allOpenSections, setAllOpenSections] = useState({});

  const openSections = allOpenSections[group] || {
    impact: true,
    finansiel: true,
  };

  const toggleSection = (section) => {
    setAllOpenSections((prev) => {
      const currentGroupSections = prev[group] || {
        impact: true,
        finansiel: true,
      };
      return {
        ...prev,
        [group]: {
          ...currentGroupSections,
          [section]: !currentGroupSections[section],
        },
      };
    });
  };

  const allQuestionsForGroup = useMemo(() => {
    const filtered = dvaQuestions.filter((q) => q.sub_category.label === group);
    console.log('DEBUG StepDVA: allQuestionsForGroup:', filtered);
    return filtered;
  }, [group, dvaQuestions]);

  const { yesCount, noCount } = useMemo(() => {
    let yes = 0;
    let no = 0;
    const currentGroupQuestions = allQuestionsForGroup.map((q) => q.id);

    Object.entries(answers).forEach(([questionId, answer]) => {
      const numericQuestionId = Number(questionId);
      if (currentGroupQuestions.includes(numericQuestionId)) {
        if (answer === 'yes') {
          yes++;
        } else if (answer === 'no') {
          no++;
        }
      }
    });
    return { yesCount: yes, noCount: no };
  }, [answers, allQuestionsForGroup]);
  const impactQuestions = useMemo(() => {
    const filtered = allQuestionsForGroup.filter((q) => q.purpose === 'impact');
    console.log('DEBUG StepDVA: impactQuestions.length:', filtered.length);
    return filtered;
  }, [allQuestionsForGroup]);
  const finansielQuestions = useMemo(() => {
    const filtered = allQuestionsForGroup.filter(
      (q) => q.purpose === 'finansiel',
    );
    console.log('DEBUG StepDVA: finansielQuestions.length:', filtered.length);
    return filtered;
  }, [allQuestionsForGroup]);

  const categoryInfo = categoryDescriptions[group] || {};

  const categoryCompletion = useMemo(() => {
    const totalQuestions = allQuestionsForGroup.length;
    if (totalQuestions === 0) return 0;
    const answeredQuestions = allQuestionsForGroup.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] !== null,
    ).length;
    return (answeredQuestions / totalQuestions) * 100;
  }, [allQuestionsForGroup, answers]);

  const openModal = (content, title, position) => {
    setModalContent(content);
    setModalTitle(title);
    setModalPosition(position);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsCategoryDrawerOpen(false);
  };

  const handleCategoryInfoClick = () => {
    setIsCategoryDrawerOpen(true);
  };

  const handleQuestionInfoClick = (questionId) => {
    const adjustedQuestionId = questionId - 1000; // Adjust questionId to match keys in descriptions.js
    const questionInfo = questionDescriptions[adjustedQuestionId] || {};
    openModal(
      <div className="esg-flex esg-gap-4">
        <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-p-4 esg-rounded-lg">
          <h3 className="esg-font-bold">Information:</h3>
          <p>{questionInfo.description}</p>
        </div>
        <div className="esg-flex-1 esg-bg-[#f4f4f4] esg-p-4 esg-rounded-lg">
          <h3 className="esg-font-bold">Typiske brancher:</h3>
          <p>{questionInfo.typicalIndustry}</p>
        </div>
      </div>,
      'Spørgsmålsinformation',
      'question-center',
    );
  };

  const handleNextClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNext();
  };

  return (
    <div className="esg-flex esg-flex-col lg:esg-flex-row esg-gap-8">
      <div className="esg-w-full lg:esg-flex-[3]">
        <div className="esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md">
          <h1 className="esg-text-xl esg-font-bold esg-mb-6 esg-flex esg-items-center">
            {categoryInfo.title}
            <InfoIcon onClick={handleCategoryInfoClick} />
          </h1>
          <>
            {' '}
            {/* Start of React Fragment */}
            {impactQuestions.length > 0 && (
              <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg">
                <button
                  className="esg-flex esg-justify-between esg-items-center esg-w-full esg-p-4 esg-text-lg esg-font-bold esg-bg-gray-50 esg-rounded-t-lg focus:esg-outline-none"
                  onClick={() => toggleSection('impact')}
                >
                  <span>Virkningsvæsentlighed</span>
                  <svg
                    className={`esg-w-5 esg-h-5 esg-transition-transform esg-duration-300 ${
                      openSections.impact ? 'esg-rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div
                  className={`esg-overflow-hidden esg-transition-all esg-duration-500 esg-ease-in-out ${
                    openSections.impact
                      ? 'esg-max-h-[5000px] esg-opacity-100'
                      : 'esg-max-h-0 esg-opacity-0'
                  }`}
                >
                  <div className="esg-p-4 esg-grid esg-grid-cols-1 md:esg-grid-cols-2 xl:esg-grid-cols-3 esg-gap-6">
                    {impactQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="esg-flex esg-flex-col esg-items-start esg-h-full"
                      >
                        <QuestionCard
                          question={question}
                          answer={answers[question.id]}
                          onAnswerChange={onAnswerChange}
                          onInfoClick={() =>
                            handleQuestionInfoClick(question.id)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {finansielQuestions.length > 0 && (
              <div className="esg-mb-8 esg-border esg-border-gray-200 esg-rounded-lg">
                <button
                  className="esg-flex esg-justify-between esg-items-center esg-w-full esg-p-4 esg-text-lg esg-font-bold esg-bg-gray-50 esg-rounded-t-lg focus:esg-outline-none"
                  onClick={() => toggleSection('finansiel')}
                >
                  <span>Finansiel væsentlighed</span>
                  <svg
                    className={`esg-w-5 esg-h-5 esg-transition-transform esg-duration-300 ${
                      openSections.finansiel ? 'esg-rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div
                  className={`esg-overflow-hidden esg-transition-all esg-duration-500 esg-ease-in-out ${
                    openSections.finansiel
                      ? 'esg-max-h-[5000px] esg-opacity-100'
                      : 'esg-max-h-0 esg-opacity-0'
                  }`}
                >
                  <div className="esg-p-4 esg-grid esg-grid-cols-1 md:esg-grid-cols-2 xl:esg-grid-cols-3 esg-gap-6">
                    {finansielQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="esg-flex esg-flex-col esg-items-start esg-h-full"
                      >
                        <QuestionCard
                          question={question}
                          answer={answers[question.id]}
                          onAnswerChange={onAnswerChange}
                          onInfoClick={() =>
                            handleQuestionInfoClick(question.id)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>{' '}
          {/* End of React Fragment */}
        </div>
        <div className="esg-flex esg-justify-between esg-mt-8">
          <button onClick={onPrev} className="btn-secondary">
            Forrige
          </button>
          <button onClick={handleNextClick} className="btn-primary">
            Næste
          </button>
        </div>
      </div>
      <div className="esg-w-full lg:esg-flex-1 esg-sticky esg-top-2 esg-self-start lg:esg-pr-8">
        <div className="esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md esg-flex esg-flex-col esg-items-center esg-justify-center">
          <CircularProgress percentage={categoryCompletion} size={150} />
          <p className="esg-mt-4 esg-text-sm esg-text-gray-700 esg-text-center">
            Så langt er du nået med spørgsmålene til {categoryInfo.title}
          </p>
        </div>
        <div className="esg-bg-white esg-p-8 esg-rounded-lg esg-shadow-md esg-mt-8 esg-flex esg-flex-col esg-items-center esg-justify-center">
          <AnswerRatioGraph yesCount={yesCount} noCount={noCount} />
        </div>
      </div>
      <Drawer
        isOpen={isCategoryDrawerOpen}
        onClose={closeModal}
        title={categoryInfo.title}
      >
        <p>{categoryInfo.description}</p>
      </Drawer>
      <Modal isOpen={!!modalContent} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>{' '}
    </div>
  );
}

export default StepDVA;
