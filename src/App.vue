<template>
  <div id="app">
    <router-view />

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
import { ref, onMounted, onUnmounted } from 'vue';
import { usePhoneStore } from '@/stores/phone.store';

const phoneStore = usePhoneStore();
const showBackToTop = ref(false);

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  // Tự động kéo dữ liệu mới nhất từ MySQL mỗi khi ứng dụng khởi chạy
  await phoneStore.fetchPhones();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
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
</style>
