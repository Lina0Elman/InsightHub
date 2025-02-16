export const config = {
    app: {
        backend_url: () => import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
    }
}