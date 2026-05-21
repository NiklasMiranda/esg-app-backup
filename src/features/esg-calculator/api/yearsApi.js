import { DJANGO_API_BASE_URL, createAuthHeader } from 'shared/api/client';

/**
 * Fetches a list of years for which a company has saved data.
 * @param {number} companyId The ID of the company to fetch available years for.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of years.
 */
export const fetchAvailableYears = async (companyId) => {
  try {
    const response = await fetch(
      `${DJANGO_API_BASE_URL}company-data/available-years/${companyId}/`,
      {
        headers: createAuthHeader(),
      },
    );
    if (!response.ok) {
      // If 404, it means no data exists for any year, return an empty array
      if (response.status === 404) {
        console.warn(`No available years found for company ${companyId}.`);
        return [];
      }
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json();
    // Assuming data is an array of numbers (years)
    return data;
  } catch (error) {
    console.error('Error fetching available years:', error);
    throw error;
  }
};

/**
 * Creates an empty CompanyBasismodulData entry for a given company and year.
 * This is used to persist a newly added year in the backend even if no answers are immediately provided.
 * @param {number} companyId The ID of the company.
 * @param {number} year The year for which to create the entry.
 * @returns {Promise<Object>} A promise that resolves to the created/updated data.
 */
export const createEmptyCompanyBasismodulData = async (companyId, year) => {
  try {
    const response = await fetch(
      `${DJANGO_API_BASE_URL}company-basismodul-data/${companyId}/${year}/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...createAuthHeader(),
        },
        body: JSON.stringify({ company: companyId, year: year }), // Minimal data needed for update_or_create
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
    console.error('Error creating empty Basismodul data:', error);
    throw error;
  }
};
