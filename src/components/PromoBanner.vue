<template>
  <!-- ========================================================================================= -->
  <!-- BANNER KHUYẾN MÃI & MÃ GIẢM GIÁ VOUCHER (PROMO CAMPAIGN BANNER)                          -->
  <!-- Ánh xạ ERD: Thực thể `KhuyenMai` (Ưu đãi ngày thuê) & `PhieuKhuyenMai` (Voucher nhập mã)  -->
  <!-- ========================================================================================= -->
  <div class="promo-banner-section my-5">
    <div class="container">
      <div class="promo-card p-4 p-md-5 rounded-4 shadow-sm text-white position-relative overflow-hidden">
        <div class="row align-items-center position-relative z-2">
          
          <!-- Cột bên trái: Giới thiệu ưu đãi và danh sách Voucher có thể sao chép mã -->
          <div class="col-lg-7">
            <span class="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill mb-2">
              <i class="fa fa-gift me-1"></i> CHƯƠNG TRÌNH KHUYẾN MÃI (KhuyenMai & PhieuKhuyenMai)
            </span>
            <h3 class="fw-black mb-3">
              Ưu Đãi Thuê Càng Dài - Giảm Càng Sâu Đến 25%
            </h3>
            <p class="text-slate-100 mb-4" style="font-size: 0.95rem;">
              Hệ thống tự động áp dụng chính sách giảm giá khi đủ số ngày thuê (quan hệ <code>uuDai</code>), 
              hoặc nhập mã voucher độc quyền dành cho khách hàng mới (<code>nhapMa</code>).
            </p>

            <!-- Danh sách các mã Voucher nhập tay (ERD: PhieuKhuyenMai) -->
            <div class="d-flex flex-wrap gap-2">
              <div
                v-for="v in mockVouchers"
                :key="v.Code"
                class="voucher-tag d-flex align-items-center bg-white text-dark rounded-pill px-3 py-1.5 shadow-sm"
              >
                <i class="fa fa-ticket text-danger me-2"></i>
                <!-- Mã code voucher (Code) -->
                <span class="fw-bold me-2">{{ v.Code }}</span>
                <!-- Giá trị giảm (GiaTriGiam) -->
                <small class="text-muted me-2">({{ convertToVND(v.GiaTriGiam) }})</small>
                <!-- Nút sao chép mã vào clipboard -->
                <button
                  class="btn btn-sm btn-link p-0 text-primary fw-bold text-decoration-none"
                  @click="copyCode(v.Code)"
                >
                  Sao chép
                </button>
              </div>
            </div>
          </div>

          <!-- Cột bên phải: Bảng tóm tắt các mức giảm giá tự động theo ngày thuê (ERD: KhuyenMai) -->
          <div class="col-lg-5 text-center mt-4 mt-lg-0">
            <div class="bg-white-10 p-3 rounded-4 backdrop-blur border border-white-20">
              <h6 class="fw-bold text-warning mb-2"><i class="fa fa-percent me-1"></i> BẢNG MỨC GIẢM TỰ ĐỘNG</h6>
              <ul class="text-start small mb-0 space-y-2">
                <!-- Mức 1: Thuê >= 3 ngày giảm 15% tổng tiền thuê -->
                <li class="d-flex justify-content-between py-1 border-bottom border-white-10">
                  <span>Thuê từ 3 ngày trở lên:</span>
                  <strong class="text-warning">Giảm 15% tổng tiền</strong>
                </li>
                <!-- Mức 2: Thuê >= 7 ngày giảm 25% tổng tiền thuê -->
                <li class="d-flex justify-content-between py-1 border-bottom border-white-10">
                  <span>Thuê từ 7 ngày (1 tuần):</span>
                  <strong class="text-warning">Giảm 25% tổng tiền</strong>
                </li>
                <!-- Mức 3: Khách hàng mới (khachMoi = true) -->
                <li class="d-flex justify-content-between py-1">
                  <span>Khách hàng mới (khachMoi):</span>
                  <strong class="text-info">Tặng Voucher 50.000₫</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// =========================================================================================
// KHU VỰC SCRIPT VUE 3: LOGIC BANNER KHUYẾN MÃI
// =========================================================================================

import { mockVouchers } from '@/data/mockData';        // Danh sách voucher mẫu (ERD: PhieuKhuyenMai)
import { convertToVND } from '@/utils/formatters';     // Hàm chuyển đổi số sang tiền VNĐ
import Swal from 'sweetalert2';                        // Popup thông báo

// Hàm sao chép mã voucher vào bộ nhớ tạm (Copy voucher code to clipboard)
const copyCode = (code) => {
  navigator.clipboard.writeText(code);
  Swal.fire({
    title: 'Đã sao chép mã!',
    text: `Mã ${code} đã được lưu vào clipboard. Hãy áp dụng ở bước giỏ hàng!`,
    icon: 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000
  });
};
</script>

<style scoped>
/* Màu nền dải màu gradient công nghệ cao (Tech gradient background) */
.promo-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%);
}

.bg-white-10 {
  background: rgba(255, 255, 255, 0.12);
}

.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.border-white-10 {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.backdrop-blur {
  backdrop-filter: blur(10px);
}
</style>
