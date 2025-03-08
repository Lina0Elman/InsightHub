import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../config';
import { Box, Paper, Typography } from '@mui/material';
import TopBar from './TopBar';

/// todo
const Profile: React.FC = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(`${config.app.backend_url()}/auth/profile`);
      setProfile(response.data as any);
    };
    fetchProfile();
  }, []);


  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <TopBar />
    <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px', px: 2 }}>
      <Box sx={{ flexGrow: 1, maxWidth: '900px' }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            User Profile
          </Typography>
          {/* Add profile details here */}
        </Paper>
      </Box>
    </Box>
  </Box>
  );
};

export default Profile;