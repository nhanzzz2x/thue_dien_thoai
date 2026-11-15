<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: MODAL XÁC NHẬN TẠO ĐƠN & KÝ HỢP ĐỒNG ĐIỆN TỬ THEO 3 HÌNH THỨC THẾ CHÂN         -->
  <!-- 1. Căn cước công dân (CCCD): Bổ sung chức năng chụp ảnh / tải ảnh CCCD 2 mặt              -->
  <!-- 2. Chuyển khoản Ngân hàng / VNPay: Hiện mã QR VietQR thanh toán tiền thuê & tiền cọc       -->
  <!-- 3. Laptop / iPad / Máy ảnh: Thông báo khách mang thiết bị đến địa chỉ của shop kiểm tra hàng-->
  <!-- ========================================================================================== -->
  <div v-if="isOpen" class="contract-modal-backdrop" @click.self="closeModal">
    <div class="contract-modal-dialog">
      <!-- HEADER MODAL -->
      <div class="contract-modal-header d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
        <div class="d-flex align-items-center gap-2">
          <div class="badge-icon bg-primary text-white rounded-circle p-2">
            <i class="fa fa-file-text-o"></i>
          </div>
          <div>
            <h5 class="fw-bold mb-0 text-dark">Hợp Đồng Thuê & Xác Nhận Thế Chân</h5>
            <small class="text-muted">Mã hợp đồng dự kiến: <strong class="text-primary">{{ tempContractCode }}</strong></small>
          </div>
        </div>
        <button class="btn btn-close-modal" @click="closeModal">
          <i class="fa fa-times"></i>
        </button>
      </div>

      <!-- BODY MODAL -->
      <div class="contract-modal-body p-4 overflow-y-auto">
        <!-- 1. TÓM TẮT THÔNG TIN HỢP ĐỒNG -->
        <div class="order-summary-card p-3 rounded-3 border bg-white mb-4">
          <h6 class="fw-bold text-dark border-bottom pb-2 mb-3">
            <i class="fa fa-info-circle text-primary me-1"></i> Thông Tin Đơn Thuê & Thiết Bị
          </h6>
          <div class="row g-2 small">
            <div class="col-md-6">
              <span class="text-muted">Khách hàng:</span>
              <strong class="d-block text-dark">{{ userStore.user.hoTen || 'Trần Trọng Nhân' }}</strong>
            </div>
            <div class="col-md-6">
              <span class="text-muted">Số điện thoại / Email:</span>
              <strong class="d-block text-dark">{{ userStore.user.sdt || '0908 123 456' }} &bull; {{ userStore.user.email }}</strong>
            </div>
            <div class="col-md-6">
              <span class="text-muted">Thời gian thuê:</span>
              <strong class="d-block text-dark">
                {{ cartStore.startDate }} &rarr; {{ cartStore.endDate }} ({{ cartStore.rentalDays }} ngày)
              </strong>
            </div>
            <div class="col-md-6">
              <span class="text-muted">Địa chỉ nhận máy:</span>
              <strong class="d-block text-dark">{{ userStore.user.diaChi || '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM' }}</strong>
            </div>
          </div>

          <!-- Danh sách thiết bị thuê -->
          <div class="mt-3 pt-2 border-top">
            <small class="text-muted fw-bold d-block mb-1">Thiết bị trong hợp đồng ({{ cartStore.items.length }} máy):</small>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="item in cartStore.items"
                :key="item.phone.maDienThoai"
                class="badge bg-light text-dark border px-2 py-1.5"
              >
                {{ item.phone.TenDienThoai }} (x{{ item.quantity }})
              </span>
            </div>
          </div>

          <!-- Tổng kết tiền -->
          <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top bg-light-subtle p-2 rounded">
            <div>
              <span class="small text-muted d-block">Tiền thuê ({{ cartStore.rentalDays }} ngày): <strong>{{ convertToVND(cartStore.finalTotalRental) }}</strong></span>
              <span class="small text-muted d-block">Tiền cọc mặt yêu cầu: <strong class="text-danger">{{ convertToVND(cartStore.actualCashDeposit) }}</strong></span>
            </div>
            <div class="text-end">
              <span class="small text-muted d-block">Tổng thanh toán ban đầu:</span>
              <span class="fs-5 fw-bold text-danger">{{ convertToVND(cartStore.finalTotalRental + cartStore.actualCashDeposit) }}</span>
            </div>
          </div>
        </div>

        <!-- ================================================================================ -->
        <!-- ĐIỀU KIỆN 1: CĂN CƯỚC CÔNG DÂN (CCCD) -> CHỤP ẢNH / TẢI ẢNH CCCD 2 MẶT            -->
        <!-- ================================================================================ -->
        <div v-if="cartStore.selectedDepositMethod === 'GIAY_TO_TUY_THAN'" class="deposit-detail-box cccd-box p-3 rounded-3 border mb-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-primary mb-0">
              <i class="fa fa-id-card me-1"></i> Bổ Sung Ảnh Căn Cước Công Dân (CCCD) Gắn Chip
            </h6>
            <span class="badge bg-success-subtle text-success border border-success-subtle">
              <i class="fa fa-check me-1"></i> Giảm 85% tiền mặt cọc
            </span>
          </div>
          <p class="small text-muted mb-3">
            Theo chính sách bảo vệ tài sản, vui lòng <strong>chụp ảnh hoặc tải lên ảnh 2 mặt CCCD gắn chip</strong> chính chủ. Hình ảnh sẽ được lưu trữ bảo mật trong hợp đồng điện tử để nhân viên đối chiếu khi giao nhận máy.
          </p>

          <!-- Nút nạp ảnh CCCD mẫu phục vụ báo cáo đồ án -->
          <div class="mb-3 text-end">
            <button
              type="button"
              class="btn btn-sm btn-outline-warning text-dark fw-bold"
              @click="loadSampleCccd"
              title="Tự động nạp ảnh CCCD mẫu demo chuẩn đồ án"
            >
              <i class="fa fa-magic me-1 text-warning"></i> Nạp ảnh CCCD mẫu demo (Báo cáo đồ án)
            </button>
          </div>

          <!-- Khung chụp ảnh mặt trước và mặt sau CCCD -->
          <div class="row g-3">
            <!-- 1. MẶT TRƯỚC CCCD -->
            <div class="col-md-6">
              <div class="card h-100 border p-3 bg-white text-center cccd-card">
                <span class="small fw-bold text-dark d-block mb-2">
                  <i class="fa fa-camera text-primary me-1"></i> 1. Mặt Trước CCCD
                </span>

                <!-- Khung camera đang mở -->
                <div v-if="activeCamera === 'FRONT'" class="camera-stream-box mb-2">
                  <video ref="frontVideoRef" autoplay playsinline class="video-preview w-100 rounded"></video>
                  <div class="d-flex justify-content-center gap-2 mt-2">
                    <button class="btn btn-sm btn-success" type="button" @click="capturePhoto('FRONT')">
                      <i class="fa fa-camera me-1"></i> Bấm Chụp Ngay
                    </button>
                    <button class="btn btn-sm btn-secondary" type="button" @click="stopCamera">
                      Hủy
                    </button>
                  </div>
                </div>

                <!-- Đã có ảnh preview -->
                <div v-else-if="cccdFrontImg" class="preview-box position-relative mb-2">
                  <img :src="cccdFrontImg" alt="Mặt trước CCCD" class="img-preview img-fluid rounded border" />
                  <span class="badge bg-success position-absolute top-2 start-2">
                    <i class="fa fa-check me-1"></i> Đã có ảnh
                  </span>
                  <div class="mt-2 d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-outline-primary" type="button" @click="triggerFileUpload('FRONT')">
                      <i class="fa fa-refresh me-1"></i> Đổi ảnh
                    </button>
                    <button class="btn btn-sm btn-outline-danger" type="button" @click="cccdFrontImg = null">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- Chưa có ảnh: Nút chụp hoặc tải ảnh -->
                <div v-else class="upload-placeholder p-4 border border-dashed rounded bg-light mb-2">
                  <i class="fa fa-id-card-o text-muted fs-1 mb-2"></i>
                  <p class="small text-muted mb-3">Chưa có ảnh mặt trước</p>
                  <div class="d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-primary" type="button" @click="startCamera('FRONT')">
                      <i class="fa fa-camera me-1"></i> Chụp Bằng Camera
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" type="button" @click="triggerFileUpload('FRONT')">
                      <i class="fa fa-upload me-1"></i> Tải ảnh từ máy
                    </button>
                  </div>
                </div>

                <!-- Hidden file input -->
                <input
                  type="file"
                  ref="frontFileInputRef"
                  class="d-none"
                  accept="image/*"
                  capture="environment"
                  @change="onFileChange($event, 'FRONT')"
                />
              </div>
            </div>

            <!-- 2. MẶT SAU CCCD -->
            <div class="col-md-6">
              <div class="card h-100 border p-3 bg-white text-center cccd-card">
                <span class="small fw-bold text-dark d-block mb-2">
                  <i class="fa fa-camera text-primary me-1"></i> 2. Mặt Sau CCCD (Có Chip)
                </span>

                <!-- Khung camera đang mở -->
                <div v-if="activeCamera === 'BACK'" class="camera-stream-box mb-2">
                  <video ref="backVideoRef" autoplay playsinline class="video-preview w-100 rounded"></video>
                  <div class="d-flex justify-content-center gap-2 mt-2">
                    <button class="btn btn-sm btn-success" type="button" @click="capturePhoto('BACK')">
                      <i class="fa fa-camera me-1"></i> Bấm Chụp Ngay
                    </button>
                    <button class="btn btn-sm btn-secondary" type="button" @click="stopCamera">
                      Hủy
                    </button>
                  </div>
                </div>

                <!-- Đã có ảnh preview -->
                <div v-else-if="cccdBackImg" class="preview-box position-relative mb-2">
                  <img :src="cccdBackImg" alt="Mặt sau CCCD" class="img-preview img-fluid rounded border" />
                  <span class="badge bg-success position-absolute top-2 start-2">
                    <i class="fa fa-check me-1"></i> Đã có ảnh
                  </span>
                  <div class="mt-2 d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-outline-primary" type="button" @click="triggerFileUpload('BACK')">
                      <i class="fa fa-refresh me-1"></i> Đổi ảnh
                    </button>
                    <button class="btn btn-sm btn-outline-danger" type="button" @click="cccdBackImg = null">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- Chưa có ảnh: Nút chụp hoặc tải ảnh -->
                <div v-else class="upload-placeholder p-4 border border-dashed rounded bg-light mb-2">
                  <i class="fa fa-microchip text-muted fs-1 mb-2"></i>
                  <p class="small text-muted mb-3">Chưa có ảnh mặt sau</p>
                  <div class="d-flex flex-column gap-2">
                    <button class="btn btn-sm btn-primary" type="button" @click="startCamera('BACK')">
                      <i class="fa fa-camera me-1"></i> Chụp Bằng Camera
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" type="button" @click="triggerFileUpload('BACK')">
                      <i class="fa fa-upload me-1"></i> Tải ảnh từ máy
                    </button>
                  </div>
                </div>

                <!-- Hidden file input -->
                <input
                  type="file"
                  ref="backFileInputRef"
                  class="d-none"
                  accept="image/*"
                  capture="environment"
                  @change="onFileChange($event, 'BACK')"
                />
              </div>
            </div>
          </div>

          <div class="alert alert-warning py-2 px-3 small mt-3 mb-0 d-flex align-items-center gap-2">
            <i class="fa fa-shield fs-5 text-warning"></i>
            <div>
              <strong>Lưu ý nhận máy:</strong> Quý khách vui lòng mang theo <strong>CCCD gắn chip bản gốc</strong> để nhân viên quầy đối chiếu và lưu giữ trong két niêm phong an toàn tại thời điểm bàn giao thiết bị.
            </div>
          </div>
        </div>

        <!-- ================================================================================ -->
        <!-- ĐIỀU KIỆN 2: CHUYỂN KHOẢN NGÂN HÀNG / VNPAY -> HIỆN MÃ QR THANH TOÁN TIỀN THUÊ     -->
        <!-- ================================================================================ -->
        <div v-else-if="cartStore.selectedDepositMethod === 'CHUYEN_KHOAN'" class="deposit-detail-box qr-box p-3 rounded-3 border mb-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            <h6 class="fw-bold text-success mb-0">
              <i class="fa fa-qrcode me-1"></i> Quét Mã QR Thanh Toán Tiền Thuê & Tiền Cọc
            </h6>
            <span class="badge bg-primary">VietQR &bull; Napas 247</span>
          </div>
          <p class="small text-muted mb-3">
            Mở ứng dụng Ngân hàng bất kỳ (MB Bank, Vietcombank, Techcombank...) hoặc ví MoMo/VNPay để quét mã QR chuyển khoản nhanh 24/7.
          </p>

          <div class="row g-3 align-items-center">
            <!-- Khối hiển thị ảnh QR -->
            <div class="col-md-5 text-center">
              <div class="qr-image-wrapper p-2 bg-white rounded-3 border shadow-sm d-inline-block">
                <img
                  :src="vietQrUrl"
                  alt="Mã QR Chuyển khoản"
                  class="img-fluid rounded"
                  style="max-width: 220px;"
                />
                <div class="small fw-bold text-primary mt-1">
                  <i class="fa fa-mobile me-1"></i> Quét mã để thanh toán tự động
                </div>
              </div>
            </div>

            <!-- Bảng thông tin chuyển khoản rõ ràng -->
            <div class="col-md-7">
              <div class="p-3 bg-light rounded-3 border small">
                <div class="d-flex justify-content-between py-1 border-bottom">
                  <span class="text-muted">Ngân hàng:</span>
                  <strong class="text-dark">MB Bank (Ngân Hàng Quân Đội)</strong>
                </div>
                <div class="d-flex justify-content-between py-1 border-bottom">
                  <span class="text-muted">Số tài khoản:</span>
                  <div class="d-flex align-items-center gap-1">
                    <strong class="text-primary font-monospace fs-6">0908123456</strong>
                    <button class="btn btn-sm btn-link p-0 text-decoration-none" @click="copyText('0908123456', 'Số tài khoản')">
                      <i class="fa fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div class="d-flex justify-content-between py-1 border-bottom">
                  <span class="text-muted">Chủ tài khoản:</span>
                  <strong class="text-dark">TRAN TRONG NHAN</strong>
                </div>
                <div class="d-flex justify-content-between py-1 border-bottom">
                  <span class="text-muted">Số tiền thanh toán:</span>
                  <strong class="text-danger fs-6">{{ convertToVND(cartStore.finalTotalRental + cartStore.actualCashDeposit) }}</strong>
                </div>
                <div class="d-flex justify-content-between py-1">
                  <span class="text-muted">Nội dung chuyển khoản:</span>
                  <div class="d-flex align-items-center gap-1">
                    <strong class="text-danger font-monospace">THUEMAY {{ tempOrderCode }}</strong>
                    <button class="btn btn-sm btn-link p-0 text-decoration-none" @click="copyText(`THUEMAY ${tempOrderCode}`, 'Nội dung chuyển khoản')">
                      <i class="fa fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="mt-2 text-muted" style="font-size: 0.78rem;">
                <i class="fa fa-info-circle text-success me-1"></i> Hệ thống tự động kiểm tra giao dịch. Sau khi quý khách hoàn trả máy nguyên vẹn tem bảo hành, số tiền cọc sẽ được <strong>chuyển khoản hoàn lại trong 5 phút</strong>.
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================================ -->
        <!-- ĐIỀU KIỆN 3: LAPTOP / IPAD / MÁY ẢNH -> THÔNG BÁO ĐẾN ĐỊA CHỈ CỦA SHOP KIỂM TRA    -->
        <!-- ================================================================================ -->
        <div v-else-if="cartStore.selectedDepositMethod === 'MAY_ANH_MAY_TINH'" class="deposit-detail-box store-check-box p-3 rounded-3 border mb-4 bg-white">
          <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            <h6 class="fw-bold text-warning-emphasis mb-0">
              <i class="fa fa-laptop me-1"></i> Thế Chân Tài Sản Công Nghệ (Laptop / iPad / Máy ảnh)
            </h6>
            <span class="badge bg-warning text-dark">
              <i class="fa fa-check-circle me-1"></i> Miễn 100% Cọc Tiền Mặt (0₫)
            </span>
          </div>

          <!-- Thông báo địa chỉ shop cực kỳ rõ ràng -->
          <div class="store-address-banner p-3 rounded-3 border bg-warning-subtle mb-3">
            <div class="d-flex align-items-start gap-3">
              <div class="store-icon-badge bg-warning text-dark p-2.5 rounded-circle fs-4">
                <i class="fa fa-map-marker"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold text-dark mb-1">
                  Địa Chỉ Cửa Hàng Shop Để Kiểm Tra & Bàn Giao Hàng:
                </h6>
                <p class="mb-1 text-dark fw-semibold fs-6">
                  📍 180 Cao Lỗ, Phường 4, Quận 8, TP. Hồ Chí Minh
                </p>
                <div class="small text-muted d-flex flex-wrap gap-3">
                  <span><i class="fa fa-university me-1"></i> Cổng Trường ĐH Công Nghệ Sài Gòn (STU)</span>
                  <span><i class="fa fa-clock-o me-1"></i> Giờ tiếp nhận: <strong>08:00 &ndash; 21:00</strong> (Tất cả các ngày)</span>
                  <span><i class="fa fa-phone me-1"></i> Hotline: <strong>0908 123 456</strong></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quy trình 4 bước kiểm tra tại quầy -->
          <h6 class="fw-bold text-dark small mb-2">
            <i class="fa fa-list-ol text-primary me-1"></i> Quy trình thẩm định thiết bị tại quầy shop:
          </h6>
          <div class="row g-2 small mb-3">
            <div class="col-md-6">
              <div class="p-2.5 border rounded bg-light h-100">
                <strong>1. Mang máy đến quầy:</strong> Quý khách mang Laptop/iPad kèm dây sạc tới quầy 180 Cao Lỗ, Quận 8.
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-2.5 border rounded bg-light h-100">
                <strong>2. Kiểm tra nhanh 5 phút:</strong> Kỹ thuật viên kiểm tra ngoại quan và bật máy test nguồn.
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-2.5 border rounded bg-light h-100">
                <strong>3. Dán tem niêm phong:</strong> Thiết bị được dán tem niêm phong và cất vào tủ bảo mật trước mặt khách.
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-2.5 border rounded bg-light h-100">
                <strong>4. Nhận điện thoại thuê:</strong> Ký biên bản bàn giao và nhận ngay điện thoại mang về với <strong>0₫ tiền cọc mặt</strong>!
              </div>
            </div>
          </div>

          <!-- Nhập thông tin thiết bị dự kiến mang đến thế chân -->
          <div class="mb-2">
            <label class="form-label small fw-bold">Thông tin thiết bị thế chân dự kiến mang đến:</label>
            <input
              type="text"
              class="form-control form-control-sm"
              v-model="techDeviceNote"
              placeholder="Ví dụ: Laptop Dell XPS 13 2024 (Kèm củ sạc 65W) hoặc iPad Pro M2 11-inch"
            />
          </div>
        </div>

        <!-- 3. ĐIỀU KHOẢN HỢP ĐỒNG & CAM KẾT -->
        <div class="contract-terms-box p-3 bg-light rounded-3 border small mb-3">
          <h6 class="fw-bold text-dark mb-2">
            <i class="fa fa-gavel text-secondary me-1"></i> Điều Khoản Cam Kết Thuê Thiết Bị:
          </h6>
          <ul class="ps-3 text-muted mb-2" style="font-size: 0.8rem;">
            <li>Bên thuê có trách nhiệm bảo quản nguyên vẹn máy, không tự ý tháo mở tem niêm phong, không cài phần mềm độc hại.</li>
            <li>Hỗ trợ đổi mới thiết bị trong vòng 2 giờ nếu máy phát sinh sự cố phần cứng do nhà sản xuất.</li>
            <li>Bên cho thuê (Shop TrongNhanMobile) cam kết hoàn trả 100% tài sản thế chân và tiền cọc trong vòng 5 phút sau khi khách hàng hoàn tất thủ tục trả máy nguyên vẹn.</li>
          </ul>
          <div class="form-check mt-2">
            <input class="form-check-input" type="checkbox" id="agreeTermsCheck" v-model="agreeTerms" />
            <label class="form-check-label fw-bold text-dark cursor-pointer" for="agreeTermsCheck">
              Tôi đã đọc, hiểu rõ và đồng ý với tất cả điều khoản hợp đồng cho thuê điện thoại.
            </label>
          </div>
        </div>
      </div>

      <!-- FOOTER MODAL -->
      <div class="contract-modal-footer p-3 border-top d-flex justify-content-between align-items-center bg-light">
        <button class="btn btn-outline-secondary" type="button" @click="closeModal">
          <i class="fa fa-arrow-left me-1"></i> Quay lại giỏ hàng
        </button>
        <button
          class="btn btn-primary-smart px-4 py-2"
          type="button"
          :disabled="!agreeTerms"
          @click="confirmAndSignContract"
        >
          <i class="fa fa-check-circle me-1"></i> Ký Hợp Đồng & Hoàn Tất Đặt Thuê
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.store';
import { useOrderStore } from '@/stores/order.store';
import { useUserStore } from '@/stores/user.store';
import { convertToVND } from '@/utils/formatters';
import Swal from 'sweetalert2';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const userStore = useUserStore();

// Trạng thái modal
const agreeTerms = ref(true);
const techDeviceNote = ref('Laptop Asus ROG Strix G16 (Kèm sạc zin)');

// Mã đơn và mã hợp đồng tạm
const tempOrderCode = ref(Math.floor(1000 + Math.random() * 9000).toString());
const tempContractCode = computed(() => `HD_20261112_${tempOrderCode.value}`);

// ============================================================================================
// LOGIC CHỤP ẢNH & TẢI ẢNH CĂN CƯỚC CÔNG DÂN (CCCD)
// ============================================================================================
const cccdFrontImg = ref(null);
const cccdBackImg = ref(null);
const activeCamera = ref(null); // 'FRONT' | 'BACK' | null
const frontVideoRef = ref(null);
const backVideoRef = ref(null);
const frontFileInputRef = ref(null);
const backFileInputRef = ref(null);
let mediaStream = null;

// Kích hoạt input file
const triggerFileUpload = (side) => {
  stopCamera();
  if (side === 'FRONT' && frontFileInputRef.value) {
    frontFileInputRef.value.click();
  } else if (side === 'BACK' && backFileInputRef.value) {
    backFileInputRef.value.click();
  }
};

// Đọc file tải lên thành DataURL
const onFileChange = (e, side) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    if (side === 'FRONT') {
      cccdFrontImg.value = event.target.result;
    } else {
      cccdBackImg.value = event.target.result;
    }
  };
  reader.readAsDataURL(file);
};

// Mở camera chụp ảnh trực tiếp
const startCamera = async (side) => {
  stopCamera();
  activeCamera.value = side;

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });

    setTimeout(() => {
      const videoEl = side === 'FRONT' ? frontVideoRef.value : backVideoRef.value;
      if (videoEl) {
        videoEl.srcObject = mediaStream;
      }
    }, 100);
  } catch (err) {
    console.warn('Không thể truy cập camera:', err);
    activeCamera.value = null;
    Swal.fire({
      icon: 'info',
      title: 'Không thể mở Camera',
      text: 'Trình duyệt không tìm thấy camera hoặc chưa cấp quyền. Quý khách vui lòng dùng nút "Tải ảnh từ máy" hoặc "Nạp ảnh CCCD mẫu demo" nhé!',
      confirmButtonText: 'Đã hiểu'
    });
  }
};

// Chụp ảnh từ video stream
const capturePhoto = (side) => {
  const videoEl = side === 'FRONT' ? frontVideoRef.value : backVideoRef.value;
  if (!videoEl) return;

  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth || 640;
  canvas.height = videoEl.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

  if (side === 'FRONT') {
    cccdFrontImg.value = dataUrl;
  } else {
    cccdBackImg.value = dataUrl;
  }

  stopCamera();
};

// Tắt camera
const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  activeCamera.value = null;
};

// Nạp ảnh mẫu demo nhanh (Dành cho báo cáo đồ án)
const loadSampleCccd = () => {
  // Ảnh mẫu mặt trước CCCD
  cccdFrontImg.value = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80';
  // Ảnh mẫu mặt sau CCCD
  cccdBackImg.value = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
  Swal.fire({
    icon: 'success',
    title: 'Đã nạp ảnh CCCD mẫu demo!',
    text: 'Ảnh CCCD gắn chip 2 mặt đã được tự động thêm vào hồ sơ hợp đồng.',
    timer: 1500,
    showConfirmButton: false
  });
};

// ============================================================================================
// LOGIC TẠO MÃ QR THANH TOÁN TIỀN THUÊ & CỌC (VIETQR)
// ============================================================================================
const vietQrUrl = computed(() => {
  const totalAmount = cartStore.finalTotalRental + cartStore.actualCashDeposit;
  const memo = encodeURIComponent(`THUEMAY ${tempOrderCode.value}`);
  const accountName = encodeURIComponent('TRAN TRONG NHAN');
  return `https://api.vietqr.io/image/970422-0908123456-compact2.jpg?amount=${totalAmount}&addInfo=${memo}&accountName=${accountName}`;
});

// Sao chép thông tin
const copyText = (text, label) => {
  navigator.clipboard.writeText(text);
  Swal.fire({
    icon: 'success',
    title: 'Đã sao chép!',
    text: `${label}: ${text}`,
    timer: 1200,
    showConfirmButton: false
  });
};

// Đóng modal
const closeModal = () => {
  stopCamera();
  emit('close');
};

// ============================================================================================
// XÁC NHẬN KÝ HỢP ĐỒNG & HOÀN TẤT ĐẶT THUÊ
// ============================================================================================
const confirmAndSignContract = () => {
  // 1. Kiểm tra nếu chọn CCCD mà chưa chụp ảnh
  if (cartStore.selectedDepositMethod === 'GIAY_TO_TUY_THAN' && (!cccdFrontImg.value || !cccdBackImg.value)) {
    Swal.fire({
      icon: 'warning',
      title: 'Chưa đủ ảnh CCCD 2 mặt',
      text: 'Vui lòng chụp hoặc tải đủ ảnh mặt trước và mặt sau CCCD (hoặc bấm nút "Nạp ảnh CCCD mẫu demo") để hoàn tất hợp đồng!',
      confirmButtonText: 'Tôi sẽ bổ sung ngay'
    });
    return;
  }

  // 2. Tạo đơn thuê vào Store & CSDL
  const newOrder = orderStore.taoDonThue({
    hoTen: userStore.user.hoTen || 'Trần Trọng Nhân',
    sdt: userStore.user.sdt || '0908123456',
    email: userStore.user.email || 'trongnhan@stu.edu.vn',
    cccd: userStore.user.cccd || '079203001234',
    diaChi: userStore.user.diaChi || '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM',
    items: cartStore.items,
    startDate: cartStore.startDate,
    endDate: cartStore.endDate,
    rentalDays: cartStore.rentalDays,
    depositMethod: cartStore.selectedDepositMethod,
    depositMethodText: cartStore.selectedDepositMethod === 'GIAY_TO_TUY_THAN' 
      ? 'Căn cước công dân (CCCD) - Đã chụp 2 mặt'
      : (cartStore.selectedDepositMethod === 'CHUYEN_KHOAN' ? 'Chuyển khoản Ngân hàng / VNPay (Mã QR)' : 'Laptop / iPad (Kiểm tra tại shop 180 Cao Lỗ)'),
    cashDeposit: cartStore.actualCashDeposit,
    subTotalRental: cartStore.subTotalRental,
    discountAmount: cartStore.autoDiscountAmount + cartStore.voucherDiscountAmount,
    finalTotalRental: cartStore.finalTotalRental,
    anhCccdMatTruoc: cccdFrontImg.value,
    anhCccdMatSau: cccdBackImg.value,
    maGiaoDichQr: cartStore.selectedDepositMethod === 'CHUYEN_KHOAN' ? `VNPAY_${Date.now()}` : null,
    ghiChuTheChan: cartStore.selectedDepositMethod === 'MAY_ANH_MAY_TINH' ? `Thiết bị kiểm tra tại shop: ${techDeviceNote.value}` : 'Hợp đồng trực tuyến',
    note: `Đã ký hợp đồng ${tempContractCode.value} thành công.`
  });

  // 3. Xóa giỏ hàng & đóng modal
  cartStore.clearCart();
  cartStore.closeDrawer();
  closeModal();

  // 4. Thông báo thành công
  Swal.fire({
    icon: 'success',
    title: 'Đặt Thuê & Ký Hợp Đồng Thành Công!',
    html: `
      <div class="text-start small">
        <p>Mã hợp đồng: <strong class="text-primary">${tempContractCode.value}</strong></p>
        <p>Mã đơn thuê: <strong class="text-success">${newOrder.maDonThue}</strong></p>
        <p class="text-muted">Hệ thống đang chuyển bạn sang trang Lịch sử thuê để xem chi tiết hợp đồng điện tử...</p>
      </div>
    `,
    timer: 2500,
    showConfirmButton: false
  });

  // 5. Điều hướng sang trang Lịch Sử Thuê
  router.push('/lich-su-thue');
};
</script>

<style scoped>
.contract-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(5px);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.contract-modal-dialog {
  background: #ffffff;
  width: 100%;
  max-width: 780px;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpModal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.btn-close-modal {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-modal:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.cccd-box {
  background: #f0fdf4;
}

.cccd-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.upload-placeholder {
  border-color: #cbd5e1 !important;
  cursor: pointer;
}

.img-preview {
  max-height: 160px;
  width: 100%;
  object-fit: cover;
}

.video-preview {
  max-height: 180px;
  background: #000;
  object-fit: cover;
}

.store-address-banner {
  background-color: #fffbeb !important;
}

.store-icon-badge {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

