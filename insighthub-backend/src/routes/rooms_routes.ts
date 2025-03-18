
import express, {Request, Response} from 'express';
import * as roomsController from '../controllers/rooms_controller';
import { CustomRequest } from 'types/customRequest';

const router = express.Router();

router.get('/user/:receiverUserId', (req: Request, res: Response) => roomsController.getRoomByUserIds(req as CustomRequest, res));

export default router;