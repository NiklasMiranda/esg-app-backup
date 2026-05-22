import { DJANGO_API_BASE_URL, createAuthHeader } from 'shared/api/client';

/**
 * Fetches calculation results from the Django DRF API.
 * @param {number} companyId The ID of the company to fetch results for.
 * @param {number} year The year for which to fetch results.
 * @returns {Promise<Object>} A promise that resolves to the calculated ESG results.
 */
export const fetchCalculationResultsFromApi = async (companyId, year) => {
  try {
    const response = await fetch(
      `${DJANGO_API_BASE_URL}calculation-results/${companyId}/${year}/`,
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
    console.error('Error fetching calculation results:', error);
    throw error;
  }
};
