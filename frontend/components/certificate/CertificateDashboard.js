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
} from "@ant-design/icons";

import StatusTag from "./StatusTag";

import "../../assets/styles/pagination.css";
import "../../assets/styles/filter.css";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCertificates } from "../../store/certificates/certificateThunk";

import ActionDialog from "./ActionDialog";
import SideMenu from "../SideMenu";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const STATUS_ENUM = Object.freeze({
  claimed: "Claimed",
  retired: "Retired",
  active: "Active",
  expired: "Expired",
  locked: "Locked",
  withdraw: "Withdraw",
  reserved: "Reserved",
});

const CertificateDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { certificates, loading, error } = useSelector(
    (state) => state.certificates
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { currentAccount } = useSelector((state) => state.account);

  console.log("currentAccount: ", currentAccount);

  const deviceOptions = useMemo(
    () =>
      currentAccount.devices.map((device) => ({
        value: device.id,
        label: device.device_name || `Device ${device.id}`,
      })),
    [currentAccount.devices]
  );

  const today = dayjs();
  const one_week_ago = dayjs().subtract(7, "days");

  const defaultFilters = {
    device_id: null,
    energy_source: null,
    certificate_bundle_status: [STATUS_ENUM.active],
    certificate_period_start: one_week_ago,
    certificate_period_end: today,
  };

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      certificate_period_start: one_week_ago,
      certificate_period_end: today,
    }));
  }, []);

  const pageSize = 10;

  const dialogRef = useRef();

  useEffect(() => {
    // fetchCertificatesData();
  }, [dispatch]);

  useEffect(() => {
    if (isEmpty(filters)) fetchCertificatesData();
  }, [filters]);

  const fetchCertificatesData = async () => {
    console.log("filters: ", filters);

    const fetchBody = {
      ...filters,
      user_id: 1,
      source_id: 1,
      device_id: 1,
    };

    await dispatch(fetchCertificates(fetchBody)).unwrap();
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    fetchCertificatesData();
  };

  const handleClearFilter = async () => {
    setFilters({});
    // fetchCertificatesData();
  };

  const totalPages = Math.ceil(certificates?.length / pageSize);

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

  const handleDateChange = (dates) => {
    setFilters((prev) => ({
      ...prev,
      certificate_period_start: dates[0]["$d"],
      certificate_period_end: dates[1]["$d"],
    }));
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleTransfer = (fromAccount, toAccount, certificateId) => {
    // Perform the transfer logic here
    console.log(
      `Transferring certificate ${certificateId} from ${fromAccount} to ${toAccount}`
    );
  };

  const handleCancel = (certificateId) => {
    // Perform the cancel logic here
    console.log(`Cancelling certificate ${certificateId}`);
  };

  const openDialog = () => {
    dialogRef.current.openDialog(); // Open the dialog from the parent component
  };

  const closeDialog = () => {
    dialogRef.current.closeDialog(); // Close the dialog from the parent component
  };

  const isCertificatesSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: <span style={{ color: "#80868B" }}>Issuance ID</span>,
      dataIndex: "issuance_id",
      key: "issuance_id",
    },
    {
      title: <span style={{ color: "#80868B" }}>Device Name</span>,
      dataIndex: "device_id",
      key: "device_id",
    },
    {
      title: <span style={{ color: "#80868B" }}>Energy Source</span>,
      dataIndex: "energy_source",
      key: "energy_source",
    },
    {
      title: <span style={{ color: "#80868B" }}>Certificate Period Start</span>,
      dataIndex: "certificate_bundle_id_range_start",
      key: "certificate_bundle_id_range_start",
      render: (text) => <span style={{ color: "#5F6368" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#80868B" }}>Certificate Period End</span>,
      dataIndex: "certificate_bundle_id_range_end",
      key: "certificate_bundle_id_range_end",
      render: (text) => <span style={{ color: "#5F6368" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#80868B" }}>Production (MWh)</span>,
      dataIndex: "bundle_quantity",
      key: "bundle_quantity",
    },
    {
      title: <span style={{ color: "#80868B" }}>Status</span>,
      dataIndex: "certificate_bundle_status",
      key: "certificate_bundle_status",
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
                onClick={() => openDialog()}
              >
                Cancel
              </Button>
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                disabled={!isCertificatesSelected}
                style={{ height: "40px" }}
                onClick={() => openDialog()}
              >
                Reserve
              </Button>
              <Button
                icon={<SwapOutlined />}
                type="primary"
                disabled={!isCertificatesSelected}
                style={{ height: "40px" }}
                onClick={() => openDialog()}
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
              mode="multiple"
              options={deviceOptions}
              value={filters.device}
              onChange={(value) => handleFilterChange("device_id", value)}
              style={{ width: 120 }}
              suffixIcon={<LaptopOutlined />}
              allowClear
            ></Select>

            {/* Energy Source Filter */}
            <Select
              placeholder="Energy Source"
              value={filters.energySource}
              onChange={(value) => handleFilterChange("energy_source", value)}
              style={{ width: 150 }}
              suffixIcon={<ThunderboltOutlined />}
              allowClear
            >
              <Option value="solar">Solar</Option>
              <Option value="wind">Wind</Option>
              <Option value="hydro">Hydropower</Option>
            </Select>

            <RangePicker
              value={filters.dateRange}
              onChange={(value) => handleDateChange(value)} // Handle date selection
              dropdownClassName="custom-range-picker" // Custom styling
            />

            {/* Status Filter */}
            <Select
              // mode="multiple"
              placeholder="Status"
              value={filters.status}
              onChange={(value) =>
                handleFilterChange("certificate_bundle_status", value)
              }
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
            rowSelection={rowSelection}
            columns={columns}
            dataSource={certificates?.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
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
              total={certificates?.length}
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

      {/* Dialog component with a ref to control it from outside */}
      <ActionDialog ref={dialogRef} />
    </Layout>
  );
};

export default CertificateDashboard;
