import baseAPI from "./baseAPI";

export const readUserAPI = (userID) => {
  return baseAPI.get(`/user/${userID}`);
};
