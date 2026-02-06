// new-esg-app/src/api.js

const DJANGO_API_BASE_URL = 'http://127.0.0.1:8000/api/'; // Hardcoded for now
const TEST_COMPANY_ID = 1; // Placeholder until authentication and company context are implemented

/**
 * Fetches user data (answers) from the Django backend.
 * @returns {Promise<Object>} A promise that resolves to the user's saved data.
 */
export const fetchUserData = async () => {
  // This will eventually fetch answers linked to the authenticated user/company
  console.log("Fetching user data from Django API (placeholder for company_id: " + TEST_COMPANY_ID + ")");
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}user-answers/${TEST_COMPANY_ID}/`); // Custom endpoint for user answers
    if (!response.ok) {
        if (response.status === 404) {
            console.warn(`No existing user data found for company ${TEST_COMPANY_ID}. Returning empty answers.`);
            return { dvaAnswers: {}, iaAnswers: {} };
        }
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    // If fetching fails, return empty answers to prevent app crash
    return { dvaAnswers: {}, iaAnswers: {} };
  }
};

/**
 * Saves user data (answers) to the Django backend.
 * @param {Object} dataToSave The data to be saved (e.g., { dvaAnswers, iaAnswers }).
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const saveUserData = async (dataToSave) => {
  console.log("Saving user data to Django API (placeholder for company_id: " + TEST_COMPANY_ID + ")");
  console.log("Data being sent:", dataToSave); // Add this line
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}user-answers/${TEST_COMPANY_ID}/`, { // Custom endpoint for user answers
      method: 'PUT', // Assuming PUT for update/create, can be POST for create and PUT for update
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_id: TEST_COMPANY_ID, ...dataToSave }), // Spread dataToSave directly
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Fetches DVA questions from the Django DRF API.
 * @returns {Promise<Array>} A promise that resolves to an array of DVA questions.
 */
export const fetchDvaQuestionsFromApi = async () => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}questions/?question_type=DVA`);
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
    const response = await fetch(`${DJANGO_API_BASE_URL}questions/?question_type=IA`);
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

/**
 * Fetches calculation results from the Django DRF API.
 * @param {number} companyId The ID of the company to fetch results for.
 * @param {number} year The year for which to fetch results.
 * @returns {Promise<Object>} A promise that resolves to the calculated ESG results.
 */
export const fetchCalculationResultsFromApi = async (companyId, year) => {
  try {
    // Hardcode year for now as it's hardcoded in backend, will make dynamic later
    const response = await fetch(`${DJANGO_API_BASE_URL}calculation-results/${companyId}/?year=${year}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching calculation results:', error);
    throw error;
  }
};


