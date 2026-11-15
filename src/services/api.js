// ============================================================================================
// VIETNAMESE: CẤU HÌNH AXIOS KẾT NỐI BACKEND SPRING BOOT (GIAI ĐOẠN 3)
// ENGLISH: AXIOS HTTP CLIENT CONFIGURATION FOR SPRING BOOT BACKEND (PHASE 3)
// ARCHITECTURE: Chế độ lai thông minh (Hybrid Mode) - Tự động gọi API Spring Boot, nếu backend
//               chưa bật hoặc lỗi kết nối thì tự động dùng Mock Data để giao diện không bị sập.
// ============================================================================================

import axios from 'axios';

// Địa chỉ cổng API backend Spring Boot (Cổng mặc định: 8080)
// Spring Boot Backend Base URL (Default port: 8080)
export const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================================================================
// VIETNAMESE: BỘ CHẶN YÊU CẦU (REQUEST INTERCEPTOR) - TỰ ĐỘNG GẮN TOKEN JWT VÀO HEADER
// ENGLISH: REQUEST INTERCEPTOR - AUTOMATICALLY ATTACH JWT BEARER TOKEN
// ============================================================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================================
// VIETNAMESE: BỘ CHẶN PHẢN HỒI (RESPONSE INTERCEPTOR) - BẮT LỖI KẾT NỐI & TỰ ĐỘNG FALLBACK
// ENGLISH: RESPONSE INTERCEPTOR - CATCH CONNECTION ERRORS & SAFELY DEGRADE TO MOCK
// ============================================================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn(
      '[API Warning] Không thể kết nối Backend Spring Boot, hệ thống tự động chạy chế độ Mock Data:',
      error.message
    );
    return Promise.reject(error);
  }
);

export default apiClient;
