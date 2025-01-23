import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCertificatesAPI,
  transferCertificateAPI,
  cancelCertificateAPI,
} from "../../api/certificateAPI";

export const fetchCertificates = createAsyncThunk(
  "certificates/fetchCertificates",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetchCertificatesAPI(_);

      console.log("fetchCertificates thunk headers:", response?.headers);
      console.log("fetchCertificates thunk data:", response?.data);

      return response?.data;
    } catch (error) {
      console.log("QUERY ERROR", error);
      return error;
      // return rejectWithValue(error);
    }
  }
);

export const transferCertificates = createAsyncThunk(
  "certificates/transferCertificates",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await transferCertificateAPI(_);

      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
      // return rejectWithValue(error);
    }
  }
);

export const cancelCertificates = createAsyncThunk(
  "certificates/cancelCertificates",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await cancelCertificateAPI(_);

      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
      // return rejectWithValue(error);
    }
  }
);
