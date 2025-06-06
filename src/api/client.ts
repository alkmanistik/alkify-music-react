import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Добавляем токен к каждому запросу
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
