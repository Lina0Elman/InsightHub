import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {config} from './config';
import {LoginResponse} from "./models/LoginResponse.ts";
import {getUserAuth, removeUserAuth, setUserAuth} from "./handlers/userAuth.ts";


// Create an Axios instance
const api: AxiosInstance = axios.create({
    baseURL: config.app.backend_url(),
});

// Function to refresh the token
const refreshToken = async (): Promise<LoginResponse | null> => {
    try {
        const authData = getUserAuth();
        const response = await axios.post(`${config.app.backend_url()}/auth/refresh`, {
            refreshToken: authData.refreshToken,
        });
        const newAuthData = response.data as LoginResponse;
        setUserAuth(newAuthData);
        return newAuthData;
    } catch (error) {
        removeUserAuth();
        window.location.href = '/login';
        return null;
    }
};


// Add a request interceptor
api.interceptors.request.use((axiosConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authData: LoginResponse = getUserAuth();

    if (authData) {
        const accessToken = authData.accessToken;
        if (accessToken) {
            // Attach the token to the Authorization header
            axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return axiosConfig;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAuthData = await refreshToken();
            if (newAuthData) {
                const currUserAuth = getUserAuth()
                currUserAuth.accessToken = newAuthData.accessToken;
                currUserAuth.refreshToken = newAuthData.refreshToken;
                setUserAuth(currUserAuth);
                originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;
                return api(originalRequest);
            }
        }
        // If refresh token fails, redirect to login
        if (error.response.status === 401) {
            removeUserAuth();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;