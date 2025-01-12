import baseAPI from "./baseAPI";

export const loginAPI = async (credentials) => {
  return await baseAPI.post("/auth/login", credentials, {
    headers: {
      "Content-Type": "multipart/form-data", // Required for file uploads
    },
  });
};
