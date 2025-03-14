import { config } from "../config";

const onlineUsers = new Set();

const initSocket = (socketNamespace) => {
    socketNamespace.on("connection", socket => {
        console.log("New client has been connected.");
        onlineUsers.add(socket.userId);
        console.log(onlineUsers);
        socket.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers));

        socket.on("disconnect", () => {
            console.log("One client disconnected.");
            onlineUsers.delete(socket.userId);
            console.log(onlineUsers);
            socket.emit(config.socketMethods.onlineUsers, Array.from(onlineUsers));
        });
    });
};

export { initSocket };