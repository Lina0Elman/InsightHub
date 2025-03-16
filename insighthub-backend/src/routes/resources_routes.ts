
import express from 'express';
import Resource from '../controllers/resources_controller';

const router = express.Router();

router.post('/image', Resource.createImageResource);
router.get('/image/:filename', Resource.getImageResource);

export default router;