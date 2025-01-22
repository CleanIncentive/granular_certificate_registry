import baseAPI from "./baseAPI";

export const getAccountAPI = (account_id) => {
  return baseAPI.get(`/account/${account_id}`);
};

export const getAccountSummaryAPI = (account_id) => {
  return baseAPI.get(`/account/${account_id}/summary`);
};

export const getAccountDevicesAPI = (account_id) => {
  return baseAPI.get(`/account/${account_id}/devices`);
};
