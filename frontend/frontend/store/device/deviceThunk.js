import { createAsyncThunk } from "@reduxjs/toolkit";
import { createDeviceAPI } from "../../api/deviceAPI";

export const createDevice = createAsyncThunk("device/createDevice", async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await createDeviceAPI();
    console.log(response)
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
