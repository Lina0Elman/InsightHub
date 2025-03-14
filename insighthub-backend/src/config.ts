export const config = {
    mongo: {
        uri: () => process.env.DB_CONNECTION || 'mongodb://localhost:27017'
    },
    app: {
        port: () => process.env.PORT || 3000,
        frontend_url: () => process.env.FRONTEND_URL || 'http://localhost:5000',
        backend_url: () => process.env.BACKEND_URL || `http://localhost:${config.app.port()}`,
    },
    token: {
        refresh_token_expiration: () => process.env.REFRESH_TOKEN_EXPIRATION || '3d',
        token_expiration: () => process.env.TOKEN_EXPIRATION || '100000s',
        access_token_secret: () => process.env.ACCESS_TOKEN_SECRET || 'secret'
    },
    resources: {
        imagesDirectoryPath: () => 'resources/images',
        imageMaxSize: () => 10 * 1024 * 1024 // Max file size: 10MB
    },
    socketMethods: {
        messageFromServer: "message-from-server",
        messageFromClient: "message-from-client"
    }
}