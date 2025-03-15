export const config = {
    app: {
        backend_url: () => import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
    },
    resources: {
        imageMaxSize: () => 10 * 1024 * 1024 // Max file size: 10MB
    },
    localStorageKeys: {
        userAuth: "userAuth"
    }
}