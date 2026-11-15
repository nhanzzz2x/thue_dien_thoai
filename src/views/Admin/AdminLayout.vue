<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: BỐ CỤC KHUNG GIAO DIỆN QUẢN TRỊ ADMIN (PHẦN BẢNG ĐIỀU KHIỂN & SIDEBAR MENU)     -->
  <!-- ENGLISH: ADMIN PORTAL MASTER LAYOUT (SIDEBAR NAVIGATION & TOPBAR HEADER)                  -->
  <!-- ERD MAPPING: Quản lý điều hướng đến các phân hệ DonThue, DienThoai, DatCoc                -->
  <!-- ========================================================================================== -->
  <div class="admin-wrapper d-flex">
    <!-- ==================================================================================== -->
    <!-- VIETNAMESE: THANH BÊN ĐIỀU HƯỚNG QUẢN TRỊ (ADMIN SIDEBAR)                            -->
    <!-- ENGLISH: ADMIN SIDEBAR NAVIGATION DRAWER                                             -->
    <!-- ==================================================================================== -->
    <aside class="admin-sidebar d-flex flex-column text-white">
      <!-- VIETNAMESE: Logo & Tiêu đề cổng quản trị | ENGLISH: Brand logo & portal title -->
      <div class="sidebar-brand p-3 border-bottom border-secondary d-flex align-items-center gap-2">
        <div class="brand-logo-circle bg-primary text-white rounded-3 d-flex align-items-center justify-content-center">
          <i class="fa fa-shield"></i>
        </div>
        <div>
          <h6 class="fw-bold mb-0 text-white">ADMIN PORTAL</h6>
          <small class="text-secondary" style="font-size: 0.72rem;">TrongNhanMobile Quản Trị</small>
        </div>
      </div>

      <!-- VIETNAMESE: Danh sách các liên kết điều hướng chức năng quản trị -->
      <!-- ENGLISH: Sidebar menu links mapped to admin sub-routes           -->
      <nav class="sidebar-nav flex-grow-1 p-2">
        <ul class="nav flex-column gap-1 list-unstyled mb-0">
          <!-- 1. Bảng điều khiển tổng quan (Dashboard) -->
          <li class="nav-item">
            <router-link
              to="/admin"
              exact-active-class="active"
              class="nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2.5 rounded-3"
            >
              <i class="fa fa-dashboard fs-6"></i>
              <span>Tổng Quan (Dashboard)</span>
            </router-link>
          </li>

          <!-- 2. Quản lý duyệt đơn thuê & quy trình 5 bước (Bảng DonThue) -->
          <li class="nav-item">
            <router-link
              to="/admin/don-thue"
              active-class="active"
              class="nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2.5 rounded-3"
            >
              <i class="fa fa-file-text-o fs-6"></i>
              <span>Duyệt Đơn Thuê Máy</span>
              <span v-if="orderStore.pendingOrders.length" class="badge bg-warning text-dark ms-auto">
                {{ orderStore.pendingOrders.length }}
              </span>
            </router-link>
          </li>

          <!-- 3. Quản lý kho thiết bị, số lượng máy & mã IMEI (Bảng DienThoai & CauHinh_PhienBan) -->
          <li class="nav-item">
            <router-link
              to="/admin/dien-thoai"
              active-class="active"
              class="nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2.5 rounded-3"
            >
              <i class="fa fa-mobile fs-5"></i>
              <span>Kho Thiết Bị & IMEI</span>
              <span class="badge bg-secondary ms-auto">{{ phoneStore.phones.length }}</span>
            </router-link>
          </li>

          <!-- 4. Quản lý tiền cọc, tài sản thế chấp & hoàn cọc (Bảng DatCoc) -->
          <li class="nav-item">
            <router-link
              to="/admin/tien-coc"
              active-class="active"
              class="nav-link text-white-50 d-flex align-items-center gap-3 px-3 py-2.5 rounded-3"
            >
              <i class="fa fa-lock fs-6"></i>
              <span>Quản Lý Tiền Cọc & Tài Sản</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- VIETNAMESE: Nút quay trở về giao diện khách hàng -->
      <!-- ENGLISH: Return button back to client storefront view -->
      <div class="sidebar-footer p-3 border-top border-secondary">
        <router-link to="/" class="btn btn-outline-light w-100 btn-sm d-flex align-items-center justify-content-center gap-2">
          <i class="fa fa-arrow-left"></i> Về Giao Diện Khách
        </router-link>
      </div>
    </aside>

    <!-- ==================================================================================== -->
    <!-- VIETNAMESE: KHUNG NỘI DUNG CHÍNH CỦA TRANG QUẢN TRỊ                                   -->
    <!-- ENGLISH: MAIN ADMIN CONTENT BODY                                                     -->
    <!-- ==================================================================================== -->
    <div class="admin-main flex-grow-1 d-flex flex-column bg-light">
      <!-- VIETNAMESE: Thanh trên cùng hiển thị trạng thái và thông tin tài khoản admin -->
      <!-- ENGLISH: Topbar navbar with pending order notifications & admin profile      -->
      <header class="admin-topbar bg-white border-bottom px-4 py-2.5 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <h5 class="fw-bold text-dark mb-0">HỆ THỐNG QUẢN TRỊ CHO THUÊ ĐIỆN THOẠI</h5>
          <span class="badge bg-success-subtle text-success border border-success-subtle">
            <i class="fa fa-circle me-1" style="font-size: 8px;"></i> Hệ thống hoạt động tốt
          </span>
        </div>

        <div class="d-flex align-items-center gap-3">
          <!-- VIETNAMESE: Chuông thông báo số đơn chờ duyệt mới | ENGLISH: Bell notification badge -->
          <router-link to="/admin/don-thue" class="btn btn-light btn-sm position-relative">
            <i class="fa fa-bell-o text-secondary"></i>
            <span v-if="orderStore.pendingOrders.length" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ orderStore.pendingOrders.length }}
            </span>
          </router-link>

          <!-- VIETNAMESE: Thông tin người quản trị đăng nhập | ENGLISH: Admin profile info -->
          <div class="admin-badge d-flex align-items-center gap-2 border-start ps-3">
            <div class="avatar-admin bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold">
              A
            </div>
            <div class="small">
              <strong class="d-block text-dark">Quản Trị Viên</strong>
              <span class="text-muted" style="font-size: 0.72rem;">admin@trongnhanmobile.vn</span>
            </div>
          </div>
        </div>
      </header>

      <!-- VIETNAMESE: Nơi hiển thị view con theo router (AdminDashboard, OrderManagement, PhoneManagement, DepositManagement) -->
      <!-- ENGLISH: Child router view container where nested admin components render -->
      <main class="admin-content-body flex-grow-1 p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT ORDER STORE & PHONE STORE ĐỂ HIỂN THỊ BADGE SỐ LƯỢNG TRÊN MENU
// ENGLISH: IMPORT STORES TO DISPLAY REAL-TIME BADGE COUNTS ON SIDEBAR
// ============================================================================================
import { useOrderStore } from '@/stores/order.store';
import { usePhoneStore } from '@/stores/phone.store';

const orderStore = useOrderStore();
const phoneStore = usePhoneStore();
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS CHO BỐ CỤC QUẢN TRỊ ADMIN VÀ SIDEBAR TỐI MÀU                                */
/* ENGLISH: SCOPED STYLES FOR ADMIN PORTAL SHELL & DARK SIDEBAR                                 */
/* ============================================================================================ */
.admin-wrapper {
  min-height: 100vh;
  width: 100%;
}

.admin-sidebar {
  width: 260px;
  min-width: 260px;
  background-color: #1a2332;
  min-height: 100vh;
  position: sticky;
  top: 0;
}

.brand-logo-circle {
  width: 36px;
  height: 36px;
}

.sidebar-nav .nav-link {
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.sidebar-nav .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff !important;
}

.sidebar-nav .nav-link.active {
  background-color: #0d6efd;
  color: #fff !important;
  font-weight: 600;
}

.avatar-admin {
  width: 34px;
  height: 34px;
  font-size: 0.85rem;
}

.admin-content-body {
  overflow-y: auto;
}
</style>