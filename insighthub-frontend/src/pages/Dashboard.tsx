import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Home, Person, Message, Settings, Logout } from "@mui/icons-material";
import axios from "axios";
import AddPost from "../components/AddPost";
import Profile from "../components/Profile";
import Post from "../components/Post";
import { config } from "../config";
import { PostType } from "../types/Types";

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Fixed AppBar Full Width */}
      <AppBar position="fixed" sx={{ width: "100vw", left: 0 }}>
        <Toolbar>
          <Tooltip title="Home">
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <Home />
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton color="inherit" onClick={() => navigate("/profile")}>
              <Person />
            </IconButton>
          </Tooltip>
          <Tooltip title="Messages">
            <IconButton color="inherit" onClick={() => navigate("/messages")}>
              <Message />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton color="inherit" onClick={() => navigate("/settings")}>
              <Settings />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={() => navigate("/login")}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Layout */}
      <Box sx={{ display: "flex", flexGrow: 1, mt: "64px", px: 2 }}>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, maxWidth: "900px" }}>
          <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
            <AddPost onPostCreated={loadPosts} />
          </Paper>
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
              posts.map((post) => <Post key={post.id} {...post} />)
            )}
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: "300px", ml: 2 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Profile />
          </Paper>
          <Divider sx={{ my: 2 }} />
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trending
            </Typography>
            {/* Add trending content here */}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
