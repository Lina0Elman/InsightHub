import React, { useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';
import { LoginResponse } from '../models/LoginResponse';
import TopBar from '../components/TopBar';

const NewPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem(config.localStorageKeys.userAuth) as string) as LoginResponse;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${config.app.backend_url()}/post`, {
        title,
        content,
        sender: auth._id,
      }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
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
          Authorization: `Bearer ${auth.accessToken}`,
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
      <TopBar />
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
                imageUploadURL: `${config.app.backend_url()}/resource/image`,
                imageUploadRemoteUrls: true,
                imageMaxSize: config.resources.imageMaxSize(),
                imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
                events: {
                  "image.beforeUpload": async function (fileList: any) {
                    const editor = this as any;
                    let firstFile = fileList[0];
                    if (firstFile instanceof Blob) {
                      // In case the image was inserted by URL
                      const fileExtension = firstFile.type.split('/')[1];
                      const fileName = `file.${fileExtension}`;
                      firstFile = new File([firstFile], fileName, { type: firstFile.type });
                    }
                    if (firstFile) {
                      // Upload the image to the backend
                      const imageFilename = await handleImageUpload(firstFile);
                      if (imageFilename) {
                        // Insert the image URL as the image in the content
                        editor.image.insert(`${config.app.backend_url()}/resource/image/${imageFilename}`, null, null, editor.image.get());
                      }
                    }

                    // Remove image blobs of Froala
                    const images = editor.el.getElementsByTagName("img");
                    Array.from(images).forEach((img: any) => {
                      if (img.src.startsWith("blob:")) {
                        img.parentNode?.removeChild(img);
                      }
                    });

                    return false; // Prevent Froala from handling the default upload behavior
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