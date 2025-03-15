import { config } from "../config";

const onlineUsers = new Set();

const initSocket = (socketListener) => {
    socketListener.on("connection", socket => {

        // Online users
        console.log("New client has been connected.");
        onlineUsers.add(socket.userId);
        console.log(onlineUsers);
        socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers));

        // Chat message
        socket.on(config.socketMethods.messageFromClient, message => {
            console.log(`Client sent message: ${message}`);
            socketListener.sockets.emit(config.socketMethods.messageFromServer, message);
        });

        // Online users
        socket.on("disconnect", () => {
            console.log("One client disconnected.");
            onlineUsers.delete(socket.userId);
            console.log(onlineUsers);
            socketListener.sockets.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers));
        });
    });
};

export { initSocket };