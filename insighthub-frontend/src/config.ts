export const config = {
    app: {
        backend_url: () => process?.env.VITE_BACKEND_URL|| (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000',
        domain_name: () => process?.env.VITE_DOMAIN_NAME || (import.meta as any).env?.VITE_DOMAIN_NAME || 'localhost',
        port: () => parseInt(process?.env.VITE_PORT || (import.meta as any).env?.VITE_PORT || '5000')
    },
    socketMethods: {
        messageFromServer: "message-from-server",
        messageFromClient: "message-from-client",
        onlineUsers: "online-users",
        enterRoom: "enter-room",
    },
    resources: {
        imageMaxSize: () => 10 * 1024 * 1024 // Max file size: 10MB
    },
    localStorageKeys: {
        userAuth: "userAuth"
    }
}