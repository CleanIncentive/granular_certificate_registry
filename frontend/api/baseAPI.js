import axios from "axios";

// Create a reusable Axios instance
const baseAPI = axios.create({
  baseURL: process.env.REGISTRY_API_URL || "http://localhost:8000",
  timeout: 10000,                     // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (e.g., attach token)
baseAPI.interceptors.request.use(
  (config) => {
    const token = document.cookie("access_token")
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
