import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Tooltip, Box } from '@mui/material';
import { Home, Person, Message, Settings, Logout } from '@mui/icons-material';

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ width: '100vw', left: 0 }}>
      <Toolbar>
        <Tooltip title="Home">
          <IconButton color="inherit" onClick={() => navigate('/dashboard')} sx={{ mx: 1 }}>
            <Home />
          </IconButton>
        </Tooltip>
        <Tooltip title="Profile">
          <IconButton color="inherit" onClick={() => navigate('/profile')} sx={{ mx: 1 }}>
            <Person />
          </IconButton>
        </Tooltip>
        <Tooltip title="Messages">
          <IconButton color="inherit" onClick={() => null /*navigate('/messages')*/} sx={{ mx: 1 }}>
            <Message />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings">
          <IconButton color="inherit" onClick={() => null /*navigate('/settings')*/} sx={{ mx: 1 }}>
            <Settings />
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={() => navigate('/login')} sx={{ mx: 1 }}>
            <Logout />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;