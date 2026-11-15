<template>
  <!-- ========================================================================================= -->
  <!-- THANH ĐIỀU HƯỚNG DANH MỤC & LỐI TẮT CHÍNH SÁCH (NAVIGATION BAR)                           -->
  <!-- THIẾT KẾ: TRANG CHỦ & TẤT CẢ ĐIỆN THOẠI CỐ ĐỊNH + NÚT ÚP XUỐNG DANH SÁCH THUÊ ĐIỆN THOẠI   -->
  <!-- ========================================================================================= -->
  <nav class="nav-bar-container">
    <div class="container d-flex align-items-center justify-content-between">
      
      <!-- ===================================================================================== -->
      <!-- KHỐI BÊN TRÁI: TRANG CHỦ, TẤT CẢ ĐIỆN THOẠI & NÚT ÚP XUỐNG DANH SÁCH THUÊ            -->
      <!-- ===================================================================================== -->
      <div class="d-flex align-items-center gap-2">
        <!-- 1. Nút Trang chủ -->
        <router-link
          to="/"
          class="nav-link btn-category-nav"
          :class="{ active: isHomePage }"
          @click="handleHomeClick"
        >
          <i class="fa fa-home me-2 text-warning"></i>
          <span>Trang chủ</span>
        </router-link>

        <!-- 2. Nút Tất cả điện thoại -->
        <button
          type="button"
          class="nav-link btn-category-nav"
          :class="{ active: isAllCategoryActive }"
          @click="handleAllPhonesClick"
        >
          <i class="fa fa-mobile me-2 text-info"></i>
          <span>Tất cả điện thoại</span>
        </button>

        <!-- 3. NÚT ÚP XUỐNG: "DANH SÁCH THUÊ ĐIỆN THOẠI" (DROPDOWN MENU XỔ XUỐNG) -->
        <div class="dropdown-category-wrapper position-relative" ref="dropdownRef">
          <button
            type="button"
            class="nav-link btn-category-nav btn-dropdown-toggle d-flex align-items-center gap-2"
            :class="{ active: isBrandActive, 'is-open': isDropdownOpen }"
            @click.stop="toggleDropdown"
          >
            <i class="fa fa-th-list text-primary fs-10"></i>
            <span class="fw-bold">Danh Sách Điện Thoại</span>
            <i class="fa fa-chevron-down dropdown-arrow ms-1" :class="{ 'rotate-180': isDropdownOpen }"></i>
          </button>

          <!-- MENU ÚP XUỐNG HIỂN THỊ DANH SÁCH CÁC HÃNG MÁY -->
          <div v-if="isDropdownOpen" class="category-dropdown-menu shadow-lg rounded-4 py-2 border">
            <div class="dropdown-header px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
              <span class="text-muted small fw-bold text-uppercase">
                <i class="fa fa-tag me-1 text-primary"></i> Danh sách các hãng máy ({{ brandCategories.length }})
              </span>
              <small class="text-muted">Chọn để xem</small>
            </div>

            <div class="dropdown-list-items py-1">
              <button
                v-for="brand in brandCategories"
                :key="brand.id"
                type="button"
                class="dropdown-brand-item d-flex align-items-center justify-content-between px-3 py-2.5 w-100 text-start border-0 bg-transparent"
                :class="{ 'item-selected': phoneStore.selectedCategory === brand.id && !isHomePage }"
                @click="selectBrandFromDropdown(brand.id)"
              >
                <div class="d-flex align-items-center gap-3">
                  <div class="brand-icon-box">
                    <i class="fa" :class="brand.icon || 'fa-mobile'"></i>
                  </div>
                  <div>
                    <strong class="d-block text-dark brand-name-text">{{ brand.name }}</strong>
                    <small class="text-muted d-block brand-sub-desc">{{ getBrandDesc(brand) }}</small>
                  </div>
                </div>

                <div class="text-end">
                  <span class="badge bg-light text-dark border rounded-pill px-2.5 py-1 small">
                    {{ getPhoneCount(brand.id) }} máy
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      

      <!-- ===================================================================================== -->
      <!-- KHỐI BÊN PHẢI: LỐI TẮT CHÍNH SÁCH THẾ CHÂN & MẪU HỢP ĐỒNG THUÊ                         -->
      <!-- ===================================================================================== -->
      <div class="nav-shortcuts d-none d-lg-flex align-items-center gap-3">
        <!-- Lối tắt 1: Quy định thế chân -->
        <a href="#deposit-policy-section" class="shortcut-link" @click="handleScrollToDeposit">
          <i class="fa fa-handshake-o text-warning"></i>
          <span>Quy định thế chân</span>
        </a>

        <!-- Lối tắt 2: Cam kết hoàn cọc 100% -->
        <a href="#deposit-policy-section" class="shortcut-link" @click="handleScrollToDeposit">
          <i class="fa fa-check-circle text-success"></i>
          <span>Hoàn cọc 100%</span>
        </a>

        <!-- Lối tắt 3: Mẫu hợp đồng thuê -->
        <router-link to="/lich-su-thue" class="shortcut-link">
          <i class="fa fa-file-text-o text-info"></i>
          <span>Mẫu hợp đồng thuê</span>
        </router-link>
      </div>

    </div>
  </nav>
</template>

<script setup>
// =========================================================================================
// KHU VỰC SCRIPT VUE 3: LOGIC THANH MENU & NÚT ÚP XUỐNG DANH SÁCH THUÊ ĐIỆN THOẠI
// =========================================================================================
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePhoneStore } from '@/stores/phone.store';

const router = useRouter();
const route = useRoute();
const phoneStore = usePhoneStore();

const dropdownRef = ref(null);
const isDropdownOpen = ref(false);

// Kiểm tra có đang ở trang chủ không
const isHomePage = computed(() => route.path === '/');

// Kiểm tra tab "Tất cả điện thoại" đang active
const isAllCategoryActive = computed(() => {
  return !isHomePage.value && (route.params.category === 'all' || phoneStore.selectedCategory === 'ALL');
});

// Kiểm tra có đang chọn một hãng điện thoại cụ thể nào không
const isBrandActive = computed(() => {
  return !isHomePage.value && route.params.category && route.params.category !== 'all';
});

// Lọc danh sách các HÃNG điện thoại (loại trừ mục 'ALL')
const brandCategories = computed(() => {
  return phoneStore.categories.filter(c => c.id !== 'ALL');
});

// Bật / tắt menu úp xuống
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Đếm số lượng máy của từng hãng
const getPhoneCount = (brandId) => {
  return phoneStore.phones.filter(p => p.hangSanXuat === brandId || p.category === brandId).length;
};

// Mô tả ngắn dưới tên hãng
const getBrandDesc = (brand) => {
  if (brand.id === 'APPLE') return 'iPhone 16, 15, 14 Pro Max...';
  if (brand.id === 'SAMSUNG') return 'Galaxy S24 Ultra, Z Fold...';
  if (brand.id === 'XIAOMI') return 'Xiaomi 14 Ultra, Leica Camera...';
  if (brand.id === 'GAMING') return 'ROG Phone, RedMagic 9 Pro...';
  return brand.description || 'Thiết bị sẵn sàng cho thuê';
};

// Khi click Trang chủ
const handleHomeClick = () => {
  phoneStore.setCategory('ALL');
  isDropdownOpen.value = false;
};

// Khi click "Tất cả điện thoại"
const handleAllPhonesClick = () => {
  phoneStore.setCategory('ALL');
  isDropdownOpen.value = false;
  router.push('/danh-muc/all');
};

// Khi chọn một hãng từ menu úp xuống
const selectBrandFromDropdown = (brandId) => {
  phoneStore.setCategory(brandId);
  isDropdownOpen.value = false;
  const slug = brandId.toLowerCase();
  router.push(`/danh-muc/${slug}`);
};

// Khi click vào lối tắt chính sách thế chân / hoàn cọc
const handleScrollToDeposit = (e) => {
  e.preventDefault();
  if (route.path === '/') {
    const el = document.getElementById('deposit-policy-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    router.push('/#deposit-policy-section');
  }
};

// Đóng menu khi click ra ngoài màn hình
const handleOutsideClick = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
/* Nền thanh menu màu tối hiện đại */
.nav-bar-container {
  background: #1e293b;
  border-bottom: 2px solid #334155;
  padding: 0;
  position: relative;
  z-index: 90;
}

.btn-category-nav {
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  white-space: nowrap;
}

/* Kiểu dáng từng tab danh mục */
.nav-link {
  display: flex;
  align-items: center;
  color: #cbd5e1;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 12px 18px;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

/* Kiểu dáng khi tab đang được chọn */
.nav-link.active {
  color: #38bdf8;
  border-bottom-color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
}

/* Nút úp xuống Dropdown Toggle */
.btn-dropdown-toggle {
  border-radius: 8px;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.25) !important;
  color: #f1f5f9;
}

.btn-dropdown-toggle:hover {
  background: rgba(56, 189, 248, 0.18);
  color: #38bdf8;
  border-color: #38bdf8 !important;
}

.dropdown-arrow {
  font-size: 1.05rem;
  font-weight: 900;
  color: #38bdf8;
  transition: transform 0.25s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Menu úp xuống (Dropdown Menu Container) */
.category-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 330px;
  background: #ffffff;
  z-index: 2000;
  border-color: #e2e8f0 !important;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-brand-item {
  transition: all 0.15s ease;
  cursor: pointer;
}

.dropdown-brand-item:hover {
  background: #f1f5f9;
}

.dropdown-brand-item.item-selected {
  background: #e0f2fe;
}

.dropdown-brand-item.item-selected .brand-name-text {
  color: #0284c7 !important;
}

.brand-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #2563eb;
  flex-shrink: 0;
}

.brand-name-text {
  font-size: 0.88rem;
}

.brand-sub-desc {
  font-size: 0.72rem;
}

.shortcut-link {
  font-size: 0.82rem;
  color: #cbd5e1;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
}

.shortcut-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}
</style>
