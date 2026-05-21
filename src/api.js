import { DJANGO_API_BASE_URL, createAuthHeader } from 'shared/api/client';

export {
  DJANGO_API_BASE_URL,
  createAuthHeader,
  getAuthToken,
} from 'shared/api/client';

export { loginUser, logoutUser } from './features/auth/api/authApi';

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
 * Fetches a PDF report from the Django backend and triggers a download.
 * @param {number} companyId The ID of the company for which to generate the report.
 * @param {number} year The year for which to generate the report.
 * @returns {Promise<void>}
 */
export const fetchPdfReport = async (companyId, year) => {
  try {
    const response = await fetch(
      `${DJANGO_API_BASE_URL}pdf-report/${companyId}/${year}/`,
      {
        headers: createAuthHeader(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to generate PDF report: ${response.statusText} - ${errorText}`,
      );
    }

    // Get the filename from the Content-Disposition header, if available
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `ESG_Report_${companyId}_${year}.pdf`; // Default filename
    if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
      filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
    }

    // Get the blob from the response
    const blob = await response.blob();

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Set the download filename
    document.body.appendChild(a);
    a.click(); // Programmatically click the link to trigger download

    // Clean up: remove the link and revoke the blob URL
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error fetching PDF report:', error);
    throw error;
  }
};

/**
 * Uploads a document to the backend.
 * @param {FormData} formData - Should contain 'file', 'company', 'year', 'topic'.
 * @returns {Promise<Object>}
 */
export const uploadDocument = async (formData) => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}documents/`, {
      method: 'POST',
      headers: {
        ...createAuthHeader(),
        // Note: Don't set Content-Type, fetch will set it with boundary for FormData
      },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Fetches documents with optional filtering.
 */
export const fetchDocuments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}documents/?${query}`, {
      headers: createAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch documents');
    return await response.json();
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

/**
 * Maps/links documents to an answer.
 */
export const mapDocumentsToAnswer = async (answerId, documentIds) => {
  try {
    const response = await fetch(
      `${DJANGO_API_BASE_URL}answers/${answerId}/map-documents/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...createAuthHeader(),
        },
        body: JSON.stringify({ document_ids: documentIds }),
      },
    );
    if (!response.ok) throw new Error('Failed to map documents');
    return await response.json();
  } catch (error) {
    console.error('Error mapping documents:', error);
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
