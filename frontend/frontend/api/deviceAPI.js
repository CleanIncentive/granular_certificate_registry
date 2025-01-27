import baseAPI from "./baseAPI"

export const createDeviceAPI = () => baseAPI.post("/device/create");