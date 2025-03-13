
import express from 'express';
import Auth from '../controllers/auth_controller';
import { socialAuth } from '../controllers/auth_controller';

const router = express.Router();

// Local authentication
router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.post('/logout', Auth.logout);
router.post('/refresh', Auth.refresh);

// Google & Facebook authentication
router.post('/auth/social', socialAuth);

export default router;