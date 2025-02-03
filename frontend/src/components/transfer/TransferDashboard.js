import React, { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";
import Cookies from "js-cookie";

import {
  Layout,
  Menu,
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

import StatusTag from "../StatusTag";
import FilterTable from "../FilterTable";

import "../../assets/styles/pagination.css";
import "../../assets/styles/filter.css";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCertificates,
  getCertificateDetails,
} from "../../store/certificate/certificateThunk";

// import CertificateActionDialog from "./CertificateActionDialog";
// import CertificateDetailDialog from "./CertificateDetailDialog";
import SideMenu from "../SideMenu";
import { CERTIFICATE_STATUS, ENERGY_SOURCE } from "../../enum";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { certificates, loading, error } = useSelector(
    (state) => state.certificates
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCertificateData, setSelectedCertificateData] = useState(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [dialogAction, setDialogAction] = useState(null);
  const [totalProduction, setTotalProduction] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState([]);

  const dialogRef = useRef();

  const currentAccount = JSON.parse(Cookies.get("account_detail"));
  const userInfo = JSON.parse(Cookies.get("user_data")).userInfo;

  useEffect(() => {
    if (!currentAccount?.id) {
      navigate("/login");
      return;
    }
  }, [currentAccount, navigate]);

  if (!currentAccount?.id) {
    return null;
  }

  const deviceOptions = useMemo(
    () =>
      currentAccount.devices.map((device) => ({
        value: device.id,
        label: device.device_name || `Device ${device.id}`,
      })),
    [currentAccount.devices]
  );

  const today = dayjs();
  const one_week_ago = dayjs().subtract(30, "days");

  const defaultFilters = {
    device_id: null,
    energy_source: null,
    certificate_bundle_status: CERTIFICATE_STATUS.active,
    certificate_period_start: dayjs(one_week_ago),
    certificate_period_end: dayjs(today),
  };

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      certificate_period_start: one_week_ago,
      certificate_period_end: today,
    }));
  }, []);

  useEffect(() => {
    if (!dialogAction) {
      return;
    }
    dialogRef.current.openDialog(); // Open the dialog from the parent component
  }, [dialogAction]);

  useEffect(() => {
    fetchCertificatesData();
  }, [dispatch]);

  useEffect(() => {
    if (isEmpty(filters)) fetchCertificatesData();
  }, [filters]);

  useEffect(() => {
    const totalProduction = selectedRecords.reduce(
      (sum, record) => sum + record.bundle_quantity,
      0
    );
    const devices = selectedRecords.reduce((acc, newDevice) => {
      const isDuplicate = acc.some((device) => device === newDevice.device_id);
      return isDuplicate ? acc : [...acc, newDevice.device_id];
    }, []);
    setTotalProduction(totalProduction);
    setSelectedDevices(devices);
  }, [selectedRecords]);

  const fetchCertificatesData = async () => {
    const fetchBody = {
      user_id: userInfo.userID,
      source_id: currentAccount.id,
      device_id: filters.device_id,
      certificate_bundle_status:
        CERTIFICATE_STATUS[filters.certificate_bundle_status], // Transform status to match API expectations
      certificate_period_start:
        filters.certificate_period_start?.format("YYYY-MM-DD"),
      certificate_period_end:
        filters.certificate_period_end?.format("YYYY-MM-DD"),
      energy_source: filters.energy_source,
    };
    try {
      await dispatch(fetchCertificates(fetchBody)).unwrap();
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      message.error(error?.message || "Failed to fetch certificates");
    }
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getDeviceName = (deviceID) => {
    return (
      currentAccount.devices.find((device) => deviceID === device.id)
        ?.device_name || `Device ${deviceID}`
    );
  };

  const handleDateChange = (dates) => {
    setFilters((prev) => ({
      ...prev,
      certificate_period_start: dates[0],
      certificate_period_end: dates[1],
    }));
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRecords(newSelectedRows);
  };

  const openDialog = (action) => {
    setDialogAction(action);
  };

  const closeDialog = () => {
    dialogRef.current.closeDialog(); // Close the dialog from the parent component
  };

  const isCertificatesSelected = selectedRowKeys.length > 0;

  const btnList = [
    {
      icon: () => {
        return <CloseOutlined />;
      },
      btnType: "primary",
      type: "cancel",
      disbled: !isCertificatesSelected,
      style: { height: "40px" },
      name: "Cancel",
      handle: () => openDialog("cancel"),
    },
    {
      icon: () => {
        return <DownloadOutlined />;
      },
      btnType: "primary",
      type: "reserve",
      disbled: !isCertificatesSelected,
      style: { height: "40px" },
      name: "Reserve",
      handle: () => openDialog("reserve"),
    },
    {
      icon: () => {
        return <SwapOutlined />;
      },
      btnType: "primary",
      type: "transfer",
      disbled: !isCertificatesSelected,
      style: { height: "40px" },
      name: "Transfer",
      handle: () => openDialog("transfer"),
    },
  ];

  const filterComponents = [
    /* Device Filter */
    <Select
      placeholder="Device"
      // mode="multiple"
      options={deviceOptions}
      value={filters.device}
      onChange={(value) => handleFilterChange("device_id", value)}
      style={{ width: 120 }}
      suffixIcon={<LaptopOutlined />}
      allowClear
    ></Select>,
    /* Energy Source Filter */
    <Select
      placeholder="Energy Source"
      value={filters.energySource}
      onChange={(value) => handleFilterChange("energy_source", value)}
      style={{ width: 150 }}
      suffixIcon={<ThunderboltOutlined />}
      allowClear
    >
      {Object.entries(ENERGY_SOURCE).map(([key, value]) => (
        <Option key={key} value={key}>
          {value}
        </Option>
      ))}
    </Select>,
    /* Date range Filter */
    <RangePicker
      value={[filters.certificate_period_start, filters.certificate_period_end]}
      onChange={(dates) => handleDateChange(dates)}
      allowClear={false}
    />,
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
      {Object.entries(CERTIFICATE_STATUS).map(([key, value]) => (
        <Option key={key} value={key}>
          {value}
        </Option>
      ))}
    </Select>,
  ];

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
      render: (id) => <span>{getDeviceName(id)}</span>,
    },
    {
      title: <span style={{ color: "#80868B" }}>Energy Source</span>,
      dataIndex: "energy_source",
      key: "energy_source",
      render: (text) => (
        <span style={{ color: "#5F6368" }}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      ),
    },
    {
      title: <span style={{ color: "#80868B" }}>Certificate Period Start</span>,
      dataIndex: "production_starting_interval",
      key: "production_starting_interval",
      render: (text) => <span style={{ color: "#5F6368" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#80868B" }}>Certificate Period End</span>,
      dataIndex: "production_ending_interval",
      key: "production_ending_interval",
      render: (text) => <span style={{ color: "#5F6368" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#80868B" }}>Production (MWh)</span>,
      dataIndex: "bundle_quantity",
      key: "bundle_quantity",
      render: (value) => (value / 1e6).toFixed(3), // Divides by 1,000,000 and shows 3 decimal places
    },
    {
      title: <span style={{ color: "#80868B" }}>Status</span>,
      dataIndex: "certificate_bundle_status",
      key: "certificate_bundle_status",
      render: (status) => <StatusTag status={String(status || "")} />, // Ensure status is a string
    },
    {
      title: "",
      render: (_, record) => {
        return (
          <Button
            style={{ color: "#043DDC", fontWeight: "600" }}
            type="link"
            onClick={() => handleGetCertificateDetail(record.id)}
          >
            Details
          </Button>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) =>
      onSelectChange(selectedKeys, selectedRows),
  };

  const summary = (
    <>
      {" "}
      <Col span={8}>
        <Card>
          <Space align="start" size={16}>
            <AppstoreOutlined
              style={{
                fontSize: "32px",
                color: "#0057FF",
                marginTop: "4px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "24px" }}>10293</h3>
              <p style={{ margin: 0, color: "#5F6368" }}>Total Certificates</p>
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
                marginTop: "4px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "24px" }}>89</h3>
              <p style={{ margin: 0, color: "#5F6368" }}>
                Certificates Transferred
              </p>
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
                marginTop: "4px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "24px" }}>204</h3>
              <p style={{ margin: 0, color: "#5F6368" }}>
                Certificates Cancelled
              </p>
            </div>
          </Space>
        </Card>
      </Col>
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={224}
        style={{ background: "#fff", padding: "0 20px 0 10px" }}
      >
        <SideMenu />
      </Sider>
      <FilterTable
        summary={summary}
        tableName="Transfer history"
        columns={columns}
        filterComponents={filterComponents}
        tableActionBtns={btnList}
        defaultFilters={defaultFilters}
        dataSource={certificates}
        fetchTableData={fetchCertificatesData}
      />

      {/* Dialog component with a ref to control it from outside */}
    </Layout>
  );
};

export default Dashboard;
