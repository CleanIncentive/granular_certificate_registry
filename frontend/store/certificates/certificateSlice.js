import { createSlice } from "@reduxjs/toolkit";
import { fetchCertificates } from "./certificateThunk";

const certificateSlice = createSlice({
  name: "certificates",
  initialState: {
    certificates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        if (action.code === "ERR_BAD_REQUEST" && action.status === 422) {
          state.certificates = [];
          state.error = action.error.message;
        } else {
          state.certificates = action.payload.granular_certificate_bundles;
        }
        state.loading = false;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default certificateSlice.reducer;
