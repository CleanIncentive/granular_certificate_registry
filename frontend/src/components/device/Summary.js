import React from "react";
import { Pie } from "react-chartjs-2";
import { Card, Row, Col, Typography } from "antd";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
} from "chart.js";

import { useAccount } from "../../context/AccountContext";

import * as styles from "./Device.module.css";

import { DEVICE_TECHNOLOGY_TYPE } from "../../enum";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale
);

const backgroundColor = [
  "#9CB4FC",
  "#FDB022",
  "#F04438",
  "#1D53F7",
  "#34C759",
  "#BDC1C6",
];

const Summary = () => {
  const { currentAccount, saveAccountDetail } = useAccount();

  // Number of Devices chart data
  const numDevicesLabels = Object.keys(
    currentAccount?.summary.num_devices_by_type || {}
  ).map((key) => DEVICE_TECHNOLOGY_TYPE[key.toUpperCase()] || key);
  const numDevicesData = Object.values(
    currentAccount?.summary.num_devices_by_type || {}
  );
  const totalNumDevices = numDevicesData.reduce(
    (total, numDevices) => total + numDevices,
    0
  );

  // Total capacity of Devices chart data
  const deviceCapacityLabels = Object.keys(
    currentAccount?.summary.device_capacity_by_type || {}
  ).map((key) => DEVICE_TECHNOLOGY_TYPE[key.toUpperCase()] || key);
  const deviceCapacityData = Object.values(
    currentAccount?.summary.device_capacity_by_type || {}
  );
  const totalCapacityDevices = deviceCapacityData.reduce(
    (total, capacityDevices) => total + capacityDevices,
    0
  );

  // Data for Total Devices Pie chart
  const totalDevicesData = {
    labels: numDevicesLabels,
    datasets: [
      {
        data: numDevicesData,
        backgroundColor,
      },
    ],
  };

  // Data for Total Capacity Pie chart
  const totalCapacityData = {
    labels: deviceCapacityLabels,
    datasets: [
      {
        data: deviceCapacityData,
        backgroundColor,
      },
    ],
  };

  // Options for the Pie chart (to make it circular)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} MW`; // Adds MW to the tooltip
          },
        },
      },
    },
    cutout: "70%",
  };

  const chartStyle = {
    maxHeight: "120px",
    maxWidth: "120px",
    flex: "1",
  };

  // Custom Legend Component for the image style
  const CustomLegend = ({ labels, colors, data, title, isCapacity }) => {
    return (
      <>
        <Typography.Title style={{ margin: "0" }} level={5}>
          {title}
        </Typography.Title>
        <div
          style={{
            // padding: "10px",
            marginTop: "8px",
            fontSize: "14px",
            display: "flex",
            justifyContent: "flex-start",
            flexFlow: "row wrap",
          }}
        >
          {labels.map((label, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                width: "50%",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: colors[index],
                  marginRight: "10px",
                }}
              ></div>
              <span style={{ fontWeight: "bold" }}>{data[index]}</span>
              {isCapacity && (
                <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
                  {" MW"}
                </span>
              )}
              <span style={{ marginLeft: "8px" }}>{` ${label}`}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <Row gutter={16} style={{ width: "100%" }}>
      {/* Total Devices Pie Chart */}
      <Col span={12}>
        <Card bordered={false}>
          <div className={styles["card-body"]}>
            <div
              style={{
                maxWidth: "50%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pie
                data={totalDevicesData}
                options={chartOptions}
                style={chartStyle}
              />
            </div>

            <div style={{ width: "90%" }}>
              <CustomLegend
                labels={numDevicesLabels}
                colors={backgroundColor}
                data={numDevicesData}
                title={`${totalNumDevices} Total Devices`}
              />
            </div>
          </div>
        </Card>
      </Col>

      {/* Total Capacity Pie Chart */}
      <Col span={12}>
        <Card bordered={false}>
          <div className={styles["card-body"]}>
            <Pie
              data={totalCapacityData}
              options={chartOptions}
              style={chartStyle}
            />
            <div style={{ width: "90%" }}>
              <CustomLegend
                labels={deviceCapacityLabels}
                colors={backgroundColor}
                data={deviceCapacityData}
                title={`${totalCapacityDevices} MW Total Capacity`}
                isCapacity={true}
              />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Summary;
