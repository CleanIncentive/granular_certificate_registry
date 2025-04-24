import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAccountAPI,
  getAccountSummaryAPI,
  getAccountDevicesAPI,
  getAccountWhitelistInverseAPI,
  getAccountCertificatesDevicesAPI,
} from "../../api/accountAPI";

// Thunk to fetch account details
export const getAccountDetails = createAsyncThunk(
  "account/getDetails",
  async (accountId, { rejectWithValue }) => {
    try {
      console.log(`Fetching details for account ID: ${accountId}`);
      
      // Use allSettled instead of all to prevent one failure from failing everything
      const [
        accountResponse,
        accountSummaryResponse,
        devicesResponse,
        certificatesDevicesResponse,
        whiteListResponse,
      ] = await Promise.allSettled([
        getAccountAPI(accountId),
        getAccountSummaryAPI(accountId),
        getAccountDevicesAPI(accountId),
        getAccountCertificatesDevicesAPI(accountId),
        getAccountWhitelistInverseAPI(accountId),
      ]);

      // Check for any failures and log them
      const failures = [];
      if (accountResponse.status === 'rejected') {
        console.error("Failed to fetch account details:", accountResponse.reason);
        failures.push("account details");
      }
      if (accountSummaryResponse.status === 'rejected') {
        console.error("Failed to fetch account summary:", accountSummaryResponse.reason);
        failures.push("account summary");
      }
      if (devicesResponse.status === 'rejected') {
        console.error("Failed to fetch devices:", devicesResponse.reason);
        failures.push("devices");
      }
      if (certificatesDevicesResponse.status === 'rejected') {
        console.error("Failed to fetch certificate devices:", certificatesDevicesResponse.reason);
        failures.push("certificate devices");
      }
      if (whiteListResponse.status === 'rejected') {
        console.error("Failed to fetch whitelist:", whiteListResponse.reason);
        failures.push("whitelist");
      }

      // If basic account details failed, we can't continue
      if (accountResponse.status === 'rejected') {
        throw new Error("Failed to load essential account information.");
      }

      // Continue with available data
      const accountDetail = {
        detail: {
          ...accountResponse.value.data,
          devices: devicesResponse.status === 'fulfilled' ? devicesResponse.value.data : [],
          certificateDevices: certificatesDevicesResponse.status === 'fulfilled' 
            ? certificatesDevicesResponse.value.data 
            : [],
          whiteListInverse: whiteListResponse.status === 'fulfilled' 
            ? whiteListResponse.value.data 
            : [],
        },
        summary: accountSummaryResponse.status === 'fulfilled' 
          ? accountSummaryResponse.value.data 
          : {},
      };

      // Add warnings about missing data
      if (failures.length > 0) {
        accountDetail._warnings = {
          message: `Some account data could not be loaded: ${failures.join(", ")}`,
          missingData: failures
        };
      }

      return accountDetail;
    } catch (error) {
      console.error("Failed to fetch account details:", error);
      return rejectWithValue({
        message: error.message || "Failed to load account details",
        status: error.response?.status || 500,
        error: error
      });
    }
  }
);
