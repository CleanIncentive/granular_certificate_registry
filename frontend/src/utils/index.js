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

export const removeAllCookies = () => {
  // Get all cookies
  const allCookies = Cookies.get(); // This returns an object of all cookies

  // Iterate over each cookie and remove it
  for (const cookieName in allCookies) {
    if (allCookies.hasOwnProperty(cookieName)) {
      Cookies.remove(cookieName); // Remove each cookie by name
    }
  }
};

// Save data to sessionStorage with size check
export const saveDataToSessionStorage = (key, data) => {
  try {
    console.log(`Saving data to sessionStorage for key ${key}:`, data);
    sessionStorage.setItem(key, JSON.stringify(data));
    console.log(`Successfully saved data to sessionStorage for key ${key}`);
  } catch (error) {
    console.error(`Error saving to sessionStorage for key ${key}:`, error);
  }
};

// Get data from sessionStorage
export const getSessionStorage = (key) => {
  try {
    console.log(`Retrieving data from sessionStorage for key ${key}`);
    const data = sessionStorage.getItem(key);
    console.log(`Raw data from sessionStorage for key ${key}:`, data);
    
    // Only parse if data exists and isn't the string "undefined"
    if (data && data !== "undefined") {
      try {
        const parsedData = JSON.parse(data);
        console.log(`Parsed data from sessionStorage for key ${key}:`, parsedData);
        return parsedData;
      } catch (parseError) {
        console.error(`Error parsing data from sessionStorage for key ${key}:`, parseError);
        return data; // Return raw data if parsing fails
      }
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving from sessionStorage for key ${key}:`, error);
    return null;
  }
};

// Remove data from sessionStorage
export const removeSessionStorage = (key) => {
  sessionStorage.removeItem(key);
};

// Remove all data from sessionStorage
export const removeAllSessionStorage = () => {
  sessionStorage.clear();
};

export const isAuthenticated = () => {
  const token = Cookies.get("access_token");
  return !!token;
};

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
