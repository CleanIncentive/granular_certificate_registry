import { createAsyncThunk } from "@reduxjs/toolkit";
import { readUserAPI, readCurrentUserAPI, createUserAPI } from "../../api/userAPI";
import { saveDataToCookies } from "../../utils";
import Cookies from "js-cookie";

export const readUser = createAsyncThunk(
  "user/readUser",
  async (userID, { rejectWithValue }) => {
    try {
      const response = await readUserAPI(userID);
      const userData = {
        accounts: response?.data?.accounts || [],
        userInfo: {
          username: response?.data?.username,
          role: response?.data?.role,
          userID: userID,
          organisation: response?.data?.organisation,
          email: response?.data?.email,
        },
      };

      saveDataToCookies("user_data", JSON.stringify(userData));

      return userData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const readCurrentUser = createAsyncThunk(
  "user/readCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log("Fetching current user data from API");
      
      // Try to load cached user data if available
      const currentState = getState();
      const cachedUserData = currentState.user?.userInfo || null;
      
      const response = await readCurrentUserAPI();
      console.log("API response for current user:", response);

      if (!response.data) {
        console.error("No data returned from current user API");
        return rejectWithValue({ message: "No user data returned from API", status: 404 });
      }

      const userData = {
        accounts: response?.data?.accounts || [],
        userInfo: {
          username: response?.data?.name,
          role: response?.data?.role,
          userID: response?.data?.id,
          organisation: response?.data?.organisation,
          email: response?.data?.email,
        },
      };

      console.log("Processed user data:", userData);
      saveDataToCookies("user_data", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Error fetching current user:", error);
      
      // Check if this is an authorization error
      if (error.status === 401) {
        console.warn("User authentication expired or invalid. Redirecting to login.");
        // Ensure token cookie is removed
        Cookies.remove("access_token", { path: "" });
        // Return a specific error for auth issues
        return rejectWithValue({ 
          message: "Your session has expired. Please log in again.", 
          status: 401,
          isAuthError: true 
        });
      }
      
      // For server errors (500), try to recover with cached data
      if (error.status === 500) {
        console.warn("Server error when fetching user. Attempting to use cached data.");
        
        // Try to get user data from cookies
        const savedUserData = Cookies.get("user_data");
        if (savedUserData) {
          try {
            const parsedUserData = JSON.parse(savedUserData);
            console.log("Using cached user data:", parsedUserData);
            
            // Return cached data but also include error information
            return {
              ...parsedUserData,
              _error: {
                message: "Using cached data due to server error",
                originalError: error.message
              }
            };
          } catch (parseError) {
            console.error("Failed to parse cached user data:", parseError);
          }
        }
      }
      
      const message = error.message || "Failed to fetch user data";
      const status = error.status || 500;
      return rejectWithValue({ message, status });
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Creating user with data:", userData);
      
      // Prepare user data in the format expected by the backend
      const userToCreate = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        organisation: userData.organisation || null,
        password: userData.password
      };

      console.log("Sending user creation request to API:", userToCreate);
      const response = await createUserAPI(userToCreate);
      console.log("User creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      
      // Handle different error formats
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        "Failed to create user";
        
      const errorStatus = error.response?.status || 500;
      
      console.error(`User creation failed: ${errorMessage} (${errorStatus})`);
      
      return rejectWithValue({
        message: errorMessage,
        status: errorStatus
      });
    }
  }
);
