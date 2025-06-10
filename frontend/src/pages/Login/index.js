import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Select,
  Typography,
  Divider,
  message,
} from "antd";
import * as styles from "./Login.module.css";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Title, Text, Link: TypographyLink } = Typography;
const { Option } = Select;

import { useDispatch } from "react-redux";
import { login } from "../../store/auth/authThunk";
import { readCurrentUser } from "../../store/user/userThunk";

import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import baseAPI from "../../api/baseAPI";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saveUserData } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch CSRF token first
      await baseAPI.get("/csrf-token");
      
      // Then attempt login
      await dispatch(login({ username, password })).unwrap();
      const userData = await dispatch(readCurrentUser()).unwrap();
      saveUserData(userData);
      message.success("Login successful 🎉", 2);
      navigate("/account-picker");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error?.message || error?.detail || "An unexpected error occurred";
      message.error(`Login failed: ${errorMessage}`, 3);
    }
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        {/* Left side - Login form */}
        <div style={{
          width: '50%',
          height: '100%',
          backgroundColor: '#fff',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 2,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ 
            maxWidth: 720, 
            margin: '50px auto', 
            textAlign: 'center',
            padding: '0 20px'
          }}>
            <Title className={styles["font-color"]} level={3}>
              Login to Account
            </Title>
            <Text type="secondary" style={{ marginTop: 12, color: "#5F6368" }}>
              Please enter your email and password to continue
            </Text>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Email Field */}
              <div style={{ marginTop: 16, width: "400px" }}>
                <div
                  className={`${styles["login-form-title"]} ${styles["font-color"]}`}
                >
                  <Text>Email</Text>
                </div>
                <Input
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ height: "40px" }}
                />
              </div>
              {/* Password Field */}
              <div style={{ marginTop: 16, width: "400px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  className={`${styles["login-form-title"]} ${styles["font-color"]}`}
                >
                  <Text>Password</Text>
                  <TypographyLink
                    href="#"
                    style={{ color: "#202224" }}
                  >
                    Forgot password
                  </TypographyLink>
                </div>
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ height: "40px" }}
                />
              </div>

              {/* Login Button */}
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{
                  backgroundColor: "#1D53F7",
                  fontWeight: "500",
                  width: "400px",
                  height: "40px",
                  marginTop: 32,
                }}
                block
              >
                Login
              </Button>

              <div
                style={{ marginTop: 16, textAlign: "center", width: "400px" }}
              >
                <Divider
                  plain
                  style={{
                    marginBottom: 12,
                    borderColor: "#DADCE0",
                    color: "#5F6368",
                  }}
                >
                  Don't have an account?
                </Divider>
                <Text>
                  <Link
                    to="/create-account"
                    style={{ fontWeight: "500", color: "#043DDC" }}
                  >
                    Create account
                  </Link>
                </Text>
              </div>

              <div style={{ marginTop: 64, color: "#5F6368" }}>
                <Text>Powered by:</Text>
              </div>

              <div className={styles["sponsors"]}>
                <img 
                  src={require("../../assets/images/clean-incentive-logo-h.png")}
                  alt="Clean Incentive"
                  style={{
                    height: "86px",
                    marginRight: "13px"
                  }}
                />
                <img 
                  src={require("../../assets/images/FEA-logo.png")}
                  alt="FEA Logo"
                  style={{
                    height: "260px",
                    marginLeft: "20px"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div style={{
          width: '50%',
          height: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <img 
            src={require("../../assets/images/login-background.png")} 
            alt="Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
