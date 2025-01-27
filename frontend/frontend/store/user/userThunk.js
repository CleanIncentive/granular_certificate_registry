import { createAsyncThunk } from "@reduxjs/toolkit";
import { readUserAPI } from "../../api/userAPI";

export const readUser = createAsyncThunk(
  "user/readUser",
  async (userID, { rejectWithValue }) => {
    try {
      const response = await readUserAPI(userID);

      return {
        accounts: response?.data?.accounts || [],
        userInfo: {
          username: response?.data?.username,
          role: response?.data?.role,
          userID: userID,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
