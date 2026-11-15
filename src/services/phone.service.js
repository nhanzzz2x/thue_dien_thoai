// ============================================================================================
// VIETNAMESE: DỊCH VỤ GỌI API ĐIỆN THOẠI & KHO THIẾT BỊ (GIAI ĐOẠN 3)
// ENGLISH: PHONE & FLEET INVENTORY API SERVICE (PHASE 3)
// ERD MAPPING: Ánh xạ endpoint Spring Boot cho thực thể DienThoai và CauHinh_PhienBan
// ============================================================================================

import apiClient from './api';
import { mockPhones, mockCategories } from '@/data/mockData';

export const PhoneService = {
  // ==========================================================================================
  // VIETNAMESE: LẤY DANH SÁCH TẤT CẢ ĐIỆN THOẠI (GET /api/phones)
  // ENGLISH: FETCH ALL PHONES (GET /api/phones)
  // ==========================================================================================
  async getAllPhones() {
    try {
      const response = await apiClient.get('/api/phones');
      console.log('getAllPhones >>> ', response.data);
      return response.data;
    } catch (err) {
      return [...mockPhones];
    }
  },

  // ==========================================================================================
  // VIETNAMESE: LẤY CHI TIẾT ĐIỆN THOẠI THEO ID (GET /api/phones/{id})
  // ENGLISH: FETCH PHONE DETAIL BY ID (GET /api/phones/{id})
  // ==========================================================================================
  async getPhoneById(id) {
    try {
      const response = await apiClient.get(`/api/phones/${id}`);
      // console.log('getPhoneById >>> ', response.data);

      return response.data;
    } catch (err) {
      return mockPhones.find(p => p.maDienThoai === Number(id));
    }
  },

  // ==========================================================================================
  // VIETNAMESE: LẤY DANH MỤC THƯƠNG HIỆU (GET /api/categories)
  // ENGLISH: FETCH BRAND CATEGORIES (GET /api/categories)
  // ==========================================================================================
  async getCategories() {
    try {
      const response = await apiClient.get('/api/categories');
      return response.data;
    } catch (err) {
      return [...mockCategories];
    }
  },

  // ==========================================================================================
  // VIETNAMESE: QUẢN TRỊ ADMIN - THÊM THIẾT BỊ MỚI (POST /api/phones)
  // ENGLISH: ADMIN ACTION - CREATE NEW PHONE (POST /api/phones)
  // ==========================================================================================
  async createPhone(phoneData) {
    try {
      // console.log('Run createPhone');
      const response = await apiClient.post('/api/phones', phoneData);
      // console.log(response.data);
      return response.data;
    } catch (err) {
      return phoneData;
    }
  },

  // ==========================================================================================
  // VIETNAMESE: QUẢN TRỊ ADMIN - CẬP NHẬT THIẾT BỊ (PUT /api/phones/{id})
  // ENGLISH: ADMIN ACTION - UPDATE PHONE (PUT /api/phones/{id})
  // ==========================================================================================
  async updatePhone(id, phoneData) {
    try {
      const response = await apiClient.put(`/api/phones/${id}`, phoneData);
      return response.data;
    } catch (err) {
      return phoneData;
    }
  },

  // ==========================================================================================
  // VIETNAMESE: QUẢN TRỊ ADMIN - XÓA THIẾT BỊ KHỎI KHO (DELETE /api/phones/{id})
  // ENGLISH: ADMIN ACTION - DELETE PHONE (DELETE /api/phones/{id})
  // ==========================================================================================
  async deletePhone(id) {
    try {
      const response = await apiClient.delete(`/api/phones/${id}`);
      return response.data;
    } catch (err) {
      return { success: true };
    }
  }
};
