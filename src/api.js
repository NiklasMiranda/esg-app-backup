// new-esg-app/src/api.js

/**
 * Fetches user data from the WordPress backend.
 * @returns {Promise<Object>} A promise that resolves to the user's saved data.
 */
export const fetchUserData = async () => {
  const { userId, nonce, apiUrl } = window.esgConfig || {};

  if (!userId || !apiUrl) {
    // If no user is logged in or config is missing, we can't fetch data.
    console.log("User not logged in or API config missing. Cannot fetch data.");
    return Promise.resolve(null);
  }

  try {
    const response = await fetch(`${apiUrl}data/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Let the component handle the error state
  }
};

/**
 * Saves user data to the WordPress backend.
 * @param {Object} dataToSave The data to be saved (e.g., { dvaAnswers, iaAnswers }).
 * @returns {Promise<Object>} A promise that resolves to the server's response.
 */
export const saveUserData = async (dataToSave) => {
  const { userId, nonce, apiUrl } = window.esgConfig || {};

  if (!userId || !apiUrl) {
    // If no user is logged in or config is missing, we can't save data.
    console.log("User not logged in or API config missing. Cannot save data.");
    return Promise.resolve(null);
  }

  try {
    const response = await fetch(`${apiUrl}data/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
      },
      body: JSON.stringify(dataToSave),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error; // Let the component handle the error state
  }
};
