import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAccountAPI, getAccountDevicesAPI, getAccountWhitelistAPI } from "../../api/accountAPI";

// Thunk to fetch account details
export const getAccountDetails = createAsyncThunk(
  "account/getDetails",
  async (accountId, { rejectWithValue }) => {
    try {
      const accountResponse = await getAccountAPI(accountId);
      const devicesResponse = await getAccountDevicesAPI(accountId);
      const whiteListResponse = await getAccountWhitelistAPI(accountId)

      return {
        ...accountResponse.data,
        devices: devicesResponse.data,
        whiteList: whiteListResponse.data
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
