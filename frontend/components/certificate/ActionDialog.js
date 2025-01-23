import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Button, Input, Select, Radio } from 'antd';

const { Option } = Select;

const TransferCertificatesDialog = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [transferType, setTransferType] = useState('percentage');
  const [percentage, setPercentage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');

  // Expose methods to the parent component
  useImperativeHandle(ref, () => ({
    openDialog: () => setVisible(true),
    closeDialog: () => setVisible(false),
  }));

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    console.log('Transfer initiated');
    setVisible(false); // Close the dialog after confirming
  };

  const handleTransferTypeChange = (e) => {
    setTransferType(e.target.value);
  };

  return (
    <Modal
      title="Transferring - 3 certificates"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Transfer Certificates"
      cancelText="Cancel"
    >
      <p>You have selected 1234 MWh of certificates to transfer from:</p>
      <ul>
        <li>A Solare device</li>
        <li>B Wind farm</li>
      </ul>

      <div>
        <span>Choose Certificates by:</span>
        <Radio.Group onChange={handleTransferTypeChange} value={transferType}>
          <Radio value="percentage">Percentage</Radio>
          <Radio value="quantity">Quantity</Radio>
        </Radio.Group>
      </div>

      {transferType === 'percentage' ? (
        <div style={{ marginTop: '10px' }}>
          <label>Certificate percentage</label>
          <Input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            suffix="%"
            style={{ width: '100%' }}
          />
        </div>
      ) : (
        <div style={{ marginTop: '10px' }}>
          <label>Certificate quantity</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <label>Destination account</label>
        <Select
          value={destinationAccount}
          onChange={(value) => setDestinationAccount(value)}
          style={{ width: '100%' }}
        >
          <Option value="account1">Account 1</Option>
          <Option value="account2">Account 2</Option>
          <Option value="account3">Account 3</Option>
        </Select>
      </div>
    </Modal>
  );
});

export default TransferCertificatesDialog;
