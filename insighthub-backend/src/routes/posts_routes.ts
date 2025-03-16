import express, { Request, Response, Router } from 'express';
import * as postsController from '../controllers/posts_controller';
import {CustomRequest} from "types/customRequest";
import {
    handleValidationErrors,
    validatePostData,
    validatePostDataOptional,
    validatePostIdParam
} from "../middleware/validation";

import Post from '../controllers/posts_controller';
import  {authMiddleware} from '../controllers/auth_controller';

const router: Router = express.Router();


router.post('/', validatePostData, handleValidationErrors, (req: Request, res: Response) => postsController.addPost(req as CustomRequest, res));

router.get('/', (req: Request, res: Response) => postsController.getPosts(req, res));

router.get('/:postId', validatePostIdParam, handleValidationErrors,(req: Request, res: Response) => postsController.getPostById(req, res));
router.get('/like', Post.getLikedPosts);


router.put('/:postId', validatePostIdParam, validatePostData, handleValidationErrors, (req: Request, res: Response) => postsController.updatePost(req as CustomRequest, res));


router.patch('/:postId', validatePostIdParam, validatePostDataOptional, handleValidationErrors, (req: Request, res: Response) => postsController.updatePost(req as CustomRequest, res));

router.delete('/:postId', validatePostIdParam, handleValidationErrors, (req: Request, res: Response) => postsController.deletePostById(req as CustomRequest, res));


router.put('/:postId/like', express.text(), Post.updateLikeByPostId);

export default router;