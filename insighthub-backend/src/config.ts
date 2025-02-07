export const config = {
    mongo: {
        uri: process.env.DB_CONNECTION || 'mongodb://localhost:27017'
    },
    app: {
        port: process.env.PORT || 3000,
        client_url: process.env.CLIENT_URL || 'http://localhost:5000'
    },
    refresh_token: {
        expiration: process.env.TOKEN_EXPIRATION || '10000'
    }
}