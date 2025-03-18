import express, { Request, Response, Router } from 'express';
import * as postsController from '../controllers/posts_controller';
import {CustomRequest} from "types/customRequest";
import {
    handleValidationErrors,
    validatePostData,
    validatePostDataOptional,
    validatePostIdParam
} from "../middleware/validation";
const router: Router = express.Router();


router.post('/', validatePostData, handleValidationErrors, (req: Request, res: Response) => postsController.addPost(req as CustomRequest, res));

router.get('/', (req: Request, res: Response) => postsController.getPosts(req, res));

router.get('/:postId', validatePostIdParam, handleValidationErrors,(req: Request, res: Response) => postsController.getPostById(req, res));

router.get('/like', (req: Request, res: Response) => postsController.getLikedPosts(req as CustomRequest, res));

router.put('/:postId', validatePostIdParam, validatePostData, handleValidationErrors, (req: Request, res: Response) => postsController.updatePost(req as CustomRequest, res));

// todo - swagger and stuff
router.get('/:postId/like', validatePostIdParam, handleValidationErrors, (req: Request, res: Response) => postsController.getLikesByPostId(req, res));

router.patch('/:postId', validatePostIdParam, validatePostDataOptional, handleValidationErrors, (req: Request, res: Response) => postsController.updatePost(req as CustomRequest, res));

router.delete('/:postId', validatePostIdParam, handleValidationErrors, (req: Request, res: Response) => postsController.deletePostById(req as CustomRequest, res));


router.put('/:postId/like', express.text(), (req: Request, res: Response) => postsController.updateLikeByPostId(req as CustomRequest, res));

export default router;