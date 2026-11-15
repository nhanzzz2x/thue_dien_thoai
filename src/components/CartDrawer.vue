<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: THANH TRƯỢT GIỎ THUÊ & TẠO ĐƠN HÀNG HỢP ĐỒNG (GIAO DIỆN KHÁCH HÀNG - GIAI ĐOẠN 1) -->
  <!-- ENGLISH: RENTAL CART SIDE DRAWER & ORDER CONTRACT CREATION (CLIENT UI - PHASE 1)          -->
  <!-- ERD MAPPING: Ánh xạ GioHang, DonThue, ChiTietDonThue, DatCoc, PhieuKhuyenMai               -->
  <!-- ========================================================================================== -->
  <div v-if="cartStore.isDrawerOpen" class="cart-drawer-overlay" @click.self="cartStore.closeDrawer">
    <div class="cart-drawer-panel p-4 d-flex flex-column">
      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: TIÊU ĐỀ GIỎ THUÊ & NÚT ĐÓNG                                              -->
      <!-- ENGLISH: DRAWER HEADER & CLOSE BUTTON                                                -->
      <!-- ==================================================================================== -->
      <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
        <div class="d-flex align-items-center gap-2">
          <i class="fa fa-shopping-bag text-primary fs-4"></i>
          <div>
            <h5 class="fw-bold mb-0">Đơn Thuê Điện Thoại (GioHang & DonThue)</h5>
            <small class="text-muted">{{ cartStore.totalItems }} thiết bị trong danh sách</small>
          </div>
        </div>
        <button class="btn-close-modal position-static" @click="cartStore.closeDrawer">
          <i class="fa fa-times"></i>
        </button>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: HIỂN THỊ KHI GIỎ HÀNG TRỐNG                                              -->
      <!-- ENGLISH: EMPTY CART STATE VIEW                                                       -->
      <!-- ==================================================================================== -->
      <div v-if="cartStore.items.length === 0" class="flex-grow-1 text-center py-5">
        <div class="empty-cart-icon mb-3">
          <i class="fa fa-shopping-basket text-muted"></i>
        </div>
        <h6 class="fw-bold text-muted">Chưa có thiết bị nào trong đơn thuê</h6>
        <p class="small text-muted mb-4">Vui lòng chọn điện thoại từ danh sách để tiếp tục</p>
        <button class="btn btn-primary-smart" @click="cartStore.closeDrawer">
          Khám phá điện thoại ngay
        </button>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: NỘI DUNG GIỎ THUÊ (CHỌN NGÀY, DANH SÁCH MÁY, CỌC, VOUCHER)                -->
      <!-- ENGLISH: DRAWER BODY (DATES, DEVICES LIST, COLLATERAL PICKER, VOUCHER)               -->
      <!-- ==================================================================================== -->
      <div v-else class="drawer-body flex-grow-1 overflow-y-auto pe-2">
        <!-- ================================================================================ -->
        <!-- VIETNAMESE: CHỌN KHOẢNG THỜI GIAN THUÊ THIẾT BỊ                                  -->
        <!-- ENGLISH: RENTAL DURATION DATE SELECTION                                          -->
        <!-- ERD: DonThue.NgayBatDauThue & DonThue.NgayKetThucThue                            -->
        <!-- ================================================================================ -->
        <div class="date-picker-box bg-light p-3 rounded-3 mb-3 border">
          <label class="form-label small fw-bold mb-2">
            <i class="fa fa-calendar text-primary me-1"></i> Thời gian thuê (NgayBatDauThue &ndash; NgayKetThucThue):
          </label>
          <div class="row g-2">
            <!-- Ngày nhận máy -->
            <div class="col-6">
              <small class="text-muted d-block">Ngày nhận máy:</small>
              <input type="date" class="form-control form-control-sm" v-model="cartStore.startDate" />
            </div>
            <!-- Ngày trả máy -->
            <div class="col-6">
              <small class="text-muted d-block">Ngày trả máy:</small>
              <input type="date" class="form-control form-control-sm" v-model="cartStore.endDate" />
            </div>
          </div>
          <!-- Tổng số ngày thuê được tự động tính toán -->
          <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
            <span class="small text-muted">Tổng số ngày thuê:</span>
            <span class="badge bg-primary fs-6">{{ cartStore.rentalDays }} ngày</span>
          </div>
        </div>

        <!-- ================================================================================ -->
        <!-- VIETNAMESE: DANH SÁCH THIẾT BỊ ĐÃ CHỌN (ChiTietDonThue)                           -->
        <!-- ENGLISH: SELECTED DEVICES LIST (ChiTietDonThue)                                  -->
        <!-- ERD: ChiTietDonThue (MaDonThue, MaDienThoai, SoLuong, DonGiaNgay)                -->
        <!-- ================================================================================ -->
        <div class="cart-items-list mb-3">
          <div
            v-for="item in cartStore.items"
            :key="item.phone.maDienThoai"
            class="cart-item-row p-2.5 rounded-3 border mb-2 d-flex align-items-center gap-3 bg-white"
          >
            <!-- Ảnh đại diện của máy -->
            <img :src="item.phone.MacDinh" :alt="item.phone.TenDienThoai" class="cart-item-img" />
            
            <!-- Chi tiết tên máy và giá thuê ngày -->
            <div class="flex-grow-1 min-w-0">
              <h6 class="fw-bold mb-1 text-truncate" style="font-size: 0.88rem;">
                {{ item.phone.TenDienThoai }}
              </h6>
              <div class="small text-muted mb-1">
                {{ item.phone.cauHinh?.RAM_ROM }} &bull; {{ item.phone.cauHinh?.Chipset }}
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-danger fw-bold small">
                  {{ convertToVND(item.phone.giaKhuyenMai || item.phone.giaThueNgay) }}/ngày
                </span>
                <span class="text-muted small" title="Tiền cọc theo máy">
                  Cọc: {{ convertToVND(item.phone.tienCocYeuCau) }}
                </span>
              </div>
            </div>

            <!-- Nút xóa và bộ điều chỉnh số lượng -->
            <div class="d-flex flex-column align-items-end gap-2">
              <button
                class="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                @click="cartStore.removeFromCart(item.phone.maDienThoai)"
                title="Xóa máy"
              >
                <i class="fa fa-trash"></i>
              </button>
              <div class="qty-control d-flex align-items-center border rounded">
                <button
                  class="btn btn-sm btn-light py-0 px-2"
                  @click="cartStore.updateQuantity(item.phone.maDienThoai, item.quantity - 1)"
                >
                  -
                </button>
                <span class="px-2 small fw-bold">{{ item.quantity }}</span>
                <button
                  class="btn btn-sm btn-light py-0 px-2"
                  @click="cartStore.updateQuantity(item.phone.maDienThoai, item.quantity + 1)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================================ -->
        <!-- VIETNAMESE: LỰA CHỌN PHƯƠNG THỨC THẾ CHÂN / ĐẶT CỌC                              -->
        <!-- ENGLISH: COLLATERAL / DEPOSIT METHOD SELECTION                                    -->
        <!-- ERD: DatCoc.PhuongThuc (GIAY_TO_TUY_THAN, CHUYEN_KHOAN, MAY_ANH_MAY_TINH)      -->
        <!-- ================================================================================ -->
        <div class="deposit-select-box bg-light p-3 rounded-3 mb-3 border">
          <label class="form-label small fw-bold mb-2">
            <i class="fa fa-shield text-warning me-1"></i> Chọn Hình Thức Thế Chân (PhuongThuc):
          </label>
          <div class="form-check mb-1.5" v-for="m in depositMethods" :key="m.id">
            <input
              class="form-check-input"
              type="radio"
              :name="'depositRadio'"
              :id="'method_' + m.id"
              :value="m.id"
              v-model="cartStore.selectedDepositMethod"
            />
            <label class="form-check-label small cursor-pointer" :for="'method_' + m.id">
              <strong>{{ m.title }}</strong> &ndash; <span class="text-muted">{{ m.badge }}</span>
            </label>
          </div>
          <!-- Hiển thị tiền mặt thực tế phải nộp -->
          <div class="mt-2 p-2 bg-white rounded border small">
            <div class="d-flex justify-content-between">
              <span>Tiền mặt cọc yêu cầu:</span>
              <strong class="text-primary">{{ convertToVND(cartStore.actualCashDeposit) }}</strong>
            </div>
          </div>
        </div>

        <!-- ================================================================================ -->
        <!-- VIETNAMESE: NHẬP VOUCHER GIẢM GIÁ (PhieuKhuyenMai)                                -->
        <!-- ENGLISH: PROMO VOUCHER REDEMPTION (PhieuKhuyenMai)                               -->
        <!-- ERD: PhieuKhuyenMai.Code & PhieuKhuyenMai.GiaTriGiam                             -->
        <!-- ================================================================================ -->
        <div class="voucher-box mb-3">
          <label class="form-label small fw-bold">Mã giảm giá (PhieuKhuyenMai):</label>
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control"
              placeholder="Nhập mã voucher (VD: KHACHMOI50K)"
              v-model="voucherInput"
              :disabled="!!cartStore.appliedVoucher"
            />
            <button
              v-if="!cartStore.appliedVoucher"
              class="btn btn-primary"
              type="button"
              @click="applyVoucher"
            >
              Áp dụng
            </button>
            <button
              v-else
              class="btn btn-outline-danger"
              type="button"
              @click="removeVoucher"
            >
              Hủy
            </button>
          </div>
          <div v-if="cartStore.appliedVoucher" class="text-success small mt-1">
            <i class="fa fa-check-circle me-1"></i> Đã áp dụng mã {{ cartStore.appliedVoucher.Code }} (-{{ convertToVND(cartStore.appliedVoucher.GiaTriGiam) }})
          </div>
        </div>

        <!-- ================================================================================ -->
        <!-- VIETNAMESE: BẢNG TỔNG HỢP CHI PHÍ TIỀN THUÊ                                      -->
        <!-- ENGLISH: RENTAL COST SUMMARY BREAKDOWN                                           -->
        <!-- ERD: DonThue.TongTien                                                            -->
        <!-- ================================================================================ -->
        <div class="summary-box p-3 bg-light rounded-3 border">
          <div class="d-flex justify-content-between small mb-1">
            <span class="text-muted">Tổng tiền thuê ngày ({{ cartStore.rentalDays }} ngày):</span>
            <span>{{ convertToVND(cartStore.subTotalRental) }}</span>
          </div>

          <!-- Chiết khấu dài hạn tự động -->
          <div v-if="cartStore.autoDiscountAmount > 0" class="d-flex justify-content-between small text-success mb-1">
            <span>Ưu đãi thuê dài hạn ({{ cartStore.autoDiscountPercent }}%):</span>
            <span>-{{ convertToVND(cartStore.autoDiscountAmount) }}</span>
          </div>

          <!-- Trừ tiền voucher -->
          <div v-if="cartStore.voucherDiscountAmount > 0" class="d-flex justify-content-between small text-success mb-1">
            <span>Voucher giảm giá ({{ cartStore.appliedVoucher.Code }}):</span>
            <span>-{{ convertToVND(cartStore.voucherDiscountAmount) }}</span>
          </div>

          <!-- Tổng tiền thuê cuối cùng -->
          <div class="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
            <span>TỔNG TIỀN THUÊ (DonThue.TongTien):</span>
            <span class="text-danger fs-5">{{ convertToVND(cartStore.finalTotalRental) }}</span>
          </div>
        </div>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: CHÂN THANH TRƯỢT - NÚT TẠO ĐƠN & LÀM HỢP ĐỒNG ĐIỆN TỬ                    -->
      <!-- ENGLISH: DRAWER FOOTER - SUBMIT RENTAL ORDER & CREATE DIGITAL CONTRACT               -->
      <!-- ==================================================================================== -->
      <div v-if="cartStore.items.length > 0" class="drawer-footer pt-3 border-top mt-auto">
        <button class="btn btn-primary-smart w-100 justify-content-center py-2.5" @click="handleCheckout">
          <i class="fa fa-check-circle me-1"></i> Xác nhận đặt thuê & Làm hợp đồng
        </button>
      </div>
    </div>
  </div>

  <!-- ======================================================================================== -->
  <!-- MODAL XÁC NHẬN HỢP ĐỒNG & THỦ TỤC THẾ CHÂN 3 HÌNH THỨC (CCCD, QR, LAPTOP TẠI SHOP)       -->
  <!-- ======================================================================================== -->
  <ContractConfirmModal
    :isOpen="isContractModalOpen"
    @close="isContractModalOpen = false"
  />
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT CÁC STORE, COMPONENT & DỮ LIỆU CẤU HÌNH CỌC
// ENGLISH: IMPORT STORES, MODAL COMPONENT, DEPOSIT PRESETS & SWEETALERT2
// ============================================================================================
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.store';
import { useOrderStore } from '@/stores/order.store';
import { useUserStore } from '@/stores/user.store';
import { depositMethods } from '@/data/mockData';
import { convertToVND } from '@/utils/formatters';
import ContractConfirmModal from './ContractConfirmModal.vue';
import Swal from 'sweetalert2';

// Khởi tạo router và stores
// Initialize router & stores
const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const userStore = useUserStore();
const voucherInput = ref('');
const isContractModalOpen = ref(false);

// ============================================================================================
// VIETNAMESE: ÁP DỤNG MÃ GIẢM GIÁ (PhieuKhuyenMai)
// ENGLISH: REDEEM PROMOTIONAL VOUCHER CODE
// ============================================================================================
const applyVoucher = () => {
  if (!voucherInput.value.trim()) return;
  const res = cartStore.applyVoucherCode(voucherInput.value);
  if (res.success) {
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: res.message,
      timer: 2000,
      showConfirmButton: false
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Không thể áp dụng',
      text: res.message
    });
  }
};

// ============================================================================================
// VIETNAMESE: HỦY ÁP DỤNG MÃ GIẢM GIÁ
// ENGLISH: REMOVE APPLIED VOUCHER CODE
// ============================================================================================
const removeVoucher = () => {
  cartStore.removeVoucher();
  voucherInput.value = '';
};

// ============================================================================================
// VIETNAMESE: MỞ MODAL XÁC NHẬN HỢP ĐỒNG & THỦ TỤC THẾ CHÂN (CCCD / QR / LAPTOP TẠI SHOP)
// ENGLISH: OPEN CONTRACT CONFIRMATION MODAL WITH 3 CONDITIONAL COLLATERAL FLOWS
// ============================================================================================
const handleCheckout = () => {
  if (!cartStore.items || cartStore.items.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Giỏ hàng trống',
      text: 'Vui lòng chọn ít nhất 1 điện thoại vào đơn thuê trước khi làm hợp đồng!'
    });
    return;
  }
  // Mở modal xác nhận hợp đồng với 3 nhánh nghiệp vụ theo yêu cầu
  isContractModalOpen.value = true;
};
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS CHO THANH TRƯỢT GIỎ THUÊ (SIDE DRAWER ANIMATION)                             */
/* ENGLISH: SCOPED STYLES & SLIDE-IN KEYFRAME ANIMATION FOR CART DRAWER                         */
/* ============================================================================================ */
.cart-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.cart-drawer-panel {
  width: 100%;
  max-width: 460px;
  height: 100%;
  background: #ffffff;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.empty-cart-icon {
  font-size: 3.5rem;
}

.cursor-pointer {
  cursor: pointer;
}

.btn-close-modal {
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
}

.btn-close-modal:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}
</style>