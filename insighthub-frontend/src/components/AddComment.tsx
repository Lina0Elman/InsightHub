import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../config';

const AddComment: React.FC<{ postId: string }> = ({ postId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${config.app.backend_url()}/comment`, { postId, content });
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Comment</h3>
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default AddComment;