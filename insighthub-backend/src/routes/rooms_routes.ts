
import express, {Request, Response} from 'express';
import * as roomsController from '../controllers/rooms_controller';
import { CustomRequest } from 'types/customRequest';
import {handleValidationErrors, validateRoomUserIds} from "../middleware/validation";

const router = express.Router();

router.get('/user/:receiverUserId', validateRoomUserIds, handleValidationErrors, (req: Request, res: Response) => roomsController.getRoomByUserIds(req as CustomRequest, res));

export default router;