<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: PHẦN CHÍNH SÁCH THẾ CHÂN & HOÀN CỌC ĐA TÀI SẢN (TRANG CHỦ)                     -->
  <!-- ENGLISH: MULTI-ASSET COLLATERAL & 100% REFUND POLICY SECTION (HOME PAGE)                   -->
  <!-- ERD MAPPING: Ánh xạ thực thể DatCoc, ChiTietPhieuThue, HopDong_GiaoNhan                    -->
  <!-- ========================================================================================== -->
  <section id="deposit-policy-section" class="deposit-policy-section py-5 my-5">
    <div class="container">
      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: TIÊU ĐỀ KHU VỰC CHÍNH SÁCH BẢO ĐẢM TÀI SẢN                              -->
      <!-- ENGLISH: POLICY SECTION HEADER & SUBTITLE                                            -->
      <!-- ==================================================================================== -->
      <div class="section-header text-center mb-5">
        <span class="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill mb-2">
          <i class="fa fa-shield me-1"></i> NGHIỆP VỤ THẾ CHÂN & HOÀN CỌC CHUẨN ĐỒ ÁN
        </span>
        <h2 class="section-title text-center fw-black">CHÍNH SÁCH THẾ CHÂN ĐA TÀI SẢN LINH HOẠT</h2>
        <p class="section-subtitle text-center mx-auto" style="max-width: 720px;">
          Ánh xạ trực tiếp quan hệ <code>DonThue &rarr; ChiTietPhieuThue</code> (PhuongThuc, SoTienCoc, TransactionId, TinhTrangCoc) và 
          <code>HopDong_GiaoNhan</code> (TinhTrangLucGiao, TinhTrangLucTra, phuThu).
        </p>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: 3 THẺ DANH MỤC HÌNH THỨC THẾ CHÂN LINH HOẠT                             -->
      <!-- ENGLISH: 3 COLLATERAL METHOD CARDS (ID CARD, CASH TRANSFER, TECH DEVICES)             -->
      <!-- ERD: DatCoc.PhuongThuc                                                               -->
      <!-- ==================================================================================== -->
      <div class="row g-4 mb-5">
        <div
          v-for="method in depositMethods"
          :key="method.id"
          class="col-lg-4 col-md-6"
        >
          <div class="policy-method-card h-100 p-4 rounded-4 shadow-sm">
            <div class="method-icon-box mb-3">
              <i class="fa" :class="method.icon"></i>
            </div>
            <span class="badge bg-light text-primary border fw-bold mb-2">{{ method.badge }}</span>
            <h5 class="fw-bold mb-2">{{ method.title }}</h5>
            <p class="method-desc text-muted mb-3" style="font-size: 0.86rem;">
              {{ method.description }}
            </p>
            <div class="method-rate p-2 rounded-3 bg-light mb-2">
              <small class="text-success fw-bold d-block"><i class="fa fa-check-circle me-1"></i> Định mức:</small>
              <span class="fw-semibold" style="font-size: 0.8rem;">{{ method.depositRate }}</span>
            </div>
            <div class="method-doc" style="font-size: 0.78rem; color: #64748b;">
              <i class="fa fa-file-text-o me-1"></i> {{ method.documents }}
            </div>
          </div>
        </div>
      </div>

      <!-- ==================================================================================== -->
      <!-- VIETNAMESE: QUY TRÌNH 4 BƯỚC THUÊ MÁY & QUYẾT TOÁN HOÀN CỌC MINH BẠCH                -->
      <!-- ENGLISH: 4-STEP RENTAL & 100% COLLATERAL REFUND WORKFLOW                             -->
      <!-- ERD: Mô tả luồng chuyển tiếp trạng thái DonThue & HopDong_GiaoNhan                   -->
      <!-- ==================================================================================== -->
      <div class="workflow-card bg-white p-4 p-md-5 rounded-4 shadow-sm border">
        <h4 class="fw-bold text-center mb-4">
          <i class="fa fa-retweet text-primary me-2"></i> Quy Trình 4 Bước Thuê Điện Thoại & Quyết Toán Hoàn Cọc
        </h4>

        <div class="row g-4">
          <!-- Bước 1: Chọn máy & Lịch thuê | Step 1: Device & Schedule selection -->
          <div class="col-lg-3 col-md-6 text-center">
            <div class="step-circle mb-3 mx-auto">1</div>
            <h6 class="fw-bold">Chọn Máy & Lịch Thuê</h6>
            <p class="text-muted small">
              Khách chọn điện thoại, chọn <em>NgayBatDauThue &ndash; NgayKetThucThue</em>. Hệ thống tự động tính số ngày và áp mã ưu đãi.
            </p>
          </div>

          <!-- Bước 2: Thẩm định thế chân | Step 2: Collateral evaluation -->
          <div class="col-lg-3 col-md-6 text-center">
            <div class="step-circle mb-3 mx-auto">2</div>
            <h6 class="fw-bold">Thẩm Định Thế Chân</h6>
            <p class="text-muted small">
              Nhân viên kiểm tra CCCD, ghi nhận tài sản cọc vào <em>ChiTietPhieuThue (PhuongThuc, SoTienCoc)</em> và cập nhật trạng thái 'Đang giữ cọc'.
            </p>
          </div>

          <!-- Bước 3: Ký hợp đồng & Bàn giao | Step 3: Contract signing & Device handover -->
          <div class="col-lg-3 col-md-6 text-center">
            <div class="step-circle mb-3 mx-auto">3</div>
            <h6 class="fw-bold">Ký Hợp Đồng & Bàn Giao</h6>
            <p class="text-muted small">
              Lập biên bản <em>HopDong_GiaoNhan</em>, ghi nhận mã tem niêm phong <em>(TinhTrangLucGiao)</em>, đổi máy sang 'Đang thuê'.
            </p>
          </div>

          <!-- Bước 4: Kiểm tra & Hoàn cọc 100% | Step 4: Inspection & 100% Deposit refund -->
          <div class="col-lg-3 col-md-6 text-center">
            <div class="step-circle mb-3 mx-auto">4</div>
            <h6 class="fw-bold">Kiểm Tra & Hoàn Cọc 100%</h6>
            <p class="text-muted small">
              Kiểm tra nguyên tem niêm phong, đúng hạn &rarr; Cập nhật <em>TinhTrangCoc = 'Hoàn 100%'</em>, đổi trạng thái máy sang 'Sẵn sàng'.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT DỮ LIỆU CÁC PHƯƠNG THỨC THẾ CHÂN
// ENGLISH: IMPORT DEPOSIT & COLLATERAL METHODS METADATA
// ============================================================================================
import { depositMethods } from '@/data/mockData';
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS CHO PHẦN CHÍNH SÁCH THẾ CHÂN & CÁC THẺ PHƯƠNG THỨC                         */
/* ENGLISH: SCOPED STYLES FOR COLLATERAL POLICY & METHOD CARDS                                  */
/* ============================================================================================ */
.deposit-policy-section {
  background: #f1f5f9;
  border-radius: 24px;
}

.policy-method-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.policy-method-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
  border-color: #0d6efd;
}

.method-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
</style>
