import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../config';
import { Send } from 'lucide-react';
import { TextField, Button, Box, Paper } from '@mui/material';

interface AddPostProps {
  onPostCreated: () => void;
}

const AddPost: React.FC<AddPostProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${config.app.backend_url()}/post`, { title, content });
      setTitle('');
      setContent('');
      onPostCreated();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled={isSubmitting}
        />
        <TextField
          label="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          disabled={isSubmitting}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<Send />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddPost;