import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axios from "axios";
import AddPost from "../components/AddPost";
import { config } from "../config";
import { Post } from "../models/Post";
import TopBar from "../components/TopBar";


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const accessToken = localStorage.getItem(config.localStorageKeys.userAuth) as string;


  const handleCreatePost = () => {
    // Navigate to the "new post" page
    navigate('/new-post');
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    navigate('/login');
  };


  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${config.app.backend_url()}/post`,);
      setPosts(response.data as any[]);
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar/>
      {/* Main Layout */}
      <Box sx={{ display: "flex", flexGrow: 1, mt: "64px", px: 2 }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, maxWidth: "900px" }}>
        <Button variant="contained" color="primary" onClick={handleCreatePost}>
          Create Post
        </Button>
        <Box sx={{ width: '100%', maxHeight: '60vh', overflowY: 'auto', mt: 4 }}>
          <List>
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
                        {" — "}
                        <span dangerouslySetInnerHTML={{ __html: post.content }} />
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
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogContent>
              <AddPost onPostCreated={loadPosts} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
      </Box>
      </Box>
    </Box>

  );
};

export default Dashboard;
