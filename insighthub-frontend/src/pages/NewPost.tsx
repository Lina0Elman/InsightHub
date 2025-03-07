import React, { useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';

const NewPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2FmYTc0MDY4ZjczNmYxMTJhZTFkNTEiLCJyYW5kb20iOjcxODg4NCwiaWF0IjoxNzQxMzIwMTI4LCJleHAiOjE3NDEzMjM3Mjh9.KjOLD9pbrZpvwv1N3D0aeRcmRYDfLT2cvRUj00Bw19w'; // Replace with your actual access token

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

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${config.app.backend_url()}/resource/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Create New Post
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem', padding: '10px', fontSize: '16px' }}
            required
          />
          <FroalaEditor
            tag="textarea"
            model={content}
            onModelChange={setContent}
            config={
                {
                    placeholderText: "Edit Your Content Here!",
                    charCounterCount: false,
                    toolbarButtons: [
                    "bold",
                    "italic",
                    "underline",
                    "insertImage",
                    "insertLink",
                    "paragraphFormat",
                    "alert",
                ],
                events: {
                    "image.beforeUpload": async function (fileList: FileList) {
                        console.log("Image before upload:", fileList);
                        const firstFile = fileList.item(0);
                        if (firstFile) {
                            const imageFilename = await handleImageUpload(firstFile);
                            if (imageFilename) {
                                console.log("Uploaded Image filename:", imageFilename);
                                
                                // Insert the image using the Froala instance
                                this.image.insert(`${config.app.backend_url()}/resource/image/${imageFilename}`, null, null, this.image.get());
                            }
                        }
                        return false; // Prevent default upload behavior
                    },
                },
                pluginsEnabled: ["image"],
            }}
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