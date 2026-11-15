<template>
  <!-- ========================================================================================= -->
  <!-- QUẢN LÝ & DUYỆT ĐƠN THUÊ MÁY (RENTAL ORDER APPROVAL & HANDOVER WORKFLOW)                   -->
  <!-- Ánh xạ ERD: Thực thể `DonThue` (Hợp đồng thuê), `TrangThai` (Tiến trình), `ChiTietDonThue` -->
  <!-- ========================================================================================= -->
  <div class="order-management">
    <!-- Header: Tiêu đề trang & Tóm tắt tổng đơn chờ duyệt (Total orders & Pending orders count) -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
      <div>
        <h4 class="fw-bold text-dark mb-1">
          <i class="fa fa-file-text-o text-primary me-2"></i> Duyệt Đơn Thuê & Xử Lý Bàn Giao Thiết Bị
        </h4>
        <p class="text-muted small mb-0">
          <!-- VI: Vòng đời: Khách đặt đơn -> Nhận cọc/CCCD -> Bàn giao máy -> Kiểm tra máy trả -> Hoàn trả cọc -->
          <!-- EN: Lifecycle: Customer places order -> Receive deposit/ID -> Hand over device -> Inspect returned phone -> Refund deposit -->
          Quy trình: Khách đặt đơn &rarr; Nhận cọc/CCCD &rarr; Bàn giao máy &rarr; Kiểm tra máy trả &rarr; Hoàn trả cọc.
        </p>
      </div>

      <!-- Huy hiệu hiển thị tổng số đơn và số đơn cần xử lý gấp (Summary badges) -->
      <div class="badge bg-light text-dark border px-3 py-2 rounded-pill">
        Tổng số: <strong>{{ orderStore.orders.length }}</strong> đơn &bull;
        Chờ duyệt: <strong class="text-danger">{{ orderStore.pendingOrders.length }}</strong> đơn
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- BỘ LỌC TÌM KIẾM ĐƠN HÀNG (SEARCH AND FILTER BAR)                                        -->
    <!-- Lọc theo: Từ khóa (Mã đơn / Tên khách / SĐT / Số IMEI) và Trạng thái tiến trình        -->
    <!-- ======================================================================================= -->
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
      <div class="row g-2 align-items-center">
        <!-- Ô nhập từ khóa tìm kiếm (Search keyword input: Order code / Customer name / Phone / IMEI) -->
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0"><i class="fa fa-search text-muted"></i></span>
            <input
              type="text"
              class="form-control border-start-0"
              placeholder="Tìm theo mã đơn (DT-...), tên khách, SĐT hoặc số IMEI..."
              v-model="orderStore.searchKeyword"
            />
          </div>
        </div>

        <!-- Dropdown chọn trạng thái đơn cần lọc (Filter by Order Status - ERD: TrangThai) -->
        <div class="col-md-5">
          <select class="form-select" v-model="orderStore.selectedStatusFilter">
            <option value="ALL">Tất cả trạng thái đơn (All Statuses)</option>
            <option value="CHO_DUYET">1. Đang chờ duyệt cọc (Pending Deposit)</option>
            <option value="DA_XAC_NHAN_COC">2. Đã xác nhận cọc (Deposit Confirmed)</option>
            <option value="DANG_THUE">3. Đang giao máy cho khách thuê (Active Rental)</option>
            <option value="DA_TRA_MAY">4. Khách đã mang trả máy (Device Returned)</option>
            <option value="HOAN_TAT_TRA_COC">5. Hoàn tất & Đã trả cọc (Completed & Refunded)</option>
            <option value="DA_HUY">Đã hủy đơn (Cancelled)</option>
          </select>
        </div>

        <!-- Nút đặt lại bộ lọc (Reset filters button) -->
        <div class="col-md-1 text-end">
          <button class="btn btn-outline-secondary w-100" @click="resetFilters" title="Đặt lại bộ lọc">
            <i class="fa fa-refresh"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- BẢNG DANH SÁCH ĐƠN THUÊ THIẾT BỊ (ORDERS TABLE)                                         -->
    <!-- Hiển thị các trường trong ERD: `DonThue`, `NguoiDung`, `ChiTietDonThue`, `TrangThai`     -->
    <!-- ======================================================================================= -->
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle small mb-0">
          <thead class="table-light">
            <tr>
              <!-- Cột 1: Mã đơn & Ngày tạo (Order ID & Created Date - ERD: DonThue.ma_don_thue) -->
              <th>Mã Đơn / Ngày Tạo</th>
              <!-- Cột 2: Thông tin khách hàng (Customer Information - ERD: NguoiDung) -->
              <th>Khách Hàng</th>
              <!-- Cột 3: Danh sách thiết bị thuê & Số IMEI (Devices & IMEI - ERD: ChiTietDonThue) -->
              <th>Thiết Bị Thuê (Mã IMEI)</th>
              <!-- Cột 4: Thời hạn thuê máy (Rental Duration - ERD: DonThue.ngay_thue, ngay_nhan) -->
              <th>Thời Hạn Thuê</th>
              <!-- Cột 5: Tổng tiền thuê và tiền cọc (Rental & Deposit Fees - ERD: DonThue.tong_thue, the_chan) -->
              <th>Tiền Thuê & Cọc</th>
              <!-- Cột 6: Trạng thái hiện tại của đơn (Current Status - ERD: TrangThai) -->
              <th>Trạng Thái</th>
              <!-- Cột 7: Thao tác duyệt đơn theo State Machine (Workflow Action Buttons) -->
              <th class="text-end" style="width: 170px;">Thao Tác Duyệt Đơn</th>
            </tr>
          </thead>
          <tbody>
            <!-- Lặp qua các đơn thỏa mãn bộ lọc (Loop filtered orders) -->
            <tr v-for="order in orderStore.filteredOrders" :key="order.maDonThue">
              <!-- Cột 1: Mã đơn định dạng DT-YYYYMMDD-XXX -->
              <td>
                <div class="fw-bold text-primary">{{ order.maDonThue }}</div>
                <small class="text-muted">{{ order.ngayTao }}</small>
              </td>

              <!-- Cột 2: Họ tên, Số điện thoại và CCCD của khách thuê -->
              <td>
                <strong class="text-dark">{{ order.khachHang.hoTen }}</strong>
                <div class="text-muted" style="font-size: 0.75rem;">
                  <i class="fa fa-phone me-1"></i> {{ order.khachHang.sdt }}
                </div>
                <div class="text-muted" style="font-size: 0.75rem;">
                  <i class="fa fa-id-card me-1"></i> CCCD: {{ order.khachHang.cccd }}
                </div>
              </td>

              <!-- Cột 3: Tên điện thoại và số định danh IMEI/Serial duy nhất -->
              <td>
                <div v-for="device in order.danhSachMay" :key="device.maDienThoai" class="mb-1">
                  <span class="fw-semibold">{{ device.TenDienThoai }}</span>
                  <div class="text-muted font-monospace" style="font-size: 0.75rem;">
                    IMEI: {{ device.SoIMEI_Serial }}
                  </div>
                </div>
              </td>

              <!-- Cột 4: Số ngày thuê và mốc ngày bắt đầu -> ngày kết thúc -->
              <td>
                <strong>{{ order.soNgayThue }} ngày</strong>
                <div class="text-muted" style="font-size: 0.75rem;">
                  {{ order.ngayBatDauThue }} &rarr; {{ order.ngayKetThucThue }}
                </div>
              </td>

              <!-- Cột 5: Bóc tách rõ tiền thuê (Doanh thu) và tiền cọc (Thế chân) -->
              <td>
                <div class="text-danger fw-bold">Thuê: {{ convertToVND(order.tongTienThue) }}</div>
                <div class="text-primary small">Cọc: {{ convertToVND(order.tienCocThucTe) }}</div>
                <small class="text-muted" style="font-size: 0.72rem;">({{ order.hinhThucCocText }})</small>
              </td>

              <!-- Cột 6: Badge trạng thái hiển thị màu sắc trực quan -->
              <td>
                <span class="badge rounded-pill" :class="getStatusBadgeClass(order.trangThai)">
                  {{ getStatusText(order.trangThai) }}
                </span>
              </td>

              <!-- Cột 7: Nút hành động tương ứng với từng giai đoạn trong State Machine -->
              <td class="text-end">
                <div class="d-flex flex-column gap-1 align-items-end">
                  <!-- BƯỚC 1: Nếu đơn mới đặt (CHO_DUYET) -> Bấm Duyệt Cọc (Confirm Deposit) -->
                  <button
                    v-if="order.trangThai === 'CHO_DUYET'"
                    class="btn btn-warning btn-sm w-100 fw-semibold"
                    @click="confirmDeposit(order)"
                  >
                    <i class="fa fa-check me-1"></i> Duyệt Cọc
                  </button>

                  <!-- BƯỚC 2: Nếu đã nhận cọc (DA_XAC_NHAN_COC) -> Bấm Bàn Giao Máy (Handover Phone) -->
                  <button
                    v-else-if="order.trangThai === 'DA_XAC_NHAN_COC'"
                    class="btn btn-primary btn-sm w-100 fw-semibold"
                    @click="handoverPhone(order)"
                  >
                    <i class="fa fa-mobile me-1"></i> Giao Máy
                  </button>

                  <!-- BƯỚC 3: Nếu máy đang cho thuê (DANG_THUE) -> Khi khách đến trả, bấm Nhận Trả Máy (Receive Return) -->
                  <button
                    v-else-if="order.trangThai === 'DANG_THUE'"
                    class="btn btn-info text-white btn-sm w-100 fw-semibold"
                    @click="receiveReturnedPhone(order)"
                  >
                    <i class="fa fa-undo me-1"></i> Nhận Trả Máy
                  </button>

                  <!-- BƯỚC 4: Nếu đã nhận lại máy (DA_TRA_MAY) -> Bấm Hoàn Trả Cọc để hoàn tất (Refund Deposit) -->
                  <button
                    v-else-if="order.trangThai === 'DA_TRA_MAY'"
                    class="btn btn-success btn-sm w-100 fw-semibold"
                    @click="completeAndRefund(order)"
                  >
                    <i class="fa fa-money me-1"></i> Hoàn Trả Cọc
                  </button>

                  <!-- BƯỚC 5: Đã hoàn tất và đóng hợp đồng thành công (Fully Completed) -->
                  <span v-else-if="order.trangThai === 'HOAN_TAT_TRA_COC'" class="text-success small fw-semibold">
                    <i class="fa fa-check-circle me-1"></i> Đã hoàn tất
                  </span>

                  <!-- Nút xem chi tiết đơn thuê và lịch sử tiến trình (View Details Modal) -->
                  <button class="btn btn-light btn-sm border w-100" @click="viewOrderDetails(order)">
                    <i class="fa fa-eye me-1"></i> Xem chi tiết
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Trạng thái trống khi không tìm thấy đơn (Empty State) -->
      <div v-if="orderStore.filteredOrders.length === 0" class="text-center py-5 text-muted">
        <i class="fa fa-inbox fs-2 mb-2"></i>
        <p class="mb-0">Không tìm thấy đơn thuê nào theo tiêu chí tìm kiếm.</p>
      </div>
    </div>

    <!-- ======================================================================================= -->
    <!-- MODAL XEM CHI TIẾT ĐƠN & BIÊN BẢN NGHIỆM THU (ORDER DETAIL & INSPECTION MODAL)          -->
    <!-- Ánh xạ ERD: Thực thể `HopDong_GiaoNhan`, `PhieuHoanTra`, `ChiTietDonThue`                -->
    <!-- ======================================================================================= -->
    <div v-if="selectedOrder" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="modal-dialog-custom bg-white rounded-4 p-4 shadow-lg border" style="max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
          <h5 class="fw-bold mb-0 text-dark">
            <i class="fa fa-info-circle text-primary me-1"></i> Chi Tiết Đơn Thuê: {{ selectedOrder.maDonThue }}
          </h5>
          <button class="btn-close" @click="selectedOrder = null"></button>
        </div>

        <!-- Khối 1: Thông tin khách hàng (Customer Information Card) -->
        <div class="bg-light p-3 rounded-3 mb-3 small">
          <h6 class="fw-bold text-dark mb-2">THÔNG TIN KHÁCH HÀNG</h6>
          <div class="row g-2">
            <div class="col-sm-6">Họ tên: <strong>{{ selectedOrder.khachHang.hoTen }}</strong></div>
            <div class="col-sm-6">SĐT: <strong>{{ selectedOrder.khachHang.sdt }}</strong></div>
            <div class="col-sm-6">CCCD: <strong>{{ selectedOrder.khachHang.cccd }}</strong></div>
            <div class="col-sm-6">Email: <strong>{{ selectedOrder.khachHang.email }}</strong></div>
            <div class="col-12">Địa chỉ: <strong>{{ selectedOrder.khachHang.diaChi }}</strong></div>
          </div>
        </div>

        <!-- Khối 2: Danh sách thiết bị và tiền cọc (Devices & Deposit Breakdown) -->
        <div class="bg-light p-3 rounded-3 mb-3 small">
          <h6 class="fw-bold text-dark mb-2">THIẾT BỊ ĐIỆN THOẠI THUÊ</h6>
          <div v-for="dev in selectedOrder.danhSachMay" :key="dev.maDienThoai" class="d-flex justify-content-between border-bottom pb-2 mb-2">
            <div>
              <strong>{{ dev.TenDienThoai }}</strong>
              <div class="text-muted">IMEI/Serial: <span class="font-monospace text-primary">{{ dev.SoIMEI_Serial }}</span></div>
            </div>
            <div class="text-end">
              <span class="text-danger fw-bold">{{ convertToVND(dev.giaThueNgay) }}/ngày</span>
              <div class="text-muted">Cọc: {{ convertToVND(dev.tienCocYeuCau) }}</div>
            </div>
          </div>
          <div class="d-flex justify-content-between pt-1">
            <span>Thời gian thuê: <strong>{{ selectedOrder.soNgayThue }} ngày</strong> ({{ selectedOrder.ngayBatDauThue }} &rarr; {{ selectedOrder.ngayKetThucThue }})</span>
          </div>
          <div class="d-flex justify-content-between pt-1 text-primary fw-bold">
            <span>Hình thức cọc: {{ selectedOrder.hinhThucCocText }}</span>
            <span>Tiền cọc: {{ convertToVND(selectedOrder.tienCocThucTe) }}</span>
          </div>
        </div>

        <!-- Khối 3: Nhật ký tiến trình đơn (Audit Trail & Status History Log) -->
        <div class="mb-3 small">
          <h6 class="fw-bold text-dark mb-2">NHẬT KÝ TIẾN TRÌNH ĐƠN</h6>
          <ul class="list-group list-group-flush border rounded-3">
            <li v-for="(log, idx) in selectedOrder.lichSuTrangThai" :key="idx" class="list-group-item">
              <div class="d-flex justify-content-between">
                <strong>{{ log.title }}</strong>
                <small class="text-muted">{{ log.time }}</small>
              </div>
              <small class="text-muted">{{ log.desc }}</small>
            </li>
          </ul>
        </div>

        <div class="text-end pt-2 border-top">
          <button class="btn btn-secondary btn-sm" @click="selectedOrder = null">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// =========================================================================================
// KHU VỰC SCRIPT COMPOSITION API CHO QUẢN TRỊ DUYỆT ĐƠN
// =========================================================================================

import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';                          // Thư viện hộp thoại thông báo
import { useOrderStore } from '@/stores/order.store';    // Quản lý trạng thái đơn hàng (Order Store)
import { usePhoneStore } from '@/stores/phone.store';    // Quản lý kho máy để đổi trạng thái máy (Phone Store)
import { convertToVND } from '@/utils/formatters';       // Định dạng tiền VNĐ

const orderStore = useOrderStore();
const phoneStore = usePhoneStore();
const selectedOrder = ref(null);                         // Đơn hàng đang được chọn xem chi tiết

onMounted(() => {
  orderStore.syncFromStorage();
});

// Hàm đặt lại bộ lọc tìm kiếm (Reset filters)
const resetFilters = () => {
  orderStore.searchKeyword = '';
  orderStore.selectedStatusFilter = 'ALL';
};

// Gán màu sắc cho từng trạng thái (Status badge styling)
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

// Dịch mã trạng thái sang tiếng Việt (Status text translation)
const getStatusText = (status) => {
  switch (status) {
    case 'CHO_DUYET': return 'Chờ duyệt cọc';
    case 'DA_XAC_NHAN_COC': return 'Đã xác nhận cọc';
    case 'DANG_THUE': return 'Đang cho thuê';
    case 'DA_TRA_MAY': return 'Khách đã trả máy';
    case 'HOAN_TAT_TRA_COC': return 'Hoàn tất & Hoàn cọc';
    case 'DA_HUY': return 'Đã hủy đơn';
    default: return status;
  }
};

// Mở modal xem chi tiết đơn (Open detail modal)
const viewOrderDetails = (order) => {
  selectedOrder.value = order;
};

// =========================================================================================
// QUY TRÌNH 1: DUYỆT CỌC (CONFIRM DEPOSIT)
// Chuyển trạng thái đơn từ `CHO_DUYET` -> `DA_XAC_NHAN_COC`
// =========================================================================================
const confirmDeposit = (order) => {
  Swal.fire({
    title: 'Xác nhận nhận cọc?',
    html: `Đã nhận cọc cho đơn <b>${order.maDonThue}</b> qua hình thức:<br><b>${order.hinhThucCocText}</b> (Số tiền: ${convertToVND(order.tienCocThucTe)})?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận đã cọc',
    cancelButtonText: 'Quay lại'
  }).then((res) => {
    if (res.isConfirmed) {
      orderStore.capNhatTrangThai(order.maDonThue, 'DA_XAC_NHAN_COC', 'Nhân viên cửa hàng đã nhận đầy đủ cọc/CCCD');
      Swal.fire('Thành công', 'Đã chuyển đơn sang trạng thái ĐÃ XÁC NHẬN CỌC.', 'success');
    }
  });
};

// =========================================================================================
// QUY TRÌNH 2: BÀN GIAO THIẾT BỊ (HANDOVER PHONE)
// Chuyển đơn sang `DANG_THUE` & Tự động đổi trạng thái máy trong kho sang `DANG_THUE`
// =========================================================================================
const handoverPhone = (order) => {
  Swal.fire({
    title: 'Bàn giao thiết bị cho khách?',
    text: `Khách hàng ${order.khachHang.hoTen} đã nhận máy và ký hợp đồng thuê? Hệ thống sẽ đổi trạng thái máy sang ĐANG THUÊ.`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Đã giao máy',
    cancelButtonText: 'Quay lại'
  }).then((res) => {
    if (res.isConfirmed) {
      orderStore.capNhatTrangThai(order.maDonThue, 'DANG_THUE', 'Bàn giao máy nguyên tem kèm phụ kiện');
      // Đổi trạng thái thiết bị trong kho sang DANG_THUE (ERD: DienThoai.TinhTrangMay = 'DANG_THUE')
      order.danhSachMay.forEach(m => {
        phoneStore.setPhoneStatus(m.maDienThoai, 'DANG_THUE');
      });
      Swal.fire('Thành công', 'Đã bắt đầu tính thời gian thuê.', 'success');
    }
  });
};

// =========================================================================================
// QUY TRÌNH 3: TIẾP NHẬN TRẢ MÁY & KIỂM TRA NGOẠI QUAN (RECEIVE RETURNED PHONE)
// Chuyển đơn sang `DA_TRA_MAY` & Giải phóng máy trong kho về lại `SAN_SANG` (Sẵn sàng)
// =========================================================================================
const receiveReturnedPhone = (order) => {
  Swal.fire({
    title: 'Tiếp nhận trả máy & Kiểm tra',
    input: 'text',
    inputLabel: 'Ghi chú kiểm tra ngoại quan máy (màn hình, viền, camera, tem ốc):',
    inputValue: 'Máy nguyên vẹn 100%, không trầy xước, tem niêm phong nguyên vẹn.',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận nhận máy',
    cancelButtonText: 'Hủy'
  }).then((res) => {
    if (res.isConfirmed) {
      orderStore.capNhatTrangThai(order.maDonThue, 'DA_TRA_MAY', res.value || 'Máy nguyên vẹn');
      // Giải phóng máy về trạng thái SAN_SANG để khách hàng khác có thể thuê
      order.danhSachMay.forEach(m => {
        phoneStore.setPhoneStatus(m.maDienThoai, 'SAN_SANG');
      });
      Swal.fire('Đã nhận máy', 'Đã lưu kết quả kiểm tra ngoại quan. Vui lòng hoàn cọc cho khách.', 'success');
    }
  });
};

// =========================================================================================
// QUY TRÌNH 4: HOÀN TRẢ CỌC & HOÀN TẤT ĐƠN (REFUND DEPOSIT & COMPLETE)
// Chuyển đơn sang `HOAN_TAT_TRA_COC` -> Đóng hợp đồng thành công
// =========================================================================================
const completeAndRefund = (order) => {
  Swal.fire({
    title: 'Hoàn trả cọc & Hoàn tất đơn?',
    html: `Hoàn trả lại <b>${convertToVND(order.tienCocThucTe)}</b> hoặc tài sản/CCCD cho khách hàng <b>${order.khachHang.hoTen}</b>?`,
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Đã trả cọc xong',
    cancelButtonText: 'Hủy'
  }).then((res) => {
    if (res.isConfirmed) {
      orderStore.capNhatTrangThai(order.maDonThue, 'HOAN_TAT_TRA_COC', 'Đã hoàn trả 100% tiền cọc và tài sản thế chân cho khách hàng.');
      Swal.fire('Hoàn tất', 'Hợp đồng thuê đã hoàn thành xuất sắc!', 'success');
    }
  });
};
</script>

<style scoped>
/* Nền tối mờ của Modal (Modal backdrop styling) */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}
</style>
