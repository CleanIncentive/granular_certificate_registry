import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button, Input, Select, Radio, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { transferCertificates } from "../store/certificates/certificateThunk"

const { Option } = Select;

const TransferCertificatesDialog = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [transferType, setTransferType] = useState("percentage");
  const [percentage, setPercentage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const { currentAccount } = useSelector((state) => state.account);
  const { userInfo } = useSelector((state) => state.user);

  // Expose methods to the parent component
  useImperativeHandle(ref, () => ({
    openDialog: () => setVisible(true),
    closeDialog: () => setVisible(false),
  }));

  const handleCancel = () => {
    setVisible(false);
    props.updateActionDialog(null);
  };

  const handleOk = async () => {
    try {
      const apiBody = {
        source_id: currentAccount.id,
        user_id: userInfo.userID,
        granular_certificate_bundle_ids: props.selectedRowKeys,
        localise_time: true,
        target_id: selectedAccount,
      };

      await dispatch(transferCertificates(apiBody)).unwrap();

      setVisible(false); // Close the dialog after confirming
      props.updateActionDialog(null);
      message.success("Transfer successful 🎉", 2);
    } catch (error) {
      message.error(`Transfer failed: ${error}`, 3);
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
        `You have selected {props.totalProduction} MWh of certificates to
        transfer from:`
      </p>
      <ul>
        {props.selectedDevices.map((device, index) => (
          <li key={index}>{device}</li>
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
        <div style={{ marginTop: "10px" }}>
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
        <div style={{ marginTop: "10px" }}>
          <label>Certificate quantity</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        {props.dialogAction === "transfer" ? (
          <label>Destination account</label>
        ) : (
          <label>Beneficiary</label>
        )}{" "}
        <Select
          value={selectedAccount}
          onChange={(value) => setSelectedAccount(value)}
          style={{ width: "100%" }}
        >
          {currentAccount.whiteList.map((account) => (
            <Option value={account.id} key={account.id}>
              {account.account_name}
            </Option>
          ))}{" "}
        </Select>
      </div>

      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <Button style={{ border: "1px solid #d9d9d9", color: "black" }}>
          Cancel
        </Button>

        {props.dialogAction === "transfer" ? (
          <Button type="primary">Transfer Certificates</Button>
        ) : (
          <Button type="primary">Cancel Certificates</Button>
        )}
      </div> */}
    </Modal>
  );
});

export default TransferCertificatesDialog;
