import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {config} from './config';
import {LoginResponse} from "./models/LoginResponse.ts";
import {getUserAuth} from "./handlers/userAuth.ts";


// Create an Axios instance
const api: AxiosInstance = axios.create({
    baseURL: config.app.backend_url(),
});

// Add a request interceptor
api.interceptors.request.use((axiosConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authData: LoginResponse = getUserAuth();

    if (authData) {
        const accessToken = authData.accessToken;
        if (accessToken) {
            // Attach the token to the Authorization header
            axiosConfig.headers.Authorization = `jwt ${accessToken}`;
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
    (error) => {

        // TODO - fix it - need to redirect to login if there is no refresh to use, if there is - need to refresh the accessToken
        if (error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            localStorage.removeItem(config.localStorageKeys.userAuth);
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;