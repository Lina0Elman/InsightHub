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

        // Chat message
        socket.on(config.socketMethods.messageFromClient, message => {
            socketListener.sockets.emit(config.socketMethods.messageFromServer, message);
        });

        // Online users
        socket.on("disconnect", () => {
            onlineUsers.delete(socket.userId);
            socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers.values()));
        });
    });
};

export { initSocket };