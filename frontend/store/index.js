import { configureStore } from "@reduxjs/toolkit";
import certificateReducer from "../features/certificates/certificateSlice";

export const store = configureStore({
  reducer: {
    products: certificateReducer // Certificate state
  },
});
