import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import certificateReducer from "./certificates/certificateSlice";
import errorReducer from "./error/errorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Auth state
    certificates: certificateReducer, // Certificate state
    error: errorReducer, // Error state
  },
});
