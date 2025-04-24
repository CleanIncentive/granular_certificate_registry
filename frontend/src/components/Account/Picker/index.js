import React, { useState } from "react";
import { Typography, Space, Divider, message } from "antd";
import * as styles from "./AccountPicker.module.css";
import addUserBtn from "../../../assets/images/add-user-btn.png";
import registryLogo from "../../../assets/images/registry-logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAccount } from "../../../context/AccountContext";
import { getAccountDetails } from "../../../store/account/accountThunk";
import Cookies from "js-cookie";

const { Title, Text } = Typography;

const AccountPicker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({});
  const userData = JSON.parse(Cookies.get("user_data") || '{"accounts":[]}');
  const { saveAccountDetail } = useAccount();

  const handleAccountSelection = async (account) => {
    try {
      // Set loading state for this specific account
      setLoading(prev => ({ ...prev, [account.id]: true }));
      
      console.log(`Selecting account: ${account.id} - ${account.account_name}`);
      const accountDetail = await dispatch(
        getAccountDetails(account.id)
      ).unwrap();
      
      console.log("Account details received:", accountDetail);
      saveAccountDetail(accountDetail);
      
      // Save selected account to cookies as fallback
      const selectedAccountData = {
        id: account.id,
        account_name: account.account_name
      };
      Cookies.set("selected_account", JSON.stringify(selectedAccountData));
      
      navigate("/certificates");
    } catch (error) {
      console.error("Error selecting account:", error);
      
      // Show error message
      message.error(
        error?.message || "Failed to select account. Please try again or contact support.",
        5
      );
      
      // Try to navigate anyway with minimal account info to prevent blocking the user
      try {
        const fallbackAccountData = {
          id: account.id,
          account_name: account.account_name,
          _error: true
        };
        saveAccountDetail(fallbackAccountData);
        navigate("/certificates");
      } catch (navError) {
        console.error("Failed to navigate with fallback account data:", navError);
      }
    } finally {
      // Clear loading state
      setLoading(prev => ({ ...prev, [account.id]: false }));
    }
  };

  const handleRequestAccount = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSdSkHMAYSu43VJFevngfVT5hvnWRZvwkelIf9QaPtpLVrIlxA/viewform?usp=sf_link",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className={styles["account-picker-container"]}>
      <div className={styles["account-picker"]}>
        <div className={styles["header"]}>
          <img 
            src={registryLogo} 
            alt="Registry Logo" 
            style={{
              maxWidth: "180px",
              height: "auto",
              marginBottom: "16px"
            }}
          />
          <Text type="secondary" style={{ textAlign: "center" }}>
            Choose an account to continue
          </Text>
        </div>

        {/* Map through user's accounts */}
        {userData?.accounts?.map((account, index) => (
          <React.Fragment key={account.id}>
            <div
              className={`${styles["account-card"]} ${loading[account.id] ? styles["account-card-loading"] : ""}`}
              onClick={() => !loading[account.id] && handleAccountSelection(account)}
              style={{ 
                cursor: loading[account.id] ? 'wait' : 'pointer',
                opacity: loading[account.id] ? 0.7 : 1
              }}
            >
              <Space align="center" style={{ width: "100%" }}>
                <div className={styles["account-initial"]}>
                  {account.account_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Text style={{ display: "flex" }} strong>
                    {account.account_name}
                  </Text>
                  {loading[account.id] && <Text type="secondary">Loading...</Text>}
                </div>
              </Space>
            </div>
            {index < userData.accounts.length - 1 && (
              <Divider className={styles["account-card-divider"]} />
            )}
          </React.Fragment>
        ))}

        {/* Request Account Card */}
        <Divider className={styles["account-card-divider"]} />
        <div className={styles["account-card"]} onClick={handleRequestAccount}>
          <Space align="center" style={{ width: "100%" }}>
            <img
              src={addUserBtn}
              alt="Request Account"
              className={styles["logo-img"]}
            />
            <Text strong>Request another account</Text>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default AccountPicker;
