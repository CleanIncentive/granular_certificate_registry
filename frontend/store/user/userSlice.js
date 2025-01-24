import { createSlice } from "@reduxjs/toolkit";
import { readUser } from "./userThunk";

const userSlice = createSlice({
  name: "user",
  initialState: {
    accounts: [],
    selectedAccount: null,
    userInfo: {
      username: null,
      role: null,
      userID: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.accounts = [];
      state.selectedAccount = null;
      state.userInfo = {
        username: null,
        role: null,
        userID: null,
      };
      state.error = null;
    },
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(readUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.accounts;
        state.userInfo = action.payload.userInfo;
        if (action.payload.accounts.length > 0) {
          state.selectedAccount = action.payload.accounts[0];
        }
      })
      .addCase(readUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.accounts = [];
        state.selectedAccount = null;
        state.userInfo = {
          username: null,
          role: null,
          userID: null,
        };
      });
  },
});

export const { clearUser, setSelectedAccount } = userSlice.actions;
export default userSlice.reducer;
