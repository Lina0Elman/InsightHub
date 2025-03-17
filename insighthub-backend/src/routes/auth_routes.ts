import express, { Request, Response, Router } from 'express';
import * as authController from '../controllers/auth_controller';
import {
    handleValidationErrors,
    validateLogin,
    validateRefreshToken,
    validateUserRegister,
} from "../middleware/validation";
import {authenticateLogoutToken} from "../middleware/auth";
import {CustomRequest} from "types/customRequest";

const router: Router = express.Router();

router.post('/login', validateLogin, handleValidationErrors, (req: Request, res: Response) => authController.loginUser(req, res));

router.post('/logout', authenticateLogoutToken as unknown as express.RequestHandler, (req: Request, res: Response) => authController.logoutUser(req as CustomRequest, res));

router.post('/register', validateUserRegister, handleValidationErrors, (req: Request, res: Response) => authController.registerUser(req, res));

router.post('/refresh', validateRefreshToken, handleValidationErrors, (req: Request, res: Response) => authController.refreshToken(req, res));

export default router;