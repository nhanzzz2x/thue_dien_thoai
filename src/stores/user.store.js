// ============================================================================================
// VIETNAMESE: PINIA STORE QUẢN LÝ TÀI KHOẢN, PHÂN QUYỀN (ADMIN / KHÁCH HÀNG) VÀ XÁC THỰC
// ENGLISH: PINIA STORE FOR USER AUTHENTICATION, ROLES (ADMIN / CLIENT) & MODAL CONTROL
// ERD MAPPING: Ánh xạ thực thể NguoiDung, KhachHang, Admin trong sơ đồ CSDL
// ============================================================================================

import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  // ==========================================================================================
  // VIETNAMESE: TRẠNG THÁI NGƯỜI DÙNG & PHÂN QUYỀN
  // ENGLISH: USER AUTHENTICATION & ROLE STATE
  // ==========================================================================================
  state: () => ({
    // Đã đăng nhập hay chưa | Is logged in flag
    isLoggedIn: false,

    // Là quản trị viên hay khách hàng thường | Is Admin role flag
    isAdmin: false,

    // Trạng thái modal đăng nhập / đăng ký
    isAuthModalOpen: false,
    authMode: 'LOGIN', // 'LOGIN' | 'REGISTER'

    // Thông tin người dùng hiện tại (Ánh xạ bảng NguoiDung / KhachHang / Admin)
    user: {
      id: 1,
      email: 'trongnhan@trongnhanmobile.vn',
      hoTen: 'Trần Trong Nhân',
      sdt: '0987654321',
      cccd: '079201008899',
      diaChi: '195/9 Nguyễn Văn Thương, P.25, Bình Thạnh, TP.HCM',
      khachMoi: true,
      vaiTro: 'KHACH_HANG' // 'ADMIN' | 'KHACH_HANG'
    }
  }),

  // ==========================================================================================
  // VIETNAMESE: ACTIONS - ĐĂNG NHẬP, ĐĂNG XUẤT VÀ PHÂN QUYỀN TRUY CẬP
  // ENGLISH: ACTIONS - LOGIN, LOGOUT & ROLE-BASED ACCESS CONTROL
  // ==========================================================================================
  actions: {
    // Mở popup đăng nhập
    openLogin() {
      this.authMode = 'LOGIN';
      this.isAuthModalOpen = true;
    },

    // Mở popup đăng ký
    openRegister() {
      this.authMode = 'REGISTER';
      this.isAuthModalOpen = true;
    },

    // Đóng popup xác thực
    closeAuthModal() {
      this.isAuthModalOpen = false;
    },

    // ========================================================================================
    // VIETNAMESE: XỬ LÝ ĐĂNG NHẬP VÀ PHÂN ĐỊNH VAI TRÒ ADMIN HOẶC KHÁCH HÀNG
    // ENGLISH: PROCESS USER LOGIN & DETERMINE USER ROLE (ADMIN VS CUSTOMER)
    // ========================================================================================
    login(email, password) {
      this.isLoggedIn = true;
      const lowerEmail = (email || '').toLowerCase().trim();

      // KIỂM TRA TÀI KHOẢN QUẢN TRỊ VIÊN ADMIN
      // Check if credentials belong to Admin
      if (lowerEmail.includes('admin') || password === 'admin123' || lowerEmail === 'admin@trongnhanmobile.vn') {
        this.isAdmin = true;
        this.user = {
          id: 99,
          email: email || 'admin@trongnhanmobile.vn',
          hoTen: 'Quản Trị Viên (Admin)',
          sdt: '0988123456',
          cccd: '079201009999',
          diaChi: 'Hệ Thống Trụ Sở TrongNhanMobile, 195/9 Nguyễn Văn Thương, Bình Thạnh',
          khachMoi: false,
          vaiTro: 'ADMIN'
        };
      } else {
        // TÀI KHOẢN KHÁCH HÀNG THUÊ THIẾT BỊ
        // Client account
        this.isAdmin = false;
        this.user = {
          id: 1,
          email: email || 'khachhang@trongnhanmobile.vn',
          hoTen: 'Trần Trong Nhân',
          sdt: '0987654321',
          cccd: '079201008899',
          diaChi: '195/9 Nguyễn Văn Thương, P.25, Bình Thạnh, TP.HCM',
          khachMoi: true,
          vaiTro: 'KHACH_HANG'
        };
      }

      this.isAuthModalOpen = false;
      return this.isAdmin;
    },

    // ========================================================================================
    // VIETNAMESE: ĐĂNG NHẬP NHANH BẰNG TÀI KHOẢN QUẢN TRỊ ADMIN (PHỤC VỤ TEST & BẢO VỆ ĐỒ ÁN)
    // ENGLISH: ONE-CLICK ADMIN LOGIN HELPER FOR THESIS DEMO & TESTING
    // ========================================================================================
    loginAsAdmin() {
      return this.login('admin@trongnhanmobile.vn', 'admin123');
    },

    // ========================================================================================
    // VIETNAMESE: ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG MỚI (LƯU VÀO STATE BẢNG KhachHang)
    // ENGLISH: REGISTER NEW CLIENT CUSTOMER ACCOUNT
    // ========================================================================================
    register(newUserData) {
      this.isLoggedIn = true;
      this.isAdmin = false;
      this.user = {
        id: Date.now(),
        email: newUserData.email || 'khachhang@trongnhanmobile.vn',
        hoTen: newUserData.hoTen || 'Khách Hàng Mới',
        sdt: newUserData.sdt || '0901234567',
        cccd: newUserData.cccd || '079201008899',
        diaChi: newUserData.diaChi || '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM',
        khachMoi: true,
        vaiTro: 'KHACH_HANG'
      };
      this.isAuthModalOpen = false;
      return this.user;
    },

    // Đăng xuất khỏi hệ thống
    // Logout action
    logout() {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }
});
