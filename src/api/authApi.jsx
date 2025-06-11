// authApi.js

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const signupApi = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const signinApi = async (credentials) => {
  const response = await axios.post(`${API_URL}/signin`, credentials);
  return response.data;
};
