import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAccountAPI, getAccountDevicesAPI } from "../../api/accountAPI";

// Thunk to fetch account details
export const getAccountDetails = createAsyncThunk(
  "account/getDetails",
  async (accountId, { rejectWithValue }) => {
    try {
      const accountResponse = await getAccountAPI(accountId);
      const devicesResponse = await getAccountDevicesAPI(accountId);

      return {
        ...accountResponse.data,
        devices: devicesResponse.data,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
