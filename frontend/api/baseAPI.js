import axios from "axios";

// Define public routes (e.g., login, register)
const AUTH_LIST = ["/auth/login"];

// Create a reusable Axios instance
const baseAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  // timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (e.g., attach token)
baseAPI.interceptors.request.use(
  (config) => {
    // Check if the request URL is in the whitelist
    const isAuthRoute = AUTH_LIST.some((route) =>
      config.url.includes(route)
    );
    if (!isAuthRoute) {
      const token = document
        .cookie("access_token")
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

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
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // Optional: Redirect to login page or handle logout
    }
    return Promise.reject(error);
  }
);

export default baseAPI;
