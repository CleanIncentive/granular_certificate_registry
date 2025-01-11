import baseAPI from "./baseAPI";

export const loginAPI = (credentials) => baseAPI.post("/auth/login", credentials);
