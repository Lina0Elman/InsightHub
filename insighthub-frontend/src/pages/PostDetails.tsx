import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, TextField, Button, Avatar, Divider, IconButton, Collapse, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ArrowBack, Comment as CommentIcon, ThumbUp as ThumbUpIcon, Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axios from 'axios';
import { config } from '../config';
import { Post as PostModel } from '../models/Post';
import { Comment } from '../models/Comment';
import TopBar from '../components/TopBar';
import { LoginResponse } from '../models/LoginResponse';

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostModel | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const auth = JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse;

  const loadPostDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const postResponse = await axios.get(`${config.app.backend_url()}/post/${postId}`);
      setPost(postResponse.data as PostModel);
      setEditedTitle((postResponse.data as PostModel).title);
      setEditedContent((postResponse.data as PostModel).content);
      try {
        const commentsResponse = await axios.get(`${config.app.backend_url()}/comment/post/${postId}`);
        setComments(commentsResponse.data as Comment[]);
      } catch (err) {
        console.log('Failed to load comments:', err);
      }
    } catch (err) {
      setError('Failed to load post details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post(`${config.app.backend_url()}/comment`, {
        content: newComment,
        postId,
        sender: auth._id,
      }, {
        headers: {
            Authorization: `Bearer ${auth.accessToken}`,
      },});
      setComments([...comments, response.data as Comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`${config.app.backend_url()}/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleEditPost = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(post?.title || '');
    setEditedContent(post?.content || '');
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${config.app.backend_url()}/post/${postId}`, {
        title: editedTitle,
        content: editedContent,
      }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setPost(response.data as PostModel);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`${config.app.backend_url()}/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    loadPostDetails();
  }, [postId]);

  return (
    <Container component="main" maxWidth="md" sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, flexGrow: 1, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
          <IconButton color="primary" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
            <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
              Post Details
            </Typography>
            {post?.sender === auth._id && !isEditing && (
              <>
                <IconButton color="primary" onClick={handleEditPost}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={handleOpenDialog}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
            {isEditing && (
              <>
                <IconButton color="primary" onClick={handleSaveEdit}>
                  <CheckIcon style={{ color: 'green' }} />
                </IconButton>
                <IconButton color="secondary" onClick={handleCancelEdit}>
                  <CancelIcon />
                </IconButton>
              </>
            )}
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          post && (
            <Paper sx={{ p: 4, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>{post.sender.charAt(0)}</Avatar>
                <Typography variant="h6">{post.sender}</Typography>
              </Box>
              {isEditing ? (
                <>
                  <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Content"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h4" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <span dangerouslySetInnerHTML={{ __html: post.content }} />
                  </Typography>
                </>
              )}
              <Divider sx={{ my: 4 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton color="primary">
                  <ThumbUpIcon />
                </IconButton>
                <IconButton color="primary" onClick={() => setCommentsOpen(!commentsOpen)}>
                  <Badge badgeContent={comments.length} color="primary">
                    <CommentIcon />
                  </Badge>
                </IconButton>
              </Box>
              <Collapse in={commentsOpen}>
                <Typography variant="h5" gutterBottom>
                  Comments
                </Typography>
                <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
                  {comments.map((comment) => (
                    <Box key={comment._id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2 }}>{comment.sender.charAt(0)}</Avatar>
                        <Typography variant="body2" color="text.primary" sx={{ flexGrow: 1 }}>
                          {comment.sender}
                        </Typography>
                        {comment.sender === auth._id && (
                          <IconButton aria-label="delete" onClick={() => handleDeleteComment(comment._id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {comment.content}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                    </Box>
                  ))}
                </Box>
                <TextField
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddComment}>
                  Add Comment
                </Button>
              </Collapse>
            </Paper>
          )
        )}
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
    </Container>
  );
};

export default PostDetails;