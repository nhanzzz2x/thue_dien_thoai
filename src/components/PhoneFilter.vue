<template>
  <!-- BỘ LỌC ĐIỆN THOẠI ĐA TIÊU CHÍ (MULTI-CRITERIA PHONE FILTER COMPONENT)                      -->
  <!-- Ánh xạ ERD: Lọc dữ liệu theo thực thể `DienThoai` & `CauHinh_PhienBan`                    -->
  <!-- Hỗ trợ lọc theo: Hãng máy, Chipset, RAM/ROM, Hệ điều hành, Mức giá và Tình trạng máy kho   -->
  <div id="filter-config-section" class="filter-card my-4">
    <div class="card border-0 shadow-sm rounded-4 p-3 p-md-4">
      
      <!-- TIÊU ĐỀ BỘ LỌC & NÚT XÓA BỘ LỌC (FILTER HEADER & RESET BUTTON)                        -->
      <div class="filter-header d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="filter-icon-badge">
            <i class="fa fa-sliders text-primary"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-0">Bộ Lọc Cấu Hình Đa Tiêu Chí (ERD Filter)</h5>
            <small class="text-muted d-none d-sm-inline">Ánh xạ trực tiếp thực thể <code>DienThoai</code> & <code>CauHinh_PhienBan</code></small>
          </div>
        </div>

        <!-- Nút xóa tất cả bộ lọc về mặc định (Chỉ hiện khi có ít nhất 1 tiêu chí lọc đang bật) -->
        <button
          v-if="hasActiveFilters"
          class="btn btn-sm btn-outline-danger rounded-pill px-2 px-sm-3"
          @click="phoneStore.resetFilters"
        >
          <i class="fa fa-refresh me-1"></i> <span class="d-none d-sm-inline">Xóa tất cả bộ lọc</span><span class="d-inline d-sm-none">Xóa lọc</span>
        </button>
      </div>

      <!-- LƯỚI 5 TIÊU CHÍ LỌC CHI TIẾT (5 FILTER CONTROLS GRID)                                 -->
      <div class="row g-2 g-md-3">
        <!-- 1. TIÊU CHÍ 1: LỌC THEO HÃNG MÁY / DANH MỤC (ERD: TheLoai.ten_loai / DienThoai.category) -->
        <div class="col-6 col-md-4 col-lg-2">
          <label class="filter-label"><i class="fa fa-tag me-1 text-primary"></i> Hãng máy</label>
          <select v-model="phoneStore.selectedCategory" class="form-select filter-select">
            <option value="ALL">Tất cả hãng (All Brands)</option>
            <option v-for="cat in phoneStore.categories.filter(c => c.id !== 'ALL')" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- 2. TIÊU CHÍ 2: LỌC THEO VI XỬ LÝ (CHIPSET) (ERD: CauHinh_PhienBan.Chipset) -->
        <div class="col-6 col-md-4 col-lg-3">
          <label class="filter-label"><i class="fa fa-microchip me-1 text-info"></i> Vi xử lý (Chipset)</label>
          <select v-model="phoneStore.selectedChipset" class="form-select filter-select">
            <option value="">Tất cả Chipset</option>
            <!-- Lấy danh sách Chipset động từ phoneStore.availableChipsets (A18 Pro, Snapdragon 8 Gen 3...) -->
            <option v-for="chip in phoneStore.availableChipsets" :key="chip" :value="chip">
              {{ chip }}
            </option>
          </select>
        </div>

        <!-- 3. TIÊU CHÍ 3: LỌC THEO BỘ NHỚ RAM / ROM (ERD: CauHinh_PhienBan.RAM_ROM) -->
        <div class="col-6 col-md-4 col-lg-2">
          <label class="filter-label"><i class="fa fa-database me-1 text-warning"></i> Bộ nhớ (RAM/ROM)</label>
          <select v-model="phoneStore.selectedRamRom" class="form-select filter-select">
            <option value="">Tất cả dung lượng</option>
            <!-- Lấy danh sách RAM/ROM động từ phoneStore.availableRamRom (8GB/256GB, 12GB/512GB, 16GB/512GB...) -->
            <option v-for="rr in phoneStore.availableRamRom" :key="rr" :value="rr">
              {{ rr }}
            </option>
          </select>
        </div>

        <!-- 4. TIÊU CHÍ 4: LỌC THEO HỆ ĐIỀU HÀNH (ERD: CauHinh_PhienBan.HeDieuHanh) -->
        <div class="col-6 col-md-4 col-lg-2">
          <label class="filter-label"><i class="fa fa-cogs me-1 text-secondary"></i> Hệ điều hành</label>
          <select v-model="phoneStore.selectedOs" class="form-select filter-select">
            <option value="">Tất cả HĐH</option>
            <option value="iOS">Apple iOS</option>
            <option value="Android">Google Android / HyperOS</option>
          </select>
        </div>

        <!-- 5. TIÊU CHÍ 5: LỌC THEO MỨC GIÁ THUÊ / NGÀY (ERD: DienThoai.giaThueNgay) -->
        <div class="col-12 col-md-4 col-lg-3">
          <label class="filter-label"><i class="fa fa-money me-1 text-success"></i> Giá thuê theo ngày</label>
          <select v-model="phoneStore.selectedPriceRange" class="form-select filter-select">
            <option value="ALL">Tất cả mức giá</option>
            <option value="UNDER_200">Dưới 200.000₫/ngày</option>
            <option value="200_TO_250">200.000₫ - 250.000₫/ngày</option>
            <option value="ABOVE_250">Trên 250.000₫/ngày</option>
          </select>
        </div>
      </div>

      <!-- THANH CHUYỂN NHANH: CHỈ HIỆN MÁY SẴN SÀNG & ĐẾM KẾT QUẢ                               -->
      <!-- Ánh xạ trường: `DienThoai.TinhTrangMay` = 'SAN_SANG'                                  -->
      <div class="mt-3 pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2">
        <!-- Nút gạt Switch: Chỉ lọc máy có thể thuê ngay (Availability toggle switch) -->
        <div class="form-check form-switch d-inline-flex align-items-center gap-2">
          <input
            class="form-check-input cursor-pointer"
            type="checkbox"
            id="onlyAvailableCheck"
            v-model="phoneStore.onlyAvailable"
          />
          <label class="form-check-label fw-semibold cursor-pointer text-dark" for="onlyAvailableCheck">
            <i class="fa fa-check-circle text-success me-1"></i> Chỉ hiển thị máy "Sẵn sàng thuê" trong kho (TinhTrangMay = 'SAN_SANG')
          </label>
        </div>

        <!-- Đếm số lượng máy tìm thấy theo thời gian thực (Real-time matched count) -->
        <div class="filter-result-count">
          <span class="text-muted font-monospace">
            Tìm thấy: <strong class="text-primary fs-6">{{ phoneStore.filteredPhones.length }}</strong> thiết bị phù hợp
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// KHU VỰC SCRIPT VUE 3: LOGIC BỘ LỌC ĐIỆN THOẠI

import { computed } from 'vue';
import { usePhoneStore } from '@/stores/phone.store';    // Store quản lý kho điện thoại và các state của bộ lọc

const phoneStore = usePhoneStore();

// Biến Computed kiểm tra xem người dùng có đang kích hoạt bất kỳ bộ lọc nào hay không
// Nếu có ít nhất 1 tiêu chí lọc khác mặc định -> nút "Xóa tất cả bộ lọc" sẽ tự động hiển thị
const hasActiveFilters = computed(() => {
  return (
    phoneStore.selectedCategory !== 'ALL' ||
    phoneStore.searchKeyword !== '' ||
    phoneStore.selectedChipset !== '' ||
    phoneStore.selectedRamRom !== '' ||
    phoneStore.selectedOs !== '' ||
    phoneStore.selectedPriceRange !== 'ALL' ||
    phoneStore.onlyAvailable
  );
});
</script>

<style scoped>
/* Huy hiệu biểu tượng bộ lọc (Filter icon styling) */
.filter-icon-badge {
  width: 38px;
  height: 38px;
  background: var(--primary-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

/* Nhãn từng ô chọn lọc (Filter label styling) */
.filter-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 5px;
  display: block;
}

/* Ô dropdown select bộ lọc (Filter select styling) */
.filter-select {
  border-radius: 8px;
  font-size: 0.85rem;
  border-color: #e2e8f0;
  background-color: #f8fafc;
  font-weight: 500;
  color: #1e293b;
}

.filter-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  background-color: #fff;
}

.cursor-pointer {
  cursor: pointer;
}

@media (max-width: 576px) {
  .filter-label {
    font-size: 0.72rem;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .filter-select {
    font-size: 0.78rem;
    padding: 6px 8px;
  }
  .filter-icon-badge {
    width: 32px;
    height: 32px;
    font-size: 0.95rem;
  }
}
</style>
