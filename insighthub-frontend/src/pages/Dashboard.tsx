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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Favorite, Message, Delete } from '@mui/icons-material';
import { Post } from "../models/Post";
import TopBar from "../components/TopBar";
import api from "../serverApi";
import {getUserAuth} from "../handlers/userAuth.ts";
import defaultProfileImage from '../assets/defaultProfileImage.jpg'; // Import the default profile image


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);
  const [filterByUser, setFilterByUser] = useState(false);
  const [profileImages, setProfileImages] = useState<{ [key: string]: string }>({});
  const auth = getUserAuth();

  const handleCreatePost = () => {
    // Navigate to the "new post" page
    navigate('/new-post');
  };

  const handleDeletePost = async () => {
    if (postIdToDelete) {
      try {
        await api.delete(`/post/${postIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setPosts(posts.filter(post => post.id !== postIdToDelete));
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

  const fetchProfileImage = async (imageFilename: string | null) => {
    try {
      if (!imageFilename) {
        return defaultProfileImage; // Return default image if no filename exists
      }
      const response = await api.get(`/resource/image/${imageFilename}`, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data as Blob);
    } catch (error) {
      console.error('Error fetching profile image:', error);
      return defaultProfileImage; // Return default image on error
    }
  };

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/post`, {
        params: filterByUser ? { owner: auth.userId } : {},
      });
      const postsData = response.data as Post[];
      setPosts(postsData);

      // Fetch profile images for each post owner
      const images: { [key: string]: string } = {};
      await Promise.all(
        postsData.map(async (post) => {
          const imageUrl = await fetchProfileImage(post.ownerProfileImage as string);
          images[post.owner] = imageUrl;
        })
      );
      setProfileImages(images);

      // Fetch comments count for each post
      const commentsCountData: { [key: string]: number } = {};
      await Promise.all(
        postsData.map(async (post) => {
          const commentsResponse = await api.get(`/comment/post/${post.id}`);
          commentsCountData[post.id] = (commentsResponse.data  as Comment[]).length;
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
  }, [filterByUser]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      {/* Main Layout */}
      <Box sx={{ display: "flex", flexGrow: 1, mt: "64px", px: 2 }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, maxWidth: "900px" }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreatePost} sx={{ mr: 5 }}>
              Create New Post
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={filterByUser}
                  onChange={() => setFilterByUser(!filterByUser)}
                  color="primary"
                />
              }
              label="Show My Posts"
            />
          </Box>
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
                  <React.Fragment key={post.id}>
                    <Card sx={{
                      mb: 2,
                      width: '80vh',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      },
                    }} onClick={() => navigate(`/post/${post.id}`)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src={profileImages[post.owner] || defaultProfileImage}
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="h6">{post.owner}</Typography>
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
                          <Badge badgeContent={commentsCount[post.id] || 0} color="primary">
                            <Message />
                          </Badge>
                        </IconButton>
                        {post.owner === auth.userId && (
                          <IconButton aria-label="delete" onClick={(e) => handleOpenDialog(e, post.id)}>
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
