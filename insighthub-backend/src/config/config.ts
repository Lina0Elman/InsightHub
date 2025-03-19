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
        salt: () => process.env.SALT || 10,
        access_token_secret: () => process.env.ACCESS_TOKEN_SECRET || 'secret',
        refresh_token_secret: () => process.env.REFRESH_TOKEN_SECRET || 'secret'
    },
    resources: {
        imagesDirectoryPath: () => 'resources/images',
        imageMaxSize: () => 10 * 1024 * 1024 // Max file size: 10MB
    },
    chatAi: {
        api_url: () => process.env.CHAT_AI_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
        api_key: () => process.env.OPENROUTER_API_KEY || undefined,
        model_name: () => process.env.OPENROUTER_MODEL_NAME || 'google/gemma-3-27b-it:free',
        turned_on: () =>  process.env.CHAT_AI_TURNED_ON === 'true' || false
    },
    socketMethods: {
        messageFromServer: "message-from-server",
        messageFromClient: "message-from-client",
        onlineUsers: "online-users",
        enterRoom: "enter-room"
    }
}