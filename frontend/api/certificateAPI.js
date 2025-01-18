import baseAPI from "./baseAPI";

export const fetchCertificatesAPI = () => baseAPI.post("/certificate/query");

export const createCertificateAPI = (certificateData) => baseAPI.post("/certificate", certificateData);
