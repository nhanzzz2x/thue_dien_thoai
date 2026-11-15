<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: TRANG LỊCH SỬ THUÊ & THEO DÕI TIẾN ĐỘ ĐƠN HÀNG DÀNH CHO KHÁCH HÀNG              -->
  <!-- ENGLISH: CUSTOMER RENTAL HISTORY & ORDER WORKFLOW TRACKING PAGE                            -->
  <!-- ERD MAPPING: Ánh xạ DonThue, ChiTietDonThue, DatCoc, HopDong_HoaDon, TrangThai            -->
  <!-- ========================================================================================== -->
  <div class="rental-history-page">
    <Header />
    <NavigationBar />

    <main class="container my-4">
      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: TIÊU ĐỀ TRANG & NÚT THUÊ THÊM THIẾT BỊ                                   -->
      <!-- ENGLISH: PAGE TITLE & ACTION TO RENT MORE DEVICES                                    -->
      <!-- ==================================================================================== -->
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 class="fw-bold text-dark mb-1">
            <i class="fa fa-history text-primary me-2"></i> Lịch Sử Thuê & Quản Lý Đơn Hàng
          </h3>
          <p class="text-muted small mb-0">
            Theo dõi tiến trình duyệt đơn, trạng thái thiết bị đang thuê và thời gian hoàn tất trả cọc.
          </p>
        </div>

        <router-link to="/" class="btn btn-outline-primary btn-sm mt-2 mt-sm-0">
          <i class="fa fa-plus-circle me-1"></i> Thuê thêm thiết bị khác
        </router-link>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: CÁC TAB LỌC TRẠNG THÁI ĐƠN HÀNG NHANH                                    -->
      <!-- ENGLISH: QUICK STATUS FILTER TABS FOR RENTAL ORDERS                                  -->
      <!-- ERD: DonThue.TrangThai (CHO_DUYET, DANG_THUE, HOAN_TAT_TRA_COC...)                   -->
      <!-- ==================================================================================== -->
      <div class="status-tabs-nav d-flex flex-wrap gap-2 mb-4">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="btn btn-tab px-3 py-2 rounded-pill small"
          :class="{ active: currentTab === tab.value }"
          @click="currentTab = tab.value"
        >
          <i class="fa me-1" :class="tab.icon"></i>
          {{ tab.label }}
          <span class="badge bg-secondary ms-1">{{ getTabCount(tab.value) }}</span>
        </button>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: DANH SÁCH THẺ ĐƠN THUÊ (CARD LIST)                                       -->
      <!-- ENGLISH: LIST OF RENTAL ORDER CARDS                                                  -->
      <!-- ERD: Bảng DonThue (MaDonThue, NgayTao, TongTien, TrangThai)                          -->
      <!-- ==================================================================================== -->
      <div v-if="filteredUserOrders.length > 0" class="order-list-wrapper d-flex flex-column gap-3">
        <div
          v-for="order in filteredUserOrders"
          :key="order.maDonThue"
          class="order-card bg-white border rounded-4 p-4 shadow-sm"
        >
          <!-- VIETNAMESE: Phần đầu thẻ đơn thuê - Mã đơn, Ngày tạo và Huy hiệu trạng thái -->
          <!-- ENGLISH: Order Card Header - Order Code, Creation Date & Status Badge        -->
          <div class="d-flex flex-wrap justify-content-between align-items-center pb-3 border-bottom mb-3 gap-2">
            <div>
              <span class="fw-bold fs-6 text-dark me-2">Mã đơn: {{ order.maDonThue }}</span>
              <span class="text-muted small">| Ngày tạo: {{ order.ngayTao }}</span>
            </div>

            <!-- VIETNAMESE: Huy hiệu hiển thị màu sắc theo từng trạng thái vòng đời đơn thuê -->
            <!-- ENGLISH: Dynamic badge color representing order lifecycle state              -->
            <span class="badge px-3 py-2 rounded-pill fs-7 fw-semibold" :class="getStatusBadgeClass(order.trangThai)">
              <i class="fa me-1" :class="getStatusIcon(order.trangThai)"></i>
              {{ getStatusText(order.trangThai) }}
            </span>
          </div>

          <!-- ================================================================================ -->
          <!-- VIETNAMESE: DANH SÁCH THIẾT BỊ TRONG ĐƠN THUÊ NÀY (BẢNG ChiTietDonThue)           -->
          <!-- ENGLISH: LIST OF RENTED PHONES IN THIS ORDER (ChiTietDonThue Table)              -->
          <!-- ERD: ChiTietDonThue (MaDonThue, MaDienThoai, SoLuong, DonGiaNgay, SoIMEI)        -->
          <!-- ================================================================================ -->
          <div class="order-devices mb-3">
            <div
              v-for="device in order.danhSachMay"
              :key="device.maDienThoai"
              class="device-row d-flex align-items-center gap-3 py-2"
            >
              <img :src="device.MacDinh" :alt="device.TenDienThoai" class="device-thumb rounded-3 border p-1" />
              <div class="flex-grow-1">
                <h6 class="fw-bold mb-1">{{ device.TenDienThoai }}</h6>
                <div class="small text-muted d-flex flex-wrap gap-3">
                  <span><i class="fa fa-barcode me-1"></i> IMEI: <strong>{{ device.SoIMEI_Serial }}</strong></span>
                  <span><i class="fa fa-database me-1"></i> {{ device.RAM_ROM }}</span>
                  <span>Số lượng: <strong>x{{ device.quantity }}</strong></span>
                </div>
              </div>
              <div class="text-end">
                <div class="text-danger fw-bold">{{ convertToVND(device.giaThueNgay) }}<small class="text-muted">/ngày</small></div>
                <small class="text-muted d-block">Định mức cọc: {{ convertToVND(device.tienCocYeuCau) }}</small>
              </div>
            </div>
          </div>

          <!-- ================================================================================ -->
          <!-- VIETNAMESE: THỜI HẠN THUÊ & THÔNG TIN TIỀN CỌC / THẾ CHÂN                        -->
          <!-- ENGLISH: RENTAL PERIOD & COLLATERAL / DEPOSIT METRICS                             -->
          <!-- ERD: DonThue.NgayBatDauThue, DonThue.NgayKetThucThue, DatCoc.SoTienCoc            -->
          <!-- ================================================================================ -->
          <div class="rental-terms-box bg-light p-3 rounded-3 mb-3">
            <div class="row g-2 small">
              <div class="col-md-3 col-6">
                <span class="text-muted d-block">Ngày nhận máy:</span>
                <strong><i class="fa fa-calendar-check-o text-success me-1"></i> {{ order.ngayBatDauThue }}</strong>
              </div>
              <div class="col-md-3 col-6">
                <span class="text-muted d-block">Ngày trả máy dự kiến:</span>
                <strong><i class="fa fa-calendar-times-o text-danger me-1"></i> {{ order.ngayKetThucThue }} ({{ order.soNgayThue }} ngày)</strong>
              </div>
              <div class="col-md-3 col-6">
                <span class="text-muted d-block">Hình thức cọc:</span>
                <strong class="text-primary">{{ order.hinhThucCocText }}</strong>
              </div>
              <div class="col-md-3 col-6">
                <span class="text-muted d-block">Tiền cọc thực tế:</span>
                <strong class="text-primary">{{ convertToVND(order.tienCocThucTe) }}</strong>
              </div>
            </div>
          </div>

          <!-- ================================================================================ -->
          <!-- VIETNAMESE: THANH TIẾN ĐỘ 5 BƯỚC MÁY TRẠNG THÁI (STATE MACHINE VISUAL STEPPER)    -->
          <!-- ENGLISH: 5-STEP VISUAL PROGRESS STEPPER FOR ORDER WORKFLOW                       -->
          <!-- LOGIC: CHO_DUYET -> DA_XAC_NHAN_COC -> DANG_THUE -> DA_TRA_MAY -> HOAN_TAT_TRA_COC-->
          <!-- ================================================================================ -->
          <div class="stepper-wrapper py-2 mb-3">
            <div class="stepper d-flex justify-content-between position-relative">
              <div
                v-for="(step, sIdx) in getSteps(order.trangThai)"
                :key="sIdx"
                class="step-item text-center flex-fill position-relative"
                :class="{ active: step.completed, current: step.current }"
              >
                <div class="step-circle mx-auto mb-1">
                  <i class="fa" :class="step.icon"></i>
                </div>
                <span class="step-label d-block small fw-semibold">{{ step.label }}</span>
              </div>
            </div>
          </div>

          <!-- ================================================================================ -->
          <!-- VIETNAMESE: TỔNG KẾT CHI PHÍ & CÁC NÚT THAO TÁC (XEM HỢP ĐỒNG / HỦY ĐƠN)          -->
          <!-- ENGLISH: FINANCIAL SUMMARY & ACTIONS (VIEW CONTRACT / CANCEL ORDER)              -->
          <!-- ================================================================================ -->
          <div class="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top gap-2">
            <div>
              <span class="small text-muted me-2">Tiền thuê: <strong>{{ convertToVND(order.tongTienThue) }}</strong></span>
              <span class="small text-muted me-2">+ Tiền cọc: <strong>{{ convertToVND(order.tienCocThucTe) }}</strong></span>
              <span class="text-dark fw-bold">
                = Tổng ban đầu: <span class="text-danger fs-6">{{ convertToVND(order.tongThanhToanBanDau) }}</span>
              </span>
            </div>

            <div class="d-flex gap-2">
              <!-- Nút mở hợp đồng điện tử pháp lý -->
              <!-- Button to view legally binding electronic contract -->
              <button class="btn btn-outline-secondary btn-sm" @click="viewContract(order)">
                <i class="fa fa-file-text-o me-1"></i> Hợp đồng điện tử
              </button>
              <!-- Nút hủy đơn khi đơn còn ở bước Chờ Duyệt -->
              <!-- Cancel order button only active when order is CHO_DUYET -->
              <button
                v-if="order.trangThai === 'CHO_DUYET'"
                class="btn btn-outline-danger btn-sm"
                @click="cancelOrder(order.maDonThue)"
              >
                <i class="fa fa-times me-1"></i> Hủy đơn
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- VIETNAMESE: Hiển thị khi chưa có đơn nào khớp với bộ lọc -->
      <!-- ENGLISH: Empty state view when no orders match current filter tab -->
      <div v-else class="text-center py-5 bg-white rounded-4 border p-5">
        <i class="fa fa-inbox text-muted fs-1 mb-3"></i>
        <h5 class="fw-bold">Chưa có đơn thuê nào trong mục này</h5>
        <p class="text-muted small">Hãy chọn thiết bị điện thoại cao cấp và tạo đơn thuê ngay hôm nay!</p>
        <router-link to="/" class="btn btn-primary btn-sm">
          <i class="fa fa-search me-1"></i> Khám phá danh sách điện thoại
        </router-link>
      </div>
    </main>

    <!-- ====================================================================================== -->
    <!-- VIETNAMESE: MODAL XEM & IN HỢP ĐỒNG THUÊ THIẾT BỊ ĐIỆN TỬ (HopDong_HoaDon ERD)          -->
    <!-- ENGLISH: ELECTRONIC RENTAL CONTRACT & HANDOVER MODAL (HopDong_HoaDon ERD)             -->
    <!-- ====================================================================================== -->
    <div v-if="selectedOrderForContract" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="modal-dialog-custom bg-white rounded-4 p-4 shadow-lg border" style="max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
          <h5 class="fw-bold mb-0 text-primary">
            <i class="fa fa-certificate me-1"></i> HỢP ĐỒNG THUÊ THIẾT BỊ ĐIỆN TỬ
          </h5>
          <button class="btn-close" @click="selectedOrderForContract = null"></button>
        </div>

        <div class="contract-body small">
          <p class="text-center text-muted mb-2">Số: <strong>HD-{{ selectedOrderForContract.maDonThue }}</strong> &bull; Ngày lập: {{ selectedOrderForContract.ngayTao }}</p>

          <!-- VIETNAMESE: Bên cho thuê (Bên A) | ENGLISH: Lessor (Party A) -->
          <div class="bg-light p-3 rounded-3 mb-3">
            <h6 class="fw-bold mb-1">BÊN CHO THUÊ (BÊN A):</h6>
            <p class="mb-0"><strong>HỆ THỐNG TRONGNHANMOBILE VIỆT NAM (SHOP THUÊ ĐIỆN THOẠI)</strong></p>
            <p class="mb-0"><i class="fa fa-map-marker text-danger me-1"></i> Địa chỉ: <strong>180 Cao Lỗ, Phường 4, Quận 8, TP.HCM</strong> (Cổng trường ĐH Công Nghệ Sài Gòn - STU)</p>
            <p class="mb-0"><i class="fa fa-phone text-primary me-1"></i> Hotline hỗ trợ & Zalo: 0908.123.456</p>
          </div>

          <!-- VIETNAMESE: Bên thuê (Bên B) | ENGLISH: Lessee (Party B) -->
          <div class="bg-light p-3 rounded-3 mb-3">
            <h6 class="fw-bold mb-1">BÊN THUÊ (BÊN B):</h6>
            <p class="mb-0">Khách hàng: <strong>{{ selectedOrderForContract.khachHang.hoTen }}</strong></p>
            <p class="mb-0">SĐT: {{ selectedOrderForContract.khachHang.sdt }} | CCCD: {{ selectedOrderForContract.khachHang.cccd }}</p>
            <p class="mb-0">Địa chỉ nhận thiết bị: {{ selectedOrderForContract.khachHang.diaChi }}</p>
          </div>

          <!-- VIETNAMESE: Điều khoản pháp lý bàn giao & hoàn cọc | ENGLISH: Terms & conditions -->
          <h6 class="fw-bold mb-2">ĐIỀU KHOẢN VÀ THIẾT BỊ THUÊ:</h6>
          <ul class="ps-3 mb-3">
            <li v-for="dev in selectedOrderForContract.danhSachMay" :key="dev.maDienThoai">
              Thiết bị: <strong>{{ dev.TenDienThoai }}</strong> (Mã IMEI: {{ dev.SoIMEI_Serial }})
            </li>
            <li>Thời hạn thuê: Từ ngày <strong>{{ selectedOrderForContract.ngayBatDauThue }}</strong> đến <strong>{{ selectedOrderForContract.ngayKetThucThue }}</strong> ({{ selectedOrderForContract.soNgayThue }} ngày).</li>
            <li>Hình thức thế chân/cọc: <strong>{{ selectedOrderForContract.hinhThucCocText }}</strong> (Số tiền cọc mặt: {{ convertToVND(selectedOrderForContract.tienCocThucTe) }}).</li>
            <li>Bên A cam kết hoàn trả 100% tài sản/tiền cọc trong vòng 5 phút sau khi bên B hoàn trả máy nguyên vẹn.</li>
          </ul>

          <!-- HIỂN THỊ CHỨNG TỪ THẾ CHÂN THEO 3 HÌNH THỨC -->
          <!-- 1. HÌNH THỨC CCCD -->
          <div v-if="selectedOrderForContract.anhCccdMatTruoc || selectedOrderForContract.anhCccdMatSau" class="p-3 bg-light rounded-3 mb-3 border">
            <h6 class="fw-bold text-success mb-2">
              <i class="fa fa-id-card me-1"></i> Hồ Sơ Căn Cước Công Dân (CCCD 2 Mặt Đã Chụp):
            </h6>
            <div class="row g-2 text-center">
              <div class="col-6" v-if="selectedOrderForContract.anhCccdMatTruoc">
                <small class="text-muted d-block mb-1">Mặt trước CCCD</small>
                <img :src="selectedOrderForContract.anhCccdMatTruoc" alt="Mặt trước CCCD" class="img-fluid rounded border shadow-sm" style="max-height: 120px;" />
              </div>
              <div class="col-6" v-if="selectedOrderForContract.anhCccdMatSau">
                <small class="text-muted d-block mb-1">Mặt sau CCCD</small>
                <img :src="selectedOrderForContract.anhCccdMatSau" alt="Mặt sau CCCD" class="img-fluid rounded border shadow-sm" style="max-height: 120px;" />
              </div>
            </div>
          </div>

          <!-- 2. HÌNH THỨC CHUYỂN KHOẢN QR -->
          <div v-if="selectedOrderForContract.hinhThucCoc === 'CHUYEN_KHOAN'" class="p-3 bg-light rounded-3 mb-3 border">
            <h6 class="fw-bold text-primary mb-1">
              <i class="fa fa-qrcode me-1"></i> Giao Dịch Chuyển Khoản Ngân Hàng / VNPay:
            </h6>
            <p class="mb-1 text-muted">Trạng thái: <span class="badge bg-success">Đã xác nhận thanh toán & cọc bảo đảm 100%</span></p>
            <small class="text-muted" v-if="selectedOrderForContract.maGiaoDichQr">Mã giao dịch: <code>{{ selectedOrderForContract.maGiaoDichQr }}</code></small>
          </div>

          <!-- 3. HÌNH THỨC THẾ CHÂN LAPTOP / IPAD / MÁY ẢNH TẠI SHOP -->
          <div v-if="selectedOrderForContract.hinhThucCoc === 'MAY_ANH_MAY_TINH'" class="p-3 bg-warning-subtle rounded-3 mb-3 border border-warning-subtle">
            <h6 class="fw-bold text-warning-emphasis mb-1">
              <i class="fa fa-laptop me-1"></i> Thủ Tục Bàn Giao Thiết Bị Thế Chân Tại Quầy:
            </h6>
            <p class="mb-1 small">Địa chỉ kiểm tra & dán tem niêm phong: <strong>180 Cao Lỗ, Phường 4, Quận 8, TP.HCM</strong> (Cổng trường STU)</p>
            <small class="text-muted d-block">{{ selectedOrderForContract.ghiChuTheChan || 'Khách hàng mang thiết bị đến shop kiểm tra ngoại quan trước khi nhận máy thuê.' }}</small>
          </div>

          <div class="text-end pt-3 border-top">
            <button class="btn btn-secondary btn-sm me-2" @click="selectedOrderForContract = null">Đóng</button>
            <button class="btn btn-primary btn-sm" @click="printContract">
              <i class="fa fa-print me-1"></i> In hợp đồng
            </button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    <CartDrawer />
    <AuthModal />
  </div>
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT CÁC MODULE VUE & STORE ORDER
// ENGLISH: IMPORT VUE HOOKS & ORDER STORE
// ============================================================================================
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useOrderStore } from '@/stores/order.store';
import { convertToVND } from '@/utils/formatters';
import Header from '@/components/Header.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import Footer from '@/components/Footer.vue';
import CartDrawer from '@/components/CartDrawer.vue';
import AuthModal from '@/components/AuthModal.vue';

// Khởi tạo order store và trạng thái tab đang chọn
// Initialize order store and active status filter tab
const orderStore = useOrderStore();
const currentTab = ref('ALL');
const selectedOrderForContract = ref(null);

onMounted(() => {
  orderStore.syncFromStorage();
});

// Danh sách các tab trạng thái đơn thuê
// Status tab list with corresponding icon and ERD state
const statusTabs = [
  { label: 'Tất cả đơn', value: 'ALL', icon: 'fa-list-ul' },
  { label: 'Chờ duyệt', value: 'CHO_DUYET', icon: 'fa-clock-o' },
  { label: 'Đang thuê', value: 'DANG_THUE', icon: 'fa-mobile' },
  { label: 'Đã hoàn tất', value: 'HOAN_TAT_TRA_COC', icon: 'fa-check-circle' }
];

// Hàm đếm số đơn thuộc từng tab
// Function to count number of orders in each tab
const getTabCount = (tabValue) => {
  if (tabValue === 'ALL') return orderStore.orders.length;
  return orderStore.orders.filter(o => o.trangThai === tabValue).length;
};

// ============================================================================================
// VIETNAMESE: DANH SÁCH ĐƠN THUÊ ĐÃ LỌC THEO TAB TRẠNG THÁI
// ENGLISH: FILTERED ORDERS LIST ACCORDING TO CURRENT TAB SELECTION
// ============================================================================================
const filteredUserOrders = computed(() => {
  if (currentTab.value === 'ALL') return orderStore.orders;
  return orderStore.orders.filter(o => o.trangThai === currentTab.value);
});

// ============================================================================================
// VIETNAMESE: ĐỊNH SẮC MÀU HUY HIỆU TRẠNG THÁI (CSS BADGE CLASS)
// ENGLISH: RESOLVE CSS CLASS FOR STATUS BADGE BASED ON ORDER STATE
// ============================================================================================
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'CHO_DUYET': return 'bg-warning text-dark';
    case 'DA_XAC_NHAN_COC': return 'bg-info text-dark';
    case 'DANG_THUE': return 'bg-primary text-white';
    case 'DA_TRA_MAY': return 'bg-secondary text-white';
    case 'HOAN_TAT_TRA_COC': return 'bg-success text-white';
    case 'DA_HUY': return 'bg-danger text-white';
    default: return 'bg-secondary text-white';
  }
};

// ============================================================================================
// VIETNAMESE: BIỂU TƯỢNG (ICON) THEO TRẠNG THÁI
// ENGLISH: FONT-AWESOME ICON FOR EACH STATUS
// ============================================================================================
const getStatusIcon = (status) => {
  switch (status) {
    case 'CHO_DUYET': return 'fa-clock-o';
    case 'DA_XAC_NHAN_COC': return 'fa-money';
    case 'DANG_THUE': return 'fa-mobile';
    case 'DA_TRA_MAY': return 'fa-check';
    case 'HOAN_TAT_TRA_COC': return 'fa-check-circle';
    case 'DA_HUY': return 'fa-times-circle';
    default: return 'fa-info-circle';
  }
};

// ============================================================================================
// VIETNAMESE: CHUYỂN ĐỔI MÃ TRẠNG THÁI THÀNH VĂN BẢN HIỂN THỊ TIẾNG VIỆT
// ENGLISH: TRANSLATE STATUS CODE TO USER-FRIENDLY VIETNAMESE LABEL
// ============================================================================================
const getStatusText = (status) => {
  switch (status) {
    case 'CHO_DUYET': return 'Chờ duyệt cọc';
    case 'DA_XAC_NHAN_COC': return 'Đã nhận cọc - Đang giao';
    case 'DANG_THUE': return 'Khách đang thuê máy';
    case 'DA_TRA_MAY': return 'Đã trả máy - Kiểm định';
    case 'HOAN_TAT_TRA_COC': return 'Hoàn tất & Đã hoàn cọc';
    case 'DA_HUY': return 'Đơn đã bị hủy';
    default: return status;
  }
};

// ============================================================================================
// VIETNAMESE: TÍNH TOÁN 5 BƯỚC TIẾN TRÌNH CHO THANH STEPPER THEO MÁY TRẠNG THÁI
// ENGLISH: CALCULATE 5-STEP LIFECYCLE PROGRESS BASED ON CURRENT ORDER STATUS
// ============================================================================================
const getSteps = (status) => {
  const stepsOrder = ['CHO_DUYET', 'DA_XAC_NHAN_COC', 'DANG_THUE', 'DA_TRA_MAY', 'HOAN_TAT_TRA_COC'];
  const currentIndex = stepsOrder.indexOf(status);

  return [
    {
      label: 'Chờ duyệt',
      icon: 'fa-file-text-o',
      completed: currentIndex >= 0,
      current: currentIndex === 0
    },
    {
      label: 'Xác nhận cọc',
      icon: 'fa-shield',
      completed: currentIndex >= 1,
      current: currentIndex === 1
    },
    {
      label: 'Đang thuê máy',
      icon: 'fa-mobile',
      completed: currentIndex >= 2,
      current: currentIndex === 2
    },
    {
      label: 'Trả máy & Ktra',
      icon: 'fa-wrench',
      completed: currentIndex >= 3,
      current: currentIndex === 3
    },
    {
      label: 'Hoàn tất trả cọc',
      icon: 'fa-check-circle',
      completed: currentIndex >= 4,
      current: currentIndex === 4
    }
  ];
};

// ============================================================================================
// VIETNAMESE: MỞ MODAL XEM CHI TIẾT HỢP ĐỒNG ĐIỆN TỬ
// ENGLISH: OPEN ELECTRONIC CONTRACT MODAL
// ============================================================================================
const viewContract = (order) => {
  selectedOrderForContract.value = order;
};

// Thao tác in hợp đồng
// Print contract action
const printContract = () => {
  window.print();
};

// ============================================================================================
// VIETNAMESE: HỦY ĐƠN THUÊ (Chỉ áp dụng khi đơn đang ở trạng thái CHO_DUYET)
// ENGLISH: CANCEL ORDER ACTION (Only applicable when order is CHO_DUYET)
// ============================================================================================
const cancelOrder = (orderId) => {
  Swal.fire({
    title: 'Xác nhận hủy đơn?',
    text: `Bạn có chắc chắn muốn hủy đơn thuê ${orderId} không?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Đồng ý hủy',
    cancelButtonText: 'Quay lại'
  }).then((result) => {
    if (result.isConfirmed) {
      orderStore.capNhatTrangThai(orderId, 'DA_HUY');
      Swal.fire({
        icon: 'success',
        title: 'Đã hủy đơn!',
        text: 'Đơn thuê của bạn đã được hủy thành công.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
};
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS TÙY CHỈNH CHO TRANG LỊCH SỬ THUÊ & BỘ STEPPER TIẾN ĐỘ                        */
/* ENGLISH: CUSTOM SCOPED STYLES FOR RENTAL HISTORY & STEPPER                                   */
/* ============================================================================================ */
.rental-history-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.btn-tab {
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  color: #495057;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-tab:hover {
  background-color: #f1f5f9;
}

.btn-tab.active {
  background-color: #0d6efd;
  color: #ffffff;
  border-color: #0d6efd;
}

.btn-tab.active .badge {
  background-color: #ffffff !important;
  color: #0d6efd !important;
}

.device-thumb {
  width: 55px;
  height: 55px;
  object-fit: contain;
}

/* Stepper Design */
.stepper::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 5%;
  right: 5%;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f1f5f9;
  border: 2px solid #cbd5e1;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.step-label {
  color: #94a3b8;
  font-size: 0.75rem;
}

.step-item.active .step-circle {
  background-color: #198754;
  border-color: #198754;
  color: #ffffff;
}

.step-item.active .step-label {
  color: #198754;
}

.step-item.current .step-circle {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
}

.step-item.current .step-label {
  color: #0d6efd;
  font-weight: 700 !important;
}

/* Custom modal backdrop */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  z-index: 1050;
  backdrop-filter: blur(4px);
}
</style>