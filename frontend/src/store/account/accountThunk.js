import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAccountAPI,
  getAccountDevicesAPI,
  getAccountWhitelistInverseAPI,
} from "../../api/accountAPI";
import Cookies from "js-cookie";

const saveAccountToCookie = (accountDetail) => {
  Cookies.set("account_detail", JSON.stringify(accountDetail), {
    expires: 7,
    path: "",
    secure: true,
  });
};

// Thunk to fetch account details
export const getAccountDetails = createAsyncThunk(
  "account/getDetails",
  async (accountId, { rejectWithValue }) => {
    try {
      const accountResponse = await getAccountAPI(accountId);
      const devicesResponse = await getAccountDevicesAPI(accountId);
      const whiteListResponse = await getAccountWhitelistInverseAPI(accountId);

      const accountDetail = {
        ...accountResponse.data,
        devices: devicesResponse.data,
        whiteListInverse: whiteListResponse.data,
      };

      saveAccountToCookie(accountDetail);

      return accountDetail;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
