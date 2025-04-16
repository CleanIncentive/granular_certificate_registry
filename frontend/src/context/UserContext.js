import React, { createContext, useContext, useEffect, useState } from "react";
import { saveDataToSessionStorage, getSessionStorage } from "../utils";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = getSessionStorage("user_data");
    console.log("UserContext - retrieved from session storage:", storedUserData);

    if (storedUserData) {
      console.log("UserContext - setting user data:", storedUserData);
      setUserData(storedUserData);
    }
  }, []);

  const saveUserData = (userData) => {
    console.log("UserContext - saving user data:", userData);
    setUserData(userData);
    saveDataToSessionStorage("user_data", JSON.stringify(userData));
  };

  return (
    <UserContext.Provider value={{ userData, saveUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
