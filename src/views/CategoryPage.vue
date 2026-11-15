<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: TRANG DANH MỤC ĐIỆN THOẠI THEO HÃNG / PHÂN KHÚC (TRANG MỚI RIÊNG BIỆT)        -->
  <!-- ENGLISH: DEDICATED CATEGORY & BRAND PAGE (SEPARATE VIEW WITHOUT SCROLLING JUMPS)           -->
  <!-- ERD MAPPING: Ánh xạ thực thể TheLoai, DienThoai, CauHinh_PhienBan                          -->
  <!-- ========================================================================================== -->
  <div class="category-page-layout">
    <!-- Header hệ thống -->
    <Header />

    <!-- Navigation Bar chứa các danh mục hãng máy -->
    <NavigationBar />

    <!-- ====================================================================================== -->
    <!-- BANNER DANH MỤC CHUYÊN BIỆT (CATEGORY HERO BANNER & BREADCRUMB)                         -->
    <!-- ====================================================================================== -->
    <div class="category-banner-section py-4 border-bottom">
      <div class="container">
        <!-- Breadcrumb dẫn hướng -->
        <nav aria-label="breadcrumb" class="mb-2">
          <ol class="breadcrumb small mb-0">
            <li class="breadcrumb-item">
              <router-link to="/" class="text-decoration-none text-muted">
                <i class="fa fa-home me-1"></i> Trang chủ
              </router-link>
            </li>
            <li class="breadcrumb-item text-muted">Danh mục điện thoại</li>
            <li class="breadcrumb-item active fw-bold text-primary" aria-current="page">
              {{ currentCategoryInfo.name }}
            </li>
          </ol>
        </nav>

        <!-- Tiêu đề và mô tả danh mục -->
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 pt-2">
          <div class="d-flex align-items-center gap-3">
            <div class="category-icon-box text-white rounded-4 shadow-sm" :class="currentCategoryInfo.bgClass">
              <i class="fa" :class="currentCategoryInfo.icon"></i>
            </div>
            <div>
              <h2 class="fw-black mb-1 text-dark fs-3">
                {{ currentCategoryInfo.title }}
              </h2>
              <p class="text-muted small mb-0" style="max-width: 680px;">
                {{ currentCategoryInfo.description }}
              </p>
            </div>
          </div>

          <!-- Huy hiệu số lượng máy -->
          <div class="category-stats-badge">
            <span class="badge bg-white text-dark border p-2.5 rounded-pill shadow-sm fs-7">
              <i class="fa fa-check-circle text-success me-1"></i>
              Có <strong class="text-primary">{{ filteredCategoryPhones.length }}</strong> thiết bị sẵn sàng thuê
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ====================================================================================== -->
    <!-- KHU VỰC BỘ LỌC ĐA TIÊU CHÍ & DANH SÁCH THẺ ĐIỆN THOẠI                                   -->
    <!-- ====================================================================================== -->
    <main class="container my-4 flex-grow-1">
      <!-- Bộ lọc phần cứng, Chipset, RAM, Giá -->
      <PhoneFilter />

      <!-- Lưới sản phẩm (Grid) -->
      <div v-if="filteredCategoryPhones.length > 0" class="row g-2 g-md-3 g-xl-4 mt-1">
        <PhoneCard
          v-for="phone in filteredCategoryPhones"
          :key="phone.maDienThoai"
          :phone="phone"
        />
      </div>

      <!-- Trạng thái trống nếu không có máy nào khớp -->
      <div v-else class="empty-state-box text-center py-5 my-4 bg-white rounded-4 border p-5 shadow-sm">
        <i class="fa fa-search-minus text-muted fs-1 mb-3"></i>
        <h5 class="fw-bold text-dark mb-2">Chưa tìm thấy điện thoại phù hợp trong danh mục này</h5>
        <p class="text-muted small mb-4" style="max-width: 500px; margin: 0 auto;">
          Hiện các thiết bị của danh mục <strong>{{ currentCategoryInfo.name }}</strong> có thể đang được thuê hết hoặc chưa khớp với tiêu chí lọc cấu hình.
        </p>
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-primary-smart btn-sm" @click="phoneStore.resetFilters">
            <i class="fa fa-refresh me-1"></i> Đặt lại bộ lọc
          </button>
          <router-link to="/danh-muc/all" class="btn btn-outline-secondary btn-sm">
            <i class="fa fa-th-large me-1"></i> Xem tất cả điện thoại
          </router-link>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Modals & Drawers toàn cục -->
    <PhoneQuickViewModal />
    <CompareModal />
    <CartDrawer />
    <AuthModal />
  </div>
</template>

<script setup>
// ============================================================================================
// LOGIC XỬ LÝ TRANG DANH MỤC RIÊNG BIỆT (CATEGORY PAGE CONTROLLER)
// ============================================================================================
import { computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePhoneStore } from '@/stores/phone.store';
import Header from '@/components/Header.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import PhoneFilter from '@/components/PhoneFilter.vue';
import PhoneCard from '@/components/PhoneCard.vue';
import Footer from '@/components/Footer.vue';
import PhoneQuickViewModal from '@/components/PhoneQuickViewModal.vue';
import CompareModal from '@/components/CompareModal.vue';
import CartDrawer from '@/components/CartDrawer.vue';
import AuthModal from '@/components/AuthModal.vue';

const route = useRoute();
const phoneStore = usePhoneStore();

// Cấu hình thông tin chi tiết từng danh mục/hãng máy
const categoryMeta = {
  ALL: {
    id: 'ALL',
    name: 'Tất cả điện thoại',
    title: 'Tất Cả Điện Thoại Cho Thuê',
    icon: 'fa-mobile',
    bgClass: 'bg-primary',
    description: 'Khám phá trọn bộ kho điện thoại cao cấp chính hãng từ Apple, Samsung, Xiaomi đến Gaming Phone. Đầy đủ tem niêm phong, kiểm tra IMEI nghiêm ngặt.'
  },
  APPLE: {
    id: 'APPLE',
    name: 'Apple iPhone',
    title: 'Điện Thoại Apple iPhone Cho Thuê',
    icon: 'fa-apple',
    bgClass: 'bg-dark',
    description: 'Trải nghiệm hệ sinh thái iOS mượt mà với các dòng iPhone 16 Pro Max, 15 Pro Max, 14 Pro Max. Màn hình Super Retina XDR, chip A18 Pro và camera quay phim 4K ProRes chuyên nghiệp.'
  },
  SAMSUNG: {
    id: 'SAMSUNG',
    name: 'Samsung Galaxy',
    title: 'Điện Thoại Samsung Galaxy Cho Thuê',
    icon: 'fa-android',
    bgClass: 'bg-primary',
    description: 'Dẫn đầu công nghệ với Galaxy S24 Ultra, Z Fold, Z Flip tích hợp bút S-Pen, tính năng Galaxy AI thông minh và camera mắt thần bóng đêm Zoom 100x.'
  },
  XIAOMI: {
    id: 'XIAOMI',
    name: 'Xiaomi & Redmi',
    title: 'Điện Thoại Xiaomi & Redmi Cho Thuê',
    icon: 'fa-bolt',
    bgClass: 'bg-warning text-dark',
    description: 'Hiệu năng cực đỉnh trong tầm giá với vi xử lý Snapdragon mạnh mẽ, thấu kính Leica quang học đỉnh cao, sạc siêu nhanh HyperCharge 120W.'
  },
  GAMING: {
    id: 'GAMING',
    name: 'Gaming Phone',
    title: 'Điện Thoại Chơi Game Chuyên Nghiệp',
    icon: 'fa-gamepad',
    bgClass: 'bg-danger',
    description: 'Chuyên trị các tựa game nặng như Genshin Impact, PUBG, Liên Quân với hệ thống tản nhiệt buồng hơi ICE 13, màn hình tần số quét 165Hz và phím trigger phản hồi xúc giác.'
  },
  FLAGSHIP: {
    id: 'FLAGSHIP',
    name: 'Flagship Cao Cấp',
    title: 'Bộ Sưu Tập Flagship Đỉnh Cao',
    icon: 'fa-crown',
    bgClass: 'bg-warning text-dark',
    description: 'Tuyển tập những chiếc smartphone cao cấp và đắt đỏ nhất trên thị trường phục vụ quay MV, chụp hình kỷ yếu, công tác sự kiện quan trọng.'
  }
};

// Đồng bộ danh mục từ URL parameter
const syncCategoryFromRoute = () => {
  const param = route.params.category;
  if (!param) {
    phoneStore.setCategory('ALL');
    return;
  }

  const rawKey = param.toString().toUpperCase();
  const found = phoneStore.categories.find(c => c.id === rawKey);
  phoneStore.setCategory(found ? found.id : 'ALL');
};

// Thông tin meta của danh mục hiện hành (lấy động từ phoneStore kèm fallback)
const currentCategoryInfo = computed(() => {
  const catKey = phoneStore.selectedCategory || 'ALL';
  const foundInStore = phoneStore.categories.find(c => c.id === catKey);
  if (foundInStore) {
    const meta = categoryMeta[catKey] || {};
    return {
      id: foundInStore.id,
      name: foundInStore.name,
      title: meta.title || `Điện Thoại ${foundInStore.name} Cho Thuê`,
      icon: foundInStore.icon || meta.icon || 'fa-mobile',
      bgClass: meta.bgClass || 'bg-primary',
      description: foundInStore.description || meta.description || `Các dòng điện thoại ${foundInStore.name} chính hãng chất lượng cao sẵn sàng cho thuê.`
    };
  }
  return categoryMeta.ALL;
});

// Danh sách điện thoại hiển thị theo bộ lọc
const filteredCategoryPhones = computed(() => {
  return phoneStore.filteredPhones;
});

// Lắng nghe thay đổi tham số danh mục trên URL
watch(
  () => route.params.category,
  () => {
    syncCategoryFromRoute();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
);

onMounted(async () => {
  if (phoneStore.phones.length === 0) {
    await phoneStore.fetchPhones();
  }
  syncCategoryFromRoute();
  window.scrollTo({ top: 0, behavior: 'instant' });
});
</script>

<style scoped>
.category-page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.category-banner-section {
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
}

.category-icon-box {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "›";
  font-size: 1.1rem;
  line-height: 1;
}

.empty-state-box {
  border-radius: 16px;
}
</style>

