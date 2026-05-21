import { useEffect } from 'react';

import {
  fetchDvaQuestionsFromApi,
  fetchIaQuestionsFromApi,
  fetchUserData,
} from '../../../api';

export default function useQuestionLoader({
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
}) {
  useEffect(() => {
    const loadAllData = async () => {
      if (!isLoggedIn || !userCompanyId) return;

      try {
        setLoadingQuestions(true);
        const [fetchedDvaQuestions, fetchedIaQuestionsRaw, userDataRaw] =
          await Promise.all([
            fetchDvaQuestionsFromApi(),
            fetchIaQuestionsFromApi(),
            fetchUserData(userCompanyId, currentYear),
          ]);
        // After fetching basic data, fetch calculation results
        await fetchAndSetCalculationResults(userCompanyId, currentYear);

        const filteredIaQuestions = fetchedIaQuestionsRaw.filter(
          (q) => q.question_type === 'IA',
        );
        setDvaQuestions(fetchedDvaQuestions);
        setIaQuestions(filteredIaQuestions);
        // console.log("DEBUG: filteredIaQuestions after setting iaQuestions:", filteredIaQuestions); // Removed debug log

        if (userDataRaw) {
          let processedIaAnswers = {};
          if (filteredIaQuestions.length > 0) {
            const validIaQuestionIds = new Set(
              filteredIaQuestions.map((q) => q.id.toString()),
            );
            processedIaAnswers = Object.fromEntries(
              Object.entries(userDataRaw.iaAnswers || {}).filter(
                ([questionId, answer]) =>
                  validIaQuestionIds.has(questionId) &&
                  answer &&
                  typeof answer === 'object' &&
                  answer.is_answered,
              ),
            );
          }
          if (userDataRaw.dvaAnswers) setAnswers(userDataRaw.dvaAnswers);
          setIaAnswers(processedIaAnswers);
        } else {
          setIaAnswers({});
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        if (error.message.includes('401')) {
          handleLogout();
        }
      } finally {
        setLoadingQuestions(false);
      }
    };
    loadAllData();
  }, [isLoggedIn, userCompanyId, currentYear]);
}
