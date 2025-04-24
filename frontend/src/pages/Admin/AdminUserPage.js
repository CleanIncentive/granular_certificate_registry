import React, { useState, useEffect } from 'react';
import { Card, Typography, Tabs } from 'antd';
import CreateUserForm from '../../components/Admin/CreateUserForm';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminUserPage = () => {
  const [activeTab, setActiveTab] = useState('1');
  const { userInfo } = useSelector((state) => state.user);
  const [authorized, setAuthorized] = useState(false);
  
  useEffect(() => {
    // Log the current role to debug
    console.log('Current user role:', userInfo?.role);
    
    // Check if user role is admin (case-insensitive)
    if (userInfo?.role) {
      const isAdmin = 
        userInfo.role === 'admin' || 
        userInfo.role === 'ADMIN' || 
        userInfo.role === 4; // Admin role value
      
      setAuthorized(isAdmin);
    }
  }, [userInfo]);

  // Check if user is admin, redirect if not
  if (userInfo && !authorized) {
    console.log('Not authorized to access admin page, redirecting...');
    return <Navigate to="/" />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>User Administration</Title>
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane tab="Create User" key="1">
            <CreateUserForm />
          </TabPane>
          {/* Additional tabs can be added for user management features */}
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminUserPage; 