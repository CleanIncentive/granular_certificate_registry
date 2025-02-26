import React, { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";

import { Layout, Button, Card, Col, Space, Input, Select } from "antd";

import {
  AppstoreOutlined,
  SwapOutlined,
  CloseCircleOutlined,
  LaptopOutlined,
  ThunderboltOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import "../../assets/styles/pagination.css";
import "../../assets/styles/filter.css";

import { useSelector } from "react-redux";
import { useAccount } from "../../context/AccountContext.js";
import { useNavigate } from "react-router-dom";

import DeviceRegisterDialog from "./DeviceRegisterForm";
import DeviceUploadDialog from "./DeviceUploadDataForm";

import FilterTable from "../common/FilterTable";

const { Option } = Select;
const { Search } = Input;

import { DEVICE_TECHNOLOGY_TYPE } from "../../enum";

const Device = () => {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);
  const { currentAccount } = useAccount();
  const devices = currentAccount?.devices || [];

  const interactAllowed =
    userInfo.role !== "TRADING_USER" && userInfo.role !== "AUDIT_USER";

  const defaultFilters = {
    device_id: null,
    technology_type: null,
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(defaultFilters);
  const [filteredDevices, setFiltersDevices] = useState(devices);
  const [searchKey, setSearchKey] = useState("");

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

    if (!currentAccount?.id) {
      navigate("/login");
      return;
    }
  }, [currentAccount, devices, navigate]);

  const pageSize = 10;
  const totalPages = Math.ceil(devices?.length / pageSize);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    // Apply the filter logic here
    const filteredDevices = devices.filter((device) => {
      // Check each filter
      const matchedFilters =
        (filters.device_id ? device.id === filters.device_id : true) &&
        (filters.technology_type
          ? device.technology_type === filters.technology_type.toLowerCase()
          : true);

      const searchFilter = !!searchKey
        ? device.device_name.toLowerCase().includes(searchKey.toLowerCase()) ||
          device.local_device_identifier
            .toLowerCase()
            .includes(searchKey.toLowerCase())
        : true;

      return matchedFilters && searchFilter;
    });

    setFiltersDevices(filteredDevices);
  };

  const handleClearFilter = async () => {
    setFilters(defaultFilters);
    setSearchKey("");
    setFiltersDevices(devices);
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

  const filterComponents = [
    <Search
      placeholder="Search for device..."
      onSearch={(value) => handleApplyFilter(value)}
      value={searchKey}
      onChange={(e) => setSearchKey(e.target.value)}
      enterButton={<SearchOutlined />}
      size="medium"
    />,
    /* Device Filter */
    <Select
      placeholder="Device"
      // mode="multiple"
      options={deviceOptions}
      value={filters.device_id}
      onChange={(value) => handleFilterChange("device_id", value)}
      style={{ width: 120 }}
      suffixIcon={<LaptopOutlined />}
      allowClear
    ></Select>,
    /* Technology Type filter */
    <Select
      placeholder="Technology Type"
      value={filters.technology_type}
      onChange={(value) => handleFilterChange("technology_type", value)}
      style={{ width: 150 }}
      suffixIcon={<ThunderboltOutlined />}
      allowClear
    >
      {Object.entries(DEVICE_TECHNOLOGY_TYPE).map(([key, value]) => (
        <Option key={key} value={key.toLocaleLowerCase()}>
          {value}
        </Option>
      ))}
    </Select>,
  ];

  const summary = (
    <>
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
              <h3 style={{ margin: 0, fontSize: "24px" }}>
                Wind: 5, Solar PV: 2
              </h3>
              <p style={{ margin: 0, color: "#5F6368" }}>
                Devices by Technology Type
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
              <h3 style={{ margin: 0, fontSize: "24px" }}>600 MW</h3>
              <p style={{ margin: 0, color: "#5F6368" }}>
                Total Device Capacity
              </p>
            </div>
          </Space>
        </Card>
      </Col>
    </>
  );

  const btnList = [
    {
      icon: <PlusCircleOutlined />,
      btnType: "primary",
      type: "add",
      style: { height: "40px" },
      name: "Add Device",
      handle: () => openDialog(),
    },
  ];

  return (
    <>
      <Layout>
        <FilterTable
          summary={summary}
          tableName="Device management"
          columns={columns}
          filterComponents={filterComponents}
          tableActionBtns={btnList}
          defaultFilters={defaultFilters}
          filters={filters}
          dataSource={filteredDevices}
          handleClearFilter={handleClearFilter}
          handleApplyFilter={handleApplyFilter}
        />
      </Layout>
      <DeviceRegisterDialog ref={deviceRegisterDialogRef} />
      <DeviceUploadDialog ref={deviceUploadDialogRef} />
    </>
  );
};

export default Device;
