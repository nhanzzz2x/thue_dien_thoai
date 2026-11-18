import axios from 'axios';

// Kết nối trực tiếp tới Backend Express + MySQL WampServer tại cổng 8080
export const API_BASE_URL = 'http://127.0.0.1:8080';

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
