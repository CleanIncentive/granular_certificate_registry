import axios from "axios";
import Cookies from "js-cookie";

const AUTH_LIST = ["/auth/login"];
const CSRF_EXEMPT = ["/csrf-token"];

const baseAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const fetchCSRFToken = async () => {
  try {
    const response = await baseAPI.get("/csrf-token");
    return response.data.csrf_token;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    return null;
  }
};

baseAPI.interceptors.request.use(
  async (config) => {
    const isAuthRoute = AUTH_LIST.some((route) => config.url?.includes(route));
    const isCSRFExempt = CSRF_EXEMPT.some((route) =>
      config.url?.includes(route)
    );

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

    if (!isAuthRoute) {
      const token = Cookies.get("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Added Authorization header with token");
      } else {
        console.warn("No access token found for authenticated route");
      }
    }

    if (!isCSRFExempt && config.method !== "get") {
      const csrfToken = await fetchCSRFToken();
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
        console.log("Added CSRF token to request headers");
      } else {
        console.warn("No CSRF token available for non-GET request");
      }
    }
    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

baseAPI.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error("API Error:", error);

    // Check for a network error
    if (
      (error.code === "ERR_NETWORK" || !error.response) &&
      window.location.pathname !== "/login"
    ) {
      console.error("Network error detected. Redirecting to login.");
      // Redirect to login on network error
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle authentication errors (unauthorized)
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      console.error("Authentication error. Token may have expired. Redirecting to login.");
      // Clear the token cookie
      Cookies.remove("access_token", { path: "" });
      // Redirect to login page
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      error.response?.status === 403 &&
      error.response?.data?.detail?.includes("CSRF")
    ) {
      console.log("CSRF token error. Attempting to fetch a new token.");
      const newToken = await fetchCSRFToken();
      if (newToken && error.config) {
        console.log("Retrying request with new CSRF token");
        error.config.headers["X-CSRF-Token"] = newToken;
        return baseAPI(error.config);
      }
    }

    // Extract as much error information as possible
    const status = error.response?.status || 500;
    let message = "An unexpected error occurred.";
    let errorDetail = null;
    
    // Try to get detailed error message
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data.detail) {
        message = error.response.data.detail;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      }
      
      // Save the full error object for debugging
      errorDetail = error.response.data;
    } else if (error.message) {
      message = error.message;
    }

    console.error(`API Error: Status ${status}, Message: ${message}`);
    
    // For 500 errors, add more context to help debugging
    if (status === 500) {
      console.error("Server error details:", {
        url: error.config?.url,
        method: error.config?.method,
        errorObject: error,
        responseData: error.response?.data
      });
    }

    return Promise.reject({ status, message, errorDetail });
  }
);

fetchCSRFToken().catch(console.error);

export default baseAPI;
