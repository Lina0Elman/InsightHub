import { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";
import AddPost from "../components/AddPost";
import { config } from "../config";
import { PostType } from "../models/Post";

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${config.app.backend_url()}/post`);
      setPosts(response.data as PostType[]);
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
      {/* Main Layout */}
      <Box sx={{ display: "flex", flexGrow: 1, mt: "64px", px: 2 }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, maxWidth: "900px" }}>
          <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ mb: 4 }}>
            Create Post
          </Button>
          <Paper elevation={3} sx={{ p: 2 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : posts.length === 0 ? (
              <Typography>No posts yet. Be the first to create one!</Typography>
            ) : (
              "todo : implement here posts retrieval"
              /*posts.map((post) => <Post key={post.id} {...post} />)*/
            )}
          </Paper>
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
