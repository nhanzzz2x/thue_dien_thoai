<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: THANH ĐIỀU HƯỚNG DƯỚI ĐÁY DÀNH RIÊNG CHO ĐIỆN THOẠI DI ĐỘNG (MOBILE BOTTOM NAV) -->
  <!-- THIẾT KẾ: CHUẨN APP THƯƠNG MẠI ĐIỆN TỬ (SHOPEE, TIKI, CELLPHONES) - CHỈ HIỆN TRÊN MOBILE    -->
  <!-- ========================================================================================== -->
  <nav class="mobile-bottom-nav d-block d-md-none">
    <div class="d-flex justify-content-around align-items-center h-100 px-1">
      <!-- 1. Trang chủ -->
      <router-link to="/" class="nav-item-mobile" :class="{ active: isRouteActive('/') }">
        <i class="fa fa-home nav-icon-mobile"></i>
        <span class="nav-label-mobile">Trang chủ</span>
      </router-link>

      <!-- 2. Danh mục / Hãng máy -->
      <router-link to="/danh-muc/all" class="nav-item-mobile" :class="{ active: isRouteActive('/danh-muc') }">
        <i class="fa fa-th-large nav-icon-mobile"></i>
        <span class="nav-label-mobile">Danh mục</span>
      </router-link>

      <!-- 3. Giỏ đơn thuê (Có badge số lượng) -->
      <button type="button" class="nav-item-mobile position-relative" @click="cartStore.openDrawer">
        <div class="position-relative d-inline-block">
          <i class="fa fa-shopping-bag nav-icon-mobile text-primary"></i>
          <span v-if="cartStore.totalItems > 0" class="mobile-cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </div>
        <span class="nav-label-mobile text-primary fw-bold">Đơn thuê</span>
      </button>

      <!-- 4. Lịch sử thuê -->
      <router-link to="/lich-su-thue" class="nav-item-mobile" :class="{ active: isRouteActive('/lich-su-thue') }">
        <i class="fa fa-history nav-icon-mobile"></i>
        <span class="nav-label-mobile">Lịch sử</span>
      </router-link>

      <!-- 5. Tài khoản -->
      <button
        v-if="!userStore.isLoggedIn"
        type="button"
        class="nav-item-mobile"
        @click="userStore.openLogin"
      >
        <i class="fa fa-user-circle nav-icon-mobile"></i>
        <span class="nav-label-mobile">Tài khoản</span>
      </button>

      <router-link
        v-else
        to="/lich-su-thue"
        class="nav-item-mobile"
      >
        <div class="mobile-user-avatar">
          {{ userStore.user.hoTen?.charAt(0) || 'U' }}
        </div>
        <span class="nav-label-mobile text-truncate" style="max-width: 50px;">{{ userStore.user.hoTen }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart.store';
import { useUserStore } from '@/stores/user.store';

const route = useRoute();
const cartStore = useCartStore();
const userStore = useUserStore();

const isRouteActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.08);
  z-index: 1040;
}

.nav-item-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: #64748b;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 4px 0;
  transition: all 0.2s ease;
}

.nav-item-mobile:hover,
.nav-item-mobile.active {
  color: #2563eb;
}

.nav-icon-mobile {
  font-size: 1.25rem;
  margin-bottom: 2px;
  transition: transform 0.2s ease;
}

.nav-item-mobile.active .nav-icon-mobile {
  transform: translateY(-2px);
  color: #2563eb;
}

.nav-label-mobile {
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1;
}

.mobile-cart-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #fff;
}

.mobile-user-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}
</style>
