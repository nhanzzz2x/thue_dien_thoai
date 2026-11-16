<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: MODAL ĐĂNG NHẬP / ĐĂNG KÝ TÀI KHOẢN (NGƯỜI DÙNG & QUẢN TRỊ ADMIN)              -->
  <!-- ENGLISH: USER & ADMIN AUTHENTICATION MODAL (LOGIN / REGISTER)                             -->
  <!-- ERD MAPPING: Ánh xạ thực thể NguoiDung, KhachHang, Admin                                  -->
  <!-- ========================================================================================== -->
  <div v-if="userStore.isAuthModalOpen" class="modal-overlay" @click.self="closeModal">
    <div
      class="modal-content-custom overflow-hidden transition-all"
      :class="{ 'p-0': oauthProvider, 'p-4': !oauthProvider }"
      :style="{ maxWidth: oauthProvider ? '780px' : '490px' }"
    >
      <!-- VIETNAMESE: Nút đóng modal | ENGLISH: Close button -->
      <button v-if="!oauthProvider" class="btn-close-modal" @click="closeModal">
        <i class="fa fa-times"></i>
      </button>

      <!-- ==================================================================================== -->
      <!-- GIAO DIỆN ĐĂNG NHẬP GOOGLE / FACEBOOK CHUẨN XÁC THEO VIDEO CLIP THỰC TẾ              -->
      <!-- ==================================================================================== -->
      <div v-if="oauthProvider" class="oauth-window-container">
        <!-- 1. MÀN HÌNH LOADING SPINNER KHI BẤM CHỌN TÀI KHOẢN (GIỐNG FRAME 00:06 CỦA VIDEO) -->
        <div v-if="isOAuthLoading" class="oauth-spinner-view text-center py-5 px-4 bg-white">
          <h2 class="fw-black text-danger mb-4 tracking-wider" style="letter-spacing: 2px;">
            TRONGNHAN MOBILE
          </h2>
          <div class="oauth-circle-spinner mx-auto mb-3"></div>
          <p class="text-secondary small mb-0">Đang đồng bộ tài khoản và đăng nhập...</p>
        </div>

        <!-- 2. MÀN HÌNH CHỌN TÀI KHOẢN OAUTH (GIỐNG FRAME 00:02 - 00:05 CỦA VIDEO) -->
        <div v-else class="oauth-main-view bg-white">
          <!-- Top bar -->
          <div class="oauth-top-bar d-flex align-items-center justify-content-between px-4 py-2.5 bg-white">
            <div class="d-flex align-items-center gap-2">
              <!-- Google icon -->
              <svg v-if="oauthProvider === 'Google'" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <!-- Facebook icon -->
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="small fw-semibold text-secondary">Đăng nhập bằng {{ oauthProvider }}</span>
            </div>
            <button @click="oauthProvider = null" class="btn btn-sm btn-link text-muted p-0 text-decoration-none" title="Đóng">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <!-- Top colored line -->
          <div class="oauth-top-line" :style="{ backgroundColor: oauthProvider === 'Google' ? '#4285F4' : '#1877F2' }"></div>

          <!-- Main 2-column box -->
          <div class="p-4 p-md-5">
            <div class="row g-4 align-items-start">
              <!-- Cột trái: Logo app & Tiêu đề "Liên kết tài khoản" -->
              <div class="col-12 col-md-5 text-start pe-md-3">
                <div class="app-oauth-badge bg-danger text-white rounded-3 d-inline-flex align-items-center justify-content-center mb-3 shadow-sm">
                  <span class="fw-bold fs-4">TN</span>
                </div>
                <h3 class="fw-bold text-dark mb-1">Liên kết tài khoản</h3>
                <p class="text-secondary small mb-0">Tiếp tục tới <strong>TrongNhanMobile Login</strong></p>
              </div>

              <!-- Cột phải: Xác nhận liên kết tài khoản của người dùng (Không còn tài khoản ảo) -->
              <div class="col-12 col-md-7 ps-md-3">
                <div class="alert alert-warning border border-warning-subtle text-dark p-3 mb-3 rounded-3 text-start">
                  <div class="d-flex gap-2">
                    <i class="fa fa-question-circle text-warning fs-5 flex-shrink-0 mt-0.5"></i>
                    <div>
                      <strong class="d-block mb-1 text-dark">Câu hỏi xác nhận:</strong>
                      <p class="mb-0 small fw-semibold text-primary">
                        Bạn có muốn liên kết tài khoản {{ oauthProvider }} để đăng nhập vào TrongNhanMobile không?
                      </p>
                    </div>
                  </div>
                </div>

                <div class="mb-3 text-start">
                  <label class="form-label small fw-bold mb-1">
                    Địa chỉ Email / Tài khoản {{ oauthProvider }} của bạn:
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="fa" :class="oauthProvider === 'Google' ? 'fa-google text-danger' : 'fa-facebook text-primary'"></i>
                    </span>
                    <input
                      v-model="customOAuthEmail"
                      type="text"
                      class="form-control"
                      :placeholder="oauthProvider === 'Google' ? 'Nhập Gmail của bạn (VD: yourname@gmail.com)' : 'Nhập Email / SĐT Facebook của bạn'"
                    />
                  </div>
                </div>

                <div class="mb-3 text-start">
                  <label class="form-label small fw-bold mb-1">Họ và tên của bạn:</label>
                  <input
                    v-model="customOAuthName"
                    type="text"
                    class="form-control"
                    placeholder="Trần Trọng Nhân"
                  />
                </div>

                <div class="d-flex flex-column gap-2 mb-3">
                  <button
                    type="button"
                    class="btn btn-primary w-100 py-2.5 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                    @click="submitCustomOAuth"
                  >
                    <i class="fa fa-check-circle"></i> Đồng ý liên kết & Đăng nhập ngay
                  </button>

                  <button
                    type="button"
                    class="btn btn-outline-secondary w-100 py-2 small rounded-pill"
                    @click="oauthProvider = null"
                  >
                    <i class="fa fa-arrow-left me-1"></i> Quay lại đăng nhập thường
                  </button>
                </div>

                <!-- Chính sách bảo mật -->
                <p class="text-muted small text-start mb-0" style="font-size: 0.74rem; line-height: 1.5;">
                  Trước khi sử dụng TrongNhanMobile Login, bạn có thể xem Chính sách quyền riêng tư và Điều khoản dịch vụ của ứng dụng này.
                </p>
              </div>
            </div>

            <!-- Footer Google: Ngôn ngữ & các liên kết -->
            <div class="d-flex justify-content-between align-items-center pt-3 mt-4 border-top text-muted small flex-wrap gap-2" style="font-size: 0.76rem;">
              <div>
                <span class="cursor-pointer text-secondary">Tiếng Việt ▾</span>
              </div>
              <div class="d-flex gap-3">
                <a href="#" class="text-muted text-decoration-none">Trợ giúp</a>
                <a href="#" class="text-muted text-decoration-none">Quyền riêng tư</a>
                <a href="#" class="text-muted text-decoration-none">Điều khoản</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FORM ĐĂNG NHẬP / ĐĂNG KÝ MẶC ĐỊNH (KHI CHƯA MỞ LIÊN KẾT MẠNG XÃ HỘI) -->
      <div v-else>
        <!-- THANH TAB CHUYỂN ĐỔI ĐĂNG NHẬP / ĐĂNG KÝ -->
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

      <!-- FORM ĐĂNG NHẬP (DÀNH CHO CẢ ADMIN VÀ KHÁCH HÀNG) -->
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

          <!-- 2 NÚT LIÊN KẾT: GMAIL, FACEBOOK -->
          <div class="d-flex flex-column gap-2 mb-3">
            <button
              type="button"
              class="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 social-btn"
              @click="handleSocialAuth('Google')"
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

        <!-- FORM ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG MỚI (BẢNG KhachHang TRONG ERD) -->
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

          <!-- 2 NÚT LIÊN KẾT: GMAIL, FACEBOOK -->
          <div class="d-flex flex-column gap-2 mb-3">
            <!-- 1. Gmail / Google -->
            <button
              type="button"
              class="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 social-btn"
              @click="handleSocialAuth('Google')"
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

// Trạng thái form đăng nhập thông thường
const loginEmail = ref('');
const loginPassword = ref('');

// Trạng thái form đăng ký khách hàng mới
const regName = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regCccd = ref('');
const regAddress = ref('');
const regPassword = ref('');

// ============================================================================================
// VIETNAMESE: QUẢN LÝ ĐĂNG NHẬP GOOGLE / FACEBOOK CHUẨN XÁC THEO CLIP VIDEO THỰC TẾ
// ENGLISH: OAUTH FLOW & SIMULATED AUTHENTICATION ACCORDING TO VIDEO
// ============================================================================================
const oauthProvider = ref(null); // null | 'Google' | 'Facebook'
const isOAuthLoading = ref(false);
const showCustomOAuth = ref(false);
const customOAuthName = ref('');
const customOAuthEmail = ref('');

const closeModal = () => {
  oauthProvider.value = null;
  isOAuthLoading.value = false;
  showCustomOAuth.value = false;
  userStore.closeAuthModal();
};

// Khi người dùng bấm vào nút liên kết Google hoặc Facebook
const handleSocialAuth = (provider) => {
  const isFacebook = provider.includes('Facebook');
  oauthProvider.value = isFacebook ? 'Facebook' : 'Google';
  isOAuthLoading.value = false;
  showCustomOAuth.value = false;
};

// Khi bấm chọn tài khoản từ danh sách (Hiện màn hình loading giống frame 00:06 của video)
const selectOAuthAccount = (account) => {
  isOAuthLoading.value = true;

  setTimeout(() => {
    userStore.register({
      hoTen: account.name,
      email: account.email,
      sdt: '0987654321',
      cccd: '079201008899',
      diaChi: '195/9 Nguyễn Văn Thương, P.25, Bình Thạnh, TP.HCM'
    });

    isOAuthLoading.value = false;
    oauthProvider.value = null;
    closeModal();

    Swal.fire({
      icon: 'success',
      title: 'Đăng nhập thành công!',
      html: `
        <div class="text-start small">
          <p class="mb-1">Khách hàng: <strong>${account.name}</strong></p>
          <p class="mb-1">Email liên kết: <code>${account.email}</code></p>
          <p class="mb-0 text-success"><i class="fa fa-gift me-1"></i> Tặng Voucher <strong>KHACHMOI50K</strong> (50.000₫) cho đơn thuê đầu tiên!</p>
        </div>
      `,
      timer: 2300,
      showConfirmButton: false
    });
  }, 1200);
};

// Xác nhận tài khoản liên kết (tự động nhận diện tài khoản người dùng)
const submitCustomOAuth = () => {
  const name = customOAuthName.value.trim() || 'Trần Trọng Nhân';
  const defaultEmail = oauthProvider.value === 'Google' ? 'trongnhan@gmail.com' : 'nhan.tran@facebook.com';
  const email = customOAuthEmail.value.trim() || defaultEmail;

  selectOAuthAccount({
    name,
    email
  });
};

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

/* ============================================================================================ */
/* CSS CHO GIAO DIỆN CHỌN TÀI KHOẢN MẠNG XÃ HỘI (GOOGLE / FACEBOOK ACCOUNT SELECTOR)            */
/* ============================================================================================ */
.account-item-btn {
  width: 100%;
  transition: all 0.2s ease;
  cursor: pointer;
}

.account-item-btn:hover {
  background: #f8fafc !important;
  border-color: #3b82f6 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.account-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.account-avatar-device {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ============================================================================================ */
/* CSS GIAO DIỆN OAUTH CHỌN TÀI KHOẢN GOOGLE / FACEBOOK & SPINNER GIỐNG VIDEO CLIP              */
/* ============================================================================================ */
.oauth-window-container {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}

.oauth-top-bar {
  border-bottom: 1px solid #f1f5f9;
}

.oauth-top-line {
  height: 3px;
  width: 100%;
}

.app-oauth-badge {
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

.oauth-account-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.oauth-account-item:hover {
  background-color: #f8fafc !important;
  border-color: #0d6efd !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.oauth-avatar-circle {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}

.oauth-circle-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #dc3545;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
