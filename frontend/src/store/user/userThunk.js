import { createAsyncThunk } from "@reduxjs/toolkit";
import { readUserAPI, readCurrentUserAPI } from "../../api/userAPI";
import { saveDataToCookies } from "../../utils";

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
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching current user data from API");
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
      const message = error.message || "Failed to fetch user data";
      const status = error.status || 500;
      return rejectWithValue({ message, status });
    }
  }
);
