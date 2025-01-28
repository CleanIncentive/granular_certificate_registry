import React, { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";

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
  Input,
} from "antd";

import {
  AppstoreOutlined,
  SwapOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  LaptopOutlined,
  ThunderboltOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import "../../assets/styles/pagination.css";
import "../../assets/styles/filter.css";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

import DeviceRegisterDialog from "./DeviceRegisterForm";
import DeviceUploadDialog from "./DeviceUploadDataForm";
import SideMenu from "../SideMenu";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

export const DEVICE_TECHNOLOGY_TYPE = Object.freeze({
  SOLAR_PV: "Solar PV",
  WIND_TURBINE: "Wind turbine",
  HYDRO: "Hydro",
  BATTERY_STORAGE: "Battery storage",
  OTHER_STORAGE: "Other storage",
  CHP: "CHP",
  OTHER: "Other",
});

const DeviceDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentAccount, devices } = useSelector((state) => state.account);
  const { userInfo, accounts } = useSelector((state) => state.user);

  const interactAllowed = userInfo.role !== "TRADING_USER" && userInfo.role !== "AUDIT_USER";

  const [currentPage, setCurrentPage] = useState(1);

  const defaultFilters = {
    deviceName: null,
    technologyType: null,
  };

  const [filters, setFilters] = useState(defaultFilters);

  const deviceRegisterDialogRef = useRef();
  const deviceUploadDialogRef = useRef();

  const deviceOptions = useMemo(
    () =>
      devices.map((device) => ({
        value: device.id,
        label:
          `${device.device_name} (${device.local_device_identifier})` ||
          `Device (${device.local_device_identifier})`,
      })),
    [devices]
  );

  useEffect(() => {
    if (!interactAllowed) {
      navigate("/certificates");
      return;
    }
    // if (!currentAccount?.id && devices && devices.length > 0) {
    //   navigate("/login");
    //   return;
    // }
  }, [devices, navigate]);

  if (!currentAccount?.id) {
    return null;
  }

  const pageSize = 10;
  const totalPages = Math.ceil(devices?.length / pageSize);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const handleApplyFilter = () => {
    // Apply the filter logic here
    console.log("Applying filters", filters);
  };

  const handleClearFilter = async () => {
    setFilters({});
  };

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleNewDevice = (accountID) => {
    console.log(`Creating new device for account ID ${accountID}`);
  };

  const handleDeviceDataUpload = (deviceID) => {
    console.log(`Uploading data for device ${deviceID}`);
  };

  const openDialog = () => {
    deviceRegisterDialogRef.current.openDialog(); // Open the dialog from the parent component
  };

  const closeDialog = () => {
    deviceRegisterDialogRef.current.closeDialog(); // Close the dialog from the parent component
  };

  const columns = [
    {
      title: <span style={{ color: "#80868B" }}>Device name & ID</span>,
      dataIndex: "device_name",
      key: "device_name",
    },
    {
      title: <span style={{ color: "#80868B" }}>Technology type</span>,
      dataIndex: "technology_type",
      key: "technology_type",
      render: (type) => {
        const upperKey = type?.toUpperCase().replace(/ /g, "_");
        return DEVICE_TECHNOLOGY_TYPE[upperKey] || type;
      },
    },
    {
      title: <span style={{ color: "#80868B" }}>Production start date</span>,
      dataIndex: "operational_date",
      key: "operational_date",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: <span style={{ color: "#80868B" }}>Device capacity (MW)</span>,
      dataIndex: "capacity",
      key: "capacity",
      render: (text) => <span style={{ color: "#5F6368" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#80868B" }}>Location</span>,
      dataIndex: "location",
      key: "location",
      render: (text) => <span style={{ color: "#5F6368" }}>{text}</span>,
    },
    {
      title: "",
      render: (_, row) => (
        <Button
          style={{ color: "#043DDC", fontWeight: "600" }}
          type="link"
          onClick={() =>
            deviceUploadDialogRef.current.openDialog({
              deviceName: row.device_name,
              deviceLocalID: row.local_device_identifier,
              deviceID: row.id,
            })
          }
        >
          <UploadOutlined /> Upload Data
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={224}
        style={{ background: "#fff", padding: "0 20px 0 10px" }}
      >
        <SideMenu />
      </Sider>

      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            padding: "0 24px",
            borderBottom: "1px solid #E8EAED",
          }}
        >
          <Title level={2}>Production devices</Title>
        </Header>

        <Content style={{ margin: "24px" }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Space align="start" size={16}>
                  <AppstoreOutlined
                    style={{ 
                      fontSize: "32px", 
                      color: "#0057FF",
                      marginTop: "4px"
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h3 style={{ margin: 0, fontSize: "24px" }}>7</h3>
                    <p style={{ margin: 0, color: "#5F6368" }}>Number of Devices</p>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Space align="start" size={16}>
                  <SwapOutlined
                    style={{ 
                      fontSize: "32px", 
                      color: "#1890ff",
                      marginTop: "4px"
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h3 style={{ margin: 0, fontSize: "24px" }}>Wind: 5, Solar PV: 2</h3>
                    <p style={{ margin: 0, color: "#5F6368" }}>Devices by Technology Type</p>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Space align="start" size={16}>
                  <CloseCircleOutlined
                    style={{ 
                      fontSize: "32px", 
                      color: "#1890ff",
                      marginTop: "4px"
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <h3 style={{ margin: 0, fontSize: "24px" }}>600 MW</h3>
                    <p style={{ margin: 0, color: "#5F6368" }}>Total Device Capacity</p>
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
              Production Device Management
            </Text>
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              style={{ height: "40px" }}
              onClick={() => openDialog()}
            >
              Add Device
            </Button>
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
            <Search
              placeholder="Search for device..."
              onSearch={(value) => console.log(value)}
              enterButton={<SearchOutlined />}
              size="medium"
            />
            {/* Device Filter */}
            <Select
              placeholder="Device"
              mode="multiple"
              options={deviceOptions}
              value={filters.device}
              onChange={(value) => handleFilterChange("device_id", value)}
              style={{ width: 120 }}
              suffixIcon={<LaptopOutlined />}
              allowClear
            ></Select>

            {/* Technology Type filter */}
            <Select
              placeholder="Technology Type"
              value={filters.technologyType}
              onChange={(value) => handleFilterChange("technologyType", value)}
              style={{ width: 150 }}
              suffixIcon={<ThunderboltOutlined />}
              allowClear
            >
              {Object.entries(DEVICE_TECHNOLOGY_TYPE).map(([key, value]) => (
                <Option key={key} value={value}>
                  {value}
                </Option>
              ))}
            </Select>
            {/* Apply Filter Button */}
            <Button
              type="link"
              onClick={() => handleApplyFilter()}
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
            columns={columns}
            dataSource={devices}
            rowKey="id"
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
              total={devices.length}
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
      <DeviceRegisterDialog ref={deviceRegisterDialogRef} />
      <DeviceUploadDialog ref={deviceUploadDialogRef} />
    </Layout>
  );
};

export default DeviceDashboard;
