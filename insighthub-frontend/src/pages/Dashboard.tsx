import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState<string>('');
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2FmYTc0MDY4ZjczNmYxMTJhZTFkNTEiLCJyYW5kb20iOjEyNzEsImlhdCI6MTc0MTA3NDQ3NSwiZXhwIjoxNzQxMDc4MDc1fQ.VQqlhKMY_Wt2rh4OussLNR0euFqQTpT345KLe5qNkj4'; // Replace with your actual access token

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${config.app.backend_url()}/post`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPosts(response.data as []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    // Navigate to the "new post" page
    navigate('/new-post');
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h3" gutterBottom>
          Dashboard
        </Typography>
        <Typography component="p" variant="body1" gutterBottom>
          Welcome to the Insight Hub Dashboard!
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreatePost}>
          Create Post
        </Button>
        <List sx={{ width: '100%', mt: 4 }}>
          {posts.map((post) => (
            <React.Fragment key={post._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={post.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {post.sender}
                      </Typography>
                      {" — " + post.content}
                    </React.Fragment>
                  }
                />
              </ListItem>
              {post.comments && post.comments.map((comment: any) => (
                <ListItem key={comment._id} sx={{ pl: 4 }}>
                  <ListItemText
                    primary={comment.sender}
                    secondary={comment.content}
                  />
                </ListItem>
              ))}
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Dashboard;