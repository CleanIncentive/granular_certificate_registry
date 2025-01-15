import React, { useEffect } from "react";
import {
  Layout,
  Menu,
  Table,
  Tag,
  Button,
  Card,
  Row,
  Col,
  Avatar,
  message,
  Space,
  Divider,
  Typography,
  Select,
  Flex,
} from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  AppstoreOutlined,
  DownloadOutlined,
  SwapOutlined,
  CloseOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCertificates } from "../store/certificates/certificateThunk";

const { Header, Sider, Content } = Layout;
const { Title, Text, Link } = Typography;
const { Option } = Select;

const statusColors = {
  Claimed: "blue",
  Retired: "gray",
  Active: "green",
  Expired: "red",
  Locked: "orange",
  Withdraw: "gold",
  Reserved: "purple",
};

const data = [
  {
    key: "1",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "2",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  // Add more data as needed
];

const columns = [
  { title: "Issuance ID", dataIndex: "issuanceId", key: "issuanceId" },
  { title: "Device Name", dataIndex: "deviceName", key: "deviceName" },
  { title: "Energy Source", dataIndex: "energySource", key: "energySource" },
  { title: "Certificate Period Start", dataIndex: "start", key: "start" },
  { title: "Certificate Period End", dataIndex: "end", key: "end" },
  { title: "Production (MWh)", dataIndex: "production", key: "production" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
  },
  {
    title: "Action",
    render: () => <Button type="link">Detail</Button>,
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect( async () => {
  //   try {
  //     await dispatch(fetchCertificates()).unwrap();

  //   } catch (error) {
  //     console.log(error)
  //     message.error(`Load failed: ${error}`, 3);
  //   }

  // }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={224} style={{ minHeight: "100vh", background: "#fff" }}>
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
          style={{ borderRight: 0 }}
        >
          <Menu.Item
            key="/certificates"
            icon={<AppstoreOutlined />}
            onClick={() => navigate("/certificates")}
            style={{
              backgroundColor:
                location.pathname === "/certificates" ? "#0057FF" : "",
              color: location.pathname === "/certificates" ? "#fff" : "",
              borderRadius: "8px",
              margin: "10px",
            }}
          >
            Certificates
          </Menu.Item>
          <Menu.Item
            key="/transfer-history"
            icon={<SwapOutlined />}
            onClick={() => navigate("/transfer-history")}
            style={{
              margin: "10px",
            }}
          >
            Transfer history
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            borderColor: "#E8EAED",
            borderWidth: "thick",
            padding: "0px 0px 16px 24px",
          }}
        >
          <Title level={2} style={{ color: "#202124" }}>
            Certificates
          </Title>
        </Header>

        <Content style={{ margin: "24px" }}>
          {/* Summary Cards */}
          <Row gutter={16}>
            <Col span={8}>
              <Row align="middle">
                <Col span={4}>
                  <AppstoreOutlined
                    style={{ fontSize: "32px", color: "#0057FF" }}
                  />
                </Col>
                <Col span={20}>
                  <h3>10293</h3>
                  <p>Total Certificates</p>
                  <Divider type="vertical" />
                  <span>
                    <strong>584</strong> Wind
                  </span>
                  <Divider type="vertical" />
                  <span>
                    <strong>231</strong> Solar
                  </span>
                  <Divider type="vertical" />
                  <span>
                    <strong>4124</strong> Hydropower
                  </span>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Card>
                <Space align="center">
                  <SwapOutlined
                    style={{ fontSize: "24px", color: "#1890ff" }}
                  />
                  <div>
                    <h3>89</h3>
                    <p>Certificates Transferred</p>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Space align="center">
                  <CloseCircleOutlined
                    style={{ fontSize: "24px", color: "#1890ff" }}
                  />
                  <div>
                    <h3>204</h3>
                    <p>Certificates Cancelled</p>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Action Buttons */}
          <Flex
            style={{
              justifyContent: "space-between",
              backgroundColor: "#fff",
              padding: "12px",
              height: "64px",
              alignItems: "center",
              border: "1px solid #f0f0f0",
              borderRadius: "8px 8px 0 0",
              marginTop: "12px"
            }}
          >
            <Text
              style={{ color: "#344054", fontWeight: "500", fontSize: "20px" }}
            >
              Certificate list
            </Text>
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                icon={<CloseOutlined />}
                type="primary"
                style={{ height: "40px" }}
              >
                Cancel
              </Button>
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                style={{ height: "40px" }}
              >
                Reserve
              </Button>
              <Button
                icon={<SwapOutlined />}
                type="primary"
                style={{ height: "40px" }}
              >
                Transfer
              </Button>
            </Space>
          </Flex>

          {/* Certificates Table */}
          <Table
            style={{ borderRadius: '0 0 8px 8px' }}
            columns={columns}
            dataSource={data}
            // loading={loading}
            pagination={{ pageSize: 8 }}
            rowKey="issuanceId"
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
