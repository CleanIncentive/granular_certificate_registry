import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  SwapOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      },
    },
    {
      key: "/transfer-history",
      icon: <SwapOutlined />,
      label: "Transfer History",
      onClick: () => navigate("/transfer-history"),
      style: { margin: "10px" },
    },
    {
      key: "/devices",
      icon: <ThunderboltOutlined />,
      label: "Devices",
      onClick: () => navigate("/devices"),
      style: { margin: "10px" },
    },
  ];

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
    </>
  );
};

export default SideMenu;
