import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCertificatesAPI } from "../../api/certificateAPI";

export const fetchCertificates = createAsyncThunk(
  "certificates/fetchCertificates",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetchCertificatesAPI(_);

      return response?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
