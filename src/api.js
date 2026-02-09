// new-esg-app/src/api.js

const DJANGO_API_BASE_URL = 'http://127.0.0.1:8000/api/';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Helper to create authorization header
const createAuthHeader = () => {
  const token = getAuthToken();
  console.log('createAuthHeader: Retrieved Token:', token); // More descriptive log
  const headers = token ? { 'Authorization': `Token ${token}` } : {};
  console.log('createAuthHeader: Generated Headers:', headers); // Log the full headers object
  return headers;
};

/**
 * Logs in a user and stores the authentication token.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} The user data including token.
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}token-auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.non_field_errors || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    // Assuming the backend also sends user info or company_id upon login
    // For now, we'll return the token and assume companyId is handled elsewhere
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Logs out a user and removes the authentication token.
 */
export const logoutUser = async () => {
  const token = getAuthToken(); // Get token before the fetch
  // Check for falsy values (null, undefined, '')
  if (!token || token === '') {
    console.log('No valid authentication token found. Already logged out or token missing.');
    localStorage.removeItem('authToken'); // Ensure it's cleared locally
    return; // Exit without making a backend call
  }

  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}logout/`, {
      method: 'POST',
      headers: createAuthHeader(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Logout failed: ${response.statusText} - ${errorText}`);
    }

    localStorage.removeItem('authToken');
    console.log('Successfully logged out.');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Fetches user data (answers) from the Django backend.
 * @param {number} companyId The ID of the company to fetch data for.
 * @param {number} year The year for which to fetch data.
 * @returns {Promise<Object>} A promise that resolves to the user's saved data.
 */
export const fetchUserData = async (companyId, year) => {
  console.log(`Fetching user data from Django API for company ${companyId}, year ${year}`);
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}user-answers/${companyId}/${year}/`, {
      headers: createAuthHeader(),
    });
    if (!response.ok) {
        if (response.status === 404) {
            console.warn(`No existing user data found for company ${companyId} and year ${year}. Returning empty answers.`);
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
  console.log(`Saving user data to Django API for company ${companyId}, year ${year}`);
  console.log("Data being sent:", dataToSave);
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}user-answers/${companyId}/${year}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeader(),
      },
      body: JSON.stringify({ company_id: companyId, ...dataToSave }),
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
    const response = await fetch(`${DJANGO_API_BASE_URL}questions/?question_type=DVA`, {
      headers: createAuthHeader(),
    });
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
    const response = await fetch(`${DJANGO_API_BASE_URL}questions/?question_type=IA`, {
      headers: createAuthHeader(),
    });
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
    const response = await fetch(`${DJANGO_API_BASE_URL}calculation-results/${companyId}/${year}/`, {
      headers: createAuthHeader(),
    });
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
 * Fetches a PDF report from the Django backend and triggers a download.
 * @param {number} companyId The ID of the company for which to generate the report.
 * @param {number} year The year for which to generate the report.
 * @returns {Promise<void>}
 */
export const fetchPdfReport = async (companyId, year) => {
  try {
    const response = await fetch(`${DJANGO_API_BASE_URL}pdf-report/${companyId}/${year}/`, {
      headers: createAuthHeader(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate PDF report: ${response.statusText} - ${errorText}`);
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

    console.log('PDF report downloaded successfully.');

  } catch (error) {
    console.error('Error fetching PDF report:', error);
    throw error;
  }
};