import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:8000/api/v1/auth';

const apiClient = axios.create({
  baseURL: AUTH_BASE_URL,
});

export const loginUser = (credentials) => {
  return apiClient.post('/token/', credentials);
};

export const registerUser = (userData) => {
  return apiClient.post('/register/', userData);
};

// You could also add logic here to handle token refresh
// or to automatically add the auth token to headers for
// other API requests.