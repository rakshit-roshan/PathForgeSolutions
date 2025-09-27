import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import DashboardOverview from '../components/DashboardOverview';
import EmployeeList from '../components/EmployeeList';

const Dashboard = () => (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f6fa' }}>
    <CssBaseline />
    <Sidebar />
    <Box sx={{ flexGrow: 1 }}>
      <TopBar />      <Box sx={{ p: 3 }}>
        <DashboardOverview />
        <EmployeeList />
      </Box>
    </Box>
  </Box>
);

export default Dashboard;