// insighthub-backend/src/middleware/validateUser.ts
import { Response, NextFunction } from 'express';
import {CustomRequest} from "types/customRequest";
import {unless} from "express-unless";

/**
 * Middleware to validate user, to perform action only on his account
 * We will be able to use it, to bypass it in the future for the admin role, if we'll have one
 * @param req
 * @param res
 * @param next
 */
const validateUser: any & { unless: typeof unless } = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const authenticatedUserId = req.user.id;
    const userIdInParams = req.params.id;

    if (userIdInParams && authenticatedUserId !== userIdInParams) {
        res.status(403).json({ message: 'Forbidden: You can only perform this action on your own account' });
        return;
    }

    next();
};

export default validateUser;