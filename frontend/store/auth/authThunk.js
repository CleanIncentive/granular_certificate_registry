import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, logoutAPI } from "../../api/authAPI";

// Save token to cookie
const saveTokenToCookie = (access_token) => {
  document.cookie = `access_token=${access_token}; path=/; max-age=${
    7 * 24 * 60 * 60
  }; secure; samesite=strict`;
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
      const { access_token } = response.data;
      saveTokenToCookie(access_token);

      return user;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk("auth/logout", async () => {
  removeTokenFromCookie();
});
