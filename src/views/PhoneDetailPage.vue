<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: TRANG CHI TIẾT ĐIỆN THOẠI & TÍNH PHÍ THUÊ / CỌC TRỰC QUAN                      -->
  <!-- ENGLISH: PHONE DETAIL PAGE & LIVE RENTAL / DEPOSIT COST CALCULATOR                         -->
  <!-- ERD MAPPING: Ánh xạ thực thể DienThoai, CauHinh_PhienBan, DatCoc, ChiTietDonThue           -->
  <!-- ========================================================================================== -->
  <div class="phone-detail-page">
    <Header />
    <NavigationBar />

    <main class="container my-4">
      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: THANH ĐIỀU HƯỚNG BREADCRUMB                                              -->
      <!-- ENGLISH: BREADCRUMB NAVIGATION BAR                                                   -->
      <!-- ==================================================================================== -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb py-2 px-3 bg-light rounded-3 small">
          <li class="breadcrumb-item">
            <router-link to="/"><i class="fa fa-home me-1"></i>Trang chủ</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/">Thiết bị cho thuê</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page" v-if="phone">
            {{ phone.TenDienThoai }}
          </li>
        </ol>
      </nav>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: KHUNG HIỂN THỊ CHI TIẾT SẢN PHẨM & TÍNH TOÁN                             -->
      <!-- ENGLISH: MAIN PRODUCT DISPLAY & RENTAL CALCULATION CONTAINER                         -->
      <!-- ERD: Bảng DienThoai (MaDienThoai, TenDienThoai, TinhTrangMay, TienCocYeuCau)        -->
      <!-- ==================================================================================== -->
      <div v-if="phone" class="bg-white rounded-4 shadow-sm border p-4 mb-4">
        <div class="row g-4">
          <!-- ================================================================================ -->
          <!-- VIETNAMESE: CỘT TRÁI - ALBUM ẢNH & CHÍNH SÁCH BẢO ĐẢM HOÀN CỌC                    -->
          <!-- ENGLISH: LEFT COLUMN - PHOTO GALLERY & COLLATERAL / DEPOSIT GUARANTEE POLICY     -->
          <!-- ================================================================================ -->
          <div class="col-lg-5">
            <div class="product-gallery">
              <!-- VIETNAMESE: Khung ảnh chính kèm huy hiệu trạng thái sẵn sàng hay đang cho thuê -->
              <!-- ENGLISH: Main image viewport with real-time availability badge                -->
              <div class="main-image-box border rounded-4 p-3 text-center position-relative mb-3 bg-light">
                <span
                  class="badge-status position-absolute top-3 start-3"
                  :class="phone.TinhTrangMay === 'SAN_SANG' ? 'badge-ready' : 'badge-rented'"
                >
                  <i class="fa" :class="phone.TinhTrangMay === 'SAN_SANG' ? 'fa-check-circle' : 'fa-clock-o'"></i>
                  {{ phone.TinhTrangMay === 'SAN_SANG' ? `Sẵn sàng (${phone.SoLuong} máy)` : 'Đang cho thuê' }}
                </span>

                <img
                  :src="activeImage || phone.MacDinh"
                  :alt="phone.TenDienThoai"
                  class="img-fluid main-img"
                  @error="onImgError"
                />
              </div>

              <!-- VIETNAMESE: Danh sách ảnh thu nhỏ để người dùng chọn xem góc chụp khác -->
              <!-- ENGLISH: Thumbnails carousel to view multi-angle device photos       -->
              <div class="thumbnail-list d-flex gap-2 justify-content-center">
                <div
                  v-for="(img, idx) in phoneImages"
                  :key="idx"
                  class="thumb-item border rounded-3 p-1 cursor-pointer"
                  :class="{ active: (activeImage || phone.MacDinh) === img }"
                  @click="activeImage = img"
                >
                  <img :src="img" :alt="phone.TenDienThoai" class="thumb-img" @error="onImgError" />
                </div>
              </div>

              <!-- VIETNAMESE: Hộp cam kết bảo đảm hoàn cọc minh bạch cho khách thuê       -->
              <!-- ENGLISH: Collateral Commitment & 100% Refund Guarantee Box              -->
              <!-- ERD: Minh chứng cho quy trình quản lý thực thể DatCoc (Deposit Entity)  -->
              <div class="collateral-alert mt-4 p-3 rounded-3 bg-primary-subtle border border-primary-subtle">
                <h6 class="fw-bold text-primary mb-2">
                  <i class="fa fa-shield me-1"></i> Chính sách bảo đảm & Hoàn cọc
                </h6>
                <ul class="mb-0 small text-secondary ps-3">
                  <li>Thiết bị chính hãng nguyên tem bảo hành niêm phong.</li>
                  <li>Hỗ trợ cọc linh hoạt bằng CCCD gắn chip (chỉ cọc 15% tiền mặt).</li>
                  <li>Hoàn trả 100% tiền cọc ngay khi bàn giao lại máy nguyên vẹn.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- ================================================================================ -->
          <!-- VIETNAMESE: CỘT PHẢI - THÔNG SỐ KỸ THUẬT & BỘ TÍNH TIỀN THUÊ TỰ ĐỘNG             -->
          <!-- ENGLISH: RIGHT COLUMN - HARDWARE SPECS & DYNAMIC RENTAL FEE CALCULATOR           -->
          <!-- ERD: Ánh xạ CauHinh_PhienBan & DonThue (TongTien, NgayBatDauThue, NgayKetThuc)   -->
          <!-- ================================================================================ -->
          <div class="col-lg-7">
            <div class="ps-lg-3">
              <!-- VIETNAMESE: Hãng sản xuất, Mã thiết bị & Số IMEI/Serial thực tế                -->
              <!-- ENGLISH: Brand badge, Device ID & Unique IMEI/Serial identification            -->
              <!-- ERD: DienThoai.HangSanXuat, DienThoai.MaDienThoai, DienThoai.SoIMEI_Serial     -->
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-primary text-uppercase px-2 py-1">{{ phone.hangSanXuat }}</span>
                <span class="badge bg-light text-dark border">Mã thiết bị: #{{ phone.maDienThoai }}</span>
                <span class="text-muted small ms-auto">
                  <i class="fa fa-barcode me-1"></i> IMEI: <strong>{{ phone.SoIMEI_Serial }}</strong>
                </span>
              </div>

              <h3 class="fw-bold text-dark mb-2">{{ phone.TenDienThoai }}</h3>

              <!-- VIETNAMESE: Thẻ tóm tắt cấu hình phần cứng (Chip, RAM/ROM, Màn hình, Pin)     -->
              <!-- ENGLISH: Hardware summary badges (Chipset, RAM/ROM, Display, Battery)          -->
              <!-- ERD: Thuộc tính từ bảng CauHinh_PhienBan                                       -->
              <div class="specs-tags d-flex flex-wrap gap-2 mb-3">
                <span class="badge bg-light text-dark border px-2.5 py-1.5" title="Chipset vi xử lý">
                  <i class="fa fa-microchip text-primary me-1"></i> {{ phone.cauHinh?.Chipset }}
                </span>
                <span class="badge bg-light text-dark border px-2.5 py-1.5" title="RAM & Dung lượng lưu trữ">
                  <i class="fa fa-database text-warning me-1"></i> {{ phone.cauHinh?.RAM_ROM }}
                </span>
                <span class="badge bg-light text-dark border px-2.5 py-1.5" title="Kích thước & độ phân giải màn hình">
                  <i class="fa fa-desktop text-info me-1"></i> {{ phone.cauHinh?.KichThuocManHinh }}
                </span>
                <span class="badge bg-light text-dark border px-2.5 py-1.5" title="Dung lượng pin">
                  <i class="fa fa-battery-full text-success me-1"></i> {{ phone.cauHinh?.DungLuongPin }}
                </span>
              </div>

              <!-- ============================================================================ -->
              <!-- VIETNAMESE: BẢNG GIÁ THUÊ & ĐỊNH MỨC CỌC TIÊU CHUẨN                          -->
              <!-- ENGLISH: DAILY RENTAL RATE & STANDARD COLLATERAL BENCHMARK                   -->
              <!-- ERD: DienThoai.GiaThueNgay & DienThoai.TienCocYeuCau                         -->
              <!-- ============================================================================ -->
              <div class="price-banner p-3 rounded-3 bg-light border mb-4">
                <div class="row align-items-center">
                  <div class="col-sm-6 border-end-sm">
                    <small class="text-muted d-block">Giá thuê thiết bị:</small>
                    <div class="d-flex align-items-baseline gap-2">
                      <span v-if="phone.giaKhuyenMai" class="text-decoration-line-through text-muted fs-6">
                        {{ convertToVND(phone.giaThueNgay) }}
                      </span>
                      <h4 class="text-danger fw-bold mb-0">
                        {{ convertToVND(phone.giaKhuyenMai || phone.giaThueNgay) }}
                      </h4>
                      <small class="text-muted">/ngày</small>
                    </div>
                  </div>
                  <div class="col-sm-6 ps-sm-3 mt-2 mt-sm-0">
                    <small class="text-muted d-block">Định mức đặt cọc tiêu chuẩn:</small>
                    <span class="fs-6 fw-bold text-primary">
                      {{ convertToVND(phone.tienCocYeuCau) }}
                    </span>
                    <small class="text-muted d-block" style="font-size: 0.75rem;">
                      (Tùy chọn giảm cọc khi giữ CCCD hoặc tài sản thế chân)
                    </small>
                  </div>
                </div>
              </div>

              <!-- ============================================================================ -->
              <!-- VIETNAMESE: BỘ CÔNG CỤ TÍNH TIỀN THUÊ & THẾ CHÂN TƯƠNG TÁC TRỰC QUAN         -->
              <!-- ENGLISH: INTERACTIVE RENTAL & COLLATERAL FEE CALCULATOR                      -->
              <!-- ERD: DonThue.NgayBatDauThue, DonThue.NgayKetThucThue, DatCoc.PhuongThuc      -->
              <!-- ============================================================================ -->
              <div class="rental-calculator-card border rounded-3 p-3 mb-4 bg-white">
                <h6 class="fw-bold text-dark mb-3">
                  <i class="fa fa-calendar text-primary me-1"></i> Chọn thời gian thuê máy:
                </h6>

                <!-- VIETNAMESE: Chọn ngày nhận và ngày trả máy -->
                <!-- ENGLISH: Date picker for rental period    -->
                <div class="row g-2 mb-3">
                  <div class="col-sm-6">
                    <label class="form-label small text-muted mb-1">Ngày nhận máy:</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="cartStore.startDate"
                      :min="todayStr"
                    />
                  </div>
                  <div class="col-sm-6">
                    <label class="form-label small text-muted mb-1">Ngày trả máy:</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="cartStore.endDate"
                      :min="cartStore.startDate"
                    />
                  </div>
                </div>

                <!-- VIETNAMESE: Chọn hình thức thế chân (CCCD, Tiền mặt, Thiết bị công nghệ) -->
                <!-- ENGLISH: Collateral Method Picker (ID Card, 100% Cash, Tech Assets)                -->
                <!-- ERD: DatCoc.PhuongThuc & ChiTietPhieuThue                                        -->
                <div class="mb-3">
                  <label class="form-label small text-muted mb-1">Hình thức đặt cọc / thế chân:</label>
                  <select class="form-select" v-model="cartStore.selectedDepositMethod">
                    <option value="GIAY_TO_TUY_THAN">Căn Cước Công Dân (Giảm 85% cọc, chỉ cọc 15% tiền mặt)</option>
                    <option value="CHUYEN_KHOAN">Chuyển khoản 100% định mức (Hoàn tiền 5 phút khi trả máy)</option>
                    <option value="MAY_ANH_MAY_TINH">Thế chân Laptop / iPad / Máy ảnh (Miễn 100% cọc tiền)</option>
                  </select>
                </div>

                <!-- VIETNAMESE: Bảng chiết tính chi phí minh bạch theo ngày và mức ưu đãi tự động -->
                <!-- ENGLISH: Live breakdown of rental duration, discounts and cash collateral    -->
                <!-- LOGIC: Thuê >= 3 ngày giảm 15%, thuê >= 7 ngày giảm 25% (KhuyenMai)          -->
                <div class="p-3 bg-light rounded-3 border">
                  <div class="d-flex justify-content-between small mb-1">
                    <span>Thời gian thuê:</span>
                    <strong>{{ cartStore.rentalDays }} ngày</strong>
                  </div>
                  <div class="d-flex justify-content-between small mb-1">
                    <span>Tiền thuê gốc:</span>
                    <span>{{ convertToVND(currentDailyPrice * cartStore.rentalDays) }}</span>
                  </div>
                  <div v-if="discountPercent > 0" class="d-flex justify-content-between small text-success mb-1">
                    <span>Ưu đãi thuê dài hạn ({{ discountPercent }}%):</span>
                    <span>-{{ convertToVND(discountAmount) }}</span>
                  </div>
                  <div class="d-flex justify-content-between small mb-1">
                    <span>Tiền thuê thực tế:</span>
                    <strong class="text-danger">{{ convertToVND(itemRentalTotal) }}</strong>
                  </div>
                  <div class="d-flex justify-content-between small pt-2 border-top">
                    <span>Tiền cọc cần chuẩn bị:</span>
                    <strong class="text-primary">{{ convertToVND(calculatedDeposit) }}</strong>
                  </div>
                  <hr class="my-2" />
                  <div class="d-flex justify-content-between align-items-baseline">
                    <span class="fw-bold">Tổng thanh toán ban đầu:</span>
                    <span class="fs-5 fw-bold text-danger">
                      {{ convertToVND(itemRentalTotal + calculatedDeposit) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- ============================================================================ -->
              <!-- VIETNAMESE: NÚT THAO TÁC - THÊM VÀO GIỎ THUÊ HOẶC THUÊ NGAY LẬP TỨC           -->
              <!-- ENGLISH: ACTION BUTTONS - ADD TO RENTAL CART OR RENT NOW                     -->
              <!-- ============================================================================ -->
              <div class="d-flex gap-3">
                <button
                  class="btn btn-outline-primary btn-lg flex-fill d-flex align-items-center justify-content-center gap-2"
                  @click="handleAddToCart"
                  :disabled="phone.TinhTrangMay !== 'SAN_SANG'"
                >
                  <i class="fa fa-cart-plus"></i> Thêm vào giỏ thuê
                </button>
                <button
                  class="btn btn-primary btn-lg flex-fill d-flex align-items-center justify-content-center gap-2"
                  @click="handleRentNow"
                  :disabled="phone.TinhTrangMay !== 'SAN_SANG'"
                >
                  <i class="fa fa-bolt"></i> Thuê ngay lập tức
                </button>
              </div>

              <!-- VIETNAMESE: Cảnh báo khi thiết bị đang được khách khác thuê                 -->
              <!-- ENGLISH: Warning notice when device is currently rented out                -->
              <div v-if="phone.TinhTrangMay !== 'SAN_SANG'" class="alert alert-warning mt-3 mb-0 small text-center">
                <i class="fa fa-info-circle me-1"></i> Thiết bị này hiện đang được khách hàng khác thuê. Quý khách vui lòng chọn máy khác hoặc liên hệ hotline để đặt lịch trước.
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================================ -->
        <!-- VIETNAMESE: BẢNG CHI TIẾT THÔNG SỐ KỸ THUẬT PHẦN CỨNG                              -->
        <!-- ENGLISH: COMPREHENSIVE HARDWARE SPECIFICATIONS TABLE                             -->
        <!-- ERD: Ánh xạ 100% cấu trúc thực thể CauHinh_PhienBan                              -->
        <!-- ================================================================================ -->
        <div class="mt-4 pt-4 border-top">
          <h5 class="fw-bold text-dark mb-3">Mô tả chi tiết & Thông số kỹ thuật</h5>
          <p class="text-muted leading-relaxed mb-4">{{ phone.moTa }}</p>

          <div class="table-responsive">
            <table class="table table-bordered table-striped small">
              <tbody>
                <tr>
                  <th style="width: 200px;">Hãng sản xuất</th>
                  <td>{{ phone.hangSanXuat }}</td>
                </tr>
                <tr>
                  <th>Hệ điều hành</th>
                  <td>{{ phone.cauHinh?.HeDieuHanh }}</td>
                </tr>
                <tr>
                  <th>Chipset (Vi xử lý)</th>
                  <td>{{ phone.cauHinh?.Chipset }}</td>
                </tr>
                <tr>
                  <th>Bộ nhớ RAM & Bộ nhớ trong</th>
                  <td>{{ phone.cauHinh?.RAM_ROM }}</td>
                </tr>
                <tr>
                  <th>Màn hình</th>
                  <td>{{ phone.cauHinh?.KichThuocManHinh }}</td>
                </tr>
                <tr>
                  <th>Dung lượng Pin & Sạc</th>
                  <td>{{ phone.cauHinh?.DungLuongPin }}</td>
                </tr>
                <tr>
                  <th>Thông số Camera</th>
                  <td>{{ phone.cauHinh?.ThongSoCamera_Pin }}</td>
                </tr>
                <tr>
                  <th>Mã IMEI / Serial</th>
                  <td>{{ phone.SoIMEI_Serial }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- VIETNAMESE: Trạng thái không tìm thấy sản phẩm khi URL truyền sai ID -->
      <!-- ENGLISH: Empty fallback state when product ID is invalid or deleted -->
      <div v-else class="text-center py-5 bg-white rounded-4 border p-5">
        <i class="fa fa-exclamation-triangle text-warning fs-1 mb-3"></i>
        <h4 class="fw-bold">Không tìm thấy thiết bị</h4>
        <p class="text-muted">Mã điện thoại bạn đang tìm không tồn tại hoặc đã được gỡ khỏi danh sách.</p>
        <router-link to="/" class="btn btn-primary">
          <i class="fa fa-arrow-left me-1"></i> Quay lại trang chủ
        </router-link>
      </div>
    </main>

    <Footer />
    <CartDrawer />
    <AuthModal />
  </div>
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT CÁC MODULE VUE & STORE QUẢN LÝ DỮ LIỆU
// ENGLISH: IMPORT VUE CORE LIBS & DATA STORES
// ============================================================================================
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { usePhoneStore } from '@/stores/phone.store';
import { useCartStore } from '@/stores/cart.store';
import { convertToVND, onImgError } from '@/utils/formatters';
import Header from '@/components/Header.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import Footer from '@/components/Footer.vue';
import CartDrawer from '@/components/CartDrawer.vue';
import AuthModal from '@/components/AuthModal.vue';

// Khởi tạo các hook định tuyến và pinia stores
// Initialize vue-router and pinia stores
const route = useRoute();
const router = useRouter();
const phoneStore = usePhoneStore();
const cartStore = useCartStore();

// Quản lý ảnh xem trước và mốc thời gian tối thiểu (hôm nay)
// Active preview image and minimum selectable date
const activeImage = ref('');
const todayStr = new Date().toISOString().split('T')[0];

// ============================================================================================
// VIETNAMESE: LẤY THÔNG TIN ĐIỆN THOẠI HIỆN TẠI TỪ PHONE STORE THEO ROUTE ID
// ENGLISH: RETRIEVE TARGET PHONE OBJECT FROM PHONE STORE VIA URL PARAM ID
// ERD: SELECT * FROM DienThoai JOIN CauHinh_PhienBan WHERE MaDienThoai = ?
// ============================================================================================
const phone = computed(() => {
  return phoneStore.getPhoneById(route.params.id);
});

// Danh sách các ảnh chụp sản phẩm
// Product photos list for gallery view
const phoneImages = computed(() => {
  if (!phone.value) return [];
  if (phone.value.hinhAnh && phone.value.hinhAnh.length) {
    return phone.value.hinhAnh;
  }
  return [phone.value.MacDinh];
});

// Giá thuê theo ngày thực tế (Ưu tiên giá khuyến mãi nếu có)
// Effective daily rental fee (prioritize promotional rate if available)
const currentDailyPrice = computed(() => {
  if (!phone.value) return 0;
  return phone.value.giaKhuyenMai || phone.value.giaThueNgay;
});

// ============================================================================================
// VIETNAMESE: TÍNH % CHIẾT KHẤU THUÊ DÀI HẠN THEO SỐ NGÀY THUÊ
// ENGLISH: DYNAMIC DISCOUNT PERCENTAGE BASED ON RENTAL DURATION
// LOGIC: Thuê từ 3 ngày trở lên giảm 15%, thuê từ 7 ngày trở lên giảm 25% (Bảng KhuyenMai)
// ============================================================================================
const discountPercent = computed(() => {
  const days = cartStore.rentalDays;
  if (days >= 7) return 25;
  if (days >= 3) return 15;
  return 0;
});

// Số tiền được giảm giá theo thời gian thuê
// Discount monetary amount
const discountAmount = computed(() => {
  const total = currentDailyPrice.value * cartStore.rentalDays;
  return Math.round(total * (discountPercent.value / 100));
});

// Tổng tiền thuê thực tế sau khi trừ chiết khấu
// Net rental total after deducting discount amount
const itemRentalTotal = computed(() => {
  const total = currentDailyPrice.value * cartStore.rentalDays;
  return total - discountAmount.value;
});

// ============================================================================================
// VIETNAMESE: TÍNH TOÁN TIỀN CỌC MẶT THEO HÌNH THỨC THẾ CHÂN ĐÃ CHỌN
// ENGLISH: CALCULATE CASH COLLATERAL BASED ON SELECTED COLLATERAL METHOD
// ERD: Ánh xạ quy tắc bảo đảm thực thể DatCoc (Deposit Entity)
// - GIAY_TO_TUY_THAN: Giữ CCCD gắn chip -> chỉ thu 15% tiền mặt
// - CHUYEN_KHOAN: Thu đủ 100% định mức cọc
// - MAY_ANH_MAY_TINH: Thế chấp tài sản giá trị tương đương -> Miễn 100% tiền cọc
// ============================================================================================
const calculatedDeposit = computed(() => {
  if (!phone.value) return 0;
  const base = phone.value.tienCocYeuCau;
  switch (cartStore.selectedDepositMethod) {
    case 'GIAY_TO_TUY_THAN':
      return Math.round(base * 0.15);
    case 'CHUYEN_KHOAN':
      return base;
    case 'MAY_ANH_MAY_TINH':
      return 0;
    default:
      return base;
  }
});

// Thao tác thêm máy vào giỏ hàng và mở thanh trượt giỏ thuê
// Handle add to cart action and open side drawer
const handleAddToCart = () => {
  if (!phone.value) return;
  cartStore.addToCart(phone.value, 1);
  cartStore.isDrawerOpen = true;
};

// Thao tác thuê ngay lập tức
// Handle rent immediately action
const handleRentNow = () => {
  if (!phone.value) return;
  cartStore.addToCart(phone.value, 1);
  cartStore.isDrawerOpen = true;
};
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS TÙY CHỈNH CHO TRANG CHI TIẾT SẢN PHẨM & ALBUM ẢNH                           */
/* ENGLISH: CUSTOM SCOPED STYLES FOR PRODUCT DETAIL & GALLERY                                   */
/* ============================================================================================ */
.phone-detail-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-image-box {
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-img {
  max-height: 300px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-img:hover {
  transform: scale(1.05);
}

.thumb-item {
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.thumb-item.active {
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
}

.thumb-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.badge-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge-ready {
  background: rgba(25, 135, 84, 0.15);
  color: #198754;
  border: 1px solid rgba(25, 135, 84, 0.3);
}

.badge-rented {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.cursor-pointer {
  cursor: pointer;
}

/* ============================================================================================ */
/* VIETNAMESE: TỐI ƯU GIAO DIỆN TRANG CHI TIẾT KHI XEM TRÊN ĐIỆN THOẠI DI ĐỘNG                */
/* ============================================================================================ */
@media (max-width: 768px) {
  .phone-detail-page main.container {
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 10px !important;
  }

  .main-image-box {
    min-height: 220px;
    padding: 10px !important;
  }

  .main-img {
    max-height: 200px;
  }

  .phone-detail-page h3 {
    font-size: 1.25rem;
  }

  .specs-tags .badge {
    font-size: 0.72rem;
    padding: 4px 8px;
  }

  .price-banner {
    padding: 10px !important;
  }

  .rental-calculator-card {
    padding: 12px !important;
  }
}
</style>