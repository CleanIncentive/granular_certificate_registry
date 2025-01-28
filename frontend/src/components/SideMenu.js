import React, { useMemo, useState } from "react";
import { Menu, Avatar, Typography, Dropdown, message } from "antd";
import {
  AppstoreOutlined,
  SwapOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  HistoryOutlined,
  MoreOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import sampleAvatar from "../assets/images/sample-avatar.jpeg";
import Cookies from "js-cookie";

const { Title, Text, Link } = Typography;

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const { userInfo, accounts } = useSelector((state) => state.user);

  const isShowDevices =
    userInfo.role !== "TRADING_USER" && userInfo.role !== "AUDIT_USER";

  const isAccountPickerAllowed = accounts.length > 1;
  
  const generateMenuStyle = (path, isVisible = true) => ({
    display: isVisible ? "flex" : "none",
    backgroundColor: location.pathname === path ? "#0057FF" : "",
    color: location.pathname === path ? "#fff" : "",
    borderRadius: "8px",
    margin: "10px",
    height: "56px",
    alignItems: "center",
  });

  const menuItems = useMemo(
    () => [
      {
        key: "/certificates",
        icon: <AppstoreOutlined />,
        label: "Certificates",
        onClick: () => navigate("/certificates"),
        style: generateMenuStyle("/certificates"),
      },
      {
        key: "/transfer-history",
        icon: <SwapOutlined />,
        label: "Transfer History",
        onClick: () => navigate("/transfer-history"),
        style: generateMenuStyle("/transfer-history"),
        disabled: true,
      },
      {
        key: "/devices",
        icon: <ThunderboltOutlined />,
        label: "Devices",
        onClick: () => navigate("/devices"),
        style: generateMenuStyle("/devices", isShowDevices),
      },
    ],
    [location.pathname, isShowDevices, navigate]
  );

  const deleteAllCookies = () => {
    const allCookies = Cookies.get(); // Get all cookies as an object

    Object.keys(allCookies).forEach((cookieName) => {
      Cookies.remove(cookieName); // Remove each cookie
    });

    console.log("All cookies have been deleted.");
  };

  const handleMenuClick = ({ key }) => {
    setDropDownVisible(false); // Close dropdown when an option is selected
    if (key === "setting") {
      navigate("/account-management");
    } else if (key === "switch") {
      navigate("/account-picker");
    } else if (key === "logout") {
      console.log("Logging out...");
      deleteAllCookies();
      navigate("/login");
      message.success("Logout successful 🎉", 2);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="setting" icon={<SettingOutlined />}>
        Setting
      </Menu.Item>
      <Menu.Item
        key="switch"
        icon={<SwapOutlined />}
        style={{ display: isAccountPickerAllowed ? "flex" : "none" }}
      >
        Switch Account
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Log Out
      </Menu.Item>
    </Menu>
  );

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
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        onVisibleChange={(visible) => setDropDownVisible(visible)}
        visible={dropDownVisible}
      >
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
            onClick={() => setDropDownVisible(!dropDownVisible)}
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
      </Dropdown>
    </>
  );
};

export default SideMenu;
