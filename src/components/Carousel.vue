<template>
  <div class="carousel-hero-container my-3">
    <div class="container">
      <div id="trongNhanHeroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
        <!-- Indicators -->
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#trongNhanHeroCarousel"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#trongNhanHeroCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#trongNhanHeroCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        <!-- Slides -->
        <div class="carousel-inner rounded-4 overflow-hidden shadow-lg">
          <!-- Slide 1: Flagship Showcase -->
          <div class="carousel-item active" data-bs-interval="4500">
            <div class="slide-content slide-gradient-1 d-flex align-items-center">
              <div class="row w-100 align-items-center mx-0 px-md-5 px-3">
                <div class="col-lg-7 text-white py-4">
                  <span class="badge bg-warning text-dark fw-bold mb-2 px-3 py-1.5 rounded-pill">
                    <i class="fa fa-fire me-1"></i> THUÊ FLAGSHIP 2024 - 2025
                  </span>
                  <h1 class="hero-title fw-black mb-3">
                    Thuê iPhone 16 Pro Max <br />
                    & Samsung Galaxy S24 Ultra
                  </h1>
                  <p class="hero-desc text-slate-200 mb-4">
                    Trải nghiệm đỉnh cao công nghệ chỉ từ <strong>220.000₫/ngày</strong>. 
                    Phục vụ chụp ảnh du lịch, sự kiện văn nghệ, quay phim chuyên nghiệp, test app iOS/Android.
                  </p>
                  <div class="d-flex flex-wrap gap-2 gap-md-3 hero-btn-group">
                    <a href="#phone-catalog-section" class="btn btn-light btn-lg px-4 py-2.5 fw-bold rounded-pill shadow">
                      <i class="fa fa-bolt text-primary me-2"></i> Thuê ngay hôm nay
                    </a>
                    <a href="#deposit-policy-section" class="btn btn-outline-light btn-lg px-4 py-2.5 fw-bold rounded-pill">
                      <i class="fa fa-info-circle me-2"></i> Bảng giá & Thủ tục
                    </a>
                  </div>
                </div>
                <div class="col-lg-5 text-center d-none d-lg-block">
                  <div class="hero-image-wrapper">
                    <img
                      src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png"
                      alt="iPhone 16 Pro Max"
                      class="hero-img floating-anim"
                      @error="onImgError"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 2: Deposit Options -->
          <div class="carousel-item" data-bs-interval="4500">
            <div class="slide-content slide-gradient-2 d-flex align-items-center">
              <div class="row w-100 align-items-center mx-0 px-md-5 px-3">
                <div class="col-lg-7 text-white py-4">
                  <span class="badge bg-info text-dark fw-bold mb-2 px-3 py-1.5 rounded-pill">
                    <i class="fa fa-shield me-1"></i> NGHIỆP VỤ THẾ CHÂN LINH HOẠT
                  </span>
                  <h1 class="hero-title fw-black mb-3">
                    3 Hình Thức Đặt Cọc: <br />
                    CCCD, Laptop Hoặc Chuyển Khoản
                  </h1>
                  <p class="hero-desc text-slate-200 mb-4">
                    Không bắt buộc cọc 100% tiền mặt! Khách hàng có thể thế chân bằng 
                    <strong>Căn cước công dân gắn chip</strong>, <strong>Laptop / iPad</strong> hoặc <strong>Chuyển khoản</strong>.
                  </p>
                  <div class="d-flex flex-wrap gap-2 gap-md-3 hero-btn-group">
                    <a href="#deposit-policy-section" class="btn btn-warning btn-lg px-4 py-2.5 fw-bold text-dark rounded-pill shadow">
                      <i class="fa fa-id-card me-2"></i> Xem chi tiết thế chân
                    </a>
                    <a href="#filter-config-section" class="btn btn-outline-light btn-lg px-4 py-2.5 fw-bold rounded-pill">
                      <i class="fa fa-sliders me-2"></i> Lọc cấu hình máy
                    </a>
                  </div>
                </div>
                <div class="col-lg-5 text-center d-none d-lg-block">
                  <div class="hero-image-wrapper">
                    <img
                      src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png"
                      alt="Samsung S24 Ultra"
                      class="hero-img floating-anim"
                      @error="onImgError"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 3: Sealed Warranty & Refund -->
          <div class="carousel-item" data-bs-interval="4500">
            <div class="slide-content slide-gradient-3 d-flex align-items-center">
              <div class="row w-100 align-items-center mx-0 px-md-5 px-3">
                <div class="col-lg-7 text-white py-4">
                  <span class="badge bg-success text-white fw-bold mb-2 px-3 py-1.5 rounded-pill">
                    <i class="fa fa-check-circle me-1"></i> CAM KẾT NIÊM PHONG
                  </span>
                  <h1 class="hero-title fw-black mb-3">
                    Biên Bản Giao Nhận & <br />
                    Hoàn Cọc 100% Nhanh Chóng
                  </h1>
                  <p class="hero-desc text-slate-200 mb-4">
                    Ghi nhận tem niêm phong lúc giao <em>(TinhTrangLucGiao)</em>. 
                    Khi trả máy nguyên vẹn đúng hạn, hệ thống quyết toán hoàn cọc 100% tức thì trong 5 phút!
                  </p>
                  <div class="d-flex flex-wrap gap-2 gap-md-3 hero-btn-group">
                    <a href="#phone-catalog-section" class="btn btn-light btn-lg px-4 py-2.5 fw-bold rounded-pill shadow">
                      <i class="fa fa-mobile me-2"></i> Chọn điện thoại thuê
                    </a>
                  </div>
                </div>
                <div class="col-lg-5 text-center d-none d-lg-block">
                  <div class="hero-image-wrapper">
                    <img
                      src="https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-xam-1-1.jpg"
                      alt="Galaxy Z Fold 6"
                      class="hero-img floating-anim"
                      @error="onImgError"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <button class="carousel-control-prev" type="button" data-bs-target="#trongNhanHeroCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Trước</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#trongNhanHeroCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Tiếp theo</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onImgError } from '@/utils/formatters';
</script>

<style scoped>
.carousel-hero-container {
  width: 100%;
}

.slide-content {
  min-height: 420px;
  padding: 40px 0;
  position: relative;
  overflow: hidden;
}

.slide-gradient-1 {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%);
}

.slide-gradient-2 {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
}

.slide-gradient-3 {
  background: linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #115e59 100%);
}

.hero-title {
  font-size: 2.2rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.hero-desc {
  font-size: 1.05rem;
  max-width: 580px;
  line-height: 1.6;
  opacity: 0.95;
}

.hero-image-wrapper {
  max-width: 320px;
  margin: 0 auto;
}

.hero-img {
  max-height: 320px;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.45));
}

@keyframes floatUpDown {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}

.floating-anim {
  animation: floatUpDown 4s ease-in-out infinite;
}

.carousel-indicators [data-bs-target] {
  width: 30px;
  height: 6px;
  border-radius: 4px;
}

/* ============================================================================================ */
/* RESPONSIVE BANNER CHO ĐIỆN THOẠI & TABLET (< 768px)                                         */
/* ============================================================================================ */
@media (max-width: 768px) {
  .slide-content {
    min-height: 270px;
    padding: 22px 0 35px 0;
  }
  .hero-title {
    font-size: 1.35rem;
    line-height: 1.3;
    margin-bottom: 0.5rem !important;
  }
  .hero-desc {
    font-size: 0.84rem;
    line-height: 1.45;
    margin-bottom: 0.85rem !important;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .hero-btn-group a {
    padding: 7px 14px !important;
    font-size: 0.8rem !important;
  }
  .carousel-indicators {
    bottom: 2px;
  }
  .carousel-indicators [data-bs-target] {
    width: 18px;
    height: 4px;
  }
}
</style>
