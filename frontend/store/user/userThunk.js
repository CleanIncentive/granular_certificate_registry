import { createAsyncThunk } from "@reduxjs/toolkit";
import { readUserAPI } from "../../api/userAPI";
import Cookies from "js-cookie";

const saveDataToCookies = (data) => {
  Cookies.set("user_data", data);
};

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
        },
      };

      saveDataToCookies(JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
