import React, { useEffect, useState } from "react";
import {
  Layout,
  Form,
  Row,
  Col,
  Input,
  Select,
  Avatar,
  Upload,
  Typography,
  Divider,
  Spin,
  message,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import sampleAvatar from "../../../assets/images/sample-avatar.jpeg";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { readCurrentUser } from "../../../store/user/userThunk";

const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const AccountManagement = () => {
  const { userData, saveUserData } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Helper to format user role (example)
  const formatUserRole = (userRole) => {
    console.log("Formatting user role:", userRole);
    switch (userRole) {
      case "TRADING":
        return "Trading User";
      case "AUDIT":
        return "Audit User";
      default:
        return "Admin";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData || !userData.userInfo) {
        try {
          console.log("Account Management - Fetching user data as it's missing");
          const result = await dispatch(readCurrentUser()).unwrap();
          console.log("Account Management - Fetched user data:", result);
          saveUserData(result);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          message.error("Failed to load user information", 3);
          navigate("/login");
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userData, dispatch, navigate, saveUserData]);

  useEffect(() => {
    if (userData && userData.userInfo) {
      console.log("Setting form values with user data:", userData.userInfo);
      const { username = "", email = "", role = "" } = userData.userInfo;
      const nameParts = username ? username.split(" ") : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts[1] || "";

      form.setFieldsValue({
        firstName,
        lastName,
        email,
        role: formatUserRole(role),
      });
      setLoading(false);
    }
  }, [userData, form]);

  if (loading) {
    return (
      <Layout>
        <Content
          style={{
            width: "100%",
            padding: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px"
          }}
        >
          <Spin size="large" tip="Loading user information..." />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content
        style={{
          width: "100%",
          padding: "24px",
        }}
      >
        {/* FIRST NAME AND LAST NAME */}
        <Form
          form={form}
          layout="horizontal"
          labelCol={{
            span: 8,
            style: {
              paddingRight: "16px",
              display: "flex",
              justifyContent: "flexStart",
              color: "#3C4043",
            },
          }}
          wrapperCol={{ span: 8 }}
          colon={false} // This removes the colon after the label
        >
          <Form.Item label={<Text strong>Name</Text>} required>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  noStyle
                  rules={[
                    { required: true, message: "Please enter your first name" },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  noStyle
                  rules={[
                    { required: true, message: "Please enter your last name" },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Divider />

          {/* EMAIL ADDRESS */}
          <Form.Item
            label={<Text strong>Email address</Text>}
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="email@example.com"
            />
          </Form.Item>
          <Divider />
          {/* PHOTO UPLOAD */}
          <Form.Item
            label={<Text strong>Your photo</Text>}
            extra="This will be displayed on your profile."
          >
            <Row gutter={16} align="middle">
              {/* Avatar Preview */}
              <Col>
                <Avatar
                  size={64}
                  src={sampleAvatar}
                  style={{
                    border: "2px solid #d9d9d9",
                  }}
                />
              </Col>

              {/* Upload Area (Drag and Drop) */}
              <Col flex="auto">
                <Upload.Dragger
                  name="avatar"
                  multiple={false}
                  showUploadList={false}
                  style={{
                    borderRadius: 8,
                    border: "1px dashed #d9d9d9",
                    background: "#fafafa",
                    padding: 20,
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ fontSize: 24 }} />
                  </p>
                  <p className="ant-upload-text">
                    Click to upload or drag and drop
                  </p>
                  <p className="ant-upload-hint">
                    SVG, PNG, JPG, or GIF (max. 800×400px)
                  </p>
                </Upload.Dragger>
              </Col>
            </Row>
          </Form.Item>
          <Divider />
          {/* ROLE SELECTION */}
          <Form.Item
            label={<Text strong>Role</Text>}
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select a role">
              <Option value="Admin">Admin</Option>
              <Option value="Production User">Production User</Option>
              <Option value="Trading User">Trading User</Option>
              <Option value="Audit User">Audit User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default AccountManagement;
