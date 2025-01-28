import React from "react";
import { Menu, Avatar, Typography } from "antd";
import {
  AppstoreOutlined,
  SwapOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  HistoryOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import sampleAvatar from "../assets/images/sample-avatar.jpeg";

const { Title, Text, Link } = Typography;

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);

  const isShowDevices =
    userInfo.role !== "TRADING" || userInfo.role !== "AUDIT";

  const menuItems = [
    {
      key: "/certificates",
      icon: <AppstoreOutlined />,
      label: "Certificates",
      onClick: () => navigate("/certificates"),
      style: {
        backgroundColor: location.pathname === "/certificates" ? "#0057FF" : "",
        color: location.pathname === "/certificates" ? "#fff" : "",
        borderRadius: "8px",
        margin: "10px",
        height: "56px",
        display: "flex",
        alignItems: "center",
      },
    },
    {
      key: "/transfer-history",
      icon: <SwapOutlined />,
      label: "Transfer History",
      onClick: () => navigate("/transfer-history"),
      style: { margin: "10px" },
      disabled: true,
      height: "56px",
      display: "flex",
      alignItems: "center",
    },
    {
      key: "/devices",
      icon: <ThunderboltOutlined />,
      label: "Devices",
      onClick: () => navigate("/devices"),
      style: {
        margin: "10px",
        display: isShowDevices ? "block" : "none",
        backgroundColor: location.pathname === "/devices" ? "#0057FF" : "",
        color: location.pathname === "/devices" ? "#fff" : "",
        borderRadius: "8px",
        margin: "10px",
        height: "56px",
        display: "flex",
        alignItems: "center",
      },
    },
  ];

  const handleAccountManagementClick = () => {
    navigate("/account-management");
  };

  return (
    <>
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Granular <span style={{ color: "#0057FF" }}>CertOS</span>
      </div>
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname]}
        style={{ border: "none" }}
        items={menuItems}
      />
      <div
        style={{
          position: "absolute",
          height: "80px",
          bottom: "0",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #f0f0f0",
          width: "calc(100% - 32px)",
        }}
      >
        <div
          style={{
            height: "56px",
            display: "flex",
            alignItems: "center",
            padding: "20px 8px",
            backgroundColor:
              location.pathname === "/account-management" ? "#0057FF" : "",
            color: location.pathname === "/account-management" ? "#fff" : "",
            cursor: "pointer",
            borderRadius: "8px",
            width: "100%",
          }}
          onClick={() => handleAccountManagementClick()}
        >
          <Avatar size={40} src={sampleAvatar} />
          <div
            style={{
              marginLeft: "12px",
              flex: 1,
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",

              display: "inline-block",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color:
                  location.pathname === "/account-management"
                    ? "#fff"
                    : "#202124",
              }}
            >
              {userInfo.username}
            </Text>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Text
                style={{
                  fontSize: "12px",
                  color:
                    location.pathname === "/account-management"
                      ? "#fff"
                      : "#80868B",
                  fontWeight: "500",
                }}
              >
                {userInfo.organisation || "Wind Farm Company"}
              </Text>
            </div>
          </div>
          <MoreOutlined
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color:
                location.pathname === "/account-management"
                  ? "#fff"
                  : "#202124",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SideMenu;
