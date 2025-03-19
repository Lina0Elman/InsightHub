import { Server } from "socket.io";
import { config } from "../config/config";
import messageModel from "../models/message_model";

const onlineUsers = new Map();

const initSocket = async (socketListener: Server) => {
    socketListener.on("connection", async socket => {

        // Online users
        const user = (socket as any).user;
        if (user) {
            delete user.password;
            delete user.refreshTokens;
            onlineUsers.set(user.id, user);
        }
        socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers.values()));

        // Enter Room
        socket.on(config.socketMethods.enterRoom, (roomId) => {
            socket.join(roomId);
        });

        // Chat Message
        socket.on(config.socketMethods.messageFromClient, async ({ roomId, messageContent }) => {
            // Persist message in db
            const messageToInsert = { userId: user.id, roomId: roomId, content: messageContent, createdAt: new Date().toISOString() };
            await new messageModel(messageToInsert).validate();
            const insertedMessage = await messageModel.create(messageToInsert);

            // Emit mesage
            socketListener.to(roomId).emit(config.socketMethods.messageFromServer, { roomId, message: insertedMessage });
        });

        // Online users
        socket.on("disconnect", () => {
            onlineUsers.delete(user.id);
            socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers.values()));
        });
    });
};

export { initSocket };