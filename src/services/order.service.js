import apiClient from './api';

// Dịch vụ gọi API Đơn Thuê, Đặt Cọc & Hợp Đồng (Kết nối Node.js Express + MySQL WampServer)
export const OrderService = {
  async getAllOrders() {
    try {
      const response = await apiClient.get('/api/rentals');
      return response.data;
    } catch (err) {
      return [];
    }
  },

  async createOrder(orderPayload) {
    try {
      const response = await apiClient.post('/api/rentals', orderPayload);
      return response.data;
    } catch (err) {
      return orderPayload;
    }
  },

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

  async getContract(orderId) {
    try {
      const response = await apiClient.get(`/api/rentals/${orderId}/contract`);
      return response.data;
    } catch (err) {
      return null;
    }
  }
};
