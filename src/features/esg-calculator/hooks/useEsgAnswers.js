import { useCallback, useState } from 'react';
import { saveUserData } from '../../../api';

export default function useEsgAnswers({
  iaQuestions,
  userCompanyId,
  currentYear,
}) {
  const [answers, setAnswers] = useState(() => {
    try {
      const savedAnswers = localStorage.getItem('esgAppAnswers');

      return savedAnswers ? JSON.parse(savedAnswers) : {};
    } catch (error) {
      console.error('Error parsing saved answers from localStorage:', error);

      return {};
    }
  });

  const [iaAnswers, setIaAnswers] = useState({});

  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  }, []);

  const handleIaAnswerChange = useCallback(
    async (questionId, isSelected, updatedAnswerObject = null) => {
      const isValidIaQuestion = iaQuestions.some(
        (q) => q.id.toString() === questionId.toString(),
      );

      if (!isValidIaQuestion) {
        console.warn(
          `Attempted to change answer for non-IA question ID: ${questionId}. Ignoring.`,
        );
        return;
      }

      // Update local state first
      let newIaAnswers;
      setIaAnswers((prevIaAnswers) => {
        const updated = { ...prevIaAnswers };
        if (updatedAnswerObject) {
          updated[questionId] = updatedAnswerObject;
        } else if (isSelected) {
          updated[questionId] = {
            is_answered: true,
            metric_value: prevIaAnswers[questionId]?.metric_value || '',
          };
        } else {
          delete updated[questionId];
        }
        newIaAnswers = updated;
        return updated;
      });

      // Immediate save to get the ID if it's a new checkmark
      if (isSelected && !updatedAnswerObject) {
        try {
          const dataToSave = {
            dvaAnswers: answers,
            iaAnswers: newIaAnswers,
          };
          const savedData = await saveUserData(
            userCompanyId,
            currentYear,
            dataToSave,
          );
          if (
            savedData &&
            savedData.iaAnswers &&
            savedData.iaAnswers[questionId]
          ) {
            setIaAnswers((prev) => ({
              ...prev,
              [questionId]: {
                ...prev[questionId],
                answer_id: savedData.iaAnswers[questionId].answer_id,
              },
            }));
          }
        } catch (error) {
          console.error('Failed to save IA answer immediately:', error);
        }
      }
    },
    [iaQuestions, answers, userCompanyId, currentYear],
  );

  return {
    answers,
    setAnswers,

    iaAnswers,
    setIaAnswers,

    handleAnswerChange,
    handleIaAnswerChange,
  };
}
