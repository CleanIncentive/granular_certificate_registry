import Cookies from "js-cookie";

export const saveDataToCookies = (key, data, options = { expires: 7 }) => {
  Cookies.set(key, data, options);
};

export const getCookies = (key) => {
  return Cookies.get(key);
};

export const removeCookies = (key) => {
  Cookies.remove(key);
};

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

export const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
