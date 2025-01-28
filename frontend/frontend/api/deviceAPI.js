import baseAPI from "./baseAPI";

export const createDeviceAPI = (deviceData) =>
  baseAPI.post("/device/create", deviceData);

export const submitMeterReadingsAPI = (csvData, deviceID) => {
  const params = new URLSearchParams({
    device_id: deviceID,
    measurement_json: JSON.stringify(csvData),
  }).toString();
  return baseAPI.post(`/measurement/submit_readings?${params}`);
};

export const downloadMeterReadingsTemplateAPI = () => {
  return baseAPI.get("/measurement/meter_readings_template", {
    responseType: "blob",
  });
};
