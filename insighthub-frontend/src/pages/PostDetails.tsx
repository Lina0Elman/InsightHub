import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Button, Avatar, Divider, IconButton, Collapse, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { ArrowBack, Comment as CommentIcon, ThumbUp as ThumbUpIcon, Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon, Cancel as CancelIcon } from '@mui/icons-material';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';
import { Post as PostModel } from '../models/Post';
import { Comment } from '../models/Comment';
import TopBar from '../components/TopBar';
import { getUserAuth } from "../handlers/userAuth.ts";
import api from "../serverApi.ts";
import defaultProfileImage from '../assets/defaultProfileImage.jpg';
import { config } from '../config.ts';

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostModel | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentProfileImages, setCommentProfileImages] = useState<{ [key: string]: string }>({});
  const [newComment, setNewComment] = useState(''); // Froala Editor content for the new comment
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState(''); // Froala Editor content for editing the post
  const [openDialog, setOpenDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // State for like icon
  const [likesCount, setLikesCount] = useState(0); // State for likes count
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImage); // State for profile image
  const auth = getUserAuth();

  const fetchProfileImage = async (imageFilename: string | null) => {
    try {
      if (!imageFilename) {
        return defaultProfileImage;
      }
      const response = await api.get(`/resource/image/${imageFilename}`, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data as Blob);
    } catch (error) {
      console.error('Error fetching profile image:', error);
      return defaultProfileImage;
    }
  };

  const loadPostDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const postResponse = await api.get(`/post/${postId}`);
      const postData = postResponse.data as PostModel;
      setPost(postData);
      setEditedTitle(postData.title);
      setEditedContent(postData.content);
  
      // Fetch profile image for the post owner
      const imageUrl = await fetchProfileImage(postData.ownerProfileImage as string);
      setProfileImage(imageUrl);
  
      // Fetch likes count and determine if the user has liked the post
      try {
        const likesResponse = await api.get(`/post/${postId}/like`);
        setLikesCount(likesResponse.data.count);
        setIsLiked(likesResponse.data.likedBy.includes(auth.userId)); // Check if the current user is in the likedBy array
      } catch (err) {
        console.error('Failed to fetch likes:', err);
      }
  
      // Fetch comments
      try {
        const commentsResponse = await api.get(`/comment/post/${postId}`);
        const commentsData = commentsResponse.data as Comment[];
        setComments(commentsData);
  
        // Fetch profile images for each comment owner
        const images: { [key: string]: string } = {};
        await Promise.all(
          commentsData.map(async (comment) => {
            const imageUrl = await fetchProfileImage(comment.ownerProfileImage as string);
            images[comment.id] = imageUrl;
          })
        );
        setCommentProfileImages(images);
      } catch (err) {
        console.log('Failed to load comments:', err);
      }
    } catch (err) {
      setError('Failed to load post details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const value = !isLiked; // Toggle the like state
      await api.put(
        `/post/${postId}/like`,
        { value },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      setIsLiked(value); // Update the like state
      setLikesCount((prev) => (value ? prev + 1 : Math.max(prev - 1, 0))); // Update the likes count
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await api.post(`/comment`, {
        content: newComment,
        postId,
      });
      const newCommentData = response.data as Comment;
      setComments([...comments, newCommentData]);

      // Fetch profile image for the new comment owner
      const imageUrl = await fetchProfileImage(newCommentData.ownerProfileImage as string);
      setCommentProfileImages((prev) => ({
        ...prev,
        [newCommentData.id]: imageUrl,
      }));

      setNewComment(''); // Clear the Froala Editor content
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comment/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
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
      const response = await api.put(`/post/${postId}`, {
        title: editedTitle,
        content: editedContent,
      });
      setPost(response.data as PostModel);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/post/${postId}`);
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

  const handleCommentToggle = () => {
    setCommentsOpen(!commentsOpen); // Open or close the comments section
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
          {post?.owner === auth.userId && !isEditing && (
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
                <Avatar
                  src={profileImage}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6">{auth.username}</Typography>
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
                  <FroalaEditor
                    tag="textarea"
                    model={editedContent}
                    onModelChange={setEditedContent}
                    config={{
                      placeholderText: "Edit your content here...",
                      charCounterCount: false,
                      toolbarButtons: [
                        "bold",
                        "italic",
                        "underline",
                        "insertImage",
                        "insertLink",
                        "paragraphFormat",
                      ],
                      imageUploadRemoteUrls: true,
                      imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
                      events: {
                        "image.beforeUpload": async function (fileList: File[]) {
                          const editor = this as any;
                          const firstFile = fileList[0];

                          if (firstFile) {
                            const formData = new FormData();
                            formData.append("file", firstFile);

                            try {
                              const response = await api.post(`/resource/image`, formData, {
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                  Authorization: `Bearer ${auth.accessToken}`,
                                },
                              });

                              const imageUrl = `${config.app.backend_url()}/resources/images/${response.data}`;
                              editor.image.insert(imageUrl, null, null, editor.image.get());
                            } catch (error) {
                              console.error("Error uploading image:", error);
                            }
                          }

                          return false; // Prevent Froala's default upload mechanism
                        },
                      },
                      pluginsEnabled: ["image", "link", "paragraphFormat"],
                    }}
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
                <IconButton
                  color={isLiked ? 'primary' : 'default'}
                  onClick={handleLikeToggle}
                >
                  <Badge badgeContent={likesCount} color="primary">
                    <ThumbUpIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  color={commentsOpen ? 'primary' : 'default'}
                  onClick={handleCommentToggle}
                >
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
                    <Box key={comment.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          src={commentProfileImages[comment.id] || defaultProfileImage}
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="body2" color="text.primary" sx={{ flexGrow: 1 }}>
                          {comment.owner}
                        </Typography>
                        {comment.owner === auth.userId && (
                          <IconButton aria-label="delete" onClick={() => handleDeleteComment(comment.id)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        <span dangerouslySetInnerHTML={{ __html: comment.content }} />
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                    </Box>
                  ))}
                </Box>
                <FroalaEditor
                  tag="textarea"
                  model={newComment}
                  onModelChange={setNewComment}
                  config={{
                    placeholderText: "Write a comment...",
                    charCounterCount: false,
                    toolbarButtons: [
                      "bold",
                      "italic",
                      "underline",
                      "insertImage",
                      "insertLink",
                      "paragraphFormat",
                    ],
                    imageUploadRemoteUrls: true,
                    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
                    events: {
                      "image.beforeUpload": async function (fileList: File[]) {
                        const editor = this as any;
                        const firstFile = fileList[0];

                        if (firstFile) {
                          const formData = new FormData();
                          formData.append("file", firstFile);

                          try {
                            const response = await api.post(`/resource/image`, formData, {
                              headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: `Bearer ${auth.accessToken}`,
                              },
                            });

                            const imageUrl = `${config.app.backend_url()}/resource/image/${response.data}`;
                            editor.image.insert(imageUrl, null, null, editor.image.get());
                          } catch (error) {
                            console.error("Error uploading image:", error);
                          }
                        }

                        return false; // Prevent Froala's default upload mechanism
                      },
                    },
                    pluginsEnabled: ["image", "link", "paragraphFormat"],
                  }}
                />
                <Button variant="contained" color="primary" onClick={handleAddComment} sx={{ mt: 2 }}>
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