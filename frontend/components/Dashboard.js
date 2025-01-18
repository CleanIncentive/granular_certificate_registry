import React, { useState, useMemo } from "react";
import {
  Layout,
  Menu,
  Table,
  Tag,
  Button,
  Card,
  Row,
  Col,
  Space,
  Divider,
  Typography,
  message,
  Flex,
  Pagination,
  Select,
  DatePicker,
  Dropdown,
} from "antd";
import {
  AppstoreOutlined,
  SwapOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  LaptopOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DownOutlined,
} from "@ant-design/icons";
import StatusTag from "./StatusTag";

import "../assets/styles/pagination.css";
import "../assets/styles/filter.css";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCertificates } from "../store/certificates/certificateThunk";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  {
    key: "3",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "4",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  {
    key: "5",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "6",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  {
    key: "7",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "8",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  {
    key: "9",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "10",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  {
    key: "11",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "12",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  {
    key: "13",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "14",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  {
    key: "15",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "16",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  {
    key: "17",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "18",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },

  {
    key: "19",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "20",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
  {
    key: "21",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "22",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },

  {
    key: "23",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 00:00",
    end: "2024-12-10 02:00",
    production: "31.223",
    status: "Claimed",
  },
  {
    key: "24",
    issuanceId: "JNKD193",
    deviceName: "Wind Farm",
    energySource: "Wind",
    start: "2024-12-10 01:00",
    end: "2024-12-10 03:00",
    production: "31.223",
    status: "Retired",
  },
];

const STATUS_ENUM = Object.freeze({
  claimed: "Claimed",
  retired: "Retired",
  active: "Active",
  expired: "Expired",
  locked: "Locked",
  withdraw: "Withdraw",
  reserved: "Reserved",
});

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultFilters = {
    device: null,
    energySource: null,
    status: [],
    dateRange: [],
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(defaultFilters);
  const pageSize = 10;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleApplyFilter = () => console.log("Applying Filters:", filters);
  const handleClearFilter = () => {
    setFilters({ device: null, energySource: null, status: [], dateRange: [] });
  };

  const totalPages = Math.ceil(data.length / pageSize);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      filters.status.length
        ? filters.status.includes(item.status.toLowerCase())
        : true
    );
  }, [filters.status, data]);

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Go to Previous Page
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to Next Page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle date selection
  const handleDateChange = (dates) => {
    setDateRange(dates);
    setIsOpen(false); // Close after selecting a date
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const isCertificatesSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: <span style={{ color: "#80868B" }}>Issuance ID</span>,
      dataIndex: "issuanceId",
      key: "issuanceId",
    },
    {
      title: <span style={{ color: "#80868B" }}>Device Name</span>,
      dataIndex: "deviceName",
      key: "deviceName",
    },
    {
      title: <span style={{ color: "#80868B" }}>Certificate Period Start</span>,
      dataIndex: "start",
      key: "start",
      render: (text) => <span style={{ color: "#5F6368" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#80868B" }}>Certificate Period End</span>,
      dataIndex: "end",
      key: "end",
      render: (text) => <span style={{ color: "#5F6368" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#80868B" }}>Production (MWh)</span>,
      dataIndex: "production",
      key: "production",
    },
    {
      title: <span style={{ color: "#80868B" }}>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status) => StatusTag(status),
    },
    {
      title: "",
      render: () => (
        <Button style={{ color: "#043DDC", fontWeight: "600" }} type="link">
          Detail
        </Button>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={224}
        style={{ background: "#fff", padding: "0 20px 0 10px" }}
      >
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
            style={{ margin: "10px" }}
          >
            Transfer History
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            padding: "0 24px",
            borderBottom: "1px solid #E8EAED",
          }}
        >
          <Title level={2}>Certificates</Title>
        </Header>

        <Content style={{ margin: "24px" }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Space align="middle">
                  <AppstoreOutlined
                    style={{ fontSize: "32px", color: "#0057FF" }}
                  />
                  <div>
                    <h3>10293</h3>
                    <p>Total Certificates</p>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Space align="middle">
                  <SwapOutlined
                    style={{ fontSize: "32px", color: "#1890ff" }}
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
                <Space align="middle">
                  <CloseCircleOutlined
                    style={{ fontSize: "32px", color: "#1890ff" }}
                  />
                  <div>
                    <h3>204</h3>
                    <p>Certificates Cancelled</p>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Flex
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: "12px",
              border: "1px solid #f0f0f0",
              borderRadius: "8px 8px 0 0",
              marginTop: "12px",
            }}
          >
            <Text
              style={{ color: "#344054", fontWeight: "500", fontSize: "20px" }}
            >
              Certificate List
            </Text>
            <Space>
              <Text
                style={{
                  color: "#202124",
                  fontWeight: "500",
                  display: selectedRowKeys.length < 1 ? "none" : "inline",
                }}
              >
                ({selectedRowKeys.length} selected)
              </Text>
              <Button
                icon={<CloseOutlined />}
                type="primary"
                disabled={!isCertificatesSelected}
                style={{ height: "40px" }}
              >
                Cancel
              </Button>
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                disabled={!isCertificatesSelected}
                style={{ height: "40px" }}
              >
                Reserve
              </Button>
              <Button
                icon={<SwapOutlined />}
                type="primary"
                disabled={!isCertificatesSelected}
                style={{ height: "40px" }}
              >
                Transfer
              </Button>
            </Space>
          </Flex>
          <Space
            style={{
              width: "100%",
              padding: "8px 16px",
              backgroundColor: "#fff",
              borderBottom: "1px solid #EAECF0",
            }}
            split={<Divider type="vertical" />}
          >
            {/* Device Filter */}
            <Select
              placeholder="Device"
              value={filters.device}
              onChange={(value) => handleFilterChange("device", value)}
              style={{ width: 120 }}
              suffixIcon={<LaptopOutlined />}
              allowClear
            >
              <Option value="device1">Device 1</Option>
              <Option value="device2">Device 2</Option>
            </Select>

            {/* Energy Source Filter */}
            <Select
              placeholder="Energy Source"
              value={filters.energySource}
              onChange={(value) => handleFilterChange("energySource", value)}
              style={{ width: 150 }}
              suffixIcon={<ThunderboltOutlined />}
              allowClear
            >
              <Option value="solar">Solar</Option>
              <Option value="wind">Wind</Option>
              <Option value="hydro">Hydropower</Option>
            </Select>

            {/* <div style={{ position: "relative", display: "inline-block" }}> */}
            {/* Custom Button to Open RangePicker */}
            {/* <Button
                className="period-time-button"
                icon={<CalendarOutlined style={{ marginRight: 8 }} />}
                onClick={() => setIsOpen(true)} // Open on click
              >
                Period Time <DownOutlined />
              </Button> */}

            {/* Visible RangePicker */}
            <RangePicker
              // open={isOpen} // Control visibility
              // onOpenChange={(open) => setIsOpen(open)} // Sync open state
              onChange={handleDateChange} // Handle date selection
              onBlur={() => setIsOpen(false)} // Close when clicking outside
              dropdownClassName="custom-range-picker" // Custom styling
            />
            {/* </div> */}

            {/* Status Filter */}
            <Select
              mode="multiple"
              placeholder="Status"
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: 200 }}
              allowClear
              suffixIcon={<ClockCircleOutlined />}
            >
              {Object.entries(STATUS_ENUM).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
            {/* Apply Filter Button */}
            <Button
              type="link"
              onClick={handleApplyFilter}
              style={{ color: "#043DDC", fontWeight: "600" }}
            >
              Apply filter
            </Button>

            {/* Clear Filter Button */}
            <Button
              type="text"
              onClick={handleClearFilter}
              disabled={isEqual(defaultFilters, filters) ? true : false}
              style={{
                color: isEqual(defaultFilters, filters) ? "#DADCE0" : "#5F6368",
                fontWeight: "600",
              }}
            >
              Clear Filter
            </Button>
          </Space>
          <Table
            style={{
              borderRadius: "0 0 8px 8px",
              fontWeight: "500",
              color: "#F9FAFB",
            }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            rowKey="key"
            pagination={false}
          />
          <Flex className="pagination-container">
            {/* Previous Button */}
            <Button
              icon={<LeftOutlined />}
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`pagination-btn ${
                currentPage === 1 ? "disabled" : ""
              }`}
            >
              Previous
            </Button>

            {/* Custom Pagination */}
            <Pagination
              className="custom-paging"
              current={currentPage}
              total={data.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              itemRender={(page, type, originalElement) => {
                if (type === "prev" || type === "next") {
                  return null; // Remove default arrows
                }

                if (type === "page") {
                  return (
                    <div
                      onClick={() => handlePageChange(page)}
                      className={`pagination-number ${
                        page === currentPage ? "active" : ""
                      }`}
                    >
                      {page}
                    </div>
                  );
                }
                return originalElement;
              }}
            />

            {/* Next Button */}
            <Button
              icon={<RightOutlined />}
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`pagination-btn ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              Next
            </Button>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
