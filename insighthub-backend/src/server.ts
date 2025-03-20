import { app, corsOptions } from './app';
import mongoose from 'mongoose';
import { config } from './config/config';
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Server } from 'socket.io';
import { socketAuthMiddleware } from './middleware/socket_auth';
import { initSocket } from './services/socket_service';
import fs from 'fs';
import https from 'https';

// Configure environment variables, and allow expand.
dotenvExpand.expand(dotenv.config());

const port = config.app.port();
let listener;

const startServer = () => {
    mongoose.connect(config.mongo.uri());
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log("Connected to DataBase"));
};

if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs.readFileSync('/ssl/privkey.pem'),
        cert: fs.readFileSync('/ssl/fullchain.pem')
    };
    listener = https.createServer(options, app).listen(port, () => {
        console.log(`Secure server running at https://localhost:${port}`);
        startServer();
    });
} else {
    listener = app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
        startServer();
    });
}

// Initialize socket.io
const socketListener = new Server(listener, { cors: corsOptions });
socketListener.use((socket, next) => socketAuthMiddleware(socket, next));
initSocket(socketListener).then();
