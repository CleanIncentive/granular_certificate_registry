import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCertificatesAPI,
  transferCertificateAPI,
  cancelCertificateAPI,
} from "../../api/certificateAPI";

export const fetchCertificates = createAsyncThunk(
  "certificates/fetchCertificates",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetchCertificatesAPI(params);
      return response?.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const transferCertificates = createAsyncThunk(
  "certificates/transferCertificates",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const response = await transferCertificateAPI(params);
      return response?.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const cancelCertificates = createAsyncThunk(
  "certificates/cancelCertificates",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const response = await cancelCertificateAPI(params);
      return response?.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);
