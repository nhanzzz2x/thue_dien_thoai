<template>
  <!-- QUẢN LÝ TIỀN CỌC & TÀI SẢN THẾ CHÂN (DEPOSIT & COLLATERAL MANAGEMENT)                      -->
  <!-- Ánh xạ ERD: Thực thể `DatCoc` / `ChiTietPhieuThue` quan hệ 1-1 với `DonThue`             -->
  <div class="deposit-management">
    <!-- Header: Tiêu đề trang & Thống kê tổng tiền cọc đang giữ tại quầy (Total Deposit Holding) -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
      <div>
        <h4 class="fw-bold text-dark mb-1">
          <i class="fa fa-lock text-primary me-2"></i> Quản Lý Tiền Cọc & Tài Sản Thế Chân
        </h4>
        <p class="text-muted small mb-0">
          <!-- Theo dõi két an toàn lưu trữ CCCD, các giao dịch chuyển khoản cọc và tài sản thế chân (Laptop, Thiết bị công nghệ) -->
          Theo dõi két an toàn lưu trữ CCCD, các giao dịch chuyển khoản cọc và tài sản thế chân (Laptop, Thiết bị công nghệ).
        </p>
      </div>

      <!-- Badge tổng tiền mặt cọc cửa hàng đang giữ (ERD: DatCoc.so_tien / DonThue.the_chan) -->
      <div class="d-flex gap-2">
        <span class="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fs-7">
          <i class="fa fa-shield me-1"></i> Tổng tiền cọc đang giữ: <strong>{{ convertToVND(orderStore.totalDepositHolding) }}</strong>
        </span>
      </div>
    </div>

    <!-- 3 THẺ THỐNG KÊ 3 HÌNH THỨC THẾ CHÂN (3 COLLATERAL METHOD STATISTIC CARDS)               -->
    <!-- ERD Field: `DatCoc.phuong_thuc` (GIAY_TO_TUY_THAN, CHUYEN_KHOAN, MAY_ANH_MAY_TINH)     -->
    <div class="row g-3 mb-4">
      <!-- 1. Cọc bằng Căn Cước Công Dân (National ID Card Collateral) -->
      <div class="col-md-4 col-sm-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-circle bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center">
              <i class="fa fa-id-card fs-4"></i>
            </div>
            <div>
              <span class="text-muted small fw-semibold">CCCD Gắn Chip</span>
              <!-- Đếm số hồ sơ cọc CCCD đang giữ (Count ID cards in secure vault) -->
              <h4 class="fw-bold text-dark mb-0">{{ countByMethod('GIAY_TO_TUY_THAN') }} hồ sơ</h4>
              <small class="text-muted">Két bảo mật quầy 1</small>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Cọc Chuyển Khoản Ngân Hàng 100% (Bank Transfer Deposit) -->
      <div class="col-md-4 col-sm-6">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-circle bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center">
              <i class="fa fa-credit-card fs-4"></i>
            </div>
            <div>
              <span class="text-muted small fw-semibold">Cọc Ngân Hàng</span>
              <!-- Đếm số đơn cọc qua tài khoản công ty có TransactionId -->
              <h4 class="fw-bold text-success mb-0">{{ countByMethod('CHUYEN_KHOAN') }} đơn</h4>
              <small class="text-muted">TK MB Bank Cty</small>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Thế chân Laptop / iPad / Máy ảnh (Tech Gadget Physical Collateral) -->
      <div class="col-md-4 col-sm-12">
        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-circle bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center">
              <i class="fa fa-laptop fs-4"></i>
            </div>
            <div>
              <span class="text-muted small fw-semibold">Laptop / iPad</span>
              <!-- Đếm số thiết bị công nghệ thế chân niêm phong thùng -->
              <h4 class="fw-bold text-warning mb-0">{{ countByMethod('MAY_ANH_MAY_TINH') }} máy</h4>
              <small class="text-muted">Niêm phong thùng</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BẢNG THEO DÕI CHI TIẾT TỪNG KHOẢN CỌC (COLLATERAL & DEPOSIT DETAILED TABLE)            -->
    <!-- Ánh xạ các trường: `maDonThue`, `khachHang`, `hinhThucCoc`, `tienCocThucTe`, `trangThai` -->
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle small mb-0">
          <thead class="table-light">
            <tr>
              <!-- Cột 1: Mã đơn thuê (Order ID) -->
              <th>Mã Đơn Thuê</th>
              <!-- Cột 2: Thông tin khách thuê gồm Họ tên, SĐT, Số CCCD (Customer Info) -->
              <th>Khách Hàng (SĐT / CCCD)</th>
              <!-- Cột 3: Phương thức thế chân (Collateral Method: CCCD / Chuyển khoản / Xe / Laptop) -->
              <th>Hình Thức Thế Chân</th>
              <!-- Cột 4: Số tiền cọc thực tế (Actual Cash Deposit Amount - ERD: DatCoc.so_tien) -->
              <th>Giá Trị Tiền Cọc Thực Tế</th>
              <!-- Cột 5: Trạng thái hợp đồng thuê máy (Rental Agreement Status - ERD: TrangThai.trang_thai) -->
              <th>Tình Trạng Hợp Đồng</th>
              <!-- Cột 6: Tình trạng giữ cọc (Deposit Status: Đang giữ hay Đã hoàn trả) -->
              <th>Trạng Thái Cọc</th>
              <!-- Cột 7: Thao tác hoàn trả cọc (Refund Action Button) -->
              <th class="text-end">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <!-- Lặp qua danh sách đơn hàng trong orderStore (Loop through all orders) -->
            <tr v-for="order in orderStore.orders" :key="order.maDonThue">
              <!-- Mã đơn thuê duy nhất (Unique Order Code) -->
              <td class="fw-bold text-primary">{{ order.maDonThue }}</td>

              <!-- Thông tin người thuê (Customer details: Name, Phone, National ID) -->
              <td>
                <strong class="text-dark">{{ order.khachHang.hoTen }}</strong>
                <div class="text-muted" style="font-size: 0.75rem;">
                  {{ order.khachHang.sdt }} &bull; CCCD: {{ order.khachHang.cccd }}
                </div>
              </td>

              <!-- Huy hiệu hình thức thế chân (Badge of Collateral Method) -->
              <td>
                <span class="badge bg-light text-dark border">
                  <i class="fa me-1" :class="getMethodIcon(order.hinhThucCoc)"></i>
                  {{ order.hinhThucCocText }}
                </span>
              </td>

              <!-- Số tiền cọc tiền mặt đã nhận (Actual cash deposit amount) -->
              <td>
                <strong class="text-danger fs-6">{{ convertToVND(order.tienCocThucTe) }}</strong>
              </td>

              <!-- Huy hiệu trạng thái hợp đồng thuê máy (Contract status badge) -->
              <td>
                <span class="badge rounded-pill" :class="getStatusBadgeClass(order.trangThai)">
                  {{ getStatusText(order.trangThai) }}
                </span>
              </td>

              <!-- Kiểm tra trạng thái cọc (Deposit lifecycle check) -->
              <td>
                <!-- 1. Đã hoàn tất và đã trả cọc cho khách (Completed & Refunded) -->
                <span v-if="order.trangThai === 'HOAN_TAT_TRA_COC'" class="text-success fw-bold">
                  <i class="fa fa-check-circle me-1"></i> Đã hoàn trả khách
                </span>
                <!-- 2. Đơn bị hủy (Order Cancelled - No Deposit Held) -->
                <span v-else-if="order.trangThai === 'DA_HUY'" class="text-muted">
                  <i class="fa fa-ban me-1"></i> Không thu cọc
                </span>
                <!-- 3. Đang lưu giữ tài sản hoặc tiền cọc (Currently Holding in Safe Vault) -->
                <span v-else class="text-warning fw-bold">
                  <i class="fa fa-clock-o me-1"></i> Đang lưu giữ tại shop
                </span>
              </td>

              <!-- Cột hành động (Action Buttons) -->
              <td class="text-end">
                <!-- Khi khách đã mang máy đến trả (DA_TRA_MAY), nút Trả Cọc sẽ sáng lên để Admin bấm hoàn tiền -->
                <button
                  v-if="order.trangThai === 'DA_TRA_MAY'"
                  class="btn btn-sm btn-success"
                  @click="quickRefund(order)"
                  title="Bấm để hoàn tất hoàn trả tiền cọc cho khách hàng"
                >
                  <i class="fa fa-money me-1"></i> Trả Cọc Cho Khách
                </button>
                <span v-else class="text-muted small">
                  -
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// KHU VỰC LOGIC JAVASCRIPT / VUE 3 COMPOSITION API (SCRIPT SECTION)

import Swal from 'sweetalert2';                          // Thư viện popup thông báo đẹp mắt (SweetAlert2 popup library)
import { useOrderStore } from '@/stores/order.store';    // Pinia Store quản lý đơn thuê (Pinia Order Store)
import { convertToVND } from '@/utils/formatters';       // Hàm tiện ích định dạng tiền VNĐ (Currency formatter)

// Khởi tạo instance của orderStore (Initialize store instance)
const orderStore = useOrderStore();

// HÀM 1: Đếm số lượng đơn thuê theo hình thức cọc (Count orders by collateral method)
// Tham số: methodId (GIAY_TO_TUY_THAN | CHUYEN_KHOAN | MAY_ANH_MAY_TINH)
const countByMethod = (methodId) => {
  return orderStore.orders.filter(o => o.hinhThucCoc === methodId && o.trangThai !== 'DA_HUY').length;
};

// HÀM 2: Lấy biểu tượng FontAwesome tương ứng với từng hình thức cọc (Get method icon)
const getMethodIcon = (method) => {
  switch (method) {
    case 'GIAY_TO_TUY_THAN': return 'fa-id-card text-primary';      // Biểu tượng thẻ CCCD
    case 'CHUYEN_KHOAN': return 'fa-credit-card text-success';       // Biểu tượng thẻ ngân hàng
    case 'MAY_ANH_MAY_TINH': return 'fa-laptop text-warning';        // Biểu tượng máy tính laptop
    default: return 'fa-shield';
  }
};

// HÀM 3: Gán màu sắc CSS Bootstrap theo mã trạng thái (Get status badge CSS class)
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'CHO_DUYET': return 'bg-warning text-dark';      // Màu vàng: Chờ duyệt cọc
    case 'DA_XAC_NHAN_COC': return 'bg-info text-dark';   // Màu xanh lơ: Đã nhận cọc
    case 'DANG_THUE': return 'bg-primary text-white';     // Màu xanh dương: Đang cho khách thuê
    case 'DA_TRA_MAY': return 'bg-secondary text-white';  // Màu xám: Khách đã mang trả máy
    case 'HOAN_TAT_TRA_COC': return 'bg-success text-white'; // Màu xanh lá: Hoàn tất & Đã trả cọc
    case 'DA_HUY': return 'bg-danger text-white';         // Màu đỏ: Đã hủy đơn
    default: return 'bg-light text-dark';
  }
};

// HÀM 4: Chuyển đổi mã trạng thái tiếng Anh sang tiếng Việt hiển thị (Translate status)
const getStatusText = (status) => {
  switch (status) {
    case 'CHO_DUYET': return 'Chờ duyệt';
    case 'DA_XAC_NHAN_COC': return 'Đã nhận cọc';
    case 'DANG_THUE': return 'Đang thuê';
    case 'DA_TRA_MAY': return 'Đã nhận máy';
    case 'HOAN_TAT_TRA_COC': return 'Hoàn tất';
    case 'DA_HUY': return 'Đã hủy';
    default: return status;
  }
};

// HÀM 5: Thao tác xác nhận hoàn trả cọc nhanh cho khách (Quick refund handler)
// Nghiệp vụ: Chuyển đơn sang trạng thái `HOAN_TAT_TRA_COC`, giải phóng tiền cọc trong két
const quickRefund = (order) => {
  Swal.fire({
    title: 'Xác nhận hoàn cọc?',
    html: `Hoàn trả <b>${convertToVND(order.tienCocThucTe)}</b> và trao trả lại tài sản thế chân cho <b>${order.khachHang.hoTen}</b>?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đã hoàn trả',
    cancelButtonText: 'Hủy'
  }).then((res) => {
    if (res.isConfirmed) {
      // Cập nhật trạng thái đơn sang HOAN_TAT_TRA_COC trong Store
      orderStore.capNhatTrangThai(order.maDonThue, 'HOAN_TAT_TRA_COC', 'Đã hoàn trả đầy đủ tiền cọc cho khách.');
      Swal.fire('Thành công', 'Đã hoàn tất thủ tục trả cọc!', 'success');
    }
  });
};
</script>

<style scoped>
/* Định kích thước khối tròn biểu tượng thống kê (Icon circle container style) */
.icon-circle {
  width: 48px;
  height: 48px;
}
</style>
