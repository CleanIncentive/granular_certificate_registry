import React, { useMemo, useState, useEffect } from "react";
import { Menu, Avatar, Typography, Dropdown, message } from "antd";
import {
  SwapOutlined,
  MoreOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { DeviceIcon } from "../../assets/icon/DeviceIcon";
import { CertificateIcon } from "../../assets/icon/CertificateIcon";
import { TransferIcon } from "../../assets/icon/TransferIcon";
import { AccountIcon } from "../../assets/icon/AccountIcon";
import "../../assets/styles/sidemenu.css";
import { useNavigate, useLocation } from "react-router-dom";
import sampleAvatar from "../../assets/images/sample-avatar.jpeg";
import registryLogo from "../../assets/images/registry-logo.png";
import Cookies from "js-cookie";
import { useUser } from "../../context/UserContext";
import { getSessionStorage } from "../../utils";

const { Text } = Typography;

const SideMenu = () => {
  // All hooks must be called first, before any conditional logic
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser();
  
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [isAccountPickerAllowed, setIsAccountPickerAllowed] = useState(false);
  const [isShowDevices, setIsShowDevices] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Always call useEffect
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUserData = getSessionStorage('user_data');
        if (storedUserData) {
          console.log('SideMenu using sessionStorage user data:', storedUserData);
          setIsAccountPickerAllowed(storedUserData.accounts.length > 1);
          setIsShowDevices(
            storedUserData.userInfo.role !== "TRADING_USER" &&
              storedUserData.userInfo.role !== "AUDIT_USER"
          );
          setIsLoading(false);
        } else if (userData && userData.userInfo) {
          console.log('SideMenu using context user data:', userData);
          setIsAccountPickerAllowed(userData.accounts.length > 1);
          setIsShowDevices(
            userData.userInfo.role !== "TRADING_USER" &&
              userData.userInfo.role !== "AUDIT_USER"
          );
          setIsLoading(false);
        } else {
          // If no data available, still show the sidebar with default settings
          console.log('SideMenu no user data available, using defaults');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('SideMenu error loading user data:', error);
        setIsLoading(false);
      }
    };

    // Try to load data immediately
    loadUserData();

    // Also set a timeout to ensure the sidebar loads even if there are API issues
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [userData]);

  // Helper functions
  const generateMenuStyle = (path, isVisible = true) => ({
    display: isVisible ? "flex" : "none",
    backgroundColor: location.pathname === path ? "#0057FF" : undefined,
    color: location.pathname === path ? "#fff" : "#3C4043",
    borderRadius: "8px",
    margin: "10px",
    height: "56px",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "20px",
  });

  const deleteAllCookies = () => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    console.log("All cookies have been deleted.");
  };

  const handleMenuClick = ({ key }) => {
    setDropDownVisible(false);
    if (key === "setting") {
      navigate("/settings");
    } else if (key === "switch") {
      navigate("/account-picker");
    } else if (key === "logout") {
      console.log("Logging out...");
      deleteAllCookies();
      navigate("/login");
      message.success("Logout successful 🎉", 2);
    }
  };

  // Memoized values
  const menuItems = useMemo(
    () => [
      {
        key: "devices",
        icon: <DeviceIcon width={20} height={20} />,
        label: "Device management",
        onClick: () => navigate("/devices"),
        style: generateMenuStyle("/devices", isShowDevices),
        className: "custom-menu-item",
      },
      {
        key: "certificates",
        icon: <CertificateIcon />,
        label: "Certificates",
        onClick: () => navigate("/certificates"),
        style: generateMenuStyle("/certificates"),
        className: "custom-menu-item",
      },
      {
        key: "account-management",
        icon: <AccountIcon />,
        label: "Account Management",
        onClick: () => navigate("/account-management"),
        style: generateMenuStyle("/account-management"),
        className: "custom-menu-item",
      },
      {
        key: "transfer",
        icon: <TransferIcon />,
        label: "Transfer History",
        style: generateMenuStyle("/transfer-history"),
        className: "custom-menu-item",
        disabled: true,
      },
    ],
    [location.pathname, isShowDevices, navigate]
  );

  const menu = useMemo(() => [
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
  ], [isAccountPickerAllowed]);

  // Early return after all hooks
  if (isLoading) {
    return (
      <div style={{ padding: "16px", textAlign: "center" }}>
        <div style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          padding: "16px",
          textAlign: "center",
        }}
      >
        <img 
          src={registryLogo} 
          alt="Registry Logo" 
          style={{
            maxWidth: "100%",
            height: "auto"
          }}
        />
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
                {userData?.userInfo?.username || "Loading..."}
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
                  {userData?.userInfo?.organisation || "Loading..."}
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
