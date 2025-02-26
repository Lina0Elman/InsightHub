import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Dashboard: React.FC = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
    navigate('/logout');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h3" gutterBottom>
          <h3>{localStorage.getItem('email')}</h3>
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