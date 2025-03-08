import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp, ArrowDown, Share2, User } from 'lucide-react';
import { PostType, CommentType } from '../types/Types';
import { config } from '../config';

interface PostProps extends PostType {}

const Post: React.FC<PostProps> = ({ 
  id, 
  title, 
  content, 
  author, 
  createdAt, 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  const loadComments = async () => {
    try {
      const response = await axios.get(`${config.app.backend_url()}/post/${id}`);
      setComments(response.data as CommentType[]);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${config.app.backend_url()}/comment`, { postId: id, content: newComment });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-600">Posted by {author}</span>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className={`text-gray-700 ${!isExpanded && 'line-clamp-3'}`}>
            {content}
          </p>
          {content.length > 200 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 text-sm mt-1"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}

          <div className="flex items-center mt-4 space-x-4">
            <button 
              className="flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              <span className="text-sm">{comments.length} Comments</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-gray-700">
              <Share2 className="w-4 h-4 mr-1" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          {showComments && (
            <div className="mt-4 space-y-4">
              <form onSubmit={handleAddComment} className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Comment
                </button>
              </form>
              
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center mb-1">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;