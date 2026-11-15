<template>
  <header class="header-wrapper">
    <!-- Top info bar -->
    <div class="top-info-bar">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="top-left d-flex align-items-center gap-2 gap-sm-3">
          <span><i class="fa fa-phone me-1 text-info"></i> Hotline: <strong>0988.123.456</strong></span>
          <span class="divider d-none d-sm-inline">|</span>
          <span class="d-none d-sm-inline"><i class="fa fa-clock-o me-1 text-warning"></i> 08:00 - 21:30</span>
          <span class="divider d-none d-md-inline">|</span>
          <span class="d-none d-md-inline"><i class="fa fa-map-marker me-1 text-danger"></i> 180 Cao Lỗ, P.4, Q.8, TP.HCM</span>
        </div>
        <div class="top-right d-flex align-items-center gap-2 gap-sm-3">
          <router-link to="/lich-su-thue" class="text-white text-decoration-none small">
            <i class="fa fa-history me-1 text-info"></i> Lịch Sử Thuê
          </router-link>
          <span class="divider d-none d-md-inline">|</span>
          <span class="policy-tag d-none d-md-inline"><i class="fa fa-shield me-1 text-success"></i> Cam kết 100% Nguyên Tem Niêm Phong</span>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="main-header py-2 py-md-3">
      <div class="container d-flex flex-wrap justify-content-between align-items-center gap-2 gap-md-3">
        <!-- Logo -->
        <router-link to="/" class="logo-brand d-flex align-items-center gap-2">
          <div class="logo-icon-box">
            <i class="fa fa-mobile-phone text-white"></i>
          </div>
          <div class="logo-text">
            <span class="brand-name">TrongNhanMobile</span>
            <span class="brand-tagline d-none d-sm-block">Hệ Thống Thuê Điện Thoại Cao Cấp</span>
          </div>
        </router-link>

        <!-- Search Bar -->
        <div class="search-bar-container flex-grow-1 mx-lg-4 order-3 order-md-2 w-100-mobile">
          <div class="search-box position-relative">
            <i class="fa fa-search search-icon"></i>
            <input
              type="text"
              v-model="phoneStore.searchKeyword"
              class="form-control search-input"
              placeholder="Tìm theo tên máy (iPhone 16, S24 Ultra), Chipset (A18 Pro, Snapdragon), RAM/ROM..."
              @keyup.enter="scrollToProducts"
            />
            <button
              v-if="phoneStore.searchKeyword"
              class="btn-clear-search"
              @click="phoneStore.searchKeyword = ''"
            >
              <i class="fa fa-times"></i>
            </button>
            <button class="btn-search-submit" @click="scrollToProducts">
              Tìm kiếm
            </button>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="header-actions d-flex align-items-center gap-2 gap-md-3 order-2 order-md-3">
          <!-- Compare Button -->
          <button
            class="action-item-btn compare-btn"
            @click="phoneStore.isCompareModalOpen = true"
            :title="`So sánh (${phoneStore.compareList.length} máy)`"
          >
            <div class="action-icon position-relative">
              <i class="fa fa-balance-scale"></i>
              <span v-if="phoneStore.compareList.length" class="badge-count">
                {{ phoneStore.compareList.length }}
              </span>
            </div>
            <div class="action-label d-none d-xl-block">
              <small class="text-muted">Tính năng</small>
              <strong>So sánh</strong>
            </div>
          </button>

          <!-- User Account with Dropdown -->
          <div class="account-wrapper position-relative">
            <!-- If not logged in -->
            <button
              v-if="!userStore.isLoggedIn"
              class="action-item-btn account-btn"
              type="button"
              @click="userStore.openLogin"
            >
              <div class="action-icon">
                <i class="fa fa-user-circle"></i>
              </div>
              <div class="action-label d-none d-lg-block text-start">
                <small class="text-muted">Đăng nhập / Đăng ký</small>
                <strong>Tài khoản</strong>
              </div>
            </button>

            <!-- If logged in: Profile Pill with Menu -->
            <div v-else class="logged-in-box position-relative">
              <button
                class="action-item-btn account-btn active-user"
                type="button"
                @click="isDropdownOpen = !isDropdownOpen"
              >
                <div class="user-avatar-badge">
                  {{ userStore.user.hoTen?.charAt(0) || 'U' }}
                </div>
                <div class="action-label d-none d-lg-block text-start">
                  <small class="text-success"><i class="fa fa-circle me-1" style="font-size: 8px;"></i> Đã đăng nhập</small>
                  <strong>{{ userStore.user.hoTen }}</strong>
                </div>
                <i class="fa fa-chevron-down ms-1 text-muted" style="font-size: 10px;"></i>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="isDropdownOpen" class="user-dropdown-card shadow-lg p-3 rounded-4 bg-white border">
                <div class="d-flex align-items-center gap-2 pb-2 border-bottom mb-2">
                  <div class="user-avatar-lg">
                    {{ userStore.user.hoTen?.charAt(0) || 'U' }}
                  </div>
                  <div class="overflow-hidden">
                    <strong class="d-block text-truncate mb-0" style="font-size: 0.95rem;">{{ userStore.user.hoTen }}</strong>
                    <small class="text-muted d-block text-truncate" style="font-size: 0.78rem;">{{ userStore.user.email }}</small>
                  </div>
                </div>

                <div class="user-profile-details small bg-light p-2.5 rounded-3 mb-2">
                  <div class="mb-1 d-flex justify-content-between">
                    <span class="text-muted"><i class="fa fa-id-card me-1 text-primary"></i> CCCD:</span>
                    <strong>{{ userStore.user.cccd || 'Chưa cập nhật' }}</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="text-muted"><i class="fa fa-phone me-1 text-success"></i> SĐT:</span>
                    <strong>{{ userStore.user.sdt || 'Chưa cập nhật' }}</strong>
                  </div>
                </div>

                <ul class="dropdown-nav-list list-unstyled mb-2 small">
                  <li>
                    <router-link to="/lich-su-thue" class="dropdown-item-link" @click="isDropdownOpen = false">
                      <i class="fa fa-history text-primary me-2"></i> Lịch sử thuê & Đơn hàng
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/admin" class="dropdown-item-link text-primary fw-bold" @click="isDropdownOpen = false">
                      <i class="fa fa-shield text-danger me-2"></i> Cổng Quản Trị (Admin Portal)
                    </router-link>
                  </li>
                </ul>

                <div class="pt-2 border-top">
                  <button class="btn btn-logout-action w-100 d-flex align-items-center justify-content-center gap-2" @click="handleLogout">
                    <i class="fa fa-sign-out text-danger"></i>
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart / Order Basket -->
          <button
            class="action-item-btn cart-btn"
            @click="cartStore.openDrawer"
            title="Đơn thuê / Giỏ hàng"
          >
            <div class="action-icon position-relative">
              <i class="fa fa-shopping-bag"></i>
              <span v-if="cartStore.totalItems" class="badge-count badge-primary">
                {{ cartStore.totalItems }}
              </span>
            </div>
            <div class="action-label d-none d-lg-block text-start">
              <small class="text-muted">Đơn thuê</small>
              <strong class="text-primary">{{ convertToVND(cartStore.finalTotalRental) }}</strong>
            </div>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePhoneStore } from '@/stores/phone.store';
import { useCartStore } from '@/stores/cart.store';
import { useUserStore } from '@/stores/user.store';
import { convertToVND } from '@/utils/formatters';
import Swal from 'sweetalert2';

const router = useRouter();
const phoneStore = usePhoneStore();
const cartStore = useCartStore();
const userStore = useUserStore();

const isDropdownOpen = ref(false);

const handleLogout = () => {
  Swal.fire({
    title: 'Đăng xuất tài khoản?',
    text: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống TrongNhanMobile?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đăng xuất ngay',
    cancelButtonText: 'Ở lại',
    confirmButtonColor: '#ef4444'
  }).then((result) => {
    if (result.isConfirmed) {
      userStore.logout();
      isDropdownOpen.value = false;
      Swal.fire({
        title: 'Đã đăng xuất!',
        text: 'Phiên làm việc đã kết thúc an toàn.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  });
};

const scrollToProducts = () => {
  const el = document.getElementById('phone-catalog-section');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    router.push('/danh-muc/all');
  }
};
</script>

<style scoped>
.header-wrapper {
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 100;
}

.top-info-bar {
  background: #0f172a;
  color: #94a3b8;
  font-size: 0.78rem;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.top-info-bar a {
  color: #cbd5e1;
}

.top-info-bar a:hover {
  color: #38bdf8;
}

.divider {
  color: #334155;
}

.policy-tag {
  color: #e2e8f0;
  font-weight: 500;
}

.logo-brand {
  text-decoration: none;
}

.logo-icon-box {
  width: 44px;
  height: 44px;
  background: var(--primary-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

.logo-text .brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  display: block;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.logo-text .brand-tagline {
  font-size: 0.68rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.2px;
  display: block;
}

.search-box {
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.95rem;
}

.search-input {
  border-radius: 50px;
  padding: 11px 115px 11px 44px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.88rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.btn-clear-search {
  position: absolute;
  right: 102px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 4px 8px;
  cursor: pointer;
}

.btn-search-submit {
  position: absolute;
  right: 4px;
  top: 4px;
  bottom: 4px;
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  border-radius: 40px;
  padding: 0 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-search-submit:hover {
  opacity: 0.92;
}

.action-item-btn {
  background: transparent;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-item-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.action-icon {
  font-size: 1.4rem;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-btn .action-icon {
  color: var(--primary);
}

.badge-count {
  position: absolute;
  top: -6px;
  right: -8px;
  background: #ef4444;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
}

.badge-primary {
  background: var(--primary);
}

.action-label small {
  display: block;
  font-size: 0.72rem;
  line-height: 1;
}

.action-label strong {
  display: block;
  font-size: 0.85rem;
  color: #0f172a;
}

/* User Avatar & Dropdown */
.user-avatar-badge {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.user-avatar-lg {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.active-user {
  background-color: #f0fdf4 !important;
  border-color: #bbf7d0 !important;
}

.user-dropdown-card {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 270px;
  z-index: 1050;
  animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item-link {
  display: block;
  padding: 7px 10px;
  border-radius: 6px;
  color: #334155;
  font-weight: 500;
  transition: all 0.15s ease;
}

.dropdown-item-link:hover {
  background-color: #f1f5f9;
  color: var(--primary);
  padding-left: 14px;
}

.btn-logout-action {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout-action:hover {
  background: #fee2e2;
  color: #b91c1c;
  transform: translateY(-1px);
}

/* ============================================================================================ */
/* RESPONSIVE HEADER CHO MÀN HÌNH TABLET & ĐIỆN THOẠI (< 768px & < 576px)                       */
/* ============================================================================================ */
@media (max-width: 768px) {
  .w-100-mobile {
    width: 100% !important;
    margin: 8px 0 0 0 !important;
  }
  .search-input {
    padding: 9px 88px 9px 36px;
    font-size: 0.82rem;
  }
  .btn-search-submit {
    padding: 0 14px;
    font-size: 0.8rem;
  }
  .btn-clear-search {
    right: 84px;
  }
  .logo-icon-box {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
  }
  .brand-name {
    font-size: 1.15rem;
  }
  .action-item-btn {
    padding: 5px 8px;
    gap: 6px;
  }
}

@media (max-width: 576px) {
  .top-info-bar {
    font-size: 0.72rem;
    padding: 5px 0;
  }
  .header-actions {
    gap: 8px !important;
  }
  .action-item-btn {
    width: 38px;
    height: 38px;
    padding: 0 !important;
    border-radius: 50% !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-icon-box {
    width: 34px;
    height: 34px;
    font-size: 1.15rem;
  }
  .brand-name {
    font-size: 1.05rem;
  }
  .user-dropdown-card {
    right: -10px;
    width: 260px;
  }
}
</style>
