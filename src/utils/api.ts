import axios from 'axios';

const API_BASE_URL = 'http://your-backend-url.com/api'; // Replace with actual backend URL

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  flatNumber: string;
}

interface LoginResponse {
  flatNumber: string;
}

export const apiLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Mock response for now
  return new Promise((resolve) => {
    setTimeout(() => resolve({ flatNumber: 'A-101' }), 500);
  });
  // Uncomment for actual API call
  // const response = await axios.post(`${API_BASE_URL}/login`, credentials);
  // return response.data;
};

export const apiRegister = async (data: RegisterData): Promise<{ success: boolean }> => {
  // Mock response for now
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
  // Uncomment for actual API call
  // const response = await axios.post(`${API_BASE_URL}/register`, data);
  // return response.data;
};