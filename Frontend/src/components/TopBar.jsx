import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const TopBar = () => (
  <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', color: '#222' }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Company Dashboard
      </Typography>
      <IconButton color="inherit">
        <NotificationsIcon />
      </IconButton>
      <Avatar sx={{ ml: 2 }}>U</Avatar>
    </Toolbar>
  </AppBar>
);

export default TopBar;