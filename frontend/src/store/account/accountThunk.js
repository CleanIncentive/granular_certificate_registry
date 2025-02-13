import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAccountAPI,
  getAccountSummaryAPI,
  getAccountDevicesAPI,
  getAccountWhitelistInverseAPI,
} from "../../api/accountAPI";

// Thunk to fetch account details
export const getAccountDetails = createAsyncThunk(
  "account/getDetails",
  async (accountId, { rejectWithValue }) => {
    try {
      const accountResponse = await getAccountAPI(accountId);
      const accountSummaryResponse = await getAccountSummaryAPI(accountId);
      const devicesResponse = await getAccountDevicesAPI(accountId);
      const whiteListResponse = await getAccountWhitelistInverseAPI(accountId);

      const accountDetail = {
        ...accountResponse.data,
        summary: accountSummaryResponse.data,
        devices: devicesResponse.data,
        whiteListInverse: whiteListResponse.data,
      };

      return accountDetail;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
