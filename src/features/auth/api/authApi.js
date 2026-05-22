import {
  DJANGO_API_BASE_URL,
  createAuthHeader,
  getAuthToken,
} from 'shared/api/client';

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
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
