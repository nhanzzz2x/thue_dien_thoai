<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: MODAL ĐĂNG NHẬP / ĐĂNG KÝ TÀI KHOẢN (NGƯỜI DÙNG & QUẢN TRỊ ADMIN)              -->
  <!-- ENGLISH: USER & ADMIN AUTHENTICATION MODAL (LOGIN / REGISTER)                             -->
  <!-- ERD MAPPING: Ánh xạ thực thể NguoiDung, KhachHang, Admin                                  -->
  <!-- ========================================================================================== -->
  <div v-if="userStore.isAuthModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content-custom p-4" style="max-width: 490px;">
      <!-- VIETNAMESE: Nút đóng modal | ENGLISH: Close button -->
      <button class="btn-close-modal" @click="closeModal">
        <i class="fa fa-times"></i>
      </button>

      <!-- ==================================================================================== -->
      <!-- GIAO DIỆN LIÊN KẾT TÀI KHOẢN MẠNG XÃ HỘI (GOOGLE / FACEBOOK / ZALO)                   -->
      <!-- XỬ LÝ CHỌN TÀI KHOẢN & XÁC NHẬN "BẠN MUỐN LIÊN KẾT TÀI KHOẢN TÊN NÀY NỮA HAY KHÔNG"  -->
      <!-- ==================================================================================== -->
      <div v-if="activeSocialProvider" class="social-auth-flow">
        <!-- BƯỚC 1: CHỌN TÀI KHOẢN LIÊN KẾT -->
        <div v-if="socialAuthStep === 'CHOOSE'">
          <div class="text-center mb-3">
            <div class="d-inline-flex p-2.5 rounded-circle bg-light mb-2 border shadow-sm">
              <!-- Logo Google -->
              <svg v-if="activeSocialProvider === 'Google'" width="32" height="32" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <!-- Logo Facebook -->
              <svg v-else-if="activeSocialProvider === 'Facebook'" width="32" height="32" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <!-- Logo Zalo -->
              <span v-else class="zalo-badge-icon" style="width: 32px; height: 32px; font-size: 18px;">Z</span>
            </div>
            <h5 class="fw-bold text-dark mb-1">
              Đăng nhập bằng {{ activeSocialProvider }}
            </h5>
            <p class="small text-muted mb-0">
              Chọn tài khoản bạn muốn liên kết với <strong>TrongNhanMobile</strong>
            </p>
          </div>

          <!-- Danh sách các tài khoản để lựa chọn -->
          <div class="d-flex flex-column gap-2 mb-3">
            <button
              v-for="(acc, index) in currentSocialAccounts"
              :key="index"
              type="button"
              class="account-item-btn text-start d-flex align-items-center justify-content-between p-2.5 rounded-3 border bg-white"
              @click="selectAccount(acc)"
            >
              <div class="d-flex align-items-center gap-3 min-w-0">
                <div class="account-avatar shadow-sm" :style="{ backgroundColor: acc.avatarBg }">
                  {{ acc.avatarText }}
                </div>
                <div class="min-w-0">
                  <strong class="d-block text-dark text-truncate" style="font-size: 0.92rem;">
                    {{ acc.name }}
                  </strong>
                  <span class="d-block text-muted small text-truncate">{{ acc.email }}</span>
                  <small class="text-primary d-block font-italic" style="font-size: 0.72rem;">{{ acc.desc }}</small>
                </div>
              </div>
              <i class="fa fa-chevron-right text-muted ms-2"></i>
            </button>

            <!-- Tùy chọn sử dụng tài khoản khác -->
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
              @click="toggleCustomInput"
            >
              <i class="fa" :class="showCustomInput ? 'fa-minus' : 'fa-user-plus'"></i>
              <span>{{ showCustomInput ? 'Thu gọn nhập tay' : `Sử dụng một tài khoản ${activeSocialProvider} khác...` }}</span>
            </button>
          </div>

          <!-- Form nhập tài khoản khác tùy ý nếu chọn -->
          <div v-if="showCustomInput" class="p-3 bg-light rounded-3 border mb-3">
            <h6 class="small fw-bold text-dark mb-2">Nhập thông tin tài khoản {{ activeSocialProvider }} của bạn:</h6>
            <div class="mb-2">
              <label class="form-label small mb-1">Họ và tên tài khoản:</label>
              <input type="text" class="form-control form-control-sm" v-model="customName" placeholder="Ví dụ: Trần Trọng Nhân" />
            </div>
            <div class="mb-2">
              <label class="form-label small mb-1">Email / ID liên kết:</label>
              <input type="email" class="form-control form-control-sm" v-model="customEmail" placeholder="Ví dụ: nhan.stu@gmail.com" />
            </div>
            <button
              type="button"
              class="btn btn-primary btn-sm w-100"
              @click="submitCustomAccount"
            >
              Tiếp tục với tài khoản này
            </button>
          </div>

          <!-- Nút quay lại đăng nhập thông thường -->
          <div class="text-center pt-2 border-top">
            <button
              type="button"
              class="btn btn-link btn-sm text-decoration-none text-muted"
              @click="backToNormalAuth"
            >
              <i class="fa fa-arrow-left me-1"></i> Quay lại đăng nhập thường
            </button>
          </div>
        </div>

        <!-- BƯỚC 2: HỘP THOẠI XÁC NHẬN "BẠN CÓ MUỐN LIÊN KẾT VỚI TÀI KHOẢN TÊN NÀY NỮA HAY KHÔNG" -->
        <div v-else-if="socialAuthStep === 'CONFIRM'">
          <div class="text-center mb-3">
            <div class="d-inline-flex p-2.5 rounded-circle bg-primary-subtle text-primary mb-2">
              <i class="fa fa-shield fs-3"></i>
            </div>
            <h5 class="fw-bold text-dark mb-1">Xác Nhận Liên Kết Tài Khoản</h5>
            <p class="small text-muted mb-0">Hệ thống liên kết tài khoản định danh an toàn</p>
          </div>

          <!-- Thông tin thẻ tài khoản đã chọn -->
          <div class="p-3 bg-light border rounded-3 text-center mb-3">
            <div class="account-avatar mx-auto mb-2 shadow-sm" :style="{ backgroundColor: selectedAccount?.avatarBg || '#2563eb' }">
              {{ selectedAccount?.avatarText || 'U' }}
            </div>
            <h5 class="fw-bold text-dark mb-0">{{ selectedAccount?.name }}</h5>
            <span class="text-muted small d-block mb-1">{{ selectedAccount?.email }}</span>
            <span class="badge bg-white text-primary border rounded-pill px-2.5 py-1 small">
              <i class="fa fa-link me-1"></i> Liên kết qua {{ activeSocialProvider }}
            </span>
          </div>

          <!-- HỘP THOẠI HỎI: BẠN CÓ MUỐN LIÊN KẾT VỚI TÀI KHOẢN TÊN NÀY NỮA HAY KHÔNG? -->
          <div class="alert alert-warning border border-warning-subtle text-dark p-3 mb-3 rounded-3 text-start">
            <div class="d-flex gap-2">
              <i class="fa fa-question-circle text-warning fs-5 flex-shrink-0 mt-0.5"></i>
              <div>
                <strong class="d-block mb-1 text-dark">Câu hỏi xác nhận:</strong>
                <p class="mb-1 fw-bold fs-6 text-primary">
                  Bạn có muốn liên kết với tài khoản tên "{{ selectedAccount?.name }}" này nữa hay không?
                </p>
                <span class="text-muted small" style="font-size: 0.78rem;">
                  Khi chọn "Có", hệ thống TrongNhanMobile sẽ sử dụng tên <strong>{{ selectedAccount?.name }}</strong> để hiển thị, lập hợp đồng thuê và tự động kích hoạt gói ưu đãi khách hàng mới.
                </span>
              </div>
            </div>
          </div>

          <!-- 2 NÚT THAO TÁC RÕ RÀNG -->
          <div class="d-flex flex-column gap-2">
            <button
              type="button"
              class="btn btn-primary w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2"
              @click="confirmAndLogin"
            >
              <i class="fa fa-check-circle"></i> Có, đồng ý liên kết tài khoản này
            </button>

            <button
              type="button"
              class="btn btn-outline-secondary w-100 py-2 small d-flex align-items-center justify-content-center gap-1"
              @click="socialAuthStep = 'CHOOSE'"
            >
              <i class="fa fa-arrow-left"></i> Không, chọn tài khoản khác
            </button>
          </div>
        </div>
      </div>

      <!-- ==================================================================================== -->
      <!-- GIAO DIỆN ĐĂNG NHẬP / ĐĂNG KÝ MẶC ĐỊNH (KHI CHƯA MỞ LIÊN KẾT MẠNG XÃ HỘI)             -->
      <!-- ==================================================================================== -->
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
import { ref, computed } from 'vue';
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
// TRẠNG THÁI LIÊN KẾT MẠNG XÃ HỘI (GOOGLE / FACEBOOK) & HỘP THOẠI XÁC NHẬN TÊN TÀI KHOẢN
// ============================================================================================
const activeSocialProvider = ref(null); // null | 'Google' | 'Facebook' | 'Zalo'
const socialAuthStep = ref('CHOOSE');    // 'CHOOSE' (Chọn tài khoản) | 'CONFIRM' (Hỏi xác nhận liên kết)
const selectedAccount = ref(null);
const showCustomInput = ref(false);
const customName = ref('');
const customEmail = ref('');

// Danh sách tài khoản mẫu mô phỏng chọn tài khoản Google
const googleAccounts = [
  {
    name: 'Trần Trọng Nhân',
    email: 'trongnhan.stu@gmail.com',
    desc: 'Tài khoản Sinh viên STU (L23_TH01 - CNTT)',
    avatarBg: '#ea4335',
    avatarText: 'N'
  },
  {
    name: 'Trần Trọng Nhân (Cá nhân)',
    email: 'nhan.personal2026@gmail.com',
    desc: 'Tài khoản Google cá nhân chính chủ',
    avatarBg: '#4285f4',
    avatarText: 'T'
  }
];

// Danh sách tài khoản mẫu mô phỏng chọn tài khoản Facebook
const facebookAccounts = [
  {
    name: 'Trần Trọng Nhân',
    email: 'nhan.tran.stu@facebook.com',
    desc: 'Tài khoản Facebook chính (Liên kết số 0987654321)',
    avatarBg: '#1877f2',
    avatarText: 'N'
  },
  {
    name: 'Trần Trọng Nhân (Trần Nhân)',
    email: 'nhan.tran.profile@facebook.com',
    desc: 'Tài khoản Facebook phụ cá nhân',
    avatarBg: '#0866ff',
    avatarText: 'T'
  }
];

// Danh sách tài khoản theo nền tảng đang kích hoạt
const currentSocialAccounts = computed(() => {
  if (activeSocialProvider.value === 'Google') return googleAccounts;
  if (activeSocialProvider.value === 'Facebook') return facebookAccounts;
  return [];
});

// Đóng modal và reset trạng thái
const closeModal = () => {
  activeSocialProvider.value = null;
  socialAuthStep.value = 'CHOOSE';
  showCustomInput.value = false;
  userStore.closeAuthModal();
};

// ============================================================================================
// VIETNAMESE: KHI NGƯỜI DÙNG BẤM NÚT ĐĂNG NHẬP / ĐĂNG KÝ BẰNG GMAIL HOẶC FACEBOOK
// ============================================================================================
const handleSocialAuth = (provider) => {
  let cleanedProvider = 'Google';
  if (provider.includes('Facebook')) cleanedProvider = 'Facebook';
  else if (provider.includes('Zalo')) cleanedProvider = 'Zalo';

  activeSocialProvider.value = cleanedProvider;
  socialAuthStep.value = 'CHOOSE';
  showCustomInput.value = false;
  customName.value = '';
  customEmail.value = '';
};

// Chọn một tài khoản từ danh sách -> Chuyển sang bước hỏi: "Bạn có muốn liên kết với tài khoản tên này nữa hay không?"
const selectAccount = (acc) => {
  selectedAccount.value = { ...acc };
  socialAuthStep.value = 'CONFIRM';
};

// Bật/tắt ô nhập tài khoản tùy chỉnh
const toggleCustomInput = () => {
  showCustomInput.value = !showCustomInput.value;
};

// Xác nhận tài khoản nhập tay
const submitCustomAccount = () => {
  if (!customName.value.trim() || !customEmail.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Thiếu thông tin!',
      text: 'Vui lòng nhập họ và tên cùng email tài khoản của bạn.'
    });
    return;
  }
  selectedAccount.value = {
    name: customName.value.trim(),
    email: customEmail.value.trim(),
    desc: `Tài khoản ${activeSocialProvider.value} tùy chọn`,
    avatarBg: '#2563eb',
    avatarText: customName.value.trim().charAt(0).toUpperCase()
  };
  socialAuthStep.value = 'CONFIRM';
};

// Quay lại giao diện đăng nhập thường
const backToNormalAuth = () => {
  activeSocialProvider.value = null;
  socialAuthStep.value = 'CHOOSE';
  showCustomInput.value = false;
};

// Người dùng bấm "Có, đồng ý liên kết tài khoản này" -> Đăng nhập & lưu vào store
const confirmAndLogin = () => {
  if (!selectedAccount.value) return;

  userStore.register({
    hoTen: selectedAccount.value.name,
    email: selectedAccount.value.email,
    sdt: '0987654321',
    cccd: '079201008899',
    diaChi: '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM'
  });

  Swal.fire({
    icon: 'success',
    title: 'Liên Kết & Đăng Nhập Thành Công!',
    html: `
      <div class="text-start small">
        <p class="mb-1">Khách hàng: <strong>${selectedAccount.value.name}</strong></p>
        <p class="mb-1">Tài khoản liên kết: <strong>${activeSocialProvider.value}</strong></p>
        <p class="mb-1">Email / ID: <code>${selectedAccount.value.email}</code></p>
        <p class="mb-0 text-success"><i class="fa fa-gift me-1"></i> Đã tặng Voucher <strong>KHACHMOI50K</strong> (50.000₫) cho bạn!</p>
      </div>
    `,
    timer: 2500,
    showConfirmButton: false
  });

  closeModal();
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
</style>
