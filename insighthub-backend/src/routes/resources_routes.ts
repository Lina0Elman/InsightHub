
import express, {Request, Response} from 'express';
import Resource from '../controllers/resources_controller';
import {CustomRequest} from "types/customRequest";

const router = express.Router();

router.post('/image/user', (req: Request, res: Response) => Resource.createUserImageResource(req as CustomRequest, res));

router.post('/image', Resource.createImageResource);

router.get('/image/:filename', Resource.getImageResource);

export default router;