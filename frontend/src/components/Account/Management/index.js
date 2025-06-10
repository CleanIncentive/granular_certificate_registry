import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Input, Typography, message, Space, Tree, Tag, InputNumber, Row, Col, Upload, Tabs } from 'antd';
import { PlusOutlined, FolderOutlined, TeamOutlined, UploadOutlined } from '@ant-design/icons';
import { useUser } from '../../../context/UserContext';
import { getSessionStorage } from '../../../utils';

const { Title, Text } = Typography;

const AccountManagement = () => {
  const { userData } = useUser();
  const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] = useState(false);
  const [isConfigureSubAccountsModalVisible, setIsConfigureSubAccountsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bulkSubaccounts, setBulkSubaccounts] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const createAccountForm = Form.useForm()[0];
  const configureSubAccountsForm = Form.useForm()[0];
  const createSubAccountForm = Form.useForm()[0];

  // Mock account hierarchy data
  const [mockAccounts, setMockAccounts] = useState([
    {
      key: '1',
      title: 'White River Solar Project',
      icon: <FolderOutlined />,
      totalGCs: 1000000,
      allocatedGCs: 750000,
      children: [
        {
          key: '1-1',
          title: 'Sub-account A',
          icon: <TeamOutlined />,
          allocatedGCs: 400000,
          allocationShare: 40,
        },
        {
          key: '1-2',
          title: 'Sub-account B',
          icon: <TeamOutlined />,
          allocatedGCs: 350000,
          allocationShare: 35,
        },
      ],
    },
    {
      key: '2',
      title: 'Trading Account',
      icon: <FolderOutlined />,
      totalGCs: 500000,
      allocatedGCs: 500000,
      children: [
        {
          key: '2-1',
          title: 'Sub-account C',
          icon: <TeamOutlined />,
          allocatedGCs: 500000,
          allocationShare: 100,
        },
      ],
    },
  ]);

  // Use sessionStorage data if API fails
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUserData = getSessionStorage('user_data');
        if (storedUserData) {
          console.log('Using sessionStorage user data:', storedUserData);
          setIsLoading(false);
        } else if (userData) {
          console.log('Using context user data:', userData);
          setIsLoading(false);
        } else {
          console.log('No user data available, showing with mock data');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsLoading(false);
      }
    };

    loadUserData();

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [userData]);

  const handleCreateAccount = async (values) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMockAccounts(prev => [
        ...prev,
        {
          key: `acc-${Date.now()}`,
          title: values.accountName,
          icon: <FolderOutlined />,
          totalGCs: 0,
          allocatedGCs: 0,
          children: [],
        }
      ]);
      message.success('Account created successfully!');
      setIsCreateAccountModalVisible(false);
      createAccountForm.resetFields();
    } catch (error) {
      message.error('Failed to create account');
    }
  };

  const handleConfigureSubAccounts = (account) => {
    setSelectedAccount(account);
    setIsConfigureSubAccountsModalVisible(true);
    
    // Pre-populate the form with current allocation values
    const initialValues = {};
    account.children?.forEach(child => {
      initialValues[child.key] = {
        share: child.allocationShare,
        amount: child.allocatedGCs,
      };
    });
    configureSubAccountsForm.setFieldsValue(initialValues);
  };

  const handleUpdateAllocations = async (values) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the mock data with new allocations
      const updatedAccounts = mockAccounts.map(account => {
        if (account.key === selectedAccount.key) {
          const updatedChildren = account.children?.map(child => {
            const allocation = values[child.key];
            if (allocation) {
              const share = allocation.share || 0;
              const amount = Math.round((share / 100) * (account.totalGCs || 0));
              return {
                ...child,
                allocatedGCs: amount,
                allocationShare: share,
              };
            }
            return child;
          });
          
          const totalAllocated = updatedChildren?.reduce((sum, child) => sum + (child.allocatedGCs || 0), 0) || 0;
          
          return {
            ...account,
            children: updatedChildren,
            allocatedGCs: totalAllocated,
          };
        }
        return account;
      });
      
      setMockAccounts(updatedAccounts);
      message.success('Sub-account allocations updated successfully!');
      setIsConfigureSubAccountsModalVisible(false);
      configureSubAccountsForm.resetFields();
      setSelectedAccount(null);
    } catch (error) {
      message.error('Failed to update allocations');
    }
  };

  const handleCreateSubAccount = async (values) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sharePercentage = values.share || 0;
      const totalAvailableGCs = selectedAccount?.totalGCs || 0;
      const calculatedAmount = Math.round((sharePercentage / 100) * totalAvailableGCs);

      const newSubAccount = {
        key: `sub-${Date.now()}`,
        title: values.subAccountName,
        icon: <TeamOutlined />,
        allocatedGCs: calculatedAmount,
        allocationShare: sharePercentage,
      };

      setMockAccounts(prev => prev.map(account => {
        if (account.key === selectedAccount.key) {
          return {
            ...account,
            children: [...(account.children || []), newSubAccount],
          };
        }
        return account;
      }));
      
      message.success(`Sub-account "${values.subAccountName}" created with ${calculatedAmount.toLocaleString()} GCs (${sharePercentage}%)`);
      createSubAccountForm.resetFields();
      
      // Update the configure form to include the new sub-account
      const currentValues = configureSubAccountsForm.getFieldsValue();
      configureSubAccountsForm.setFieldsValue({
        ...currentValues,
        [newSubAccount.key]: {
          share: sharePercentage,
          amount: calculatedAmount,
        }
      });
    } catch (error) {
      message.error('Failed to create sub-account');
    }
  };

  const parseCSV = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      const result = [];
      for (const line of lines) {
        const [subAccountName, share] = line.split(',').map(s => s.trim());
        if (!subAccountName || isNaN(Number(share))) continue;
        result.push({ subAccountName, share: Number(share) });
      }
      callback(result);
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = (info) => {
    setIsBulkLoading(true);
    setBulkError('');
    const file = info.file.originFileObj;
    parseCSV(file, (rows) => {
      setBulkSubaccounts(rows);
      setIsBulkLoading(false);
    });
  };

  const handleBulkCreate = () => {
    // Validate total share
    const totalShare = bulkSubaccounts.reduce((sum, row) => sum + (row.share || 0), 0);
    if (totalShare > 100) {
      setBulkError('Total allocation exceeds 100%.');
      return;
    }
    
    // Add subaccounts to selectedAccount
    const totalAvailableGCs = selectedAccount?.totalGCs || 0;
    const newSubs = bulkSubaccounts.map((row) => ({
      key: `bulk-${Date.now()}-${row.subAccountName}`,
      title: row.subAccountName,
      icon: <TeamOutlined />,
      allocatedGCs: Math.round((row.share / 100) * totalAvailableGCs),
      allocationShare: row.share,
    }));
    
    setMockAccounts(prev => prev.map(account => {
      if (account.key === selectedAccount.key) {
        return {
          ...account,
          children: [...(account.children || []), ...newSubs],
        };
      }
      return account;
    }));
    
    setBulkSubaccounts([]);
    message.success('Bulk sub-accounts created and allocated!');
  };

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      const selectedKey = selectedKeys[0];
      const account = mockAccounts.find(acc => acc.key === selectedKey);
      if (account) {
        setSelectedAccount(account);
      }
    } else {
      setSelectedAccount(null);
    }
  };

  // Convert accounts to tree data format
  const treeData = mockAccounts.map(account => ({
    key: account.key,
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {account.icon}
        <span style={{ fontWeight: '600' }}>{account.title}</span>
        <Tag color="blue">{account.totalGCs?.toLocaleString() || 0} GCs</Tag>
      </div>
    ),
    children: account.children?.map(child => ({
      key: child.key,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {child.icon}
          <span>{child.title}</span>
          <Tag color="green">{child.allocatedGCs?.toLocaleString() || 0} GCs</Tag>
          <Tag color="orange">{child.allocationShare || 0}%</Tag>
        </div>
      ),
    })) || [],
  }));

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading account management...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          Account Hierarchy
        </Title>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsCreateAccountModalVisible(true)}
          >
            Create Account
          </Button>
          {selectedAccount && (
            <Button 
              icon={<TeamOutlined />}
              onClick={() => handleConfigureSubAccounts(selectedAccount)}
            >
              Configure Sub-Accounts
            </Button>
          )}
        </Space>
      </div>

      <Card style={{ 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          padding: '16px 16px 0 16px',
          marginBottom: '16px'
        }}>
          {selectedAccount && (
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Selected: {selectedAccount.title}
            </Text>
          )}
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          <Tree
            showLine
            defaultExpandAll
            onSelect={onSelect}
            treeData={treeData}
            style={{ fontSize: '14px' }}
          />
        </div>
      </Card>

      {/* Create Account Modal */}
      <Modal
        title="Create New Account"
        open={isCreateAccountModalVisible}
        onCancel={() => {
          setIsCreateAccountModalVisible(false);
          createAccountForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={createAccountForm}
          layout="vertical"
          onFinish={handleCreateAccount}
        >
          <Form.Item
            label="Account Name"
            name="accountName"
            rules={[{ required: true, message: 'Please enter account name' }]}
          >
            <Input placeholder="Enter account name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea placeholder="Enter account description" rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Account
              </Button>
              <Button onClick={() => {
                setIsCreateAccountModalVisible(false);
                createAccountForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Configure Sub-Accounts Modal */}
      <Modal
        title={`Configure Sub-Accounts - ${selectedAccount?.title}`}
        open={isConfigureSubAccountsModalVisible}
        onCancel={() => {
          setIsConfigureSubAccountsModalVisible(false);
          configureSubAccountsForm.resetFields();
          createSubAccountForm.resetFields();
          setSelectedAccount(null);
          setBulkSubaccounts([]);
          setBulkError('');
        }}
        footer={null}
        width={900}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Total Available GCs: {selectedAccount?.totalGCs?.toLocaleString() || 0}</Text>
          <br />
          <Text type="secondary">
            Already Allocated: {selectedAccount?.allocatedGCs?.toLocaleString() || 0} GCs
          </Text>
          <br />
          <Text type="secondary">
            Remaining: {(selectedAccount?.totalGCs || 0) - (selectedAccount?.allocatedGCs || 0)} GCs
          </Text>
        </div>
        
        <Tabs defaultActiveKey="existing">
          <Tabs.TabPane tab="Existing Sub-Accounts" key="existing">
            <Form
              form={configureSubAccountsForm}
              layout="vertical"
              onFinish={handleUpdateAllocations}
            >
              {selectedAccount?.children?.map((child) => (
                <Card key={child.key} size="small" style={{ marginBottom: '12px' }}>
                  <Row gutter={16} align="middle">
                    <Col span={8}>
                      <Text strong>{child.title}</Text>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Share (%)"
                        name={[child.key, 'share']}
                        style={{ marginBottom: '8px' }}
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          placeholder="0"
                          addonAfter="%"
                          style={{ width: '100%' }}
                          onChange={(value) => {
                            const totalAvailableGCs = selectedAccount?.totalGCs || 0;
                            const calculatedAmount = Math.round(((value || 0) / 100) * totalAvailableGCs);
                            configureSubAccountsForm.setFieldsValue({
                              [child.key]: {
                                ...configureSubAccountsForm.getFieldValue(child.key),
                                amount: calculatedAmount,
                                share: value,
                              }
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Amount (GCs)"
                        name={[child.key, 'amount']}
                        style={{ marginBottom: '8px' }}
                      >
                        <InputNumber
                          disabled
                          placeholder="0"
                          style={{ width: '100%' }}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Update Allocations
                  </Button>
                  <Button onClick={() => {
                    setIsConfigureSubAccountsModalVisible(false);
                    configureSubAccountsForm.resetFields();
                    createSubAccountForm.resetFields();
                    setSelectedAccount(null);
                  }}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="Create New" key="create">
            <Card size="small" style={{ backgroundColor: '#f8f9fa' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>Create New Sub-Account</Title>
              <Form
                form={createSubAccountForm}
                layout="vertical"
                onFinish={handleCreateSubAccount}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Sub-Account Name"
                      name="subAccountName"
                      rules={[{ required: true, message: 'Please enter sub-account name' }]}
                    >
                      <Input placeholder="Enter sub-account name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Share (%)"
                      name="share"
                      rules={[{ required: true, message: 'Please enter share percentage' }]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        placeholder="0"
                        addonAfter="%"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Create Sub-Account
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="Bulk Upload" key="bulk">
            <Card size="small" style={{ backgroundColor: '#f8f9fa', marginBottom: 16 }}>
              <Title level={5} style={{ marginBottom: '16px' }}>Bulk Create & Allocate Sub-Accounts</Title>
              <Upload
                accept=".csv"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleBulkUpload}
                disabled={isBulkLoading}
              >
                <Button icon={<UploadOutlined />} loading={isBulkLoading}>
                  Upload CSV (subAccountName,share)
                </Button>
              </Upload>
              <div style={{ marginTop: 12, color: '#888' }}>
                Example: <code>Subaccount X,25</code>
              </div>
            </Card>
            {bulkSubaccounts.length > 0 && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 8 }}>Preview</Title>
                <Table
                  dataSource={bulkSubaccounts.map((row, idx) => ({ ...row, key: idx }))}
                  columns={[
                    { title: 'Sub-Account Name', dataIndex: 'subAccountName', key: 'subAccountName' },
                    { title: 'Share (%)', dataIndex: 'share', key: 'share' },
                    { title: 'GCs', key: 'gcs', render: (_, row) => {
                      const totalAvailableGCs = selectedAccount?.totalGCs || 0;
                      return Math.round((row.share / 100) * totalAvailableGCs).toLocaleString();
                    } },
                  ]}
                  pagination={false}
                  size="small"
                />
                <div style={{ marginTop: 8 }}>
                  Total Share: <b>{bulkSubaccounts.reduce((sum, row) => sum + (row.share || 0), 0)}%</b>
                </div>
                {bulkError && <div style={{ color: 'red', marginTop: 8 }}>{bulkError}</div>}
                <Button type="primary" style={{ marginTop: 12 }} onClick={handleBulkCreate}>
                  Create & Allocate
                </Button>
              </Card>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default AccountManagement;
