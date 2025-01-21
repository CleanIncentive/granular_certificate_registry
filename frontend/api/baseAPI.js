import axios from "axios";
import Cookies from "js-cookie";

// Define public routes (e.g., login, register)
const AUTH_LIST = ["/auth/login"];

// Create a reusable Axios instance
const baseAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  // timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include HttpOnly cookies
});

// Add a request interceptor (e.g., attach token)
baseAPI.interceptors.request.use(
  (config) => {
    // Check if the request URL is in the whitelist
    const isAuthRoute = AUTH_LIST.some((route) => config.url.includes(route));
    if (!isAuthRoute) {
      const token = Cookies.get("access_token"); // Assuming the token is saved as 'authToken'

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor (e.g., global error handling)
baseAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.detail || "An unexpected error occurred.";

    if (status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }

    return Promise.reject({ status, message }); // Standardized error
  }
);

export default baseAPI;
