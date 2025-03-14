import React, { useRef } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import axios from 'axios';
import { LoginResponse } from '../models/LoginResponse';


const Dashboard: React.FC = () => {
  const userAuthRef = useRef(JSON.parse(localStorage.getItem("userAuth") as string) as LoginResponse);
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Logout clicked');
    if (userAuthRef.current) {
      await axios.post(`${config.app.backend_url()}/auth/logout`, {
        refreshToken: userAuthRef.current.refreshToken,
      });
      localStorage.removeItem("userAuth");
    }
    navigate('/logout');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box style={{ backgroundColor: 'lightgray', padding: '10px', borderRadius: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h3" gutterBottom>
          <p>{userAuthRef.current.email}</p>
        </Typography>

        <Typography component="p" variant="body1" gutterBottom>
          Welcome to the Insight Hub Dashboard!
        </Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>


  );
};

export default Dashboard;