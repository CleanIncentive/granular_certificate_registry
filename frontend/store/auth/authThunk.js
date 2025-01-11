import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, logoutAPI } from "../../api/authAPI";

// Save token to cookie
const saveTokenToCookie = (token) => {
  document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
};

// Remove token from cookie
const removeTokenFromCookie = () => {
  document.cookie = "access_token=; path=/; max-age=0";
};

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      const { token, user } = response.data;

      saveTokenToCookie(token);
      
      return user;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  removeTokenFromCookie();
});
