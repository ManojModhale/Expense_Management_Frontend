import axios from "axios";

const API_BASE_URL = "http://localhost:8181/api";

export const addExpense = async (username, expenseform) => {
  try{
    const response = await axios.post(`${API_BASE_URL}/employee/addexpense/${username}`, expenseform);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to add expense';
  }
};

export const getExpensesByEmployee = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employee/expensesByUsername/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch expenses';
  }
};

export const getExpensesByManager = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/manager/expensesByUsername/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch expenses';
  }
};