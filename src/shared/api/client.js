export const DJANGO_API_BASE_URL = 'http://127.0.0.1:8000/api/';

export const getAuthToken = () => localStorage.getItem('authToken');

export const createAuthHeader = () => {
  const token = getAuthToken();

  return token ? { Authorization: `Token ${token}` } : {};
};
