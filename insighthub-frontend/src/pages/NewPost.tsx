import React, { useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';
import TopBar from '../components/TopBar';
import api from "../serverApi.ts";
import { getUserAuth } from '../handlers/userAuth.ts';

const NewPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]); // Store images locally
  const navigate = useNavigate();
  const auth = getUserAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload images to the server
      const uploadedImages: { [placeholder: string]: string } = {};
      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);

        const response = await api.post(`/resource/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${auth.accessToken}`,
          },
        });

        // Map the placeholder to the actual URL
        const imageUrl = `${config.app.backend_url()}/resources/images/${response.data}`;
        uploadedImages[image.name] = imageUrl;
      }

      // Replace placeholders in the content with actual URLs
      let updatedContent = content;
      Object.keys(uploadedImages).forEach((placeholder) => {
        updatedContent = updatedContent.replace(placeholder, uploadedImages[placeholder]);
      });

      // Submit the post with the updated content
      await api.post(`/post`, {
        title,
        content: updatedContent,
      });

      navigate('/dashboard'); // Redirect to dashboard after successful post creation
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Create New Post
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '90vh', overflowY: 'scroll', height: '60vh', marginTop: '1rem' }}>
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
            config={{
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
              imageUploadRemoteUrls: true,
              imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
              events: {
                // Custom image upload handling
                "image.beforeUpload": async function (fileList: File[]) {
                  const editor = this as any;
                  const firstFile = fileList[0];

                  if (firstFile) {
                    // Generate a placeholder for the image
                    const placeholder = `[[image-${firstFile.name}]]`;

                    // Insert the placeholder into the editor
                    editor.image.insert(placeholder, null, null, editor.image.get());

                    // Store the image locally
                    setImages((prevImages) => [...prevImages, firstFile]);
                  }

                  return false; // Prevent Froala's default upload mechanism
                },
              },
              pluginsEnabled: ["image"], // Ensure image plugin is enabled
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