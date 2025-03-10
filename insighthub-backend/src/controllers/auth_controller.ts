import {Request, Response} from "express";
import * as usersService from "../services/users_service";
import {handleError} from "../utils/handle_error";
import {CustomRequest} from "types/customRequest";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const tokens = await usersService.loginUser(email, password);
        if (!tokens) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.json(tokens);
    } catch (err) {
        handleError(err, res);
    }
};

export const logoutUser = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        const result = await usersService.logoutUser(refreshToken, req.user.id);

        if (!result) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }

        res.json({ message: 'User logged out successfully' });
    } catch (err) {
        handleError(err, res);
    }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email } = req.body;

        // Check if the user already exists
        const existingUser = await usersService.getUserByUsernameOrEmail(username, email);
        if (existingUser) {
            res.status(400).json({ message: 'Username or email already in use' });
            return;
        }

        const savedUser = await usersService.registerUser(username, password, email);
        res.status(201).json(savedUser);
    } catch (err) {
        handleError(err, res);
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({ message: 'Refresh token required' });
            return;
        }

        const { newRefreshToken, accessToken } = await usersService.refreshToken(refreshToken);
        res.json({ accessToken: accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        const e: Error = err as Error
        res.status(401).json({ message: e.message });
    }
};