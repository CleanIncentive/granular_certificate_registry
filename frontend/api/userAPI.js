import baseAPI from "./baseAPI"

export const readUserAPI = (userID) => baseAPI.get("/user", {
    params: {
      user_id: userID
    }
  });