import baseAPI from "./baseAPI";

export const fetchCertificatesAPI = (_) => {
  return baseAPI.post("/certificate/query", _);
};

export const createCertificateAPI = (certificateData) =>
  baseAPI.post("/certificate", certificateData);
