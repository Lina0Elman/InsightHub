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

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a new comment
 *     tags:
 *       - Comments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateComment, handleValidationErrors, (req: Request, res: Response) => commentsController.addComment(req as CustomRequest, res));

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags:
 *       - Comments
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get('/', (req: Request, res: Response) => commentsController.getAllComments(req, res));

/**
 * @swagger
 * /comments/post/{post_id}:
 *   get:
 *     summary: Get comments by post ID
 *     tags:
 *       - Comments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: No comments found for the given post ID
 *       400:
 *         description: Invalid post ID
 */
router.get('/post/:postId', validatePostIdParam, handleValidationErrors, (req: Request, res: Response) => commentsController.getCommentsByPostId(req, res));

/**
 * @swagger
 * /comments/{commentId}:
 *   get:
 *     summary: Get a comment by ID
 *     tags:
 *       - Comments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to get
 *     responses:
 *       200:
 *         description: The comment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       400:
 *         description: Invalid comment ID
 */
router.get('/:commentId', validateCommentId, handleValidationErrors, (req: Request, res: Response) => commentsController.getCommentById(req, res));

/**
 * @swagger
 * /comments/{comment_id}:
 *   put:
 *     summary: Update a comment
 *     tags:
 *       - Comments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Comment not found
 */
router.put('/:commentId', validateCommentData, handleValidationErrors, (req: Request, res: Response) => commentsController.updateComment(req, res));

router.patch('/:commentId', validateCommentDataOptional, handleValidationErrors, (req: Request, res: Response) => commentsController.updateComment(req, res));

/**
 * @swagger
 * /comments/{comment_id}:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete('/:commentId', validateCommentId, handleValidationErrors, (req: Request, res: Response) => commentsController.deleteComment(req, res));

export default router;