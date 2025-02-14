import React, { useMemo, useState, useEffect } from "react";
import { Menu, Avatar, Typography, Dropdown, message } from "antd";
import {
  AppstoreOutlined,
  SwapOutlined,
  ThunderboltOutlined,
  MoreOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import sampleAvatar from "../../assets/images/sample-avatar.jpeg";
import Cookies from "js-cookie";
import { useUser } from "../../context/UserContext";

const { Text } = Typography;

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [isAccountPickerAllowed, setIsAccountPickerAllowed] = useState(false);
  const [isShowDevices, setIsShowDevices] = useState(false);
  const { userData } = useUser();

  useEffect(() => {
    console.log(userData);
    if (!!userData) {
      setIsAccountPickerAllowed(userData.accounts.length > 1);
      setIsShowDevices(
        userData.userInfo.role !== "TRADING_USER" &&
          userData.userInfo.role !== "AUDIT_USER"
      );
    }
  }, [userData]);

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
        key: "/devices",
        icon: <ThunderboltOutlined />,
        label: "Device management",
        onClick: () => navigate("/devices"),
        style: generateMenuStyle("/devices", isShowDevices),
      },
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

  const menu = [
    {
      key: "setting",
      label: "Setting",
      icon: <SettingOutlined />,
    },
    {
      key: "switch",
      label: "Switch Account",
      icon: <SwapOutlined />,
      style: { display: isAccountPickerAllowed ? "flex" : "none" },
    },
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
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
      <Dropdown
        menu={{
          items: menu,
          onClick: handleMenuClick,
        }}
        trigger={["click"]}
        onOpenChange={(visible) => setDropDownVisible(visible)}
        open={dropDownVisible}
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
                {userData?.userInfo.username}
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
                  {userData?.userInfo.organisation || "Wind Farm Company"}
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
