import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Alert, TextField } from '@mui/material';
import axios from 'axios';
import { config } from '../config';
import TopBar from '../components/TopBar';
import { LoginResponse } from '../models/LoginResponse';

const Profile: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse;

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        //setName(userData.name); todo
        setEmail(auth.email);
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
      const response = await axios.post(`${config.app.backend_url()}/resource/image/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${auth.accessToken}`,
        },
      });

      localStorage.setItem(config.localStorageKeys.userAuth, JSON.stringify({
        ...auth,
        imageFilename: (response.data as LoginResponse).imageFilename,
      }));
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Error uploading image. Please try again.');
    }
  };


  const handleUpdateProfile = async () => {
    try {
      await axios.put(`${config.app.backend_url()}/user/${auth._id}`, {
        name,
        email,
        password,
      }, {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
        },
      });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Error updating profile. Please try again.');
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
        {success && <Alert severity="success">Profile updated successfully!</Alert>}
        {image && <img src={image} alt="Profile" style={{ width: '200px', height: '200px', marginTop: '16px', objectFit: 'cover' }} />}
      
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {selectedFile && (
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
              Upload Image
            </Button>
          )}
        </form>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleUpdateProfile} sx={{ mt: 3, mb: 2 }}>
          Update Profile
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
