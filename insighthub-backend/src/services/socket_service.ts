import { config } from "../config";
import userModel from "../models/user_model";

const onlineUsers = new Map();

const initSocket = async (socketListener) => {
    socketListener.on("connection", async socket => {

        // Online users
        const user = await userModel.findById({ _id: socket.userId }).lean();
        if (user) {
            onlineUsers.set(socket.userId, user);
        }
        socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers.values()));

        // Enter Room
        socket.on(config.socketMethods.enterRoom, (roomId) => {
            socket.join(roomId);
        });

        // Chat Message
        socket.on(config.socketMethods.messageFromClient, ({ roomId, message }) => {
            socketListener.to(roomId).emit(config.socketMethods.messageFromServer, { roomId, message });
        });

        // Online users
        socket.on("disconnect", () => {
            onlineUsers.delete(socket.userId);
            socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers.values()));
        });
    });
};

export { initSocket };