import axios from 'axios';

// URL Backend: Sử dụng URL môi trường VITE_API_URL nếu có, hoặc để trống (gọi cùng domain trên Vercel / proxy Vite)
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Chống trình duyệt lưu cache cũ khi vừa sửa dữ liệu trực tiếp trên phpMyAdmin WampServer
    if (config.method === 'get') {
      config.params = { ...(config.params || {}), _t: Date.now() };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (config && !config.__retried && (!error.response || error.response.status >= 502)) {
      config.__retried = true;
      await new Promise((resolve) => setTimeout(resolve, 500));
      return apiClient(config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
