import express, { Request, Response, Router } from 'express';
import * as usersController from '../controllers/users_controller';
import {handleValidationErrors, validateUserDataOptional, validateUserId} from "../middleware/validation";
import { socialAuth } from '../controllers/auth_controller';

const router: Router = express.Router();


router.get('/', (req: Request, res: Response) => usersController.getUsers(req, res));

router.get('/:id', validateUserId, handleValidationErrors, (req: Request, res: Response) => usersController.getUserById(req, res));

router.delete('/:id', validateUserId, handleValidationErrors, (req: Request, res: Response) => usersController.deleteUserById(req, res));

router.patch('/:id', validateUserId, validateUserDataOptional, handleValidationErrors, (req: Request, res: Response) => usersController.updateUserById(req, res));

// router.post('/', validateUserRegister, handleValidationErrors, (req: Request, res: Response) => usersController.createUser(req, res));
router.post('/social',  validateUserId, handleValidationErrors, socialAuth);


export default router;