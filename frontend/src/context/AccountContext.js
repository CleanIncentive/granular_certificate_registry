import React, { createContext, useContext, useEffect, useState } from "react";
import { saveDataToCookies, getCookies, removeCookies } from "../util";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    const storedAccount = getCookies("account_detail");

    if (!!storedAccount) {
        try{
            console.log(storedAccount)
            setCurrentAccount(JSON.parse(storedAccount));
        } catch (err) {
            console.log(err);
        }
    }
  }, []);

  const saveAccountDetail = (accountDetail) => {
    console.log(accountDetail)
    setCurrentAccount(accountDetail);
    saveDataToCookies("account_detail", JSON.stringify(accountDetail), {
      expires: 7,
    });
  };

  return (
    <AccountContext.Provider
      value={{ currentAccount, saveAccountDetail }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
