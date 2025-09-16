// authApi.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// === Signup API ===
export const signupApi = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// === Signin API ===
export const signinApi = async (credentials) => {
  const response = await axios.post(`${API_URL}/signin`, credentials);
  return response.data;
};

// === Forgot Password API ===
export const forgotPasswordApi = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

// === Reset Password API ===
export const resetPasswordApi = async (token, password) => {
  const response = await axios.post(`${API_URL}/reset-password`, { token, password });
  return response.data;
};
