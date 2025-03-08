import React, { useState } from 'react';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import axios from 'axios';
import { config } from '../config';

const Profile: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2FmYTc0MDY4ZjczNmYxMTJhZTFkNTEiLCJyYW5kb20iOjYwMTc3NywiaWF0IjoxNzQxNDA4MTIxLCJleHAiOjE3NDE0MTE3MjF9.8J-Es2F-3VOqzGxFQEPbiBDrPLDsM0jafeOQZlrqyJ8'; // Replace with your actual access token

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
      await axios.post(`${config.app.backend_url()}/resource/image/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Error uploading image. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Image uploaded successfully!</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Upload Image
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Profile; 