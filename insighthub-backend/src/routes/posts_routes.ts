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

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Add a new post
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The post ID
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                 content:
 *                   type: string
 *                   description: The content of the post
 *                 owner:
 *                   type: string
 *                   description: The ID of the user who owns the post
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was last updated
 *       400:
 *         description: Validation error
 */
router.post('/', validatePostData, handleValidationErrors, (req: Request, res: Response) => postsController.addPost(req as CustomRequest, res));


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The post ID
 *                   title:
 *                     type: string
 *                     description: The title of the post
 *                   content:
 *                     type: string
 *                     description: The content of the post
 *                   owner:
 *                     type: string
 *                     description: The ID of the user who owns the post
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the post was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the post was last updated
 *       204:
 *         description: No posts found
 */
router.get('/', (req: Request, res: Response) => postsController.getPosts(req, res));

/**
 * @swagger
 * /posts/{post_id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to get
 *     responses:
 *       200:
 *         description: The post data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The post ID
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                 content:
 *                   type: string
 *                   description: The content of the post
 *                 owner:
 *                   type: string
 *                   description: The ID of the user who owns the post
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was last updated
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid post ID
 */
router.get('/:post_id', validatePostIdParam, handleValidationErrors,(req: Request, res: Response) => postsController.getPostById(req, res));

/**
 * @swagger
 * /posts/{post_id}:
 *   put:
 *     summary: Update a post
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The post ID
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                 content:
 *                   type: string
 *                   description: The content of the post
 *                 owner:
 *                   type: string
 *                   description: The ID of the user who owns the post
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was last updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post not found
 */
router.put('/:post_id', validatePostIdParam, validatePostDataOptional, handleValidationErrors, (req: Request, res: Response) => postsController.updatePost(req as CustomRequest, res));

/**
 * @swagger
 * /posts/{post_id}:
 *   patch:
 *     summary: Update a post parameters
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The post ID
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                 content:
 *                   type: string
 *                   description: The content of the post
 *                 owner:
 *                   type: string
 *                   description: The ID of the user who owns the post
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was last updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post not found
 */
router.patch('/:post_id', validatePostIdParam, validatePostDataOptional, handleValidationErrors, (req: Request, res: Response) => postsController.updatePost(req as CustomRequest, res));

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:post_id', validatePostIdParam, handleValidationErrors, (req: Request, res: Response) => postsController.deletePostById(req as CustomRequest, res));


export default router;