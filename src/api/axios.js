import axios from 'axios';
import { globalStore } from '../store/globalStore';

// Создаем экземпляр axios с базовым URL
const instance = axios.create({
    baseURL: 'http://localhost:5188/api'
});

// Добавляем перехватчик запросов
instance.interceptors.request.use(
    (config) => {
        const token = globalStore.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Добавляем перехватчик ответов
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            globalStore.signOut();
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default instance; 