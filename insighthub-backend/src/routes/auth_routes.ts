import express, { Request, Response, Router } from 'express';
import * as authController from '../controllers/auth_controller';
import {
    handleValidationErrors,
    validateLogin,
    validateRefreshToken,
    validateUserRegister
} from "../middleware/validation";
import {CustomRequest} from "types/customRequest";

const router: Router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *   responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, handleValidationErrors, (req: Request, res: Response) => authController.loginUser(req, res));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Auth
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Validation error
 */
router.post('/logout', (req: Request, res: Response) => authController.logoutUser(req as CustomRequest, res));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the user
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the user
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the user
 *       400:
 *         description: Validation error
 */
router.post('/register', validateUserRegister, handleValidationErrors, (req: Request, res: Response) => authController.registerUser(req, res));

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token
 *       400:
 *         description: Invalid refresh token
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh-token', validateRefreshToken, handleValidationErrors, (req: Request, res: Response) => authController.refreshToken(req, res));

export default router;