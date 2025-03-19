import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import * as usersService from '../services/users_service';


const getTokenFromHeader = (socket: Socket): string | undefined => {
    const authHeader = (socket.handshake.headers['authorization'] as string | undefined) ?? (socket.handshake.headers['Authorization'] as string | undefined);
    return authHeader?.split(' ')[1];
}

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void, ignoreExpiration = false): Promise<void> => {
    const token = getTokenFromHeader(socket);

    if (!token) {
        return next(new Error("401: Access token required"));
    }
    try {
        const decoded = jwt.verify(token, config.token.access_token_secret(), { ignoreExpiration }) as jwt.JwtPayload;
        const user = await usersService.getUserById(decoded.userId);

        (socket as any).user = user; // Authenticate userId
        next();
    } catch (err) {
        next(new Error("403: Invalid token"));
    }
};