import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Card, Typography, Divider } from 'antd';
import { useDispatch } from 'react-redux';
import { createUser } from '../../store/user/userThunk';
import { UserRoles } from '../../models/enums';

const { Option } = Select;
const { Title, Text } = Typography;

// Get user roles from the enum for consistency with backend
const userRolesOptions = [
  { value: UserRoles.ADMIN, label: 'Admin' },
  { value: UserRoles.PRODUCTION_USER, label: 'Production User' },
  { value: UserRoles.TRADING_USER, label: 'Trading User' },
  { value: UserRoles.AUDIT_USER, label: 'Audit User' }
];

const CreateUserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Creating user with data:', values);
      
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        organisation: values.organisation || null
      };
      
      await dispatch(createUser(userData)).unwrap();
      message.success('User created successfully');
      form.resetFields();
    } catch (error) {
      console.error('Error creating user:', error);
      message.error(error?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={4}>Create New User</Title>
      <Text type="secondary">
        Create a new user with the specified role and permissions
      </Text>
      <Divider />
      
      <Form
        form={form}
        name="createUser"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter user name' }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email address' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          name="role"
          label="User Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select a role">
            {userRolesOptions.map(role => (
              <Option key={role.value} value={role.value}>
                {role.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="organisation"
          label="Organisation"
        >
          <Input placeholder="Organisation name (optional)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateUserForm; 