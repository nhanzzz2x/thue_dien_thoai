<template>
  <!-- THANH ĐIỀU HƯỚNG DANH MỤC & LỐI TẮT CHÍNH SÁCH (NAVIGATION BAR)                           -->
  <!-- THIẾT KẾ: TRANG CHỦ & TẤT CẢ ĐIỆN THOẠI CỐ ĐỊNH + NÚT ÚP XUỐNG DANH SÁCH THUÊ ĐIỆN THOẠI   -->
  <nav class="nav-bar-container">
    <div class="container d-flex align-items-center justify-content-between">
      
      <!-- KHỐI BÊN TRÁI: TRANG CHỦ, TẤT CẢ ĐIỆN THOẠI & NÚT ÚP XUỐNG DANH SÁCH THUÊ            -->
      <div class="d-flex align-items-center gap-1 gap-md-2 nav-left-group">
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

          <!-- MENU ÚP XUỐNG HIỂN THỊ DANH SÁCH CÁC HÃNG MÁY TRÊN DESKTOP (MÀN HÌNH LỚN) -->
          <div v-if="isDropdownOpen && !isMobile" class="category-dropdown-menu shadow-lg rounded-4 py-2 border">
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
      
      <!-- KHỐI BÊN PHẢI: LỐI TẮT CHÍNH SÁCH THẾ CHÂN & MẪU HỢP ĐỒNG THUÊ                         -->
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

    <!-- BẢNG CHỌN DANH SÁCH ĐIỆN THOẠI TRÊN MOBILE (TELEPORT TRÁNH BỊ CHE KHUẤT)              -->
    <Teleport to="body">
      <!-- Lớp phủ mờ nền khi mở danh sách trên di động -->
      <transition name="fade">
        <div
          v-if="isDropdownOpen && isMobile"
          class="mobile-brand-backdrop"
          @click="isDropdownOpen = false"
        ></div>
      </transition>

      <!-- Bảng chọn hãng máy trượt lên từ cạnh dưới màn hình -->
      <transition name="slide-up">
        <div
          v-if="isDropdownOpen && isMobile"
          class="mobile-brand-sheet shadow-lg"
        >
          <!-- Tiêu đề Header của Sheet -->
          <div class="mobile-sheet-header d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
            <div class="d-flex align-items-center gap-2">
              <div class="header-icon-badge">
                <i class="fa fa-th-list text-primary fs-5"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-0 text-dark">Danh Sách Điện Thoại Cho Thuê</h6>
                <small class="text-muted">Chọn hãng máy hoặc xem toàn bộ kho</small>
              </div>
            </div>
            <button
              type="button"
              class="btn-close-sheet"
              @click="isDropdownOpen = false"
              aria-label="Đóng"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>

          <!-- Danh sách các hãng máy -->
          <div class="mobile-sheet-body p-2">
            <!-- Mục 1: Tất cả điện thoại -->
            <button
              type="button"
              class="mobile-brand-item d-flex align-items-center justify-content-between p-2.5 w-100 rounded-3 border-0 bg-transparent mb-1"
              :class="{ 'item-active': isAllCategoryActive }"
              @click="handleAllPhonesClick"
            >
              <div class="d-flex align-items-center gap-3">
                <div class="brand-icon-box bg-primary-subtle text-primary">
                  <i class="fa fa-mobile fs-4"></i>
                </div>
                <div class="text-start">
                  <strong class="d-block text-dark">Tất cả điện thoại</strong>
                  <small class="text-muted">Xem toàn bộ kho máy sẵn sàng thuê</small>
                </div>
              </div>
              <span class="badge bg-light text-primary border rounded-pill px-2.5 py-1">
                {{ phoneStore.phones.length }} máy
              </span>
            </button>

            <!-- Mục 2: Từng hãng (Apple, Samsung, Xiaomi, Gaming...) -->
            <button
              v-for="brand in brandCategories"
              :key="brand.id"
              type="button"
              class="mobile-brand-item d-flex align-items-center justify-content-between p-2.5 w-100 rounded-3 border-0 bg-transparent mb-1"
              :class="{ 'item-active': phoneStore.selectedCategory === brand.id && !isHomePage }"
              @click="selectBrandFromDropdown(brand.id)"
            >
              <div class="d-flex align-items-center gap-3">
                <div class="brand-icon-box">
                  <i class="fa" :class="brand.icon || 'fa-mobile'"></i>
                </div>
                <div class="text-start">
                  <strong class="d-block text-dark">{{ brand.name }}</strong>
                  <small class="text-muted">{{ getBrandDesc(brand) }}</small>
                </div>
              </div>
              <span class="badge bg-light text-dark border rounded-pill px-2.5 py-1">
                {{ getPhoneCount(brand.id) }} máy
              </span>
            </button>
          </div>

          <!-- Cam kết chân sheet -->
          <div class="mobile-sheet-footer px-3 py-2 bg-light border-top text-center">
            <small class="text-muted">
              <i class="fa fa-shield text-success me-1"></i> Cam kết 100% nguyên tem niêm phong, cọc linh hoạt bằng CCCD
            </small>
          </div>
        </div>
      </transition>
    </Teleport>
  </nav>
</template>

<script setup>
// KHU VỰC SCRIPT VUE 3: LOGIC THANH MENU & NÚT ÚP XUỐNG DANH SÁCH THUÊ ĐIỆN THOẠI
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePhoneStore } from '@/stores/phone.store';

const router = useRouter();
const route = useRoute();
const phoneStore = usePhoneStore();

const dropdownRef = ref(null);
const isDropdownOpen = ref(false);
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth <= 768;
  }
};

// Khóa cuộn màn hình khi mở sheet trên điện thoại
watch(isDropdownOpen, (val) => {
  if (typeof document !== 'undefined' && isMobile.value) {
    if (val) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

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

// Đóng menu khi click ra ngoài màn hình (chỉ cho Desktop)
const handleOutsideClick = (e) => {
  if (isMobile.value) return; // Trên mobile backdrop và nút đóng X xử lý
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
  window.removeEventListener('resize', updateIsMobile);
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

/* RESPONSIVE CHO MENU TRÊN TABLET & ĐIỆN THOẠI (< 768px)                                      */
@media (max-width: 768px) {
  .nav-left-group {
    overflow-x: auto;
    white-space: nowrap;
    width: 100%;
    padding: 3px 4px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .nav-left-group::-webkit-scrollbar {
    display: none;
  }
  .nav-link {
    padding: 8px 10px;
    font-size: 0.78rem;
  }
  .btn-dropdown-toggle {
    padding: 8px 10px;
    font-size: 0.78rem;
  }
  .category-dropdown-menu {
    width: 290px;
  }
}

/* BẢNG CHỌN HÃNG MÁY TRƯỢT LÊN TỪ ĐÁY (MOBILE BOTTOM SHEET & BACKDROP)                         */
.mobile-brand-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 2100;
}

.mobile-brand-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 82vh;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  z-index: 2105;
  box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.header-icon-badge {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(37, 99, 235, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-sheet {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-sheet:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.mobile-sheet-body {
  overflow-y: auto;
  flex-grow: 1;
  -webkit-overflow-scrolling: touch;
}

.mobile-brand-item {
  transition: all 0.15s ease;
  cursor: pointer;
}

.mobile-brand-item:active,
.mobile-brand-item:hover {
  background: #f1f5f9 !important;
}

.mobile-brand-item.item-active {
  background: #e0f2fe !important;
  border-left: 4px solid #0284c7 !important;
}

.mobile-brand-item.item-active strong {
  color: #0284c7 !important;
}

/* Hiệu ứng chuyển động mượt mà (Vue Transitions) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
