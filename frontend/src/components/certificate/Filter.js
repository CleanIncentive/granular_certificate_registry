import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, Row, Col } from 'antd';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, RadialLinearScale);

const Summary = () => {
  // Data for Total Devices Pie chart
  const totalDevicesData = {
    labels: ['Solar pv', 'Wind turbine', 'chp', 'Other'],
    datasets: [
      {
        data: [493, 740, 493, 493],
        backgroundColor: ['#FFDD57', '#57FF57', '#FF4C4C', '#A0A0A0'],
      },
    ],
  };

  // Data for Total Capacity Pie chart
  const totalCapacityData = {
    labels: ['Solar pv', 'Wind turbine', 'chp', 'Other'],
    datasets: [
      {
        data: [31.223, 49.869, 8.993, 493],
        backgroundColor: ['#FFDD57', '#57FF57', '#FF4C4C', '#A0A0A0'],
      },
    ],
  };

  // Options for the Pie chart (to make it circular)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} MW`; // Adds MW to the tooltip
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16}>
        {/* Total Devices Pie Chart */}
        <Col span={12}>
          <Card title="6,421 Total Devices" bordered={false}>
            <Pie data={totalDevicesData} options={chartOptions} />
          </Card>
        </Col>

        {/* Total Capacity Pie Chart */}
        <Col span={12}>
          <Card title="6,421,039 MW Total Capacity" bordered={false}>
            <Pie data={totalCapacityData} options={chartOptions} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Summary;
