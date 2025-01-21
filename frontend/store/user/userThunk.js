import { createAsyncThunk } from "@reduxjs/toolkit";
import { readUserAPI } from "../../api/userAPI";

export const readUser = createAsyncThunk("user/readUser", async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await readUserAPI();
    console.log(response)
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
