<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: TRANG TỔNG QUAN QUẢN TRỊ ADMIN (KPIs & BÁO CÁO NHANH - GIAI ĐOẠN 2)             -->
  <!-- ENGLISH: ADMIN DASHBOARD (KPI SUMMARY & QUICK METRICS - PHASE 2)                           -->
  <!-- ERD MAPPING: Thống kê tổng hợp từ DienThoai, DonThue, DatCoc                               -->
  <!-- ========================================================================================== -->
  <div class="admin-dashboard">
    <!-- ==================================================================================== -->
    <!-- VIETNAMESE: HÀNG 4 THẺ CHỈ SỐ HOẠT ĐỘNG CHÍNH (TOP 4 KPI CARDS)                      -->
    <!-- ENGLISH: TOP 4 OPERATIONAL KPI METRICS CARDS                                         -->
    <!-- ==================================================================================== -->
    <div class="row g-3 mb-4">
      <!-- KPI 1: Tổng số thiết bị trong kho (ERD: COUNT(*) FROM DienThoai) -->
      <!-- KPI 1: Total Devices in Fleet Inventory                          -->
      <div class="col-xl-3 col-sm-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small fw-semibold">Tổng Thiết Bị Trong Kho</span>
              <h3 class="fw-bold text-dark mt-1 mb-0">{{ phoneStore.phones.length }}</h3>
              <small class="text-success">
                <i class="fa fa-check-circle me-1"></i> {{ readyPhoneCount }} máy sẵn sàng
              </small>
            </div>
            <div class="kpi-icon-box bg-primary-subtle text-primary rounded-4 d-flex align-items-center justify-content-center">
              <i class="fa fa-mobile fs-3"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI 2: Số máy đang cho thuê (ERD: COUNT(*) WHERE TinhTrangMay = 'DANG_THUE') -->
      <!-- KPI 2: Devices Currently On Active Rentals                                  -->
      <div class="col-xl-3 col-sm-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small fw-semibold">Thiết Bị Đang Cho Thuê</span>
              <h3 class="fw-bold text-primary mt-1 mb-0">{{ rentedPhoneCount }}</h3>
              <small class="text-muted">
                {{ orderStore.activeRentals.length }} hợp đồng đang chạy
              </small>
            </div>
            <div class="kpi-icon-box bg-info-subtle text-info rounded-4 d-flex align-items-center justify-content-center">
              <i class="fa fa-handshake-o fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI 3: Đơn thuê chờ duyệt (ERD: COUNT(*) FROM DonThue WHERE TrangThai = 'CHO_DUYET') -->
      <!-- KPI 3: Pending Orders Awaiting Admin Approval & Deposit Verification                -->
      <div class="col-xl-3 col-sm-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small fw-semibold">Đơn Thuê Chờ Duyệt Cọc</span>
              <h3 class="fw-bold text-warning mt-1 mb-0">{{ orderStore.pendingOrders.length }}</h3>
              <small class="text-danger fw-semibold">
                <i class="fa fa-bell me-1"></i> Cần xử lý ngay
              </small>
            </div>
            <div class="kpi-icon-box bg-warning-subtle text-warning rounded-4 d-flex align-items-center justify-content-center">
              <i class="fa fa-hourglass-half fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI 4: Tổng tiền cọc đang quản lý (ERD: SUM(SoTienCoc) FROM DatCoc) -->
      <!-- KPI 4: Total Collateral / Deposit Money Currently Held in Escrow    -->
      <div class="col-xl-3 col-sm-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small fw-semibold">Tiền Cọc Đang Quản Lý</span>
              <h4 class="fw-bold text-danger mt-1 mb-0">{{ convertToVND(orderStore.totalDepositHolding) }}</h4>
              <small class="text-muted">Bảo lãnh thế chân thiết bị</small>
            </div>
            <div class="kpi-icon-box bg-danger-subtle text-danger rounded-4 d-flex align-items-center justify-content-center">
              <i class="fa fa-shield fs-4"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================================================================================== -->
    <!-- VIETNAMESE: HÀNG THỨ HAI - BẢNG ĐƠN THUÊ CẦN XỬ LÝ GẤP & TỶ LỆ THEO HÃNG              -->
    <!-- ENGLISH: ROW 2 - URGENT ACTION ORDERS TABLE & BRAND DISTRIBUTION BREAKDOWN           -->
    <!-- ==================================================================================== -->
    <div class="row g-4 mb-4">
      <!-- Cột trái: Đơn thuê cần xử lý nhanh -->
      <!-- Left Column: Fast Processing Orders -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 class="fw-bold text-dark mb-0">Đơn Thuê Cần Xử Lý Nhanh</h5>
              <small class="text-muted">Danh sách khách hàng vừa đăng ký thuê thiết bị</small>
            </div>
            <router-link to="/admin/don-thue" class="btn btn-outline-primary btn-sm">
              Xem tất cả đơn <i class="fa fa-arrow-right ms-1"></i>
            </router-link>
          </div>

          <div v-if="orderStore.orders.length > 0" class="table-responsive">
            <table class="table table-hover align-middle small mb-0">
              <thead class="table-light">
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Thiết bị thuê</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th class="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orderStore.orders.slice(0, 5)" :key="order.maDonThue">
                  <td class="fw-bold text-primary">{{ order.maDonThue }}</td>
                  <td>
                    <strong>{{ order.khachHang.hoTen }}</strong>
                    <div class="text-muted" style="font-size: 0.75rem;">{{ order.khachHang.sdt }}</div>
                  </td>
                  <td>
                    <span v-for="m in order.danhSachMay" :key="m.maDienThoai" class="d-block text-truncate" style="max-width: 180px;">
                      {{ m.TenDienThoai }}
                    </span>
                  </td>
                  <td>
                    <span>{{ order.soNgayThue }} ngày</span>
                    <div class="text-muted" style="font-size: 0.75rem;">{{ order.ngayBatDauThue }}</div>
                  </td>
                  <td>
                    <span class="badge rounded-pill" :class="getStatusBadgeClass(order.trangThai)">
                      {{ getStatusText(order.trangThai) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <router-link to="/admin/don-thue" class="btn btn-sm btn-light border">
                      Xử lý
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-4 text-muted">
            Chưa có đơn thuê nào cần xử lý.
          </div>
        </div>
      </div>

      <!-- Cột phải: Thống kê tỷ lệ thương hiệu thiết bị trong kho -->
      <!-- Right Column: Brand Market Share Breakdown in Inventory -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
          <h5 class="fw-bold text-dark mb-3">Tỷ Lệ Thiết Bị Theo Hãng</h5>
          
          <div class="d-flex flex-column gap-3">
            <div v-for="brand in brandStats" :key="brand.name" class="brand-item">
              <div class="d-flex justify-content-between small fw-semibold mb-1">
                <span>{{ brand.name }}</span>
                <span>{{ brand.count }} máy ({{ brand.percent }}%)</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar" :class="brand.colorClass" :style="{ width: brand.percent + '%' }"></div>
              </div>
            </div>
          </div>

          <hr class="my-4" />

          <!-- Hộp lưu ý quy trình vận hành và kiểm tra thiết bị -->
          <!-- Inventory Inspection & Handover Operational Tips Box -->
          <div class="p-3 bg-light rounded-3">
            <h6 class="fw-bold small mb-2"><i class="fa fa-info-circle text-primary me-1"></i> Mẹo quản lý kho:</h6>
            <p class="small text-muted mb-0">
              Kiểm tra kỹ tình trạng màn hình và tem niêm phong ốc đít máy trước khi bấm bàn giao và sau khi nhận máy trả từ khách hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT CÁC STORE & HÀM FORMAT TIỀN TỆ
// ENGLISH: IMPORT DATA STORES & FORMATTING UTILITY
// ============================================================================================
import { computed, onMounted } from 'vue';
import { useOrderStore } from '@/stores/order.store';
import { usePhoneStore } from '@/stores/phone.store';
import { convertToVND } from '@/utils/formatters';

// Khởi tạo stores
// Initialize Pinia stores
const orderStore = useOrderStore();
const phoneStore = usePhoneStore();

onMounted(() => {
  orderStore.syncFromStorage();
});

// ============================================================================================
// VIETNAMESE: TÍNH SỐ LƯỢNG MÁY SẴN SÀNG THUÊ (TinhTrangMay = 'SAN_SANG')
// ENGLISH: COUNT DEVICES READY FOR RENT
// ============================================================================================
const readyPhoneCount = computed(() => {
  return phoneStore.phones.filter(p => p.TinhTrangMay === 'SAN_SANG').length;
});

// ============================================================================================
// VIETNAMESE: TÍNH SỐ LƯỢNG MÁY ĐANG CHO THUÊ (TinhTrangMay = 'DANG_THUE')
// ENGLISH: COUNT DEVICES CURRENTLY RENTED OUT
// ============================================================================================
const rentedPhoneCount = computed(() => {
  return phoneStore.phones.filter(p => p.TinhTrangMay === 'DANG_THUE').length;
});

// ============================================================================================
// VIETNAMESE: TÍNH TỶ TRỌNG CÁC THƯƠNG HIỆU ĐIỆN THOẠI TRONG KHO HÀNG
// ENGLISH: COMPUTE PERCENTAGE DISTRIBUTION BY PHONE BRAND IN INVENTORY
// ============================================================================================
const brandStats = computed(() => {
  const total = phoneStore.phones.length || 1;
  const apple = phoneStore.phones.filter(p => p.hangSanXuat === 'APPLE').length;
  const samsung = phoneStore.phones.filter(p => p.hangSanXuat === 'SAMSUNG').length;
  const xiaomi = phoneStore.phones.filter(p => p.hangSanXuat === 'XIAOMI').length;
  const gaming = phoneStore.phones.filter(p => p.hangSanXuat === 'ASUS' || p.category === 'GAMING').length;

  return [
    { name: 'Apple iPhone', count: apple, percent: Math.round((apple / total) * 100), colorClass: 'bg-dark' },
    { name: 'Samsung Galaxy', count: samsung, percent: Math.round((samsung / total) * 100), colorClass: 'bg-primary' },
    { name: 'Xiaomi / Redmi', count: xiaomi, percent: Math.round((xiaomi / total) * 100), colorClass: 'bg-warning' },
    { name: 'Gaming Phones', count: gaming, percent: Math.round((gaming / total) * 100), colorClass: 'bg-danger' }
  ];
});

// ============================================================================================
// VIETNAMESE: XÁC ĐỊNH MÀU SẮC HUY HIỆU THEO TRẠNG THÁI ĐƠN HÀNG
// ENGLISH: RESOLVE BADGE COLOR CLASS BY ORDER STATUS
// ============================================================================================
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'CHO_DUYET': return 'bg-warning text-dark';
    case 'DA_XAC_NHAN_COC': return 'bg-info text-dark';
    case 'DANG_THUE': return 'bg-primary text-white';
    case 'DA_TRA_MAY': return 'bg-secondary text-white';
    case 'HOAN_TAT_TRA_COC': return 'bg-success text-white';
    case 'DA_HUY': return 'bg-danger text-white';
    default: return 'bg-light text-dark';
  }
};

// ============================================================================================
// VIETNAMESE: DỊCH MÃ TRẠNG THÁI RA TÊN GỌI RÚT GỌN HIỂN THỊ TRÊN BẢNG DASHBOARD
// ENGLISH: TRANSLATE ORDER STATUS CODE TO COMPACT VIETNAMESE LABEL
// ============================================================================================
const getStatusText = (status) => {
  switch (status) {
    case 'CHO_DUYET': return 'Chờ duyệt';
    case 'DA_XAC_NHAN_COC': return 'Đã cọc';
    case 'DANG_THUE': return 'Đang thuê';
    case 'DA_TRA_MAY': return 'Đã trả máy';
    case 'HOAN_TAT_TRA_COC': return 'Hoàn tất';
    case 'DA_HUY': return 'Đã hủy';
    default: return status;
  }
};
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS CHO CÁC KHỐI BIỂU TƯỢNG KPI DASHBOARD                                       */
/* ENGLISH: SCOPED STYLES FOR KPI ICON CONTAINERS                                               */
/* ============================================================================================ */
.kpi-icon-box {
  width: 54px;
  height: 54px;
}
</style>