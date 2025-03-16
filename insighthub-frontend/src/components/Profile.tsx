import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import TopBar from './TopBar';
import api from '../serverApi';
import {getUserAuth} from "../handlers/userAuth.ts";

/// todo
const Profile: React.FC = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await api.get(`/user/${getUserAuth().userId}`);
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
          {profile && (
            <Typography variant="body1">
              {/* Add profile details here */}
              {JSON.stringify(profile)}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  </Box>
  );
};

export default Profile;