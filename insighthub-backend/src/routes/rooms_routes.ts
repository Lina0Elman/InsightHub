
import express from 'express';
import Room from '../controllers/rooms_controller';
import  {authMiddleware} from '../controllers/auth_controller';

const router = express.Router();

router.get('/user/:receiverUserId', authMiddleware, Room.getRoomIdByUserIds);

export default router;