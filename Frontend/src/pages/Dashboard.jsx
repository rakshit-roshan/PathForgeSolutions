import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import DashboardOverview from '../components/DashboardOverview';
import EmployeeList from '../components/EmployeeList';

const Dashboard = () => {
  // 1. STATE: Controls if sidebar is Expanded (true) or Collapsed (false)
  const [open, setOpen] = useState(true);

  // 2. TOGGLE: Passed to TopBar to trigger the change
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* TOP BAR: Fixed at the top */}
      <TopBar open={open} handleDrawerToggle={toggleDrawer} />

      {/* SIDEBAR: Slides in/out based on 'open' state */}
      <Sidebar open={open} />

      {/* MAIN CONTENT */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          bgcolor: '#f5f6fa', 
          height: '100vh', 
          overflow: 'auto', // Content scrolls, TopBar stays fixed
          width: '100%' 
        }}
      >
        {/* Spacer: Ensures content isn't hidden behind TopBar */}
        <Toolbar /> 
        
        <DashboardOverview />
        <EmployeeList />
      </Box>
    </Box>
  );
};

export default Dashboard;