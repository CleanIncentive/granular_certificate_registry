import React, { useEffect, useState } from "react";
import { Upload, Input, Select, Typography, Layout, Form, Avatar } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import sampleAvatar from "../../../assets/images/sample-avatar.jpeg";
import { useUser } from "../../../context/UserContext";
const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const AccountManagement = () => {
  const { userData } = useUser();
  const [form] = Form.useForm();

  useEffect(() => {
    if (userData) {
      const values = {
        username: userData.userInfo.username,
        email: userData.userInfo.email,
        role: formatUserRole(userData.userInfo.role),
      };
      form.setFieldsValue(values);
    }
  }, [userData, form]);

  const formatUserRole = (userRole) => {
    switch (userRole) {
      case "TRADING":
        return "Trading User";
      case "AUDIT":
        return "Audit User";
      default:
        return "Admin";
    }
  };

  return (
    <>
      <Content style={{ margin: "24px" }}>
        <Form
          layout="vertical"
          style={{ maxWidth: "100%" }}
          form={form}
        >
          {/* Name Fields */}
          <Form.Item label="Name" name="username">
            <Input placeholder="Olivia" />
          </Form.Item>

          {/* Email Address */}
          <Form.Item label="Email address" name="email">
            <Input
              placeholder="olivia@untitledui.com"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          {/* Profile Picture Upload */}
          <Form.Item label="Your photo">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Avatar size={64} src={sampleAvatar} />
              <Upload showUploadList={false}>
                <div
                  style={{
                    border: "1px dashed #1890ff",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    width: "250px",
                  }}
                >
                  <UploadOutlined
                    style={{ fontSize: "20px", color: "#1890ff" }}
                  />
                  <p style={{ marginBottom: "4px", color: "#1890ff" }}>
                    Click to upload
                  </p>
                  <Text type="secondary">
                    SVG, PNG, JPG, or GIF (max. 800×400px)
                  </Text>
                </div>
              </Upload>
            </div>
          </Form.Item>
          {/* Role Selection */}
          <Form.Item label="Role" name="role">
            <Select>
              <Option value="ADMIN">Admin</Option>
              <Option value="PRODUCTION_USER">Production User</Option>
              <Option value="TRADING_USER">Trading User</Option>
              <Option value="AUDIT_USER">Audit User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
};

export default AccountManagement;
