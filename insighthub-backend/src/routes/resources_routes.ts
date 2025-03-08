
import express from 'express';
import Resource from '../controllers/resources_controller';
import  { authMiddleware } from '../controllers/auth_controller';

const router = express.Router();

router.post('/image', authMiddleware, Resource.createImageResource);
router.get('/image/:filename', Resource.getImageResource);

export default router;