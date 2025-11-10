import axios from 'axios';
import authService from './authService';
import {ENDPOINTS} from "../../config/api";

const publicEndpoints = [
    ENDPOINTS.HOTELS,
    ENDPOINTS.HOTEL_ROOMS
];

const isPublicEndpoint = (url) => {
    return publicEndpoints.some(endpoint => url.startsWith(endpoint));
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        if (!isPublicEndpoint(config.url)) {
            const token = authService.getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response &&
            error.response.status === 401 &&
            !isPublicEndpoint(error.config.url)) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;