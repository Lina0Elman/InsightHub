import { config } from "../config";
import userModel from "../models/user_model";
import messageModel from "../models/message_model";

const onlineUsers = new Map();

const initSocket = async (socketListener) => {
    socketListener.on("connection", async socket => {

        // Online users
        const user = await userModel.findById({ _id: socket.userId }).lean();
        if (user) {
            delete user.password;
            delete user.refreshTokens;
            onlineUsers.set(socket.userId, user);
        }
        socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers.values()));

        // Enter Room
        socket.on(config.socketMethods.enterRoom, (roomId) => {
            socket.join(roomId);
        });

        // Chat Message
        socket.on(config.socketMethods.messageFromClient, async ({ roomId, messageContent }) => {
            // Persist message in db
            const messageToInsert = { userId: socket.userId, roomId: roomId, content: messageContent, createdAt: new Date().toISOString() };
            await new messageModel(messageToInsert).validate();
            const insertedMessage = await messageModel.create(messageToInsert);

            // Emit mesage
            socketListener.to(roomId).emit(config.socketMethods.messageFromServer, { roomId, message: insertedMessage });
        });

        // Online users
        socket.on("disconnect", () => {
            onlineUsers.delete(socket.userId);
            socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers.values()));
        });
    });
};

export { initSocket };