import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { Modal, Button, Input, Select, Radio, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  transferCertificates,
  cancelCertificates,
} from "../../store/certificate/certificateThunk.js";

const { Option } = Select;

const TransferCertificatesDialog = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [transferType, setTransferType] = useState("percentage");
  const [percentage, setPercentage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [beneficiary, setBeneficiary] = useState("");

  const { currentAccount } = useSelector((state) => state.account);
  const { userInfo } = useSelector((state) => state.user);

  // Expose methods to the parent component
  useImperativeHandle(ref, () => ({
    openDialog: () => setVisible(true),
    closeDialog: () => setVisible(false),
  }));

  const conditionalRendering = () => {
    switch (props.dialogAction) {
      case "cancel":
        return (
          <div style={{ marginTop: "24px", marginBottom: "48px" }}>
            <label>Beneficiary</label>
            <Input
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        );
        return;
      default:
        return (
          <div style={{ marginTop: "24px", marginBottom: "48px" }}>
            <label>Destination account</label>
            <Select
              value={selectedAccount}
              onChange={(value) => setSelectedAccount(value)}
              style={{ width: "100%" }}
            >
              {currentAccount.whiteListInverse.map((account) => (
                <Option value={account.id} key={account.id}>
                  {account.account_name}
                </Option>
              ))}{" "}
            </Select>
          </div>
        );
        return;
    }
  };

  const handleCancel = () => {
    setVisible(false);
    props.updateCertificateActionDialog(null);
  };

  const handleOk = async () => {
    try {
      let apiBody = {
        source_id: currentAccount.id,
        user_id: userInfo.userID,
        granular_certificate_bundle_ids: props.selectedRowKeys,
        localise_time: true,
        action_type: props.dialogAction,
      };

      switch (props.dialogAction) {
        case "cancel":
          apiBody = { ...apiBody, beneficiary: selectedAccount };
          await dispatch(cancelCertificates(apiBody)).unwrap();
          break;
        default:
          apiBody = { ...apiBody, target_id: selectedAccount };
          await dispatch(transferCertificates(apiBody)).unwrap();
          break;
      }

      setVisible(false); // Close the dialog after confirming
      props.updateCertificateActionDialog(null);
      message.success(
        `${
          props.dialogAction.charAt(0).toUpperCase() +
          props.dialogAction.slice(1)
        } successful 🎉`,
        2
      );
    } catch (error) {
      message.error(
        `${
          props.dialogAction.charAt(0).toUpperCase() +
          props.dialogAction.slice(1)
        } failed: ${error}`,
        3
      );
    }
  };

  const handleTransferTypeChange = (e) => {
    setTransferType(e.target.value);
  };

  return (
    <Modal
      title={
        props.dialogAction === "transfer"
          ? `Transferring - ${props.selectedRowKeys.length} certificates`
          : `Canceling - ${props.selectedRowKeys.length} certificates`
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={
        props.dialogAction === "transfer"
          ? "Transfer Certificates"
          : "Cancel Certificates"
      }
      cancelText="Cancel"
      okButtonProps={{
        style:
          props.dialogAction === "cancel"
            ? {
                backgroundColor: "#F04438",
              }
            : {
                backgroundColor: "#3F6CF7",
              },
      }}
    >
      <p>
        You have selected {props.totalProduction / 1e6} MWh of certificates to{" "}
        {props.dialogAction} from:{" "}
      </p>
      <ul>
        {props.selectedDevices.map((device, index) => (
          <li key={index}>{props.getDeviceName(device)}</li>
        ))}
      </ul>
      <div>
        <span>Choose Certificates by:</span>
        <Radio.Group
          onChange={handleTransferTypeChange}
          value={transferType}
          style={{ marginLeft: "12px" }}
        >
          <Radio value="percentage">Percentage</Radio>
          <Radio value="quantity">Quantity</Radio>
        </Radio.Group>
      </div>

      {transferType === "percentage" ? (
        <div style={{ marginTop: "24px" }}>
          <label>Certificate percentage</label>
          <Input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            suffix="%"
            style={{ width: "100%" }}
          />
        </div>
      ) : (
        <div style={{ marginTop: "24px" }}>
          <label>Certificate quantity</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      )}
      {conditionalRendering()}
    </Modal>
  );
});

export default TransferCertificatesDialog;
