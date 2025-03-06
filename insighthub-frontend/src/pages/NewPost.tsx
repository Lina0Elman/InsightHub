import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

const NewPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const accessToken = 'your_access_token_here'; // Replace with your actual access token

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.app.backend_url()}/post`, {
        title,
        content,
        sender: 'your_sender_id_here', // Replace with actual sender ID
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Post created:', response.data);
      navigate('/dashboard'); // Redirect to dashboard after successful post creation
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Create New Post
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Submit
          </Button>
          <Button 
            fullWidth 
            variant="outlined" 
            color="secondary" 
            onClick={() => navigate('/dashboard')} 
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default NewPost; 