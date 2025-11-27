import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu'; // Import the Hamburger Icon

const TopBar = ({ open, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" // Changed to fixed so it stays top
      elevation={1} 
      sx={{ 
        bgcolor: '#fff', 
        color: '#222',
        zIndex: (theme) => theme.zIndex.drawer + 1 // Important: Stays above Sidebar
      }}
    >
      <Toolbar>
        {/* HAMBURGER ICON */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          RasuTech Consulting Dashboard
        </Typography>

        {/* Existing User Logic */}
        {user && (
          <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
            Welcome, {user.email}
          </Typography>
        )}
        
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        
        <IconButton
          onClick={handleClick}
          color="inherit"
          sx={{ ml: 2 }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;