import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import certificateReducer from "./certificates/certificateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // auth state
    certificates: certificateReducer // Certificate state
  },
});
