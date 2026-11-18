<template>
  <div id="app">
    <router-view />

    <!-- Thanh điều hướng đáy dành riêng cho thiết bị di động (Mobile Bottom Navigation) -->
    <MobileBottomNav v-if="!isAdminRoute" />

    <!-- Nút cuộn nhanh lên đầu trang (Back to top) tiện lợi khi lướt xem sản phẩm -->
    <button
      v-show="showBackToTop"
      class="btn-back-to-top shadow-lg"
      @click="scrollToTop"
      title="Lên đầu trang"
      type="button"
    >
      <i class="fa fa-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePhoneStore } from '@/stores/phone.store';
import { useOrderStore } from '@/stores/order.store';
import MobileBottomNav from '@/components/MobileBottomNav.vue';

const route = useRoute();
const phoneStore = usePhoneStore();
const orderStore = useOrderStore();
const showBackToTop = ref(false);

const isAdminRoute = computed(() => {
  return route.path && route.path.startsWith('/admin');
});

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

let syncTimer = null;

const syncMysqlRealtime = async () => {
  if (document.hidden) return;
  await Promise.all([
    phoneStore.fetchPhones(),
    orderStore.fetchOrders()
  ]);
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('focus', syncMysqlRealtime);
  document.addEventListener('visibilitychange', syncMysqlRealtime);

  // Tải ngay khi mở trang & tự động lắng nghe thay đổi trực tiếp từ MySQL WampServer mỗi 3 giây
  await syncMysqlRealtime();
  syncTimer = setInterval(syncMysqlRealtime, 3000);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('focus', syncMysqlRealtime);
  document.removeEventListener('visibilitychange', syncMysqlRealtime);
  if (syncTimer) clearInterval(syncTimer);
});
</script>

<style>
/* Nút bấm nổi cuộn lên đầu trang */
.btn-back-to-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-gradient, linear-gradient(135deg, #2563eb, #06b6d4));
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transition: all 0.25s ease;
}

.btn-back-to-top:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
  color: #fff;
}

/* Tối ưu trải nghiệm khi dùng điện thoại */
@media (max-width: 768px) {
  body {
    padding-bottom: 64px; /* Tránh để thanh điều hướng dưới đáy che mất nội dung trang */
  }

  .btn-back-to-top {
    bottom: 74px; /* Đẩy nút Lên đầu trang lên trên thanh bottom nav */
    right: 14px;
    width: 38px;
    height: 38px;
    font-size: 0.95rem;
  }
}
</style>
