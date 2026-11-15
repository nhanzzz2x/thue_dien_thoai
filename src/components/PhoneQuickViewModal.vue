<template>
  <!-- ========================================================================================= -->
  <!-- MODAL XEM NHANH THÔNG SỐ ĐIỆN THOẠI (QUICK VIEW PHONE MODAL)                              -->
  <!-- Ánh xạ ERD: Thực thể `DienThoai` & `CauHinh_PhienBan`                                     -->
  <!-- Cho phép khách xem nhanh camera, pin, chipset, tính nhanh tiền thuê và thêm giỏ hàng       -->
  <!-- ========================================================================================= -->
  <div v-if="phone" class="modal-overlay" @click.self="close">
    <div class="modal-content-custom p-4">
      
      <!-- Nút đóng cửa sổ xem nhanh (Close modal button) -->
      <button class="btn-close-modal" @click="close" title="Đóng cửa sổ">
        <i class="fa fa-times"></i>
      </button>

      <div class="row g-4">
        <!-- =================================================================================== -->
        <!-- CỘT BÊN TRÁI: HÌNH ẢNH SẢN PHẨM & CÁC GÓC CHỤP (IMAGE & GALLERY)                    -->
        <!-- ERD: DienThoai.MacDinh, DienThoai.hinhAnh                                           -->
        <!-- =================================================================================== -->
        <div class="col-md-5 text-center">
          <!-- Ảnh lớn chính đang được chọn hiển thị -->
          <div class="main-img-box p-3 bg-light rounded-4 mb-3">
            <img :src="selectedImg || phone.MacDinh" :alt="phone.TenDienThoai" class="img-fluid quick-img" @error="onImgError" />
          </div>
          <!-- Danh sách ảnh thumbnail các góc máy (Click để đổi ảnh lớn) -->
          <div v-if="phone.hinhAnh?.length > 1" class="d-flex justify-content-center gap-2">
            <img
              v-for="(img, idx) in phone.hinhAnh"
              :key="idx"
              :src="img"
              class="thumb-img rounded-2 border"
              :class="{ active: selectedImg === img }"
              @click="selectedImg = img"
              :alt="`Góc chụp ${idx + 1}`"
              @error="onImgError"
            />
          </div>
        </div>

        <!-- =================================================================================== -->
        <!-- CỘT BÊN PHẢI: THÔNG SỐ KỸ THUẬT, GIÁ THUÊ & NÚT THUÊ (SPECS & ACTIONS)              -->
        <!-- =================================================================================== -->
        <div class="col-md-7">
          <!-- Trạng thái máy & Số IMEI (ERD: DienThoai.TinhTrangMay, DienThoai.SoIMEI_Serial) -->
          <div class="d-flex align-items-center gap-2 mb-2">
            <span
              class="badge-status"
              :class="phone.TinhTrangMay === 'SAN_SANG' ? 'badge-ready' : 'badge-rented'"
            >
              <i class="fa" :class="phone.TinhTrangMay === 'SAN_SANG' ? 'fa-check-circle' : 'fa-clock-o'"></i>
              {{ phone.TinhTrangMayText }}
            </span>
            <span class="badge bg-secondary font-monospace" style="font-size: 0.72rem;">
              IMEI/Serial: {{ phone.SoIMEI_Serial }}
            </span>
          </div>

          <!-- Tên thiết bị và mô tả ngắn (Device name & short description) -->
          <h4 class="fw-bold mb-2">{{ phone.TenDienThoai }}</h4>
          <p class="text-muted small mb-3">{{ phone.moTa }}</p>

          <!-- ================================================================================= -->
          <!-- BẢNG CẤU HÌNH PHIÊN BẢN (ERD: CauHinh_PhienBan)                                   -->
          <!-- ================================================================================= -->
          <div class="specs-table-box bg-light p-3 rounded-3 mb-3">
            <h6 class="fw-bold mb-2 text-primary" style="font-size: 0.85rem;">
              <i class="fa fa-cogs me-1"></i> BẢNG CẤU HÌNH PHIÊN BẢN (CauHinh_PhienBan)
            </h6>
            <div class="row g-2 small">
              <!-- Vi xử lý Chipset -->
              <div class="col-6">
                <strong>Chipset:</strong> {{ phone.cauHinh?.Chipset }}
              </div>
              <!-- Bộ nhớ RAM và ROM -->
              <div class="col-6">
                <strong>RAM / ROM:</strong> {{ phone.cauHinh?.RAM_ROM }}
              </div>
              <!-- Hệ điều hành -->
              <div class="col-6">
                <strong>Hệ điều hành:</strong> {{ phone.cauHinh?.HeDieuHanh }}
              </div>
              <!-- Dung lượng Pin & Công nghệ sạc -->
              <div class="col-6">
                <strong>Pin & Sạc:</strong> {{ phone.cauHinh?.DungLuongPin }}
              </div>
              <!-- Camera và kích thước màn hình -->
              <div class="col-12">
                <strong>Camera & Màn hình:</strong> {{ phone.cauHinh?.ThongSoCamera_Pin }}
              </div>
            </div>
          </div>

          <!-- ================================================================================= -->
          <!-- GIÁ THUÊ & TIỀN CỌC ĐỊNH MỨC (ERD: giaThueNgay & tienCocYeuCau)                   -->
          <!-- ================================================================================= -->
          <div class="row align-items-center p-3 bg-primary-subtle rounded-3 mb-3">
            <!-- Giá thuê ngày -->
            <div class="col-6 border-end">
              <small class="text-muted d-block">Giá thuê theo ngày:</small>
              <span class="fs-5 fw-bold text-danger">
                {{ convertToVND(phone.giaKhuyenMai || phone.giaThueNgay) }}
              </span>
              <span class="small text-muted">/ngày</span>
            </div>
            <!-- Tiền cọc định mức -->
            <div class="col-6 ps-3">
              <small class="text-muted d-block">Định mức tiền cọc (tienCocYeuCau):</small>
              <span class="fs-6 fw-bold text-dark">
                {{ convertToVND(phone.tienCocYeuCau) }}
              </span>
              <span class="d-block text-success fw-semibold" style="font-size: 0.72rem;">
                * Hỗ trợ thế chân bằng CCCD (chỉ cọc 15% tiền mặt)
              </span>
            </div>
          </div>

          <!-- ================================================================================= -->
          <!-- BỘ TÍNH NHANH TIỀN THUÊ THEO SỐ NGÀY (QUICK DAY CALCULATOR)                       -->
          <!-- Tự động tính ưu đãi: 3 ngày giảm 15%, 7 ngày giảm 25% (ERD: KhuyenMai)            -->
          <!-- ================================================================================= -->
          <div class="day-calculator mb-3">
            <label class="form-label small fw-bold">Chọn thử số ngày thuê:</label>
            <div class="btn-group w-100" role="group">
              <button
                type="button"
                class="btn btn-sm"
                :class="calcDays === 1 ? 'btn-primary' : 'btn-outline-primary'"
                @click="calcDays = 1"
              >
                1 ngày
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="calcDays === 3 ? 'btn-primary' : 'btn-outline-primary'"
                @click="calcDays = 3"
              >
                3 ngày (-15%)
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="calcDays === 7 ? 'btn-primary' : 'btn-outline-primary'"
                @click="calcDays = 7"
              >
                7 ngày (-25%)
              </button>
            </div>
            <div class="mt-2 text-end small">
              Ước tính tiền thuê: <strong class="text-danger fs-6">{{ convertToVND(calcTotal) }}</strong>
            </div>
          </div>

          <!-- ================================================================================= -->
          <!-- CÁC NÚT THAO TÁC: THUÊ NGAY & THÊM VÀO SO SÁNH (ACTION BUTTONS)                   -->
          <!-- ================================================================================= -->
          <div class="d-flex gap-2">
            <!-- Nút thuê máy nếu trạng thái là SẴN SÀNG -->
            <button
              v-if="phone.TinhTrangMay === 'SAN_SANG'"
              class="btn btn-primary-smart flex-grow-1 justify-content-center py-2.5"
              @click="addToCart"
            >
              <i class="fa fa-shopping-cart me-1"></i> Thuê thiết bị này ngay
            </button>
            <!-- Nếu máy đang có khách thuê -> Khóa nút -->
            <button
              v-else
              class="btn btn-secondary flex-grow-1"
              disabled
            >
              Thiết bị đang được thuê
            </button>
            <!-- Nút thêm vào danh sách so sánh cấu hình (Toggle compare) -->
            <button class="btn btn-outline-secondary" @click="toggleCompare" title="So sánh cấu hình">
              <i class="fa fa-balance-scale"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// =========================================================================================
// KHU VỰC SCRIPT VUE 3: LOGIC MODAL XEM NHANH ĐIỆN THOẠI
// =========================================================================================

import { ref, computed } from 'vue';
import { usePhoneStore } from '@/stores/phone.store';    // Store quản lý kho máy
import { useCartStore } from '@/stores/cart.store';      // Store quản lý giỏ hàng
import { convertToVND, onImgError } from '@/utils/formatters';       // Định dạng tiền tệ VNĐ & xử lý ảnh lỗi
import Swal from 'sweetalert2';                          // Popup thông báo

const phoneStore = usePhoneStore();
const cartStore = useCartStore();

// Lấy thông tin thiết bị đang mở xem nhanh từ phoneStore
const phone = computed(() => phoneStore.quickViewPhone);
const selectedImg = ref('');                             // Ảnh thumbnail đang được chọn xem
const calcDays = ref(3);                                 // Số ngày thuê đang chọn thử mặc định là 3 ngày

// Hàm tính nhanh tiền thuê dự kiến có áp dụng chiết khấu tự động
const calcTotal = computed(() => {
  if (!phone.value) return 0;
  const rate = phone.value.giaKhuyenMai || phone.value.giaThueNgay;
  const days = calcDays.value;
  let discount = 0;
  if (days >= 7) discount = 0.25;                         // Thuê >= 7 ngày giảm 25%
  else if (days >= 3) discount = 0.15;                    // Thuê >= 3 ngày giảm 15%
  return Math.round(rate * days * (1 - discount));
});

// Hàm đóng cửa sổ xem nhanh
const close = () => {
  phoneStore.closeQuickView();
  selectedImg.value = '';
};

// Hàm thêm máy vào giỏ hàng và hiện thông báo
const addToCart = () => {
  if (phone.value) {
    cartStore.addToCart(phone.value, 1);
    close();
    Swal.fire({
      title: 'Đã thêm vào giỏ thuê!',
      text: `Thiết bị: ${phone.value.TenDienThoai}`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }
};

// Hàm bật/tắt máy này vào bảng so sánh cấu hình
const toggleCompare = () => {
  if (phone.value) {
    phoneStore.toggleCompare(phone.value);
  }
};
</script>

<style scoped>
/* Nút đóng modal tròn góc trên bên phải */
.btn-close-modal {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.btn-close-modal:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.quick-img {
  max-height: 250px;
  object-fit: contain;
}

.thumb-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  padding: 4px;
  cursor: pointer;
  background: #fff;
}

.thumb-img.active {
  border-color: var(--primary) !important;
}
</style>
