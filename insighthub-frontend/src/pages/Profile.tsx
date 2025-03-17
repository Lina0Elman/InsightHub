import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Alert, TextField, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import TopBar from '../components/TopBar';
import {getUserAuth, setUserAuth} from "../handlers/userAuth.ts";
import api from "../serverApi.ts";
import {UserProfile} from "../models/UserProfile.ts";

const Profile: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const auth = getUserAuth();
  const [profile, setProfile] = useState<UserProfile>();

  useEffect(() => {
    const fetchProfileImage = async (profile: UserProfile) => {
      try {
        const response = await api.get(`/resource/image/${profile?.imageFilename}`, {
          responseType: 'blob',
        });
        const imageUrl = URL.createObjectURL(response.data as Blob);
        setImage(imageUrl);
      } catch (error) {
        setError('Error fetching profile image.');
      }
    };

    const fetchProfile = async () => {
      const response = await api.get(`/user/${getUserAuth().userId}`);
      const userProfile = response.data as UserProfile;
      setProfile(userProfile);
      setUserName(userProfile.username);
      setEmail(userProfile.email);
      return userProfile;
    };
    fetchProfile().then((profile) => fetchProfileImage(profile));
  }, []);

  // useEffect(() => {
  //   const fetchProfileImage = async () => {
  //     try {
  //       const response = await api.get(`/resource/image/${auth.imageFilename}`, {
  //           responseType: 'blob',
  //         });
  //       const imageUrl = URL.createObjectURL(response.data as Blob);
  //         setImage(imageUrl);
  //     } catch (error) {
  //       setError('Error fetching profile image.');
  //     }
  //   };
  //   fetchProfileImage();
  // }, [auth.imageFilename]);

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
      const response = await api.post(`/resource/image/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      // setUserAuth({...auth, imageFilename: (response.data as LoginResponse).imageFilename})
      if (response.status === 201) {
        setSuccess(true);
        setError('');
        setTimeout(() => {
          setSuccess(false);
          window.location.reload();
        }, 3000);
      } else {
        setError('Error uploading image. Please try again.');
      }
    } catch (err) {
      setError('Error uploading image. Please try again.');
    }
  };


  const handleUpdateProfile = async () => {
    // todo route doesnt exist
    try {
      await api.patch(`/user/${auth.userId}`, {
        username,
        email,
        password,
      });
      setSuccess(true);
      setError('');
      setTimeout(() => {
        setSuccess(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError('Error updating profile. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '80vh', overflowY: 'auto', mt: 3 }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, flexGrow: 1, overflowY: isProfileOpen ? 'auto' : 'hidden' }}>
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
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 3 }}>
              Change profile Image
            </Button>
          )}
        </form>
        <Box sx={{ width: '100%', mt: 3, height: '70vh' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            endIcon={isProfileOpen ? <ExpandLess /> : <ExpandMore />}
            fullWidth
          >
            {isProfileOpen ? 'Hide' : 'Update Profile'}
          </Button>
          <Collapse in={isProfileOpen}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
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
              Save Changes
            </Button>
          </Collapse>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
