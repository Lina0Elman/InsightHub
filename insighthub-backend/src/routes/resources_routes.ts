
import express from 'express';
import Resource from '../controllers/resources_controller';
import  { authMiddleware } from '../controllers/auth_controller';
import { uploadImage } from '../services/resources_service';

const router = express.Router();

router.post('/image', authMiddleware, uploadImage.single('file'), Resource.createImageResource);

export default router;