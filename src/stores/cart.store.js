// ============================================================================================
// VIETNAMESE: PINIA STORE QUẢN LÝ GIỎ THUÊ, THỜI GIAN THUÊ, TIỀN CỌC VÀ ƯU ĐÃI
// ENGLISH: PINIA STORE FOR RENTAL CART, RENTAL PERIOD, DEPOSIT CALCULATION & DISCOUNTS
// ERD MAPPING: Ánh xạ cấu trúc bảng DonThue, ChiTietDonThue, DatCoc, KhuyenMai, PhieuKhuyenMai
// ============================================================================================

import { defineStore } from 'pinia';
import { mockPromotions, mockVouchers } from '@/data/mockData';

export const useCartStore = defineStore('cart', {
  // ==========================================================================================
  // VIETNAMESE: TRẠNG THÁI KHỞI TẠO CỦA GIỎ THUÊ
  // ENGLISH: INITIAL CART STATE
  // ==========================================================================================
  state: () => {
    const today = new Date();
    const defaultEnd = new Date();
    defaultEnd.setDate(today.getDate() + 3); // Mặc định thời gian thuê 3 ngày

    return {
      // Danh sách các thiết bị trong giỏ thuê: [{ phone, quantity }]
      // ERD: Ánh xạ các dòng của ChiTietDonThue (MaDonThue, MaDienThoai, SoLuong, DonGiaNgay)
      items: [],

      // Mốc thời gian nhận máy và trả máy
      // ERD: DonThue.NgayBatDauThue và DonThue.NgayKetThucThue
      startDate: today.toISOString().split('T')[0],
      endDate: defaultEnd.toISOString().split('T')[0],

      // Phương thức thế chân / đặt cọc đã chọn (GIAY_TO_TUY_THAN, CHUYEN_KHOAN, MAY_ANH_MAY_TINH)
      // ERD: DatCoc.PhuongThuc
      selectedDepositMethod: 'GIAY_TO_TUY_THAN',

      // Phiếu khuyến mãi voucher người dùng đã áp dụng
      // ERD: PhieuKhuyenMai (Code, GiaTriGiam)
      appliedVoucher: null,

      // Trạng thái mở/đóng thanh trượt giỏ hàng
      isDrawerOpen: false
    };
  },

  // ==========================================================================================
  // VIETNAMESE: GETTERS - TÍNH TOÁN CÁC CHỈ SỐ TÀI CHÍNH CỦA ĐƠN THUÊ
  // ENGLISH: GETTERS - DERIVED FINANCIAL CALCULATIONS
  // ==========================================================================================
  getters: {
    // Tổng số lượng thiết bị thuê trong giỏ
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    // ========================================================================================
    // VIETNAMESE: TÍNH TỔNG SỐ NGÀY THUÊ DỰA TRÊN NGÀY BẮT ĐẦU VÀ KẾT THÚC
    // ENGLISH: CALCULATE TOTAL RENTAL DAYS (DATEDIFF IN SQL)
    // SQL TƯƠNG ĐƯƠNG: DATEDIFF(DonThue.NgayKetThucThue, DonThue.NgayBatDauThue)
    // ========================================================================================
    rentalDays: (state) => {
      const start = new Date(state.startDate);
      const end = new Date(state.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    },

    // ========================================================================================
    // VIETNAMESE: TIỀN THUÊ TẠM TÍNH (CHƯA TRỪ KHUYẾN MÃI) = TỔNG(ĐƠN GIÁ NGÀY * SỐ NGÀY * SỐ LƯỢNG)
    // ENGLISH: SUBTOTAL RENTAL REVENUE BEFORE DISCOUNTS
    // SQL TƯƠNG ĐƯƠNG: SUM(ct.DonGiaNgay * :rentalDays * ct.SoLuong)
    // ========================================================================================
    subTotalRental: (state) => {
      const days = state.rentalDays;
      return state.items.reduce((total, item) => {
        const dailyRate = item.phone.giaKhuyenMai || item.phone.giaThueNgay;
        return total + dailyRate * days * item.quantity;
      }, 0);
    },

    // ========================================================================================
    // VIETNAMESE: TỔNG TIỀN CỌC ĐỊNH MỨC THEO THIẾT BỊ (BẢNG DienThoai.TienCocYeuCau)
    // ENGLISH: TOTAL BENCHMARK COLLATERAL VALUE BASED ON DEVICES
    // ========================================================================================
    totalDepositRequired: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.phone.tienCocYeuCau * item.quantity;
      }, 0);
    },

    // ========================================================================================
    // VIETNAMESE: TIỀN MẶT CẦN CỌC THỰC TẾ DỰA TRÊN HÌNH THỨC THẾ CHÂN ĐÃ CHỌN
    // ENGLISH: ACTUAL CASH COLLATERAL REQUIRED BASED ON SELECTED COLLATERAL METHOD
    // ERD: DatCoc.SoTienCoc
    // - GIAY_TO_TUY_THAN: Giữ CCCD gắn chip -> chỉ nộp 15% tiền mặt
    // - CHUYEN_KHOAN: Chuyển khoản đủ 100% định mức
    // - MAY_ANH_MAY_TINH: Thế chân tài sản giá trị tương đương -> 0đ tiền cọc mặt
    // ========================================================================================
    actualCashDeposit: (state) => {
      const baseDeposit = state.totalDepositRequired;
      switch (state.selectedDepositMethod) {
        case 'GIAY_TO_TUY_THAN':
          return Math.round(baseDeposit * 0.15);
        case 'CHUYEN_KHOAN':
          return baseDeposit;
        case 'MAY_ANH_MAY_TINH':
          return 0;
        default:
          return baseDeposit;
      }
    },

    // ========================================================================================
    // VIETNAMESE: PHẦN TRĂM ƯU ĐÃI TỰ ĐỘNG THEO SỐ NGÀY THUÊ DÀI HẠN
    // ENGLISH: AUTO DISCOUNT PERCENTAGE BASED ON RENTAL DURATION
    // LOGIC: Thuê >= 3 ngày giảm 15%, thuê >= 7 ngày giảm 25% (KhuyenMai)
    // ========================================================================================
    autoDiscountPercent: (state) => {
      const days = state.rentalDays;
      if (days >= 7) return 25;
      if (days >= 3) return 15;
      return 0;
    },

    // Số tiền giảm giá tự động từ chính sách thuê dài hạn
    autoDiscountAmount: (state) => {
      const percent = state.autoDiscountPercent;
      return Math.round(state.subTotalRental * (percent / 100));
    },

    // Số tiền giảm giá từ phiếu Voucher
    voucherDiscountAmount: (state) => {
      if (!state.appliedVoucher) return 0;
      return state.appliedVoucher.GiaTriGiam || 0;
    },

    // ========================================================================================
    // VIETNAMESE: TỔNG TIỀN THUÊ CUỐI CÙNG SAU TẤT CẢ KHUYẾN MÃI
    // ENGLISH: FINAL NET RENTAL REVENUE (DonThue.TongTien)
    // CÔNG THỨC: finalTotalRental = subTotalRental - autoDiscountAmount - voucherDiscountAmount
    // ========================================================================================
    finalTotalRental: (state) => {
      const subtotal = state.subTotalRental;
      const autoDiscount = state.autoDiscountAmount;
      const voucherDiscount = state.voucherDiscountAmount;
      const total = subtotal - autoDiscount - voucherDiscount;
      return total > 0 ? total : 0;
    }
  },

  // ==========================================================================================
  // VIETNAMESE: ACTIONS - THAO TÁC THÊM/SỬA/XÓA MÁY VÀ ÁP DỤNG VOUCHER
  // ENGLISH: ACTIONS - CART MANIPULATION & VOUCHER VALIDATION
  // ==========================================================================================
  actions: {
    // VIETNAMESE: Thêm thiết bị vào giỏ thuê
    // ENGLISH: Add phone device to rental cart
    addToCart(phone, quantity = 1) {
      const existing = this.items.find(i => i.phone.maDienThoai === phone.maDienThoai);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          phone,
          quantity
        });
      }
    },

    // Cập nhật số lượng thuê của 1 máy
    updateQuantity(phoneId, qty) {
      if (qty <= 0) {
        this.removeFromCart(phoneId);
        return;
      }
      const item = this.items.find(i => i.phone.maDienThoai === phoneId);
      if (item) {
        item.quantity = qty;
      }
    },

    // Xóa máy khỏi giỏ thuê
    removeFromCart(phoneId) {
      this.items = this.items.filter(i => i.phone.maDienThoai !== phoneId);
    },

    // Xóa toàn bộ giỏ thuê sau khi đặt hàng thành công
    clearCart() {
      this.items = [];
      this.appliedVoucher = null;
    },

    // Mở và đóng drawer
    openDrawer() {
      this.isDrawerOpen = true;
    },

    closeDrawer() {
      this.isDrawerOpen = false;
    },

    // ========================================================================================
    // VIETNAMESE: KIỂM TRA VÀ ÁP DỤNG MÃ VOUCHER (PhieuKhuyenMai)
    // ENGLISH: VALIDATE AND APPLY PROMOTIONAL VOUCHER CODE
    // ========================================================================================
    applyVoucherCode(code) {
      const trimmed = (code || '').toUpperCase().trim();
      const voucher = mockVouchers.find(v => v.Code.toUpperCase() === trimmed);

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

    // Hủy mã giảm giá đã áp dụng
    removeVoucher() {
      this.appliedVoucher = null;
    }
  }
});
