import baseAPI from "./baseAPI";

export const readUserAPI = (userID) => {
  return baseAPI.get(`/user/${userID}`);
};

export const readCurrentUserAPI = () => {
  return baseAPI.get(`/user/me`);
};

export const createUserAPI = (userData) => {
  console.log("Creating user via API:", userData);
  return baseAPI.post('/user', userData);
};
