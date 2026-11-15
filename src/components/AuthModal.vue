<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: MODAL ĐĂNG NHẬP / ĐĂNG KÝ TÀI KHOẢN (NGƯỜI DÙNG & QUẢN TRỊ ADMIN)              -->
  <!-- ENGLISH: USER & ADMIN AUTHENTICATION MODAL (LOGIN / REGISTER)                             -->
  <!-- ERD MAPPING: Ánh xạ thực thể NguoiDung, KhachHang, Admin                                  -->
  <!-- ========================================================================================== -->
  <div v-if="userStore.isAuthModalOpen" class="modal-overlay" @click.self="userStore.closeAuthModal">
    <div class="modal-content-custom p-4" style="max-width: 480px;">
      <!-- VIETNAMESE: Nút đóng modal | ENGLISH: Close button -->
      <button class="btn-close-modal" @click="userStore.closeAuthModal">
        <i class="fa fa-times"></i>
      </button>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: THANH TAB CHUYỂN ĐỔI ĐĂNG NHẬP / ĐĂNG KÝ                                 -->
      <!-- ENGLISH: TAB TOGGLE BETWEEN LOGIN AND REGISTRATION MODES                             -->
      <!-- ==================================================================================== -->
      <div class="d-flex border-bottom mb-4">
        <button
          class="auth-tab flex-grow-1 text-center py-2.5 fw-bold"
          :class="{ active: userStore.authMode === 'LOGIN' }"
          @click="userStore.authMode = 'LOGIN'"
        >
          Đăng Nhập
        </button>
        <button
          class="auth-tab flex-grow-1 text-center py-2.5 fw-bold"
          :class="{ active: userStore.authMode === 'REGISTER' }"
          @click="userStore.authMode = 'REGISTER'"
        >
          Đăng Ký Khách Mới
        </button>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: FORM ĐĂNG NHẬP (DÀNH CHO CẢ ADMIN VÀ KHÁCH HÀNG)                          -->
      <!-- ENGLISH: LOGIN FORM (AUTHENTICATES BOTH ADMIN & CLIENT ROLES)                        -->
      <!-- ==================================================================================== -->
      <form v-if="userStore.authMode === 'LOGIN'" @submit.prevent="handleLogin">
        <!-- Nhập Email hoặc Số điện thoại -->
        <div class="mb-3">
          <label class="form-label small fw-bold">Email hoặc Số điện thoại:</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa fa-envelope text-muted"></i></span>
            <input
              type="text"
              class="form-control"
              v-model="loginEmail"
              placeholder="VD: khachhang@trongnhanmobile.vn"
              required
            />
          </div>
        </div>

        <!-- Nhập Mật khẩu -->
        <div class="mb-3">
          <label class="form-label small fw-bold">Mật khẩu:</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa fa-lock text-muted"></i></span>
            <input
              type="password"
              class="form-control"
              v-model="loginPassword"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <!-- Tùy chọn ghi nhớ phiên đăng nhập -->
        <div class="d-flex justify-content-between align-items-center mb-4 small">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input me-1" checked /> Nhớ đăng nhập 
          </label>
          <a href="#" class="text-primary">Quên mật khẩu?</a>
        </div>

        <!-- Nút gửi đăng nhập -->
        <button type="submit" class="btn btn-primary-smart w-100 justify-content-center py-2.5 mb-3">
          <i class="fa fa-sign-in me-1"></i> Đăng nhập hệ thống
        </button>

        <!-- ĐƯỜNG PHÂN CÁCH HOẶC ĐĂNG NHẬP BẰNG TÀI KHOẢN LIÊN KẾT -->
        <div class="social-divider my-3 d-flex align-items-center">
          <hr class="flex-grow-1 my-0 border-secondary opacity-25" />
          <span class="px-2 small text-muted text-nowrap">Hoặc đăng nhập bằng</span>
          <hr class="flex-grow-1 my-0 border-secondary opacity-25" />
        </div>

        <!-- 3 NÚT LIÊN KẾT: GMAIL, FACEBOOK, ZALO -->
        <div class="d-flex flex-column gap-2 mb-3">
          <button
            type="button"
            class="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 social-btn"
            @click="handleSocialAuth('Gmail / Google')"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span class="small fw-bold text-dark">Đăng nhập bằng tài khoản Gmail</span>
          </button>

          <button
            type="button"
            class="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 social-btn"
            @click="handleSocialAuth('Facebook')"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="small fw-bold text-dark">Đăng nhập bằng tài khoản Facebook</span>
          </button>

         
        </div>

        <!-- Liên kết chuyển sang đăng ký -->
        <div class="text-center small text-muted">
          Chưa có tài khoản?
          <a href="#" class="fw-bold text-primary" @click.prevent="userStore.authMode = 'REGISTER'">
            Đăng ký ngay
          </a>
        </div>
      </form>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: FORM ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG MỚI (BẢNG KhachHang TRONG ERD)          -->
      <!-- ENGLISH: NEW CUSTOMER REGISTRATION FORM (MAPS TO KhachHang ERD TABLE)                 -->
      <!-- ERD: KhachHang (HoTen, Email, SDT, SoCCCD, DiaChi, KhachMoi)                          -->
      <!-- ==================================================================================== -->
      <form v-else @submit.prevent="handleRegister">
        <div class="alert alert-info py-2 px-3 small mb-3">
          <i class="fa fa-info-circle me-1"></i> Khách hàng mới (khachMoi) nhận ngay <strong>Voucher 50.000₫</strong> cho đơn thuê đầu tiên!
        </div>

        <!-- Họ và tên khách hàng (KhachHang.HoTen) -->
        <div class="mb-2">
          <label class="form-label small fw-bold">Họ và tên (khách thuê):</label>
          <input type="text" class="form-control form-control-sm" v-model="regName" placeholder="Nguyễn Văn A" required />
        </div>

        <!-- Email khách hàng (KhachHang.Email) -->
        <div class="mb-2">
          <label class="form-label small fw-bold">Email:</label>
          <input type="email" class="form-control form-control-sm" v-model="regEmail" placeholder="email@example.com" required />
        </div>

        <!-- Số điện thoại & CCCD (KhachHang.SDT, KhachHang.SoCCCD) -->
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label small fw-bold">Số điện thoại:</label>
            <input type="tel" class="form-control form-control-sm" v-model="regPhone" placeholder="0901234567" required />
          </div>
          <div class="col-6">
            <label class="form-label small fw-bold">Số CCCD (bắt buộc):</label>
            <input type="text" class="form-control form-control-sm" v-model="regCccd" placeholder="079201008899" required />
          </div>
        </div>

        <!-- Địa chỉ giao nhận máy (KhachHang.DiaChi) -->
        <div class="mb-2">
          <label class="form-label small fw-bold">Địa chỉ giao nhận máy:</label>
          <input type="text" class="form-control form-control-sm" v-model="regAddress" placeholder="Địa chỉ thường trú / tạm trú" required />
        </div>

        <!-- Mật khẩu tạo mới -->
        <div class="mb-3">
          <label class="form-label small fw-bold">Mật khẩu:</label>
          <input type="password" class="form-control form-control-sm" v-model="regPassword" placeholder="Tối thiểu 6 ký tự" required />
        </div>

        <!-- Nút kích hoạt tài khoản -->
        <button type="submit" class="btn btn-primary-smart w-100 justify-content-center py-2.5 mb-2">
          <i class="fa fa-user-plus me-1"></i> Đăng ký & Kích hoạt tài khoản
        </button>

        <!-- ĐƯỜNG PHÂN CÁCH HOẶC ĐĂNG KÝ BẰNG TÀI KHOẢN LIÊN KẾT -->
        <div class="social-divider my-3 d-flex align-items-center">
          <hr class="flex-grow-1 my-0 border-secondary opacity-25" />
          <span class="px-2 small text-muted text-nowrap">Hoặc đăng ký nhanh bằng</span>
          <hr class="flex-grow-1 my-0 border-secondary opacity-25" />
        </div>

        <!-- 3 NÚT LIÊN KẾT: GMAIL, FACEBOOK, ZALO TRONG ĐĂNG KÝ -->
        <div class="d-flex flex-column gap-2 mb-3">
          <!-- 1. Gmail / Google -->
          <button
            type="button"
            class="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 social-btn"
            @click="handleSocialAuth('Gmail / Google')"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span class="small fw-bold text-dark">Đăng ký bằng tài khoản Gmail</span>
          </button>

          <!-- 2. Facebook -->
          <button
            type="button"
            class="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 social-btn"
            @click="handleSocialAuth('Facebook')"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="small fw-bold text-dark">Đăng ký bằng tài khoản Facebook</span>
          </button>

          <!-- 3. Zalo -->
          <button
            type="button"
            class="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 social-btn"
            @click="handleSocialAuth('Zalo')"
          >
            <span class="zalo-badge-icon">Z</span>
            <span class="small fw-bold text-dark">Đăng ký bằng tài khoản Zalo</span>
          </button>
        </div>

        <div class="text-center small text-muted">
          Đã có tài khoản?
          <a href="#" class="fw-bold text-primary" @click.prevent="userStore.authMode = 'LOGIN'">
            Đăng nhập
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT CÁC MODULE VUE & STORE USER
// ENGLISH: IMPORT VUE CORE LIBS, ROUTER & USER STORE
// ============================================================================================
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import Swal from 'sweetalert2';

// Khởi tạo router và userStore
// Initialize router & userStore
const router = useRouter();
const userStore = useUserStore();

// Trạng thái form đăng nhập
// Login form state
const loginEmail = ref('');
const loginPassword = ref('');

// Trạng thái form đăng ký khách hàng mới
// Registration form state
const regName = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regCccd = ref('');
const regAddress = ref('');
const regPassword = ref('');

// ============================================================================================
// VIETNAMESE: XỬ LÝ ĐĂNG NHẬP & TỰ ĐỘNG ĐIỀU HƯỚNG SANG TRANG ADMIN NẾU LÀ ADMIN
// ENGLISH: HANDLE LOGIN & REDIRECT TO ADMIN PORTAL IF ROLE IS ADMIN
// ============================================================================================
const handleLogin = () => {
  const isAdmin = userStore.login(loginEmail.value, loginPassword.value);
  if (isAdmin) {
    Swal.fire({
      title: 'Đăng nhập Admin thành công!',
      text: 'Chào mừng Quản trị viên! Hệ thống đang chuyển bạn đến Cổng quản trị...',
      icon: 'success',
      timer: 1800,
      showConfirmButton: false
    });
    router.push('/admin');
  } else {
    Swal.fire({
      title: 'Đăng nhập thành công!',
      text: `Chào mừng ${userStore.user.hoTen} đã trở lại TrongNhanMobile!`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }
};

// ============================================================================================
// VIETNAMESE: XỬ LÝ ĐĂNG KÝ KHÁCH HÀNG MỚI (LƯU VÀO KhachHang)
// ENGLISH: HANDLE NEW CUSTOMER REGISTRATION
// ============================================================================================
const handleRegister = () => {
  userStore.user.hoTen = regName.value || 'Khách Mới';
  userStore.user.email = regEmail.value;
  userStore.user.sdt = regPhone.value;
  userStore.user.cccd = regCccd.value;
  userStore.user.diaChi = regAddress.value;
  userStore.user.khachMoi = true;
  userStore.login(regEmail.value, regPassword.value);

  Swal.fire({
    title: 'Đăng ký thành công!',
    text: 'Đã tạo tài khoản và kích hoạt phiên đăng nhập. Bạn được tặng mã KHACHMOI50K!',
    icon: 'success'
  });
};

// ============================================================================================
// VIETNAMESE: XỬ LÝ LIÊN KẾT ĐĂNG KÝ / ĐĂNG NHẬP BẰNG GMAIL, FACEBOOK, ZALO
// ENGLISH: SOCIAL AUTH HANDLER (GMAIL / GOOGLE, FACEBOOK, ZALO)
// ============================================================================================
const handleSocialAuth = (provider) => {
  Swal.fire({
    title: `Đang liên kết với ${provider}...`,
    html: `
      <div class="text-center py-2">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="small text-muted mb-0">Đang xác thực thông tin và đồng bộ hồ sơ từ <strong>${provider}</strong>...</p>
      </div>
    `,
    showConfirmButton: false,
    timer: 1500
  }).then(() => {
    let mockEmail = 'trongnhan.stu@gmail.com';
    let mockName = 'Trần Trọng Nhân';
    if (provider.includes('Facebook')) {
      mockEmail = 'trongnhan.fb@gmail.com';
      mockName = 'Trần Trọng Nhân (Facebook)';
    } else if (provider.includes('Zalo')) {
      mockEmail = '0908123456@zalo.vn';
      mockName = 'Trần Trọng Nhân (Zalo)';
    } else {
      mockName = 'Trần Trọng Nhân (Google)';
    }

    userStore.register({
      hoTen: mockName,
      email: mockEmail,
      sdt: '0908123456',
      cccd: '079203001234',
      diaChi: '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM'
    });

    Swal.fire({
      icon: 'success',
      title: 'Đăng Ký & Liên Kết Thành Công!',
      html: `
        <div class="text-start small">
          <p class="mb-1">Khách hàng: <strong>${mockName}</strong></p>
          <p class="mb-1">Tài khoản liên kết: <strong>${provider}</strong></p>
          <p class="mb-1">Email / ID: <code>${mockEmail}</code></p>
          <p class="mb-0 text-success"><i class="fa fa-gift me-1"></i> Đã tặng Voucher <strong>KHACHMOI50K</strong> (50.000₫)!</p>
        </div>
      `,
      timer: 2500,
      showConfirmButton: false
    });
  });
};
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS CHO MODAL XÁC THỰC NGƯỜI DÙNG & TABS                                        */
/* ENGLISH: SCOPED STYLES FOR AUTH MODAL & TABS                                                 */
/* ============================================================================================ */
.social-btn {
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.social-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

.zalo-badge-icon {
  width: 20px;
  height: 20px;
  background: #0068FF;
  color: #ffffff;
  font-weight: 900;
  font-size: 12px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  letter-spacing: -0.5px;
}
.auth-tab {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.auth-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.btn-close-modal {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
}

.btn-close-modal:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}
</style>
