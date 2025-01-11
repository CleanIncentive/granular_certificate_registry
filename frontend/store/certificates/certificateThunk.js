import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCertificatesAPI } from "../../api/certificateAPIAPI";

export const fetchCertificates = createAsyncThunk("certificates/fetchCertificates", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchCertificatesAPI();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
