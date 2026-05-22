import { DJANGO_API_BASE_URL, createAuthHeader } from 'shared/api/client';

/**
 * Fetches user data (answers) from the Django backend.
 * @param {number} companyId The ID of the company to fetch data for.
 * @param {number} year The year for which to fetch data.
 * @returns {Promise<Object>} A promise that resolves to the user's saved data.
 */
export const fetchUserData = async (companyId, year) => {
  try {
    const response = await fetch(
      `${DJANGO_API_BASE_URL}user-answers/${companyId}/${year}/`,
      {
        headers: createAuthHeader(),
      },
    );
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(
          `No existing user data found for company ${companyId} and year ${year}. Returning empty answers.`,
        );
        return { dvaAnswers: {}, iaAnswers: {} };
      }
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { dvaAnswers: {}, iaAnswers: {} };
  }
};

/**
 * Saves user data (answers) to the Django backend.
 * @param {number} companyId The ID of the company to save data for.
 * @param {number} year The year for which to save data.
 * @param {Object} dataToSave The data to be saved (e.g., { dvaAnswers, iaAnswers }).
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const saveUserData = async (companyId, year, dataToSave) => {
  try {
    const requestBody = JSON.stringify({
      company_id: companyId,
      ...dataToSave,
    });
    const response = await fetch(
      `${DJANGO_API_BASE_URL}user-answers/${companyId}/${year}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...createAuthHeader(),
        },
        body: requestBody,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Network response was not ok: ${response.statusText} - ${errorText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};
