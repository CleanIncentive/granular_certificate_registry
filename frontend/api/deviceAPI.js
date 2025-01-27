import baseAPI from "./baseAPI"

export const createDeviceAPI = (deviceData) => baseAPI.post("/device/create", deviceData);

export const submitMeterReadingsAPI = (csvData) => {
  return baseAPI.post("/measurement/submit_readings", {
    measurement_json: csvData
  });
};

export const downloadMeterReadingsTemplateAPI = () => {
  return baseAPI.get("/measurement/meter_readings_template", {
    responseType: 'blob'
  });
};


