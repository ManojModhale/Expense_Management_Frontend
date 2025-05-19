// src/services/authService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data; 
  } catch (error) {
    // Throw an error to be handled by the caller
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, { username, password });
    return response.data; // Return the response data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const verifyUserForForgotPassword = async (username, email, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/verify-forgotpass-user`, {
      username,
      email,
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const resetPassword = async (username, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/reset-password`, {
      username,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};


