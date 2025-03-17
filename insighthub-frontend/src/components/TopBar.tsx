import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Tooltip, Box } from '@mui/material';
import { Home, Person, Message, Logout } from '@mui/icons-material';
import {getUserAuth, removeUserAuth} from "../handlers/userAuth.ts";
import api from "../serverApi.ts";

const TopBar: React.FC = () => {
  const userAuthRef = useRef(getUserAuth());
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (userAuthRef.current) {
      await api.post(`/auth/logout`, {
        refreshToken: userAuthRef.current.refreshToken,
      });
      removeUserAuth();
    }
    navigate('/logout');
  };

  return (
    <AppBar position="fixed" sx={{ width: '100vw', left: 0 }}>
      <Toolbar>
        <Tooltip title="Home">
          <IconButton color="inherit" onClick={() => navigate('/dashboard')} sx={{ mx: 1 }}>
            <Home fontSize='large'/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Profile">
          <IconButton color="inherit" onClick={() => navigate('/profile')} sx={{ mx: 1 }}>
            <Person fontSize='large'/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Messages">
          <IconButton color="inherit" onClick={() => null /*navigate('/messages')*/} sx={{ mx: 1 }}>
            <Message fontSize='large'/>
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
            <Logout fontSize='large'/>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;