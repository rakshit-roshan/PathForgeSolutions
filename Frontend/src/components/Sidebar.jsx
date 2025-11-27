import React from 'react';
import { 
  Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Toolbar 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon /> },
  { text: 'Employees', icon: <PeopleIcon /> },
  { text: 'Applications', icon: <AssignmentIcon /> },
  { text: 'Register Employee', icon: <PersonAddIcon /> },
  { text: 'Reports', icon: <BarChartIcon /> },
  { text: 'Settings', icon: <SettingsIcon /> },
  { text: 'Logout', icon: <LogoutIcon /> },
];

const drawerWidth = 250;
const collapsedWidth = 65;

const Sidebar = ({ open }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: open ? drawerWidth : collapsedWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      // Transitions for the container
      transition: (theme) => theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [`& .MuiDrawer-paper`]: {
        width: open ? drawerWidth : collapsedWidth,
        transition: (theme) => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        bgcolor: '#fff',
      },
    }}
  >
    {/* This Toolbar pushes the list down so it isn't hidden behind TopBar */}
    <Toolbar /> 
    
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center', // Center icon when collapsed
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto', // Add margin only when open
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            
            <ListItemText 
              primary={item.text} 
              sx={{ opacity: open ? 1 : 0 }} // Fade text out when collapsed
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default Sidebar;