import axios from "axios";
import { auth } from "./firebase"; // Import your Firebase auth instance

// Create a new Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Your backend URL from .env.local
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Get the current user from Firebase Auth
    const user = auth.currentUser;

    if (user) {
      // If the user is logged in, get their ID token
      const token = await user.getIdToken();
      // Set the Authorization header for the request
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default api;
