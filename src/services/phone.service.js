import apiClient from './api';
import { mockPhones, mockCategories } from '@/data/mockData';

// Dịch vụ gọi API Kho Điện Thoại (Kết nối Node.js Express + MySQL WampServer)
export const PhoneService = {
  async getAllPhones() {
    try {
      const response = await apiClient.get('/api/phones');
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async getPhoneById(id) {
    try {
      const response = await apiClient.get(`/api/phones/${id}`);
      return response.data;
    } catch (err) {
      return mockPhones.find((p) => p.maDienThoai === Number(id));
    }
  },

  async getCategories() {
    try {
      const response = await apiClient.get('/api/categories');
      return response.data;
    } catch (err) {
      return [...mockCategories];
    }
  },

  async createPhone(phoneData) {
    try {
      const response = await apiClient.post('/api/phones', phoneData);
      return response.data;
    } catch (err) {
      return phoneData;
    }
  },

  async updatePhone(id, phoneData) {
    try {
      const response = await apiClient.put(`/api/phones/${id}`, phoneData);
      return response.data;
    } catch (err) {
      return phoneData;
    }
  },

  async deletePhone(id) {
    try {
      const response = await apiClient.delete(`/api/phones/${id}`);
      return response.data;
    } catch (err) {
      return { success: true };
    }
  }
};
