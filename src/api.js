import { DJANGO_API_BASE_URL, createAuthHeader } from 'shared/api/client';

export {
  DJANGO_API_BASE_URL,
  createAuthHeader,
  getAuthToken,
} from 'shared/api/client';

export { loginUser, logoutUser } from 'features/auth/api/authApi';

export {
  fetchUserData,
  saveUserData,
} from 'features/esg-calculator/api/answersApi';

export {
  fetchDvaQuestionsFromApi,
  fetchIaQuestionsFromApi,
} from 'features/esg-calculator/api/questionsApi';

export { fetchCalculationResultsFromApi } from 'features/esg-calculator/api/calculationsApi';

export {
  createEmptyCompanyBasismodulData,
  fetchAvailableYears,
} from 'features/esg-calculator/api/yearsApi';

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
