import express, { Request, Response, Router } from 'express';
import * as commentsController from '../controllers/comments_controller';
import {
    handleValidationErrors,
    validateComment,
    validateCommentData,
    validateCommentDataOptional,
    validateCommentId,
    validatePostIdParam,
} from '../middleware/validation';
import {CustomRequest} from "types/customRequest";

const router: Router = express.Router();


router.post('/', validateComment, handleValidationErrors, (req: Request, res: Response) => commentsController.addComment(req as CustomRequest, res));

router.get('/', (req: Request, res: Response) => commentsController.getAllComments(req, res));

router.get('/post/:postId', validatePostIdParam, handleValidationErrors, (req: Request, res: Response) => commentsController.getCommentsByPostId(req, res));

router.get('/:commentId', validateCommentId, handleValidationErrors, (req: Request, res: Response) => commentsController.getCommentById(req, res));

router.put('/:commentId', validateCommentData, handleValidationErrors, (req: Request, res: Response) => commentsController.updateComment(req, res));

router.patch('/:commentId', validateCommentDataOptional, handleValidationErrors, (req: Request, res: Response) => commentsController.updateComment(req, res));

router.delete('/:commentId', validateCommentId, handleValidationErrors, (req: Request, res: Response) => commentsController.deleteComment(req, res));

export default router;