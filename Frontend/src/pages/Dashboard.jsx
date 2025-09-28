import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import DashboardOverview from '../components/DashboardOverview';
import EmployeeList from '../components/EmployeeList';

const Dashboard = () => (
  <Box sx={{ 
    display: 'flex', 
    minHeight: '100vh', 
    bgcolor: '#f5f6fa',
    width: '100vw',
    overflow: 'hidden'
  }}>
    <CssBaseline />
    <Sidebar />
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <TopBar />
      <Box sx={{ 
        p: 3, 
        flex: 1, 
        overflow: 'auto',
        height: 'calc(100vh - 64px)' // Adjust based on TopBar height
      }}>
        <DashboardOverview />
        <EmployeeList />
      </Box>
    </Box>
  </Box>
);

export default Dashboard;