import { app, corsOptions } from './app';
import mongoose from 'mongoose';
import { config } from './config';
import { Server } from 'socket.io';


// Start app while verifying connection to the database.
const port = config.app.port();
const listener = app.listen(port, () => {
    mongoose.connect(config.mongo.uri())
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log("Connected to DataBase"));
    console.log(`Example app listening at http://localhost:${port}`);
});

const socketListener = new Server(listener, { cors: corsOptions });

// Listening to new clients connection:
socketListener.sockets.on("connection", socket => {
    console.log("New client has been connected.");

    socket.on(config.socketMethods.messageFromClient, message => {
        console.log(`Client sent message: ${message}`);
        socketListener.sockets.emit(config.socketMethods.messageFromServer, message);
    });

    socket.on("disconnect", () => {
        console.log("One client disconnected.");
    });
});
