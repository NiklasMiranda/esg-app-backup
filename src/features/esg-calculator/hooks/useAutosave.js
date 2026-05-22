import { useEffect, useRef } from 'react';

import { saveUserData } from '../../../api';

export default function useAutosave({
  answers,
  iaAnswers,
  iaQuestions,

  userCompanyId,
  currentYear,

  isLoggedIn,
  loadingQuestions,

  fetchAndSetCalculationResults,

  setIaAnswers,
}) {
  const isUpdatingFromServer = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !userCompanyId || loadingQuestions) return;

    if (isUpdatingFromServer.current) return;

    const handler = setTimeout(async () => {
      try {
        const validIaQuestionIds = new Set(
          iaQuestions.map((q) => q.id.toString()),
        );

        const filteredIaAnswers = Object.fromEntries(
          Object.entries(iaAnswers).filter(
            ([questionId, answer]) =>
              validIaQuestionIds.has(questionId) &&
              answer &&
              typeof answer === 'object' &&
              answer.is_answered,
          ),
        );

        const dataToSave = {
          dvaAnswers: answers,
          iaAnswers: filteredIaAnswers,
        };

        const savedData = await saveUserData(
          userCompanyId,
          currentYear,
          dataToSave,
        );

        if (savedData && savedData.iaAnswers) {
          isUpdatingFromServer.current = true;
          setIaAnswers((prev) => {
            const updated = { ...prev };

            Object.keys(savedData.iaAnswers).forEach((qid) => {
              updated[qid] = {
                ...updated[qid],
                answer_id: savedData.iaAnswers[qid].answer_id,
                documents: savedData.iaAnswers[qid].documents,
              };
            });

            return updated;
          });

          setTimeout(() => {
            isUpdatingFromServer.current = false;
          }, 0);
        }

        // await fetchAndSetCalculationResults(userCompanyId, currentYear);
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [
    answers,
    iaAnswers,
    iaQuestions,
    userCompanyId,
    currentYear,
    isLoggedIn,
    loadingQuestions,
    fetchAndSetCalculationResults,
    setIaAnswers,
  ]);
}
