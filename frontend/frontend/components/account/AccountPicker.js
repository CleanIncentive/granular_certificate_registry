import React, { useState } from "react";
import { Card, Button, Typography, Space, Divider } from "antd";
import { CheckCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import * as styles from "./AccountPicker.module.css";
import edfLogo from "../../assets/images/edf-energy-logo.png";
import bscLtdLogo from "../../assets/images/bsc-ltd-logo.png";
import addUserBtn from "../../assets/images/add-user-btn.png";

import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AccountPicker = () => {
  const navigate = useNavigate();

  const handleAccountSelection = (accountName) => {
    console.log("CLICKEDDDD");
    switch (accountName) {
      case "production":
        navigate("/certificates");
        break;
      case "trading":
        navigate("/devices");
        break;
      default:
        window.location.href =
          "https://docs.google.com/forms/d/e/1FAIpQLSdSkHMAYSu43VJFevngfVT5hvnWRZvwkelIf9QaPtpLVrIlxA/viewform?usp=sf_link";
        break;
    }
  };

  return (
    <div className={styles["account-picker-container"]}>
      <div className={styles["account-picker"]}>
        <div className={styles["header"]}>
          <Title level={3}>GranularCertOS</Title>
          <Text type="secondary">
            Choose an account to continue to GranularCertOS
          </Text>
        </div>

        <div
          className={styles["account-card"]}
          onClick={() => handleAccountSelection("production")}
        >
          <Space>
            <img
              src={edfLogo}
              alt="EDF Energy"
              className={styles["logo-img"]}
            />
            <div>
              <Text style={{ display: "flex" }} strong>
                EDF Energy
              </Text>
              <Text style={{ display: "flex" }} type="secondary">
                Production account
              </Text>
            </div>
          </Space>
        </div>
        <Divider className={styles["account-card-divider"]} />
        <div
          className={styles["account-card"]}
          onClick={() => handleAccountSelection("trading")}
        >
          <Space>
            <img
              src={bscLtdLogo}
              alt="EDF Energy"
              className={styles["logo-img"]}
            />
            <div>
              <Text style={{ display: "flex" }} strong>
                Battery Storage Co Ltd.
              </Text>
              <div>
                <Text style={{ display: "flex" }} type="secondary">
                  Trading account
                </Text>
              </div>
            </div>
          </Space>
        </div>
        <Divider className={styles["account-card-divider"]} />
        <div
          className={styles["account-card"]}
          onClick={() => handleAccountSelection("trading")}
        >
          <Space>
            <img
              src={addUserBtn}
              alt="EDF Energy"
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
