// auth.ts
import {Response, NextFunction, RequestHandler} from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { CustomRequest } from 'types/customRequest';
import {unless} from 'express-unless';
import {UserData} from "types/user_types";
import * as usersService from '../services/users_service';


// Middleware to authenticate token for all requests
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - BearerAuth: []
 */
const authenticateToken: any & { unless: typeof unless } = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  try {
    const isBlacklisted = await usersService.isAccessTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(403).json({ message: 'Token is blacklisted' });
      return;
    }

    const decoded = jwt.verify(token, config.auth.access_token) as jwt.JwtPayload;
    const user = await usersService.getUserById(decoded.userId);

    if (!user) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    req.user = user;
    next();

  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

authenticateToken.unless = unless;

export default authenticateToken;