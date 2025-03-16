
import express from 'express';
import Post from '../controllers/posts_controller';
import  {authMiddleware} from '../controllers/auth_controller';

const router = express.Router();

router.get('/', Post.getAllPosts);

router.get('/like', authMiddleware, Post.getLikedPosts);

router.post('/', authMiddleware, Post.createPost);

router.get('/:id', Post.getPostById);

router.put('/:id', authMiddleware, Post.updatePostById);

router.delete('/:id', authMiddleware, Post.);

router.put('/:id/like', authMiddleware, express.text(), Post.updateLikeByPostId);

export default router;