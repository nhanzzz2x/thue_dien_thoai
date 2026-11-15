// ============================================================================================
// VIETNAMESE: DỊCH VỤ GỌI API ĐƠN THUÊ, HỢP ĐỒNG & DUYỆT CỌC (GIAI ĐOẠN 3)
// ENGLISH: RENTAL ORDER, CONTRACT & DEPOSIT API SERVICE (PHASE 3)
// ERD MAPPING: Ánh xạ endpoint Spring Boot cho thực thể DonThue, ChiTietDonThue, DatCoc
// ============================================================================================

import apiClient from './api';

export const OrderService = {
  // ==========================================================================================
  // VIETNAMESE: LẤY DANH SÁCH TẤT CẢ ĐƠN THUÊ (GET /api/rentals)
  // ENGLISH: FETCH ALL RENTAL ORDERS (GET /api/rentals)
  // ==========================================================================================
  async getAllOrders() {
    try {
      const response = await apiClient.get('/api/rentals');
      return response.data;
    } catch (err) {
      return [];
    }
  },

  // ==========================================================================================
  // VIETNAMESE: TẠO ĐƠN THUÊ MỚI (POST /api/rentals)
  // ENGLISH: CREATE NEW RENTAL ORDER (POST /api/rentals)
  // ==========================================================================================
  async createOrder(orderPayload) {
    try {
      const response = await apiClient.post('/api/rentals', orderPayload);
      return response.data;
    } catch (err) {
      return orderPayload;
    }
  },

  // ==========================================================================================
  // VIETNAMESE: CẬP NHẬT TRẠNG THÁI VÒNG ĐỜI ĐƠN THUÊ (PATCH /api/rentals/{id}/status)
  // ENGLISH: UPDATE RENTAL STATUS WORKFLOW (PATCH /api/rentals/{id}/status)
  // STATES: CHO_DUYET -> DA_XAC_NHAN_COC -> DANG_THUE -> DA_TRA_MAY -> HOAN_TAT_TRA_COC
  // ==========================================================================================
  async updateOrderStatus(orderId, newStatus, inspectionNotes = '') {
    try {
      const response = await apiClient.patch(`/api/rentals/${orderId}/status`, {
        status: newStatus,
        notes: inspectionNotes
      });
      return response.data;
    } catch (err) {
      return { success: true, status: newStatus };
    }
  },

  // ==========================================================================================
  // VIETNAMESE: LẤY CHI TIẾT HỢP ĐỒNG ĐIỆN TỬ (GET /api/rentals/{id}/contract)
  // ENGLISH: FETCH DIGITAL RENTAL CONTRACT DATA (GET /api/rentals/{id}/contract)
  // ==========================================================================================
  async getContract(orderId) {
    try {
      const response = await apiClient.get(`/api/rentals/${orderId}/contract`);
      return response.data;
    } catch (err) {
      return null;
    }
  }
};
