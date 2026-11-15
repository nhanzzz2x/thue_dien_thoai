<template>
  <div class="home-page-layout">
    <!-- Header -->
    <Header />

    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Hero Carousel -->
    <Carousel />

    <!-- Phone Spotlight (Top Featured / Hot phones) -->
    <PhoneSpotlight />

    <!-- Catalog Section with Multi-criteria Filter -->
    <main id="phone-catalog-section" class="catalog-section container my-5">
      <!-- Section Header -->
      <div class="section-header">
        <div>
          <h2 class="section-title">DANH SÁCH THIẾT BỊ CHO THUÊ</h2>
          <p class="section-subtitle">
            Quản lý kho thiết bị theo mã định danh IMEI/Serial &bull; Trạng thái sẵn sàng thuê
          </p>
        </div>

        <div class="d-none d-md-block text-end">
          <span class="badge bg-light text-dark border px-3 py-2 rounded-pill">
            <i class="fa fa-cubes text-primary me-1"></i>
            Tổng số: <strong>{{ phoneStore.phones.length }}</strong> máy &bull; 
            Đang hiển thị: <strong class="text-primary">{{ phoneStore.filteredPhones.length }}</strong> máy
          </span>
        </div>
      </div>

      <!-- Filter Controls (ERD mapping) -->
      <PhoneFilter />

      <!-- Phone Cards Grid -->
      <div v-if="phoneStore.filteredPhones.length > 0" class="row">
        <PhoneCard
          v-for="phone in phoneStore.filteredPhones"
          :key="phone.maDienThoai"
          :phone="phone"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-box text-center py-5 my-4 bg-white rounded-4 border p-5">
        <i class="fa fa-search-minus text-muted fs-1 mb-3"></i>
        <h5 class="fw-bold text-dark mb-2">Không tìm thấy thiết bị phù hợp với bộ lọc</h5>
        <p class="text-muted small mb-4">
          Hãy thử nới lỏng các tiêu chí tìm kiếm, đổi sang hãng máy khác hoặc bỏ chọn lọc theo Chipset/RAM.
        </p>
        <button class="btn btn-outline-smart" @click="phoneStore.resetFilters">
          <i class="fa fa-refresh me-1"></i> Xóa tất cả bộ lọc
        </button>
      </div>
    </main>

    <!-- Promotional Campaign Banner -->
    <PromoBanner />

    <!-- Collateral Deposit & Refund Policy Section -->
    <DepositPolicySection />

    <!-- Footer -->
    <Footer />

    <!-- Modals & Drawers -->
    <PhoneQuickViewModal />
    <CompareModal />
    <CartDrawer />
    <AuthModal />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePhoneStore } from '@/stores/phone.store';
import Header from '@/components/Header.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import Carousel from '@/components/Carousel.vue';
import PhoneSpotlight from '@/components/PhoneSpotlight.vue';
import PhoneFilter from '@/components/PhoneFilter.vue';
import PhoneCard from '@/components/PhoneCard.vue';
import PromoBanner from '@/components/PromoBanner.vue';
import DepositPolicySection from '@/components/DepositPolicySection.vue';
import Footer from '@/components/Footer.vue';
import PhoneQuickViewModal from '@/components/PhoneQuickViewModal.vue';
import CompareModal from '@/components/CompareModal.vue';
import CartDrawer from '@/components/CartDrawer.vue';
import AuthModal from '@/components/AuthModal.vue';

const phoneStore = usePhoneStore();

onMounted(async () => {
  await phoneStore.fetchPhones();
});
</script>

<style scoped>
.home-page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.empty-state-box {
  box-shadow: var(--shadow-sm);
}
</style>
