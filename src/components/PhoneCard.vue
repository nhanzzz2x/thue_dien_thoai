<template>
  <!-- ========================================================================================= -->
  <!-- THẺ ĐIỆN THOẠI TRONG DANH SÁCH (PHONE CARD ITEM COMPONENT)                                -->
  <!-- Ánh xạ ERD: Thực thể `DienThoai` & quan hệ `coCauHinh` với `CauHinh_PhienBan`             -->
  <!-- ========================================================================================= -->
  <div class="col-xl-3 col-lg-4 col-md-6 col-6 mb-3 mb-md-4">
    <!-- Thẻ bao bọc card: Thêm class 'rented-card' làm mờ nếu máy đang có khách thuê -->
    <div class="phone-card h-100 d-flex flex-column" :class="{ 'rented-card': phone.TinhTrangMay !== 'SAN_SANG' }">
      
      <!-- ===================================================================================== -->
      <!-- KHỐI ẢNH THIẾT BỊ VÀ CÁC HUY HIỆU (IMAGE WRAPPER & BADGES)                            -->
      <!-- ===================================================================================== -->
      <div class="card-img-wrapper position-relative">
        <!-- 1. Huy hiệu trạng thái máy (Device Availability Badge - ERD: DienThoai.TinhTrangMay) -->
        <span
          class="badge-status position-absolute top-2 start-2 z-2"
          :class="phone.TinhTrangMay === 'SAN_SANG' ? 'badge-ready' : 'badge-rented'"
        >
          <i class="fa" :class="phone.TinhTrangMay === 'SAN_SANG' ? 'fa-check-circle' : 'fa-clock-o'"></i>
          {{ phone.TinhTrangMay === 'SAN_SANG' ? `Sẵn sàng (${phone.SoLuong} máy)` : 'Đang thuê' }}
        </span>

        <!-- 2. Huy hiệu HOT nổi bật (Hot Featured Badge) -->
        <span v-if="phone.isHot" class="badge bg-danger position-absolute top-2 end-2 z-2 px-2.5 py-1 rounded-pill">
          <i class="fa fa-fire me-1"></i> HOT
        </span>

        <!-- 3. Ảnh đại diện sản phẩm (Default Product Image - ERD: DienThoai.MacDinh) -->
        <!-- Click vào ảnh sẽ mở modal xem nhanh (Quick View Modal) -->
        <div class="img-container" @click="phoneStore.openQuickView(phone)">
          <img :src="phone.MacDinh" :alt="phone.TenDienThoai" class="product-img" loading="lazy" @error="onImgError" />
        </div>

        <!-- 4. Thanh công cụ nổi khi rê chuột (Floating action buttons: Quick view & Compare) -->
        <div class="quick-hover-actions">
          <!-- Nút 1: Xem nhanh thông số (Quick View) -->
          <button
            class="btn-hover-action"
            title="Xem chi tiết nhanh"
            @click.stop="phoneStore.openQuickView(phone)"
          >
            <i class="fa fa-eye"></i>
          </button>
          <!-- Nút 2: Thêm vào danh sách so sánh cấu hình tối đa 3 máy (Compare) -->
          <button
            class="btn-hover-action"
            :class="{ active: isComparing }"
            title="Thêm vào so sánh cấu hình"
            @click.stop="phoneStore.toggleCompare(phone)"
          >
            <i class="fa fa-balance-scale"></i>
          </button>
        </div>
      </div>

      <!-- ===================================================================================== -->
      <!-- KHỐI NỘI DUNG CHI TIẾT (CARD BODY: TITLE, SPECS, PRICING & ACTIONS)                    -->
      <!-- ===================================================================================== -->
      <div class="card-body-content p-3 d-flex flex-column flex-grow-1">
        <!-- Hãng sản xuất và Hệ điều hành (Brand & OS - ERD: TheLoai.ten_loai, CauHinh.HeDieuHanh) -->
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="text-uppercase fw-bold text-primary font-monospace" style="font-size: 0.75rem;">
            {{ phone.hangSanXuat }}
          </span>
          <span class="text-muted" style="font-size: 0.75rem;">
            <i class="fa fa-barcode me-1"></i> {{ phone.cauHinh?.HeDieuHanh }}
          </span>
        </div>

        <!-- Tên thiết bị (Device Name - ERD: DienThoai.TenDienThoai) -->
        <!-- Bấm vào tên sẽ chuyển hướng sang trang chi tiết PhoneDetailPage.vue -->
        <h6 class="phone-title fw-bold mb-2">
          <router-link :to="'/dien-thoai/' + phone.maDienThoai" class="text-dark text-decoration-none" :title="phone.TenDienThoai">
            {{ phone.TenDienThoai }}
          </router-link>
        </h6>

        <!-- Huy hiệu cấu hình: Chipset & Bộ nhớ (ERD: CauHinh_PhienBan.Chipset, RAM_ROM) -->
        <div class="specs-tags d-flex flex-wrap gap-1 mb-2">
          <span class="badge-chip">
            <i class="fa fa-microchip text-primary me-1"></i> {{ phone.cauHinh?.Chipset }}
          </span>
          <span class="badge-chip">
            <i class="fa fa-database text-warning me-1"></i> {{ phone.cauHinh?.RAM_ROM }}
          </span>
        </div>

        <!-- Thông số Camera & Pin (Camera & Battery Specs - ERD: CauHinh.ThongSoCamera_Pin) -->
        <p class="specs-desc text-muted mb-3" style="font-size: 0.78rem;">
          {{ phone.cauHinh?.ThongSoCamera_Pin }}
        </p>

        <!-- Khối giá thuê và cọc định mức (Pricing block - mt-auto đẩy xuống sát đáy card) -->
        <div class="pricing-box mt-auto pt-2 border-top">
          <!-- 1. Giá thuê theo ngày (Rental Daily Rate - ERD: DienThoai.giaThueNgay & giaKhuyenMai) -->
          <div class="d-flex justify-content-between align-items-baseline mb-1">
            <span class="text-muted" style="font-size: 0.8rem;">Giá thuê ngày:</span>
            <div class="text-end">
              <!-- Giá gốc gạch ngang nếu có giá khuyến mãi -->
              <span v-if="phone.giaKhuyenMai" class="price-original me-1">
                {{ convertToVND(phone.giaThueNgay) }}
              </span>
              <!-- Giá thuê áp dụng thực tế (màu đỏ nổi bật) -->
              <span class="price-current fw-bold text-danger">
                {{ convertToVND(phone.giaKhuyenMai || phone.giaThueNgay) }}
              </span>
              <span class="price-unit">/ngày</span>
            </div>
          </div>

          <!-- 2. Tiền cọc định mức (Required Deposit Standard - ERD: DienThoai.tienCocYeuCau) -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted" style="font-size: 0.78rem;" title="Định mức thế chân trong ERD (tienCocYeuCau)">
              <i class="fa fa-shield text-info me-1"></i> Cọc định mức:
            </span>
            <span class="deposit-amount fw-semibold text-secondary" style="font-size: 0.82rem;">
              {{ convertToVND(phone.tienCocYeuCau) }}
            </span>
          </div>

          <!-- 3. Nút hành động: Xem chi tiết & Thuê ngay (Action Buttons) -->
          <div class="d-flex gap-2 btn-action-group">
            <!-- Nút Xem chi tiết chuyển sang /dien-thoai/:id -->
            <router-link
              :to="'/dien-thoai/' + phone.maDienThoai"
              class="btn btn-outline-secondary btn-sm flex-fill d-flex align-items-center justify-content-center btn-card-action"
              title="Xem thông số kỹ thuật chi tiết"
            >
              <i class="fa fa-info-circle me-1"></i> Chi tiết
            </router-link>

            <!-- Nếu máy SẴN SÀNG -> Cho phép bấm Thuê ngay (Add to cart & Rent) -->
            <button
              v-if="phone.TinhTrangMay === 'SAN_SANG'"
              class="btn btn-primary-smart flex-fill justify-content-center btn-card-action"
              @click="handleRentClick"
            >
              <i class="fa fa-shopping-cart me-1"></i> Thuê ngay
            </button>
            <!-- Nếu máy ĐANG THUÊ -> Nút bị vô hiệu hóa (Disabled button) -->
            <button
              v-else
              class="btn btn-secondary flex-fill btn-sm btn-card-action"
              disabled
            >
              <i class="fa fa-clock-o me-1"></i> Đang thuê
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// =========================================================================================
// KHU VỰC SCRIPT VUE 3 COMPOSITION API (PHONE CARD LOGIC)
// =========================================================================================

import { computed } from 'vue';
import { usePhoneStore } from '@/stores/phone.store';    // Pinia Phone Store
import { useCartStore } from '@/stores/cart.store';      // Pinia Cart Store
import { convertToVND, onImgError } from '@/utils/formatters';       // Hàm chuyển đổi số sang tiền VNĐ & xử lý ảnh lỗi
import Swal from 'sweetalert2';                          // Popup thông báo

// Khai báo Props nhận vào đối tượng điện thoại từ component cha (Home.vue)
const props = defineProps({
  phone: {
    type: Object,
    required: true
  }
});

const phoneStore = usePhoneStore();
const cartStore = useCartStore();

// Kiểm tra xem thiết bị này có đang nằm trong danh sách so sánh cấu hình hay không
const isComparing = computed(() => {
  return phoneStore.compareList.some(p => p.maDienThoai === props.phone.maDienThoai);
});

// Xử lý khi khách bấm nút "Thuê ngay": Thêm máy vào giỏ hàng, mở thanh trượt giỏ thuê và hiện toast thông báo
const handleRentClick = () => {
  cartStore.addToCart(props.phone, 1);
  cartStore.openDrawer();
  Swal.fire({
    title: 'Đã thêm vào danh sách thuê!',
    html: `Đã chọn: <strong>${props.phone.TenDienThoai}</strong><br>Vui lòng xác nhận thời gian thuê và bấm <b>"Xác nhận đặt thuê & Làm hợp đồng"</b> để hoàn tất gửi đơn cho Admin duyệt!`,
    icon: 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
};
</script>

<style scoped>
/* Khung thẻ điện thoại (Card container styles) */
.phone-card {
  background: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.phone-card:hover {
  transform: translateY(-5px);
  border-color: #93c5fd;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.12);
}

.rented-card {
  opacity: 0.85;
  background-color: #fafafa;
}

.card-img-wrapper {
  background: #f8fafc;
  padding: 24px 16px;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.img-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.product-img {
  max-height: 180px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.phone-card:hover .product-img {
  transform: scale(1.06);
}

.top-2 { top: 10px; }
.start-2 { left: 10px; }
.end-2 { right: 10px; }

.quick-hover-actions {
  position: absolute;
  bottom: -45px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  transition: bottom 0.25s ease;
  z-index: 5;
}

.phone-card:hover .quick-hover-actions {
  bottom: 12px;
}

.btn-hover-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffffff;
  color: #334155;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-hover-action:hover, .btn-hover-action.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.phone-title {
  font-size: 0.96rem;
  line-height: 1.35;
  height: 2.7em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.phone-title:hover {
  color: var(--primary);
}

.price-original {
  text-decoration: line-through;
  color: #94a3b8;
  font-size: 0.8rem;
}

.price-current {
  font-size: 1.15rem;
}

.price-unit {
  font-size: 0.75rem;
  color: #64748b;
}

.cursor-pointer {
  cursor: pointer;
}

/* ============================================================================================ */
/* RESPONSIVE CHO MÀN HÌNH ĐIỆN THOẠI (DƯỚI 576PX - 2 CỘT CHUẨN APP THƯƠNG MẠI ĐIỆN TỬ)        */
/* ============================================================================================ */
@media (max-width: 576px) {
  .card-img-wrapper {
    padding: 12px 6px;
  }
  .img-container {
    height: 130px;
  }
  .product-img {
    max-height: 115px;
  }
  .badge-status {
    font-size: 0.65rem;
    padding: 2px 6px;
    top: 6px;
    left: 6px;
  }
  .top-2 { top: 6px; }
  .start-2 { left: 6px; }
  .end-2 { right: 6px; }

  .card-body-content {
    padding: 0.65rem 0.5rem !important;
  }
  .phone-title {
    font-size: 0.82rem;
    line-height: 1.25;
    height: 2.5em;
    margin-bottom: 0.35rem !important;
  }
  .specs-tags {
    gap: 3px !important;
    margin-bottom: 0.35rem !important;
  }
  .badge-chip {
    font-size: 0.62rem;
    padding: 2px 5px;
  }
  .specs-desc {
    display: none; /* Ẩn mô tả dài để các card 2 cột luôn bằng phẳng, thẳng hàng */
  }
  .pricing-box {
    padding-top: 0.35rem !important;
  }
  .price-original {
    font-size: 0.7rem;
  }
  .price-current {
    font-size: 0.95rem;
  }
  .price-unit {
    font-size: 0.7rem;
  }
  .deposit-amount {
    font-size: 0.75rem;
  }
  .btn-action-group {
    gap: 4px !important;
  }
  .btn-card-action {
    font-size: 0.72rem !important;
    padding: 5px 3px !important;
    white-space: nowrap;
  }
  .quick-hover-actions {
    bottom: 6px;
    opacity: 0.9;
  }
  .btn-hover-action {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}
</style>
