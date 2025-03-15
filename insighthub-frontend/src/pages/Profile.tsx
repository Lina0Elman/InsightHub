import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import axios from 'axios';
import { config } from '../config';
import TopBar from '../components/TopBar';
import { LoginResponse } from '../models/LoginResponse';

const Profile: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const auth = JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`${config.app.backend_url()}/resource/image/${auth.imageFilename}`, {
          responseType: 'blob',
        });
        const imageUrl = URL.createObjectURL(response.data as Blob);
        setImage(imageUrl);
      } catch (error) {
        setError('Error fetching profile image.');
      }
    };
    fetchProfileImage();
  }, [auth.imageFilename]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(`${config.app.backend_url()}/resource/image/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${auth.accessToken}`,
        },
      });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Error uploading image. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, flexGrow: 1 }}>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Image uploaded successfully!</Alert>}
        {image && <img src={image} alt="Profile" style={{ width: '200px', height: '200px', marginTop: '16px', objectFit: 'cover' }} />}
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
