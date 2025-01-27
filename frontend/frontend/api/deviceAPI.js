import baseAPI from "./baseAPI"

export const createDeviceAPI = (deviceData) => baseAPI.post("/device/create", deviceData);