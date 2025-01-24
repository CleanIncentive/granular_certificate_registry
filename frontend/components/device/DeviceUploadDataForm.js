import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button, Space, Typography } from "antd";
import {
  DownloadOutlined,
  UploadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const DeviceUploadDialog = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    openDialog: () => setVisible(true),
    closeDialog: () => setVisible(false),
  }));

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting meter readings");
      setVisible(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <Modal
      title={
        <Space direction="vertical" size={2} style={{ width: "100%" }}>
          <div>
            <Text strong>Upload Data - Wind Farm </Text>
            <Text type="secondary">(98765)</Text>
          </div>
          <Text type="secondary">Date of the latest certificate:</Text>
          <Space>
            <CalendarOutlined style={{ color: "#5F6368" }} />
            <Text type="secondary" strong>
              03 May 2024
            </Text>
          </Space>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          style={{ backgroundColor: "#CEDAFD" }}
        >
          Submit meter readings
        </Button>,
      ]}
      width={480}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Space direction="vertical" size={4}>
          <Text strong>Upload Metering Data</Text>
          <Text type="secondary">
            Metering data for this device can be uploaded, this will trigger
            issuance of certificates for the device. Please download the CSV
            template below for details of the format to upload the data in:
          </Text>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            style={{ color: "#043DDC", fontWeight: 600, paddingLeft: 0 }}
          >
            Download CSV template
          </Button>
        </Space>

        <Button
          icon={<UploadOutlined />}
          style={{
            width: "100%",
            backgroundColor: "#EBF0FE",
            borderColor: "#9CB4FC",
            color: "#043DDC",
            fontWeight: 600,
          }}
        >
          Upload metering data
        </Button>
      </Space>
    </Modal>
  );
});

export default DeviceUploadDialog;
