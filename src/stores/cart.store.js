import { defineStore } from 'pinia';
import { mockVouchers } from '@/data/mockData';

// Pinia Store quản lý Giỏ thuê, Thời gian thuê, Tiền cọc & Khuyến mãi
export const useCartStore = defineStore('cart', {
  state: () => {
    const today = new Date();
    const defaultEnd = new Date();
    defaultEnd.setDate(today.getDate() + 3);

    return {
      items: [], // [{ phone, quantity }]
      startDate: today.toISOString().split('T')[0],
      endDate: defaultEnd.toISOString().split('T')[0],
      selectedDepositMethod: 'GIAY_TO_TUY_THAN', // GIAY_TO_TUY_THAN | CHUYEN_KHOAN | MAY_ANH_MAY_TINH
      appliedVoucher: null,
      isDrawerOpen: false
    };
  },

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    // Tổng số ngày thuê
    rentalDays: (state) => {
      const diffTime = Math.abs(new Date(state.endDate) - new Date(state.startDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    },

    // Tiền thuê tạm tính trước giảm giá
    subTotalRental: (state) => {
      const days = state.rentalDays;
      return state.items.reduce((total, item) => {
        const dailyRate = item.phone.giaKhuyenMai || item.phone.giaThueNgay;
        return total + dailyRate * days * item.quantity;
      }, 0);
    },

    // Tổng tiền cọc định mức của các máy trong giỏ
    totalDepositRequired: (state) =>
      state.items.reduce((total, item) => total + item.phone.tienCocYeuCau * item.quantity, 0),

    // Số tiền mặt cần cọc thực tế theo phương thức thế chân
    actualCashDeposit: (state) => {
      const baseDeposit = state.totalDepositRequired;
      if (state.selectedDepositMethod === 'GIAY_TO_TUY_THAN') return Math.round(baseDeposit * 0.15);
      if (state.selectedDepositMethod === 'MAY_ANH_MAY_TINH') return 0;
      return baseDeposit;
    },

    // Phần trăm giảm giá tự động khi thuê dài hạn (>= 3 ngày giảm 15%, >= 7 ngày giảm 25%)
    autoDiscountPercent: (state) => {
      if (state.rentalDays >= 7) return 25;
      if (state.rentalDays >= 3) return 15;
      return 0;
    },

    autoDiscountAmount: (state) => Math.round(state.subTotalRental * (state.autoDiscountPercent / 100)),

    voucherDiscountAmount: (state) => state.appliedVoucher?.GiaTriGiam || 0,

    // Tổng tiền thuê cuối cùng sau khuyến mãi
    finalTotalRental: (state) => {
      const total = state.subTotalRental - state.autoDiscountAmount - state.voucherDiscountAmount;
      return total > 0 ? total : 0;
    }
  },

  actions: {
    addToCart(phone, quantity = 1) {
      const existing = this.items.find((i) => i.phone.maDienThoai === phone.maDienThoai);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ phone, quantity });
      }
    },

    updateQuantity(phoneId, qty) {
      if (qty <= 0) return this.removeFromCart(phoneId);
      const item = this.items.find((i) => i.phone.maDienThoai === phoneId);
      if (item) item.quantity = qty;
    },

    removeFromCart(phoneId) {
      this.items = this.items.filter((i) => i.phone.maDienThoai !== phoneId);
    },

    clearCart() {
      this.items = [];
      this.appliedVoucher = null;
    },

    openDrawer() {
      this.isDrawerOpen = true;
    },

    closeDrawer() {
      this.isDrawerOpen = false;
    },

    applyVoucherCode(code) {
      const trimmed = (code || '').toUpperCase().trim();
      const voucher = mockVouchers.find((v) => v.Code.toUpperCase() === trimmed);

      if (!voucher) {
        return { success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
      }
      if (this.subTotalRental < voucher.DonToiThieu) {
        return {
          success: false,
          message: `Đơn thuê tối thiểu phải từ ${voucher.DonToiThieu.toLocaleString('vi-VN')}đ để sử dụng mã này.`
        };
      }

      this.appliedVoucher = voucher;
      return {
        success: true,
        message: `Áp dụng thành công mã ${voucher.Code}: Giảm ${voucher.GiaTriGiam.toLocaleString('vi-VN')}đ!`
      };
    },

    removeVoucher() {
      this.appliedVoucher = null;
    }
  }
});
