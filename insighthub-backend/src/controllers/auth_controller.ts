import {Request, Response} from "express";
import * as usersService from "../services/users_service";
import {handleError} from "../utils/handle_error";
import {CustomRequest} from "types/customRequest";
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (ensure Firebase credentials are set in .env)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const authProvider = req.body.authProvider;
        const { email, password } = req.body;
        const tokens = await usersService.loginUser(email, password, authProvider);
        if (!tokens) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.json(tokens);
    } catch (err) {
        handleError(err, res);
    }
};

// Google & Facebook Authentication (using Firebase)
export const socialAuth = async (req: Request, res: Response) => {
    try {
        console.log("Received request body:", req.body); // Log the received request

        const { idToken, authProvider } = req.body;
        if (!idToken) {
            console.error("Missing idToken"); // Debugging line
            return res.status(400).json({ message: 'Missing idToken' });
        }
        if (!authProvider) {
            console.error("Missing authProvider"); // Debugging line
            return res.status(400).json({ message: 'Missing authProvider' });
        }

        // Verify the token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (!decodedToken.email) {
            console.error("Invalid token - No email found"); // Debugging line
            return res.status(400).json({ message: 'Invalid token' });
        }

        console.log("Decoded Firebase Token:", decodedToken); // Debugging line


        const email = decodedToken.email;
        loginUserGoogle(email, authProvider);

        return res.status(200).json({ message: "Authentication successful", tokens });
    } catch (error) {
        console.error("Authentication failed:", error);
        return res.status(400).json({ message: "Authentication failed", error });
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
        const authProvider = req.body.authProvider;

        // Check if the user already exists
        const existingUser = await usersService.getUserByUsernameOrEmail(username, email);
        if (existingUser) {
            res.status(400).json({ message: 'Username or email already in use' });
            return;
        }
        
        const savedUser = await usersService.registerUser(username, password, email, authProvider);
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
