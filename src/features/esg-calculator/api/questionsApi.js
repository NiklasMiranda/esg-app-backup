import { DJANGO_API_BASE_URL, createAuthHeader } from 'shared/api/client';

/**
 * Fetches DVA questions from the Django DRF API.
 * @returns {Promise<Array>} A promise that resolves to an array of DVA questions.
 */
export const fetchDvaQuestionsFromApi = async () => {
  try {
    const response = await fetch(
      `${DJANGO_API_BASE_URL}questions/?question_type=DVA`,
      {
        headers: createAuthHeader(),
      },
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching DVA questions:', error);
    throw error;
  }
};

/**
 * Fetches IA questions from the Django DRF API.
 * @returns {Promise<Array>} A promise that resolves to an array of IA questions.
 */
export const fetchIaQuestionsFromApi = async () => {
  try {
    const response = await fetch(
      `${DJANGO_API_BASE_URL}questions/?question_type=IA`,
      {
        headers: createAuthHeader(),
      },
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching IA questions:', error);
    throw error;
  }
};
