<template>
  <!-- ========================================================================================= -->
  <!-- MODAL BẢNG SO SÁNH CẤU HÌNH ĐIỆN THOẠI (DEVICE COMPARISON MODAL)                           -->
  <!-- Ánh xạ ERD: So sánh trực tiếp giữa các thực thể `DienThoai` & `CauHinh_PhienBan`           -->
  <!-- Người dùng có thể chọn tối đa 3 máy để đối chiếu thông số, giá thuê và tiền cọc             -->
  <!-- ========================================================================================= -->
  <div v-if="phoneStore.isCompareModalOpen" class="modal-overlay" @click.self="phoneStore.isCompareModalOpen = false">
    <div class="modal-content-custom p-4" style="max-width: 950px;">
      
      <!-- ===================================================================================== -->
      <!-- PHẦN 1: TIÊU ĐỀ BẢNG SO SÁNH & CÁC NÚT ĐIỀU KHIỂN (HEADER & CONTROLS)                   -->
      <!-- ===================================================================================== -->
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div class="d-flex align-items-center gap-2">
          <i class="fa fa-balance-scale text-primary fs-4"></i>
          <div>
            <h5 class="fw-bold mb-0">Bảng So Sánh Cấu Hình Thiết Bị (Device Comparison)</h5>
            <small class="text-muted">Đối chiếu trực quan Chipset, RAM/ROM, Camera/Pin, Giá thuê & Tiền cọc</small>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <!-- Nút Xóa tất cả các máy đang chọn so sánh -->
          <button class="btn btn-sm btn-outline-danger" @click="phoneStore.clearCompare">
            <i class="fa fa-trash me-1"></i> Xóa tất cả so sánh
          </button>
          <!-- Nút đóng cửa sổ so sánh (Dấu X) -->
          <button class="btn-close-modal position-static" @click="phoneStore.isCompareModalOpen = false">
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>

      <!-- ===================================================================================== -->
      <!-- PHẦN 2: TRƯỜNG HỢP CHƯA CHỌN MÁY NÀO (EMPTY STATE)                                      -->
      <!-- ===================================================================================== -->
      <div v-if="phoneStore.compareList.length === 0" class="text-center py-5">
        <i class="fa fa-info-circle text-muted fs-1 mb-2"></i>
        <p class="text-muted">Chưa có thiết bị nào trong danh sách so sánh. Vui lòng bấm biểu tượng cái cân trên thẻ điện thoại để thêm!</p>
      </div>

      <!-- ===================================================================================== -->
      <!-- PHẦN 3: BẢNG ĐỐI CHIẾU CẤU HÌNH THEO HÀNG (COMPARISON TABLE)                            -->
      <!-- ===================================================================================== -->
      <div v-else class="table-responsive">
        <table class="table table-bordered align-middle text-center compare-table">
          <!-- Hàng tiêu đề: Ảnh và Tên các điện thoại đang so sánh (Product Image & Name) -->
          <thead class="table-light">
            <tr>
              <th style="width: 20%;" class="text-start">Tiêu chí đối chiếu</th>
              <th
                v-for="phone in phoneStore.compareList"
                :key="phone.maDienThoai"
                style="width: 26%;"
              >
                <div class="position-relative">
                  <!-- Nút xóa riêng máy này ra khỏi bảng so sánh -->
                  <button
                    class="btn btn-sm btn-light position-absolute top-0 end-0 rounded-circle"
                    style="width: 24px; height: 24px; padding: 0;"
                    @click="phoneStore.removeFromCompare(phone.maDienThoai)"
                    title="Xóa máy này khỏi bảng so sánh"
                  >
                    &times;
                  </button>
                  <!-- Ảnh đại diện của máy (ERD: DienThoai.MacDinh) -->
                  <img :src="phone.MacDinh" :alt="phone.TenDienThoai" class="compare-thumb mx-auto mb-2" @error="onImgError" />
                  <!-- Tên điện thoại (ERD: DienThoai.TenDienThoai) -->
                  <div class="fw-bold small px-2">{{ phone.TenDienThoai }}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- HÀNG 1: VI XỬ LÝ / CHIP CỦA MÁY (ERD: CauHinh_PhienBan.Chipset) -->
            <tr>
              <td class="text-start fw-bold bg-light">
                <i class="fa fa-microchip text-primary me-2"></i> Vi xử lý (Chipset)
              </td>
              <td v-for="phone in phoneStore.compareList" :key="phone.maDienThoai">
                <span class="badge-chip">{{ phone.cauHinh?.Chipset }}</span>
              </td>
            </tr>

            <!-- HÀNG 2: BỘ NHỚ RAM VÀ BỘ NHỚ TRONG (ERD: CauHinh_PhienBan.RAM_ROM) -->
            <tr>
              <td class="text-start fw-bold bg-light">
                <i class="fa fa-database text-warning me-2"></i> Bộ nhớ (RAM/ROM)
              </td>
              <td v-for="phone in phoneStore.compareList" :key="phone.maDienThoai">
                <strong class="text-dark">{{ phone.cauHinh?.RAM_ROM }}</strong>
              </td>
            </tr>

            <!-- HÀNG 3: HỆ ĐIỀU HÀNH iOS / Android (ERD: CauHinh_PhienBan.HeDieuHanh) -->
            <tr>
              <td class="text-start fw-bold bg-light">
                <i class="fa fa-cogs text-secondary me-2"></i> Hệ điều hành (HĐH)
              </td>
              <td v-for="phone in phoneStore.compareList" :key="phone.maDienThoai">
                {{ phone.cauHinh?.HeDieuHanh }}
              </td>
            </tr>

            <!-- HÀNG 4: THÔNG SỐ CAMERA VÀ DUNG LƯỢNG PIN (ERD: CauHinh_PhienBan.ThongSoCamera_Pin) -->
            <tr>
              <td class="text-start fw-bold bg-light">
                <i class="fa fa-camera text-info me-2"></i> Camera & Dung Lượng Pin
              </td>
              <td v-for="phone in phoneStore.compareList" :key="phone.maDienThoai" class="small text-muted">
                {{ phone.cauHinh?.ThongSoCamera_Pin }}
              </td>
            </tr>

            <!-- HÀNG 5: GIÁ THUÊ THEO NGÀY (ERD: DienThoai.giaThueNgay & giaKhuyenMai) -->
            <tr>
              <td class="text-start fw-bold bg-light">
                <i class="fa fa-tag text-danger me-2"></i> Giá thuê theo ngày
              </td>
              <td v-for="phone in phoneStore.compareList" :key="phone.maDienThoai">
                <span class="fw-bold text-danger fs-6">
                  {{ convertToVND(phone.giaKhuyenMai || phone.giaThueNgay) }}
                </span>
                <span class="small text-muted">/ngày</span>
              </td>
            </tr>

            <!-- HÀNG 6: ĐỊNH MỨC TIỀN CỌC THẾ CHÂN (ERD: DienThoai.tienCocYeuCau) -->
            <tr>
              <td class="text-start fw-bold bg-light">
                <i class="fa fa-shield text-success me-2"></i> Định mức tiền đặt cọc
              </td>
              <td v-for="phone in phoneStore.compareList" :key="phone.maDienThoai">
                <span class="fw-semibold text-secondary">
                  {{ convertToVND(phone.tienCocYeuCau) }}
                </span>
              </td>
            </tr>

            <!-- HÀNG 7: TÌNH TRẠNG THIẾT BỊ TRONG KHO (ERD: DienThoai.TinhTrangMay: SAN_SANG / DANG_THUE) -->
            <tr>
              <td class="text-start fw-bold bg-light">
                <i class="fa fa-info-circle me-2"></i> Tình trạng máy trong kho
              </td>
              <td v-for="phone in phoneStore.compareList" :key="phone.maDienThoai">
                <span
                  class="badge-status"
                  :class="phone.TinhTrangMay === 'SAN_SANG' ? 'badge-ready' : 'badge-rented'"
                >
                  {{ phone.TinhTrangMayText }}
                </span>
              </td>
            </tr>

            <!-- HÀNG 8: NÚT HÀNH ĐỘNG THUÊ MÁY (ACTION BUTTONS: RENT THIS PHONE) -->
            <tr>
              <td class="text-start fw-bold bg-light">Hành động</td>
              <td v-for="phone in phoneStore.compareList" :key="phone.maDienThoai">
                <!-- Nếu máy sẵn sàng -> Cho phép bấm Thuê máy này để đưa vào giỏ hàng -->
                <button
                  v-if="phone.TinhTrangMay === 'SAN_SANG'"
                  class="btn btn-sm btn-primary-smart"
                  @click="rentFromCompare(phone)"
                >
                  <i class="fa fa-shopping-cart me-1"></i> Thuê máy này
                </button>
                <!-- Nếu máy đang có người thuê -> Khóa nút -->
                <button v-else class="btn btn-sm btn-secondary" disabled>Đang có khách thuê</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// =========================================================================================
// KHU VỰC SCRIPT VUE 3: XỬ LÝ LOGIC BẢNG SO SÁNH
// =========================================================================================

import { usePhoneStore } from '@/stores/phone.store';    // Store quản lý kho điện thoại và danh sách so sánh
import { useCartStore } from '@/stores/cart.store';      // Store quản lý giỏ thuê
import { convertToVND, onImgError } from '@/utils/formatters';       // Hàm tiện ích định dạng tiền Việt Nam & xử lý ảnh lỗi
import Swal from 'sweetalert2';                          // Popup thông báo

const phoneStore = usePhoneStore();
const cartStore = useCartStore();

// Hàm xử lý khi người dùng bấm nút "Thuê máy này" từ bảng so sánh
// Nghiệp vụ: Thêm máy vào giỏ hàng cartStore, đóng modal so sánh và mở ngăn kéo giỏ hàng
const rentFromCompare = (phone) => {
  cartStore.addToCart(phone, 1);
  phoneStore.isCompareModalOpen = false;
  cartStore.isDrawerOpen = true;

  Swal.fire({
    title: 'Đã chọn thiết bị!',
    text: `Đã đưa ${phone.TenDienThoai} vào danh sách thuê.`,
    icon: 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000
  });
};
</script>

<style scoped>
/* Chiều cao và cách hiển thị ảnh trong ô so sánh */
.compare-thumb {
  height: 90px;
  object-fit: contain;
}

/* Kiểu dáng đường viền bảng so sánh */
.compare-table th, .compare-table td {
  padding: 10px 12px;
  font-size: 0.86rem;
}
</style>
