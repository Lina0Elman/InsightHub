import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  List,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Favorite, Message, Delete } from '@mui/icons-material';
import axios from "axios";
import { config } from "../config";
import { Post } from "../models/Post";
import TopBar from "../components/TopBar";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);
  const auth = JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string);

  const handleCreatePost = () => {
    // Navigate to the "new post" page
    navigate('/new-post');
  };

  const handleDeletePost = async () => {
    if (postIdToDelete) {
      try {
        await axios.delete(`${config.app.backend_url()}/post/${postIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setPosts(posts.filter(post => post._id !== postIdToDelete));
        setOpenDialog(false);
        setPostIdToDelete(null);
      } catch (err) {
        console.error("Failed to delete post:", err);
      }
    }
  };

  const handleOpenDialog = (e: React.FormEvent, postId: string) => {
    e.stopPropagation();
    setPostIdToDelete(postId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPostIdToDelete(null);
  };

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${config.app.backend_url()}/post`);
      const postsData = response.data as Post[];
      setPosts(postsData);

      // Fetch comments count for each post
      const commentsCountData: { [key: string]: number } = {};
      await Promise.all(
        postsData.map(async (post) => {
          const commentsResponse = await axios.get(`${config.app.backend_url()}/comment/post/${post._id}`);
          commentsCountData[post._id] = (commentsResponse.data  as Comment[]).length;
        })
      );
      setCommentsCount(commentsCountData);
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

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      {/* Main Layout */}
      <Box sx={{ display: "flex", flexGrow: 1, mt: "64px", px: 2 }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, maxWidth: "900px" }}>
          <Box sx={{ width: '100%', maxHeight: '60vh', overflowY: 'auto', mt: 4 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <List>
                {posts.map((post) => (
                  <React.Fragment key={post._id}>
                    <Card sx={{ 
                      mb: 2,
                      width: '80vh',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      },
                    }} onClick={() => navigate(`/post/${post._id}`)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ mr: 2 }}>{post.sender.charAt(0)}</Avatar> {/* make the avatar either the profile pic or the curr one */}
                          <Typography variant="h6">{post.sender}</Typography>
                        </Box>
                        <Typography variant="h5" component="div">
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          <span dangerouslySetInnerHTML={{ __html: post.content }} />
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                          <Favorite />
                        </IconButton>
                        <IconButton aria-label="comments" sx={{ marginLeft: 'auto' }}>
                          <Badge badgeContent={commentsCount[post._id] || 0} color="primary">
                            <Message />
                          </Badge>
                        </IconButton>
                        {post.sender === auth._id && (
                          <IconButton aria-label="delete" onClick={(e) => handleOpenDialog(e, post._id)}>
                            <Delete />
                          </IconButton>
                        )}
                      </CardActions>
                    </Card>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
          <Button variant="contained" color="primary" onClick={handleCreatePost}>
            Create New Post
          </Button>
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePost} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
