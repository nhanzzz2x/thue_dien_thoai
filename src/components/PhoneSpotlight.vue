<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: KHU VỰC THIẾT BỊ NỔI BẬT & ĐƯỢC THUÊ NHIỀU NHẤT (HOT PHONES SPOTLIGHT)          -->
  <!-- ENGLISH: FEATURED & MOST RENTED FLAGSHIP PHONES SPOTLIGHT SECTION                          -->
  <!-- ERD MAPPING: Lọc các dòng DienThoai có thuộc tính isHot = true                             -->
  <!-- ========================================================================================== -->
  <section class="phone-spotlight-section my-5">
    <div class="container">
      <!-- VIETNAMESE: Tiêu đề khu vực nổi bật | ENGLISH: Section Header -->
      <div class="spotlight-header text-center mb-4">
        <span class="spotlight-badge badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill mb-2">
          <i class="fa fa-star me-1"></i> THIẾT BỊ ĐƯỢC THUÊ NHIỀU NHẤT
        </span>
        <h2 class="section-title fw-black">BẠN CÓ THÍCH DÒNG MÁY NÀY?</h2>
        <p class="section-subtitle">
          Top điện thoại Flagship cấu hình đỉnh cao, camera chuyên nghiệp phục vụ quay MV, sự kiện, concert & du lịch
        </p>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: DANH SÁCH THẺ ĐIỆN THOẠI NỔI BẬT (PhoneCard.vue)                         -->
      <!-- ENGLISH: SPOTLIGHT PHONE CARDS ROW (PhoneCard.vue)                                   -->
      <!-- ==================================================================================== -->
      <div class="row g-2 g-md-3 g-xl-4">
        <PhoneCard
          v-for="phone in hotPhones"
          :key="phone.maDienThoai"
          :phone="phone"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT STORE ĐIỆN THOẠI & COMPONENT THẺ ĐIỆN THOẠI
// ENGLISH: IMPORT PHONE STORE & PHONE CARD COMPONENT
// ============================================================================================
import { computed } from 'vue';
import { usePhoneStore } from '@/stores/phone.store';
import PhoneCard from './PhoneCard.vue';

const phoneStore = usePhoneStore();

// Lọc lấy 4 thiết bị nổi bật nhất
// Compute top 4 hot phones from phoneStore
const hotPhones = computed(() => {
  return phoneStore.phones.filter(p => p.isHot).slice(0, 4);
});
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS CHO PHẦN THIẾT BỊ NỔI BẬT                                                   */
/* ENGLISH: SCOPED STYLES FOR SPOTLIGHT SECTION                                                 */
/* ============================================================================================ */
.spotlight-header {
  position: relative;
}

.spotlight-badge {
  font-size: 0.82rem;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.25rem !important;
  }
  .section-subtitle {
    font-size: 0.82rem !important;
  }
  .phone-spotlight-section {
    margin-top: 1.5rem !important;
    margin-bottom: 1.5rem !important;
  }
}
</style>
