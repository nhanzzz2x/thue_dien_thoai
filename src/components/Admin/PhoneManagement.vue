<template>
  <!-- ========================================================================================== -->
  <!-- VIETNAMESE: QUẢN LÝ KHO ĐIỆN THOẠI, MÃ IMEI & CẤU HÌNH (GIAO DIỆN QUẢN TRỊ ADMIN - GIAI ĐOẠN 2)-->
  <!-- ENGLISH: PHONE INVENTORY, IMEI & HARDWARE CONFIG MANAGEMENT (ADMIN PORTAL - PHASE 2)       -->
  <!-- ERD MAPPING: Ánh xạ 100% hai thực thể cốt lõi DienThoai và CauHinh_PhienBan               -->
  <!-- ========================================================================================== -->
  <div class="phone-management">
    <!-- ==================================================================================== -->
    <!-- VIETNAMESE: TIÊU ĐỀ TRANG QUẢN TRỊ & NÚT THÊM THIẾT BỊ MỚI VÀO KHO                   -->
    <!-- ENGLISH: ADMIN PAGE HEADER & BUTTON TO ADD NEW PHONE TO INVENTORY                     -->
    <!-- ==================================================================================== -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
      <div>
        <h4 class="fw-bold text-dark mb-1">
          <i class="fa fa-mobile text-primary me-2"></i> Quản Lý Kho Điện Thoại & Mã IMEI
        </h4>
        <p class="text-muted small mb-0">
          Quản lý toàn bộ danh mục thiết bị, thông số cấu hình, định mức tiền cọc và tình trạng máy.
        </p>
      </div>

      <div class="d-flex gap-2">
        <!-- Nút mở modal quản lý & thêm hãng điện thoại mới -->
        <button class="btn btn-outline-primary d-flex align-items-center gap-2" @click="isCategoryModalOpen = true">
          <i class="fa fa-tags"></i> Quản Lý & Thêm Hãng Máy
        </button>
        <!-- Nút thêm điện thoại mới vào kho -->
        <button class="btn btn-primary d-flex align-items-center gap-2" @click="openAddModal">
          <i class="fa fa-plus-circle"></i> Thêm Điện Thoại Mới
        </button>
      </div>
    </div>

    <!-- ==================================================================================== -->
    <!-- VIETNAMESE: THANH TÌM KIẾM THEO TÊN/IMEI & BỘ LỌC HÃNG / TRẠNG THÁI MÁY              -->
    <!-- ENGLISH: SEARCH BAR (BY NAME/IMEI) & FILTER DROPDOWNS (BRAND, AVAILABILITY STATUS)   -->
    <!-- ==================================================================================== -->
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
      <div class="row g-2 align-items-center">
        <!-- VIETNAMESE: Tìm kiếm từ khóa theo tên máy hoặc mã IMEI/Serial -->
        <!-- ENGLISH: Search keyword by phone name or IMEI/Serial code     -->
        <div class="col-md-5">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0"><i class="fa fa-search text-muted"></i></span>
            <input
              type="text"
              class="form-control border-start-0"
              placeholder="Tìm theo tên máy hoặc mã IMEI/Serial..."
              v-model="searchKey"
            />
          </div>
        </div>

        <!-- VIETNAMESE: Lọc theo hãng sản xuất động từ danh sách categories -->
        <!-- ENGLISH: Filter by dynamic brand list (DienThoai.HangSanXuat)   -->
        <div class="col-md-3 col-6">
          <select class="form-select" v-model="filterBrand">
            <option value="ALL">Tất cả hãng sản xuất</option>
            <option v-for="cat in availableBrandCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- VIETNAMESE: Lọc theo trạng thái máy (SAN_SANG, DANG_THUE, BAO_TRI) -->
        <!-- ENGLISH: Filter by device state (DienThoai.TinhTrangMay)           -->
        <div class="col-md-3 col-6">
          <select class="form-select" v-model="filterStatus">
            <option value="ALL">Tất cả trạng thái máy</option>
            <option value="SAN_SANG">Sẵn sàng thuê</option>
            <option value="DANG_THUE">Đang có khách thuê</option>
            <option value="BAO_TRI">Đang bảo trì / Kiểm định</option>
          </select>
        </div>

        <!-- VIETNAMESE: Nút đặt lại bộ lọc về mặc định | ENGLISH: Reset filters -->
        <div class="col-md-1 text-end">
          <button class="btn btn-outline-secondary w-100" @click="resetFilters" title="Đặt lại bộ lọc">
            <i class="fa fa-refresh"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ==================================================================================== -->
    <!-- VIETNAMESE: BẢNG DANH SÁCH THIẾT BỊ TRONG KHO (BẢNG DienThoai & CauHinh_PhienBan)   -->
    <!-- ENGLISH: INVENTORY DEVICES DATA TABLE (DienThoai & CauHinh_PhienBan TABLES)         -->
    <!-- ==================================================================================== -->
    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle small mb-0">
          <thead class="table-light">
            <tr>
              <!-- Cột 1: Mã điện thoại | Column 1: Phone ID -->
              <th style="width: 50px;">Mã</th>
              <!-- Cột 2: Hình ảnh đại diện | Column 2: Default thumbnail -->
              <th>Ảnh</th>
              <!-- Cột 3: Tên máy & Cấu hình | Column 3: Name & Specs -->
              <th>Tên Thiết Bị / Cấu Hình</th>
              <!-- Cột 4: Hãng sản xuất | Column 4: Brand -->
              <th>Hãng</th>
              <!-- Cột 5: Số IMEI / Serial | Column 5: IMEI Serial code -->
              <th>Số IMEI / Serial</th>
              <!-- Cột 6: Giá thuê theo ngày | Column 6: Daily rental price -->
              <th>Giá Thuê / Ngày</th>
              <!-- Cột 7: Tiền cọc yêu cầu | Column 7: Required deposit benchmark -->
              <th>Định Mức Cọc</th>
              <!-- Cột 8: Tình trạng máy | Column 8: Machine status -->
              <th>Trạng Thái</th>
              <!-- Cột 9: Thao tác | Column 9: Actions -->
              <th class="text-end" style="width: 140px;">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="phone in displayPhones" :key="phone.maDienThoai">
              <!-- Mã điện thoại (DienThoai.MaDienThoai) -->
              <td class="fw-bold text-muted">#{{ phone.maDienThoai }}</td>

              <!-- Ảnh sản phẩm (DienThoai.MacDinh) -->
              <td>
                <img :src="phone.MacDinh" :alt="phone.TenDienThoai" class="phone-admin-thumb rounded-3 border p-1" @error="onImgError" />
              </td>

              <!-- Tên máy & cấu hình vi xử lý, RAM (CauHinh_PhienBan) -->
              <td>
                <div class="fw-bold text-dark">{{ phone.TenDienThoai }}</div>
                <div class="text-muted" style="font-size: 0.75rem;">
                  <span class="me-2"><i class="fa fa-microchip text-primary"></i> {{ phone.cauHinh?.Chipset }}</span>
                  <span><i class="fa fa-database text-warning"></i> {{ phone.cauHinh?.RAM_ROM }}</span>
                </div>
              </td>

              <!-- Hãng sản xuất (DienThoai.HangSanXuat) -->
              <td>
                <span class="badge bg-light text-dark border">{{ phone.hangSanXuat }}</span>
              </td>

              <!-- Số IMEI định danh duy nhất (DienThoai.SoIMEI_Serial) -->
              <td>
                <span class="badge bg-light text-primary border font-monospace">
                  {{ phone.SoIMEI_Serial }}
                </span>
              </td>

              <!-- Giá thuê theo ngày (DienThoai.GiaThueNgay) -->
              <td class="fw-bold text-danger">
                {{ convertToVND(phone.giaThueNgay) }}
              </td>

              <!-- Định mức cọc tiêu chuẩn (DienThoai.TienCocYeuCau) -->
              <td class="text-primary fw-semibold">
                {{ convertToVND(phone.tienCocYeuCau) }}
              </td>

              <!-- Trạng thái máy (DienThoai.TinhTrangMay) - Có thể click để đổi trạng thái -->
              <td>
                <span
                  class="badge px-2.5 py-1.5 rounded-pill cursor-pointer"
                  :class="getStatusClass(phone.TinhTrangMay)"
                  @click="toggleStatus(phone)"
                  title="Click để đổi nhanh trạng thái: Sẵn sàng -> Đang thuê -> Bảo trì"
                >
                  <i class="fa fa-circle me-1" style="font-size: 7px;"></i>
                  {{ phone.TinhTrangMayText || phone.TinhTrangMay }}
                </span>
              </td>

              <!-- Các nút Sửa và Xóa máy -->
              <td class="text-end">
                <button
                  class="btn btn-outline-primary btn-sm me-1"
                  @click="openEditModal(phone)"
                  title="Chỉnh sửa thông tin máy & cấu hình"
                >
                  <i class="fa fa-pencil"></i>
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="handleDelete(phone)"
                  title="Xóa máy khỏi kho"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ==================================================================================== -->
    <!-- VIETNAMESE: MODAL THÊM MỚI HOẶC CHỈNH SỬA THIẾT BỊ ĐIỆN THOẠI                        -->
    <!-- ENGLISH: MODAL DIALOG TO CREATE OR EDIT PHONE & HARDWARE SPECS                       -->
    <!-- ERD: Đồng thời ghi dữ liệu vào 2 bảng DienThoai và CauHinh_PhienBan                  -->
    <!-- ==================================================================================== -->
    <div v-if="isModalOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3" @click.self="isModalOpen = false; closeAllPriceDropdowns();">
      <div class="bg-white rounded-4 p-4 shadow-lg border" style="max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto;" @click="closeAllPriceDropdowns">
        <div class="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
          <h5 class="fw-bold mb-0 text-primary">
            <i class="fa" :class="isEditMode ? 'fa-pencil' : 'fa-plus-circle'"></i>
            {{ isEditMode ? 'Cập Nhật Thiết Bị' : 'Thêm Thiết Bị Mới Vào Kho' }}
          </h5>
          <button class="btn-close" @click="isModalOpen = false"></button>
        </div>

        <form @submit.prevent="savePhone">
          <div class="row g-3">
            <!-- Tên điện thoại (DienThoai.TenDienThoai) -->
            <div class="col-md-8">
              <label class="form-label small fw-bold">Tên Điện Thoại *</label>
              <input type="text" class="form-control" v-model="formData.TenDienThoai" required placeholder="VD: iPhone 16 Pro Max 256GB" />
            </div>

            <!-- Hãng sản xuất (DienThoai.HangSanXuat) lấy động từ danh sách categories -->
            <div class="col-md-4">
              <label class="form-label small fw-bold">Hãng Sản Xuất *</label>
              <select class="form-select" v-model="formData.hangSanXuat" required>
                <option v-for="cat in availableBrandCategories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <!-- Mã IMEI / Serial (DienThoai.SoIMEI_Serial) - Có camera quét & nhập tay -->
            <div class="col-md-6">
              <label class="form-label small fw-bold d-flex justify-content-between align-items-center">
                <span>Số IMEI / Serial *</span>
                <button type="button" class="btn btn-link btn-sm p-0 text-decoration-none text-primary" @click="openImeiScanner">
                  <i class="fa fa-camera me-1"></i> Quét camera
                </button>
              </label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control font-monospace"
                  v-model="formData.SoIMEI_Serial"
                  required
                  placeholder="VD: 358912345678901"
                />
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="openImeiScanner"
                  title="Bật Camera quét số IMEI / Barcode trên thân máy"
                >
                  <i class="fa fa-camera fs-6"></i>
                </button>
              </div>
              <small class="text-muted d-block mt-1" style="font-size: 0.73rem;">
                <i class="fa fa-info-circle text-primary me-1"></i>Mở bàn phím số và bấm: <strong class="text-danger font-monospace">*#06#</strong> để kiểm tra số IMEI
              </small>
            </div>

            <!-- Chipset vi xử lý (CauHinh_PhienBan.Chipset) -->
            <div class="col-md-6">
              <label class="form-label small fw-bold">Chipset (CPU/GPU)</label>
              <input type="text" class="form-control" v-model="formData.Chipset" placeholder="VD: Apple A18 Pro, Snapdragon 8 Gen 3" />
            </div>

            <!-- Bộ nhớ RAM & ROM (CauHinh_PhienBan.RAM_ROM) -->
            <div class="col-md-6">
              <label class="form-label small fw-bold">RAM & Bộ Nhớ Trong</label>
              <input type="text" class="form-control" v-model="formData.RAM_ROM" placeholder="VD: 8GB / 256GB" />
            </div>

            <!-- Trạng thái thiết bị (DienThoai.TinhTrangMay) -->
            <div class="col-md-6">
              <label class="form-label small fw-bold">Tình Trạng Thiết Bị</label>
              <select class="form-select" v-model="formData.TinhTrangMay">
                <option value="SAN_SANG">Sẵn sàng thuê</option>
                <option value="DANG_THUE">Đang thuê</option>
                <option value="BAO_TRI">Đang bảo trì</option>
              </select>
            </div>

            <!-- Giá thuê theo ngày (DienThoai.GiaThueNgay) - Nhập tay & Mũi tên xổ xuống chọn nhanh -->
            <div class="col-md-6 position-relative">
              <label class="form-label small fw-bold">Giá Thuê/Ngày (VNĐ) *</label>
              <div class="position-relative">
                <input
                  type="text"
                  class="form-control fw-bold text-danger font-monospace pe-4"
                  :value="giaThueDisplay"
                  @input="onGiaThueInput($event.target.value)"
                  placeholder="VD: 120.000"
                  required
                />
                <button
                  type="button"
                  class="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted px-2 py-1 shadow-none"
                  style="cursor: pointer; z-index: 4;"
                  @click.stop="toggleGiaThueDropdown"
                  title="Bấm để chọn nhanh mức giá gợi ý"
                >
                  <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem;"></i>
                </button>

                <!-- Menu chọn nhanh giá thuê xổ xuống -->
                <ul
                  v-if="showGiaThueDropdown"
                  class="dropdown-menu show shadow-lg w-100 mt-1 py-1"
                  style="position: absolute; top: 100%; left: 0; z-index: 1060; max-height: 220px; overflow-y: auto;"
                >
                  <li class="dropdown-header small text-muted py-1 fw-bold">
                    <i class="fa fa-list-ul me-1"></i> MỨC GIÁ THUÊ GỢI Ý
                  </li>
                  <li v-for="p in [120000, 150000, 200000, 250000, 290000, 350000, 500000]" :key="p">
                    <button
                      type="button"
                      class="dropdown-item d-flex justify-content-between align-items-center py-2 px-3"
                      :class="{ 'active bg-danger text-white': formData.giaThueNgay === p }"
                      @click="selectGiaThuePreset(p)"
                    >
                      <span class="fw-bold font-monospace">{{ formatCurrency(p) }} ₫</span>
                      <span class="small" :class="formData.giaThueNgay === p ? 'text-white-50' : 'text-muted'">/ngày</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Tiền cọc yêu cầu (DienThoai.TienCocYeuCau) - Nhập tay & Mũi tên xổ xuống chọn nhanh -->
            <div class="col-md-6 position-relative">
              <label class="form-label small fw-bold">Tiền Cọc (VNĐ) *</label>
              <div class="position-relative">
                <input
                  type="text"
                  class="form-control fw-bold text-primary font-monospace pe-4"
                  :value="tienCocDisplay"
                  @input="onTienCocInput($event.target.value)"
                  placeholder="VD: 12.000.000"
                  required
                />
                <button
                  type="button"
                  class="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted px-2 py-1 shadow-none"
                  style="cursor: pointer; z-index: 4;"
                  @click.stop="toggleTienCocDropdown"
                  title="Bấm để chọn nhanh mức tiền cọc gợi ý"
                >
                  <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem;"></i>
                </button>

                <!-- Menu chọn nhanh tiền cọc xổ xuống -->
                <ul
                  v-if="showTienCocDropdown"
                  class="dropdown-menu show shadow-lg w-100 mt-1 py-1"
                  style="position: absolute; top: 100%; left: 0; z-index: 1060; max-height: 220px; overflow-y: auto;"
                >
                  <li class="dropdown-header small text-muted py-1 fw-bold">
                    <i class="fa fa-list-ul me-1"></i> MỨC TIỀN CỌC GỢI Ý
                  </li>
                  <li v-for="d in [5000000, 8000000, 10000000, 12000000, 15000000, 20000000, 25000000]" :key="d">
                    <button
                      type="button"
                      class="dropdown-item d-flex justify-content-between align-items-center py-2 px-3"
                      :class="{ 'active bg-primary text-white': formData.tienCocYeuCau === d }"
                      @click="selectTienCocPreset(d)"
                    >
                      <span class="fw-bold font-monospace">{{ formatCurrency(d) }} ₫</span>
                      <span class="small" :class="formData.tienCocYeuCau === d ? 'text-white-50' : 'text-muted'">cọc</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Ảnh sản phẩm URL / Tải từ máy / Chụp trực tiếp (DienThoai.MacDinh) -->
            <div class="col-12">
              <label class="form-label small fw-bold">Ảnh Sản Phẩm (Dán link URL hoặc tải ảnh trực tiếp từ máy) *</label>
              <div class="row g-2 align-items-center">
                <div class="col-md-8">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="formData.MacDinh"
                      placeholder="Dán link ảnh https://... hoặc bấm nút tải ảnh"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm"
                      @click="triggerImageUpload"
                      title="Tải file ảnh từ máy tính"
                    >
                      <i class="fa fa-upload me-1"></i> Tải ảnh
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm"
                      @click="openPhoneCamera"
                      title="Chụp ảnh máy trực tiếp bằng Camera"
                    >
                      <i class="fa fa-camera me-1"></i> Chụp ảnh
                    </button>
                  </div>
                  <!-- Input file ẩn để chọn ảnh từ máy tính -->
                  <input
                    type="file"
                    ref="phoneFileInputRef"
                    accept="image/*"
                    class="d-none"
                    @change="onPhoneFileSelected"
                  />
                </div>

                <!-- Khung xem trước ảnh sản phẩm -->
                <div class="col-md-4">
                  <div class="d-flex align-items-center gap-2 p-1.5 bg-light rounded border">
                    <img
                      :src="formData.MacDinh || 'https://via.placeholder.com/80?text=Chua+co+anh'"
                      alt="Preview"
                      class="rounded border bg-white"
                      style="width: 48px; height: 48px; object-fit: contain;"
                      @error="onImgError"
                    />
                    <div class="min-w-0 flex-grow-1">
                      <small class="d-block fw-bold text-dark text-truncate" style="font-size: 0.78rem;">Ảnh hiển thị</small>
                      <small class="text-success d-block" style="font-size: 0.7rem;"><i class="fa fa-check me-0.5"></i> Đã sẵn sàng</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mô tả chi tiết ngoại quan & phụ kiện -->
            <div class="col-12">
              <label class="form-label small fw-bold">Mô Tả Thiết Bị</label>
              <textarea class="form-control" rows="3" v-model="formData.moTa" placeholder="Tình trạng ngoại quan, phụ kiện đi kèm..."></textarea>
            </div>
          </div>

          <!-- Nút hủy và nút lưu -->
          <div class="text-end pt-3 mt-3 border-top">
            <button type="button" class="btn btn-secondary me-2" @click="isModalOpen = false">Hủy</button>
            <button type="submit" class="btn btn-primary">
              <i class="fa fa-save me-1"></i> {{ isEditMode ? 'Cập Nhật' : 'Lưu Vào Kho' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ====================================================================================== -->
    <!-- MODAL QUẢN LÝ & THÊM HÃNG ĐIỆN THOẠI MỚI (Brand Category Management Modal)              -->
    <!-- ====================================================================================== -->
    <div v-if="isCategoryModalOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="modal-dialog-custom bg-white rounded-4 p-4 shadow-lg border" style="max-width: 680px; width: 100%; max-height: 90vh; overflow-y: auto;">
        <!-- Header Modal -->
        <div class="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
          <h5 class="fw-bold mb-0 text-primary">
            <i class="fa fa-tags me-1"></i> Quản Lý & Thêm Hãng Điện Thoại (Thương Hiệu)
          </h5>
          <button class="btn-close" @click="isCategoryModalOpen = false"></button>
        </div>

        <!-- Form Thêm Hãng Mới -->
        <div class="bg-light p-3 rounded-3 border mb-4">
          <h6 class="fw-bold text-dark small mb-3">
            <i class="fa fa-plus-circle text-success me-1"></i> Thêm Hãng Máy Mới Vào Hệ Thống:
          </h6>
          <form @submit.prevent="submitAddCategory">
            <div class="row g-2 mb-2">
              <div class="col-md-6">
                <label class="form-label small fw-bold">Tên hãng máy *</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="newCategoryForm.name"
                  placeholder="Ví dụ: OPPO, Vivo, Realme, Sony..."
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold">Mã định danh (ID/Slug)</label>
                <input
                  type="text"
                  class="form-control form-control-sm font-monospace text-uppercase"
                  v-model="newCategoryForm.id"
                  placeholder="Tự sinh nếu để trống (VD: OPPO)"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold">Biểu tượng (Icon)</label>
                <select class="form-select form-select-sm" v-model="newCategoryForm.icon">
                  <option value="fa-mobile">📱 Điện thoại thông minh (fa-mobile)</option>
                  <option value="fa-apple">🍏 Quả táo Apple (fa-apple)</option>
                  <option value="fa-android">🤖 Robot Android (fa-android)</option>
                  <option value="fa-bolt">⚡ Tia sét Xiaomi (fa-bolt)</option>
                  <option value="fa-gamepad">🎮 Tay cầm Game (fa-gamepad)</option>
                  <option value="fa-crown">👑 Vương miện Flagship (fa-crown)</option>
                  <option value="fa-camera">📷 Máy ảnh (fa-camera)</option>
                  <option value="fa-fire">🔥 Ngọn lửa Hot (fa-fire)</option>
                  <option value="fa-star">⭐ Ngôi sao (fa-star)</option>
                  <option value="fa-cube">📦 Khối hộp công nghệ (fa-cube)</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold">Mô tả ngắn</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="newCategoryForm.description"
                  placeholder="Mô tả cho trang danh mục..."
                />
              </div>
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-success btn-sm px-3">
                <i class="fa fa-plus me-1"></i> Thêm Hãng Mới
              </button>
            </div>
          </form>
        </div>

        <!-- Danh sách các hãng máy hiện có -->
        <h6 class="fw-bold text-dark small mb-2">
          <i class="fa fa-list me-1"></i> Danh Sách Các Hãng Máy Hiện Tại ({{ availableBrandCategories.length }} hãng):
        </h6>
        <div class="table-responsive">
          <table class="table table-sm table-bordered align-middle small mb-3">
            <thead class="table-light">
              <tr>
                <th style="width: 45px;" class="text-center">Icon</th>
                <th>Tên Hãng</th>
                <th style="width: 110px;">Mã (ID)</th>
                <th style="width: 90px;" class="text-center">Số máy</th>
                <th style="width: 70px;" class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in availableBrandCategories" :key="cat.id">
                <td class="text-center">
                  <i class="fa fs-6 text-primary" :class="cat.icon || 'fa-tag'"></i>
                </td>
                <td class="fw-bold">{{ cat.name }}</td>
                <td><code>{{ cat.id }}</code></td>
                <td class="text-center">
                  <span class="badge bg-light text-dark border">
                    {{ getPhoneCountByBrand(cat.id) }} máy
                  </span>
                </td>
                <td class="text-center">
                  <button
                    class="btn btn-outline-danger btn-sm py-0 px-2"
                    @click="handleDeleteCategory(cat)"
                    title="Xóa hãng này"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-end border-top pt-2">
          <button class="btn btn-secondary btn-sm" @click="isCategoryModalOpen = false">
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>

    <!-- ====================================================================================== -->
    <!-- MODAL QUÉT CAMERA SỐ IMEI / MÃ VẠCH / QR CODE CHUẨN XÁC                                -->
    <!-- ====================================================================================== -->
    <div v-if="isImeiScannerOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="modal-dialog-custom bg-white rounded-4 p-4 shadow-lg border" style="max-width: 470px; width: 100%;">
        <div class="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
          <h6 class="fw-bold mb-0 text-primary d-flex align-items-center gap-2">
            <i class="fa fa-barcode fs-5"></i>
            <span>Quét Mã Vạch IMEI / QR Code Thiết Bị</span>
          </h6>
          <button class="btn-close" @click="closeImeiScanner"></button>
        </div>

        <!-- Ghi chú hướng dẫn mở mã IMEI trên điện thoại -->
        <div class="alert alert-info py-2 px-3 mb-3 d-flex align-items-center gap-2 rounded-3 border-info border-opacity-25 shadow-sm" style="background-color: #f0f9ff;">
          <i class="fa fa-info-circle text-primary fs-5 flex-shrink-0"></i>
          <div class="small text-dark">
            <strong></strong> Mở bàn phím số và bấm: 
            <span class="badge bg-white text-danger border border-danger-subtle font-monospace px-2 py-0.5 fs-6 shadow-sm mx-1">*#06#</span> 
            để kiểm tra số IMEI
          </div>
        </div>

        <!-- Khung Camera & Kính ngắm Barcode/QR Code (Kích thước ngang chuẩn mã vạch IMEI) -->
        <div class="position-relative rounded-3 overflow-hidden bg-black text-center mb-3" style="min-height: 260px; max-height: 280px;">
          <video ref="imeiVideoRef" class="w-100 h-100" style="object-fit: cover; min-height: 260px;" autoplay playsinline muted></video>
          
          <!-- Lớp phủ ngắm mã Barcode IMEI / QR -->
          <div class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3" style="pointer-events: none;">
            
            <!-- Khung định vị mã vạch (Viewfinder Box tỉ lệ ngang rộng) -->
            <div class="scanner-frame" :class="{ 'detected': isDetected }">
              <span class="scanner-corner corner-tl"></span>
              <span class="scanner-corner corner-tr"></span>
              <span class="scanner-corner corner-bl"></span>
              <span class="scanner-corner corner-br"></span>
              
              <!-- Tia laser quét lên xuống khi đang tìm kiếm mã thực tế -->
              <div v-if="!isDetected" class="scanner-laser"></div>
              
              <!-- Trạng thái khi nhận diện thành công mã -->
              <div v-if="isDetected" class="h-100 d-flex flex-column align-items-center justify-content-center bg-success bg-opacity-25 rounded-3">
                <i class="fa fa-check-circle text-success fs-1"></i>
                <div class="badge bg-success mt-2 font-monospace fs-6 px-3 py-1.5 shadow">
                  {{ scannedImeiResult }}
                </div>
              </div>
            </div>

            <!-- Dòng chữ hướng dẫn trạng thái quét trực tiếp -->
            <div class="mt-3 text-center">
              <span v-if="!isDetected" class="badge bg-dark bg-opacity-75 text-light px-3 py-1.5 small fw-normal d-inline-flex align-items-center gap-2">
                <span class="spinner-grow spinner-grow-sm text-info" style="width: 0.55rem; height: 0.55rem;"></span>
                Đang tự động quét mã vạch IMEI / QR trên màn hình hoặc vỏ máy
              </span>
              <span v-else class="badge bg-success px-3 py-1.5 small fw-bold">
                ✓ Đã nhận diện mã thành công!
              </span>
            </div>
          </div>
        </div>

        <!-- Các nút thao tác hỗ trợ linh hoạt -->
        <div class="d-flex flex-column gap-2">
          <div class="d-flex gap-2">
            <button
              type="button"
              class="btn btn-primary btn-sm py-2 flex-grow-1 fw-bold"
              @click="snapAndDecodeCurrentFrame"
              :disabled="isDetected"
              title="Bấm để chụp lại và quét mã khung hình hiện tại"
            >
              <i class="fa fa-camera me-1"></i> Bấm Chụp & Quét Khung Này
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm py-2 px-3"
              @click="triggerQrFileInput"
              title="Tải ảnh màn hình chứa mã vạch IMEI từ máy"
            >
              <i class="fa fa-upload me-1"></i> Tải ảnh mã
            </button>
            <input
              type="file"
              ref="qrFileInputRef"
              accept="image/*"
              class="d-none"
              @change="onQrFileUploaded"
            />
          </div>

          <button
            type="button"
            class="btn btn-outline-primary btn-sm py-1.5 text-truncate"
            @click="useSampleImei('354889099431072')"
            :disabled="isDetected"
            title="Nạp ngay mã IMEI từ ảnh iPhone bạn gửi"
          >
            <i class="fa fa-magic me-1"></i> Nạp số IMEI mẫu máy bạn: <strong>354889099431072</strong>
          </button>

          <button type="button" class="btn btn-light btn-sm text-muted" @click="closeImeiScanner">
            Đóng camera & nhập tay
          </button>
        </div>
      </div>
    </div>

    <!-- ====================================================================================== -->
    <!-- MODAL CHỤP ẢNH ĐIỆN THOẠI TRỰC TIẾP BẰNG CAMERA                                       -->
    <!-- ====================================================================================== -->
    <div v-if="isPhoneCameraOpen" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="modal-dialog-custom bg-white rounded-4 p-4 shadow-lg border" style="max-width: 460px; width: 100%;">
        <div class="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
          <h6 class="fw-bold mb-0 text-primary">
            <i class="fa fa-camera me-1"></i> Chụp Ảnh Thiết Bị Trực Tiếp
          </h6>
          <button class="btn-close" @click="closePhoneCamera"></button>
        </div>

        <div class="rounded-3 overflow-hidden bg-black mb-3 text-center" style="min-height: 240px;">
          <video ref="phoneVideoRef" class="w-100" style="max-height: 260px; object-fit: cover;" autoplay playsinline></video>
        </div>

        <div class="d-flex justify-content-between gap-2">
          <button type="button" class="btn btn-secondary btn-sm" @click="closePhoneCamera">Hủy</button>
          <button type="button" class="btn btn-primary-smart btn-sm px-4" @click="capturePhonePhoto">
            <i class="fa fa-camera me-1"></i> Chụp ảnh này
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ============================================================================================
// VIETNAMESE: IMPORT CÁC MODULE VUE & STORE ĐIỆN THOẠI
// ENGLISH: IMPORT VUE CORE LIBS & PHONE STORE
// ============================================================================================
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { usePhoneStore } from '@/stores/phone.store';
import { convertToVND, onImgError } from '@/utils/formatters';

// Khởi tạo phone store
// Initialize phone store
const phoneStore = usePhoneStore();

// Biến quản lý tìm kiếm và lọc
// Search & filter state variables
const searchKey = ref('');
const filterBrand = ref('ALL');
const filterStatus = ref('ALL');

// Trạng thái modal Thêm/Sửa
// Modal visibility and edit state
const isModalOpen = ref(false);
const isEditMode = ref(false);
const currentEditId = ref(null);

// Trạng thái modal Quản lý & Thêm hãng máy
const isCategoryModalOpen = ref(false);
const newCategoryForm = ref({
  name: '',
  id: '',
  icon: 'fa-mobile',
  description: ''
});

// Danh sách các hãng máy (loại trừ ALL)
const availableBrandCategories = computed(() => {
  return phoneStore.categories.filter(c => c.id !== 'ALL');
});

// Đếm số lượng máy theo hãng
const getPhoneCountByBrand = (brandId) => {
  return phoneStore.phones.filter(p => p.hangSanXuat === brandId || p.category === brandId).length;
};

// Form dữ liệu tương ứng với thực thể DienThoai và CauHinh_PhienBan
// Form state object mapped directly to DienThoai & CauHinh_PhienBan ERD entities
const formData = ref({
  TenDienThoai: '',
  hangSanXuat: 'APPLE',
  SoIMEI_Serial: '',
  giaThueNgay: 250000,
  tienCocYeuCau: 12000000,
  Chipset: '',
  RAM_ROM: '8GB / 256GB',
  TinhTrangMay: 'SAN_SANG',
  MacDinh: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
  moTa: ''
});

// Biến hiển thị chuỗi có dấu chấm phân cách hàng nghìn (VD: 120.000 / 12.000.000)
const giaThueDisplay = ref('250.000');
const tienCocDisplay = ref('12.000.000');

// Trạng thái mở/đóng menu mũi tên xổ xuống chọn nhanh giá thuê & tiền cọc
const showGiaThueDropdown = ref(false);
const showTienCocDropdown = ref(false);

const toggleGiaThueDropdown = () => {
  showGiaThueDropdown.value = !showGiaThueDropdown.value;
  showTienCocDropdown.value = false;
};

const toggleTienCocDropdown = () => {
  showTienCocDropdown.value = !showTienCocDropdown.value;
  showGiaThueDropdown.value = false;
};

const selectGiaThuePreset = (num) => {
  setGiaThuePreset(num);
  showGiaThueDropdown.value = false;
};

const selectTienCocPreset = (num) => {
  setTienCocPreset(num);
  showTienCocDropdown.value = false;
};

const closeAllPriceDropdowns = () => {
  showGiaThueDropdown.value = false;
  showTienCocDropdown.value = false;
};

// Hàm format số nguyên sang dạng dấu chấm phân cách hàng nghìn
const formatCurrency = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const num = Number(val);
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN');
};

// Xử lý khi nhập tay giá thuê
const onGiaThueInput = (val) => {
  const digits = val.replace(/\D/g, '');
  const num = digits ? Number(digits) : 0;
  formData.value.giaThueNgay = num;
  giaThueDisplay.value = digits ? Number(digits).toLocaleString('vi-VN') : '';
  showGiaThueDropdown.value = false;
};

// Chọn nhanh giá thuê gợi ý
const setGiaThuePreset = (num) => {
  formData.value.giaThueNgay = num;
  giaThueDisplay.value = num.toLocaleString('vi-VN');
};

// Xử lý khi nhập tay tiền cọc
const onTienCocInput = (val) => {
  const digits = val.replace(/\D/g, '');
  const num = digits ? Number(digits) : 0;
  formData.value.tienCocYeuCau = num;
  tienCocDisplay.value = digits ? Number(digits).toLocaleString('vi-VN') : '';
  showTienCocDropdown.value = false;
};

// Chọn nhanh tiền cọc gợi ý
const setTienCocPreset = (num) => {
  formData.value.tienCocYeuCau = num;
  tienCocDisplay.value = num.toLocaleString('vi-VN');
};

// ============================================================================================
// LOGIC TẢI ẢNH TỪ MÁY TÍNH & CAMERA CHỤP ẢNH MÁY TRỰC TIẾP
// ============================================================================================
const phoneFileInputRef = ref(null);
const isPhoneCameraOpen = ref(false);
const phoneVideoRef = ref(null);
let phoneMediaStream = null;

const triggerImageUpload = () => {
  if (phoneFileInputRef.value) {
    phoneFileInputRef.value.click();
  }
};

const onPhoneFileSelected = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    formData.value.MacDinh = event.target.result;
    Swal.fire({
      icon: 'success',
      title: 'Đã tải ảnh lên!',
      text: 'Ảnh từ máy tính đã được nạp thành công.',
      timer: 1500,
      showConfirmButton: false
    });
  };
  reader.readAsDataURL(file);
};

const openPhoneCamera = async () => {
  isPhoneCameraOpen.value = true;
  try {
    phoneMediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    if (phoneVideoRef.value) {
      phoneVideoRef.value.srcObject = phoneMediaStream;
    }
  } catch (err) {
    console.warn('Không thể mở camera chụp ảnh:', err);
  }
};

const closePhoneCamera = () => {
  if (phoneMediaStream) {
    phoneMediaStream.getTracks().forEach(t => t.stop());
    phoneMediaStream = null;
  }
  isPhoneCameraOpen.value = false;
};

const capturePhonePhoto = () => {
  if (!phoneVideoRef.value) return;
  const canvas = document.createElement('canvas');
  canvas.width = phoneVideoRef.value.videoWidth || 640;
  canvas.height = phoneVideoRef.value.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(phoneVideoRef.value, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

  formData.value.MacDinh = dataUrl;
  closePhoneCamera();

  Swal.fire({
    icon: 'success',
    title: 'Đã chụp ảnh máy thành công!',
    timer: 1500,
    showConfirmButton: false
  });
};

// ============================================================================================
// LOGIC QUÉT MÃ VẠCH (BARCODE CODE 128 / IMEI) & QR CODE QUA CAMERA (REAL-TIME SCANNER)
// ============================================================================================
const isImeiScannerOpen = ref(false);
const imeiVideoRef = ref(null);
const qrFileInputRef = ref(null);
const isDetected = ref(false);
const scannedImeiResult = ref('');
let imeiMediaStream = null;
let scanTimer = null;
let zxingReaderInstance = null;

// Hàm lọc và làm sạch số IMEI / Serial từ chuỗi mã quét được
const cleanImei = (str) => {
  if (!str) return '';
  const trimmed = String(str).trim();
  // Nếu quét được nội dung chứa chuỗi 14 - 17 chữ số (IMEI chuẩn), trích xuất chính xác dãy số đó
  const imeiMatch = trimmed.match(/\b\d{14,17}\b/);
  if (imeiMatch) {
    return imeiMatch[0];
  }
  return trimmed;
};

// Phát âm thanh tiếng BEEP chuẩn máy quét mã vạch
const playBeepSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // Ignore audio errors
  }
};

// Xử lý khi nhận diện thành công mã THỰC TẾ
const handleSuccessScan = (code) => {
  if (isDetected.value) return;
  const finalCode = cleanImei(code);
  if (!finalCode) return;

  isDetected.value = true;
  scannedImeiResult.value = finalCode;

  if (scanTimer) {
    clearTimeout(scanTimer);
    clearInterval(scanTimer);
    scanTimer = null;
  }
  if (zxingReaderInstance) {
    try { zxingReaderInstance.reset(); } catch (e) {}
  }

  // Phát âm thanh tiếng "Bíp!"
  playBeepSound();

  // Rung phản hồi nếu thiết bị hỗ trợ
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate([80, 40, 80]); } catch (e) {}
  }

  // Chờ 600ms hiển thị hiệu ứng xanh lá thành công trên camera
  setTimeout(() => {
    formData.value.SoIMEI_Serial = finalCode;
    closeImeiScanner();
    Swal.fire({
      icon: 'success',
      title: 'Đã nhận diện thành công!',
      html: `Mã IMEI quét được:<br><strong class="font-monospace text-primary fs-5 mt-2 d-inline-block">${finalCode}</strong>`,
      timer: 2200,
      showConfirmButton: false
    });
  }, 650);
};

// Mở camera quét mã thực tế
const openImeiScanner = async () => {
  isImeiScannerOpen.value = true;
  isDetected.value = false;
  scannedImeiResult.value = '';

  try {
    imeiMediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    if (imeiVideoRef.value) {
      imeiVideoRef.value.srcObject = imeiMediaStream;
      await imeiVideoRef.value.play().catch(() => {});
    }
  } catch (err) {
    console.warn('Không thể truy cập camera thực tế:', err);
  }

  // 1. Tận dụng thư viện chuyên dụng ZXing quét đa định dạng Barcode (Code 128 IMEI) & QR Code trực tiếp từ Video
  if (typeof window !== 'undefined' && window.ZXing) {
    try {
      if (!zxingReaderInstance) {
        zxingReaderInstance = new window.ZXing.BrowserMultiFormatReader();
      }
      if (imeiVideoRef.value) {
        zxingReaderInstance.decodeFromVideoElement(imeiVideoRef.value, (result, err) => {
          if (result && !isDetected.value) {
            const txt = result.getText();
            if (txt) {
              handleSuccessScan(txt);
            }
          }
        });
      }
    } catch (e) {
      console.warn('Lỗi khởi tạo ZXing video reader:', e);
    }
  }

  // 2. Chuẩn bị BarcodeDetector của Chromium
  let barcodeDetector = null;
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      barcodeDetector = new window.BarcodeDetector({
        formats: ['code_128', 'qr_code', 'ean_13', 'code_39', 'data_matrix', 'upc_a']
      });
    } catch (e) {
      console.warn('BarcodeDetector formats error:', e);
    }
  }

  // Khởi tạo Canvas offscreen dự phòng
  const offscreenCanvas = document.createElement('canvas');
  const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

  // Vòng lặp quét liên tục theo thời gian thực
  const scanLoop = async () => {
    if (!isImeiScannerOpen.value || isDetected.value) return;

    if (imeiVideoRef.value && imeiVideoRef.value.readyState >= 2) {
      const video = imeiVideoRef.value;
      const w = video.videoWidth;
      const h = video.videoHeight;

      if (w > 0 && h > 0) {
        offscreenCanvas.width = w;
        offscreenCanvas.height = h;
        offscreenCtx.drawImage(video, 0, 0, w, h);

        // Quét bằng BarcodeDetector
        if (barcodeDetector) {
          try {
            const barcodes = await barcodeDetector.detect(offscreenCanvas);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              handleSuccessScan(barcodes[0].rawValue);
              return;
            }
          } catch (err) {}
        }

        // Quét bằng jsQR nếu là mã QR
        if (typeof window !== 'undefined' && window.jsQR) {
          try {
            const imgData = offscreenCtx.getImageData(0, 0, w, h);
            const qrResult = window.jsQR(imgData.data, imgData.width, imgData.height, {
              inversionAttempts: 'dontInvert'
            });
            if (qrResult && qrResult.data) {
              handleSuccessScan(qrResult.data);
              return;
            }
          } catch (e) {}
        }
      }
    }

    scanTimer = setTimeout(scanLoop, 200);
  };

  scanTimer = setTimeout(scanLoop, 400);
};

// Đóng camera quét mã
const closeImeiScanner = () => {
  if (scanTimer) {
    clearTimeout(scanTimer);
    clearInterval(scanTimer);
    scanTimer = null;
  }
  if (zxingReaderInstance) {
    try { zxingReaderInstance.reset(); } catch (e) {}
  }
  if (imeiMediaStream) {
    imeiMediaStream.getTracks().forEach(t => t.stop());
    imeiMediaStream = null;
  }
  isImeiScannerOpen.value = false;
};

// Hàm tự động phát hiện và trích xuất các khung thẻ trắng chứa mã vạch (dành cho ảnh màn hình tối như iOS *#06#)
const extractWhiteCards = (ctx, w, h) => {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const isBright = (x, y) => {
    const idx = (y * w + x) * 4;
    return data[idx] > 170 && data[idx + 1] > 170 && data[idx + 2] > 170;
  };

  const whiteRowCounts = new Array(h).fill(0);
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      if (isBright(x, y)) whiteRowCounts[y]++;
    }
  }

  const cards = [];
  let inCard = false;
  let startY = 0;
  for (let y = 0; y < h; y += 4) {
    if (whiteRowCounts[y] > (w / 4) * 0.2) {
      if (!inCard) { inCard = true; startY = y; }
    } else {
      if (inCard) {
        if (y - startY > 20) cards.push({ startY, endY: y });
        inCard = false;
      }
    }
  }
  if (inCard && h - startY > 20) cards.push({ startY, endY: h });

  const crops = [];
  for (const card of cards) {
    let minX = w, maxX = 0;
    const sampleY = Math.floor((card.startY + card.endY) / 2);
    for (let x = 0; x < w; x++) {
      if (isBright(x, sampleY)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
    if (maxX - minX > 50) {
      const padX = Math.max(0, minX - 12);
      const padY = Math.max(0, card.startY - 12);
      const cw = Math.min(w - padX, (maxX - minX) + 24);
      const ch = Math.min(h - padY, (card.endY - card.startY) + 24);
      crops.push({ x: padX, y: padY, width: cw, height: ch });
    }
  }
  return crops;
};

// Hàm đa năng giải mã Barcode / QR / OCR từ Canvas
const decodeFromCanvasUniversal = async (canvas, ctx, w, h) => {
  // 1. Nếu có thẻ trắng chứa mã vạch (như trên iPhone dark mode), trích xuất từng thẻ trắng và giải mã
  const crops = extractWhiteCards(ctx, w, h);
  if (typeof window !== 'undefined' && window.ZXing) {
    try {
      const zxReader = new window.ZXing.BrowserMultiFormatReader();
      for (const crop of crops) {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = crop.width;
        cropCanvas.height = crop.height;
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.fillStyle = '#ffffff';
        cropCtx.fillRect(0, 0, crop.width, crop.height);
        cropCtx.drawImage(canvas, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        try {
          const res = await zxReader.decodeFromCanvas(cropCanvas);
          if (res && res.getText()) {
            return res.getText();
          }
        } catch (e) {}
      }

      // Thử toàn bộ canvas
      const fullRes = await zxReader.decodeFromCanvas(canvas);
      if (fullRes && fullRes.getText()) {
        return fullRes.getText();
      }
    } catch (e) {}
  }

  // 2. BarcodeDetector của trình duyệt
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const detector = new window.BarcodeDetector({
        formats: ['code_128', 'qr_code', 'ean_13', 'code_39', 'data_matrix', 'upc_a']
      });
      const barcodes = await detector.detect(canvas);
      if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
        return barcodes[0].rawValue;
      }
    } catch (e) {}
  }

  // 3. jsQR nếu là mã QR
  if (typeof window !== 'undefined' && window.jsQR) {
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const qrResult = window.jsQR(imgData.data, imgData.width, imgData.height);
      if (qrResult && qrResult.data) {
        return qrResult.data;
      }
    } catch (e) {}
  }

  // 4. Tesseract OCR (Nhận diện chữ số "IMEI 354889099431072" trên ảnh màn hình thiết bị)
  if (typeof window !== 'undefined' && window.Tesseract) {
    try {
      const ocrResult = await window.Tesseract.recognize(canvas, 'eng');
      if (ocrResult && ocrResult.data && ocrResult.data.text) {
        const text = ocrResult.data.text;
        const imeiMatch = text.match(/\b\d{14,17}\b/);
        if (imeiMatch) {
          return imeiMatch[0];
        }
      }
    } catch (e) {
      console.warn('OCR fallback error:', e);
    }
  }

  return null;
};

// Nút bấm Chụp & Quét ngay khung hình hiện tại (khi người dùng để màn hình iPhone trước camera)
const snapAndDecodeCurrentFrame = async () => {
  if (!imeiVideoRef.value) return;
  const video = imeiVideoRef.value;
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(video, 0, 0, w, h);

  Swal.fire({
    title: 'Đang giải mã khung hình...',
    text: 'Hệ thống đang quét mã vạch và số IMEI trên khung camera...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  const detectedCode = await decodeFromCanvasUniversal(canvas, ctx, w, h);
  Swal.close();

  if (detectedCode) {
    handleSuccessScan(detectedCode);
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Chưa thấy rõ mã vạch',
      text: 'Vui lòng căn chỉnh lại mã vạch IMEI thẳng khung hình, tránh ánh sáng phản chiếu chói màn hình rồi bấm chụp lại.',
      timer: 2500,
      showConfirmButton: false
    });
  }
};

// Nút nạp số IMEI mẫu demo khi người dùng chủ động bấm
const useSampleImei = (sampleVal) => {
  const val = sampleVal || '354889099431072';
  handleSuccessScan(val);
};

// Kích hoạt chọn tệp ảnh QR / Barcode từ máy tính
const triggerQrFileInput = () => {
  if (qrFileInputRef.value) {
    qrFileInputRef.value.click();
  }
};

// Giải mã từ file ảnh người dùng tải lên (Ví dụ: ảnh chụp màn hình *#06#)
const onQrFileUploaded = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  Swal.fire({
    title: 'Đang phân tích ảnh...',
    text: 'Hệ thống đang quét mã vạch và nhận diện số IMEI trong ảnh tải lên...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  const reader = new FileReader();
  reader.onload = (event) => {
    const imgDataUrl = event.target.result;
    const img = new Image();
    img.onload = async () => {
      const w = img.width;
      const h = img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const code = await decodeFromCanvasUniversal(canvas, ctx, w, h);
      Swal.close();

      if (code) {
        handleSuccessScan(code);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Không phát hiện mã!',
          text: 'Không thể nhận diện mã vạch trong ảnh này. Vui lòng bấm "Nạp số IMEI mẫu máy bạn: 354889099431072" hoặc nhập tay.',
          confirmButtonText: 'Đã hiểu'
        });
      }
    };
    img.src = imgDataUrl;
  };
  reader.readAsDataURL(file);
};

// ============================================================================================
// VIETNAMESE: DANH SÁCH THIẾT BỊ ĐÃ ĐƯỢC TÌM KIẾM VÀ LỌC
// ENGLISH: COMPUTED FILTERED PHONES LIST FOR ADMIN TABLE VIEW
// ============================================================================================

// database => api (backend) => service => [store] => ui

const displayPhones = computed(() => {
  return phoneStore.phones.filter(p => {
    // Lọc theo hãng sản xuất
    // Filter by manufacturer
    if (filterBrand.value !== 'ALL' && p.hangSanXuat !== filterBrand.value) return false;

    // Lọc theo trạng thái thiết bị
    // Filter by device availability status
    if (filterStatus.value !== 'ALL' && p.TinhTrangMay !== filterStatus.value) return false;

    // Tìm kiếm theo tên máy hoặc mã IMEI
    // Search keyword match against phone name or IMEI
    if (searchKey.value && searchKey.value.trim() !== '') {
      const kw = searchKey.value.toLowerCase().trim();
      const matchName = p.TenDienThoai.toLowerCase().includes(kw);
      const matchImei = p.SoIMEI_Serial?.toLowerCase().includes(kw);
      if (!matchName && !matchImei) return false;
    }

    return true;
  });
});

// Đặt lại các bộ lọc về mặc định
// Reset all filters back to default
const resetFilters = () => {
  searchKey.value = '';
  filterBrand.value = 'ALL';
  filterStatus.value = 'ALL';
};

// ============================================================================================
// VIETNAMESE: XÁC ĐỊNH CLASS MÀU CHO HUY HIỆU TRẠNG THÁI MÁY
// ENGLISH: GET BADGE CSS CLASS BASED ON DEVICE AVAILABILITY
// ============================================================================================
const getStatusClass = (status) => {
  switch (status) {
    case 'SAN_SANG': return 'bg-success text-white';
    case 'DANG_THUE': return 'bg-primary text-white';
    case 'BAO_TRI': return 'bg-warning text-dark';
    default: return 'bg-secondary text-white';
  }
};

// ============================================================================================
// VIETNAMESE: ĐỔI NHANH TRẠNG THÁI MÁY (Sẵn sàng -> Đang thuê -> Bảo trì -> Sẵn sàng)
// ENGLISH: QUICK CYCLE DEVICE STATUS (SAN_SANG -> DANG_THUE -> BAO_TRI -> SAN_SANG)
// ============================================================================================
const toggleStatus = (phone) => {
  let nextStatus = 'SAN_SANG';
  if (phone.TinhTrangMay === 'SAN_SANG') nextStatus = 'DANG_THUE';
  else if (phone.TinhTrangMay === 'DANG_THUE') nextStatus = 'BAO_TRI';
  else nextStatus = 'SAN_SANG';

  phoneStore.setPhoneStatus(phone.maDienThoai, nextStatus);
};

// ============================================================================================
// VIETNAMESE: MỞ MODAL THÊM THIẾT BỊ MỚI VỚI DỮ LIỆU MẪU MẶC ĐỊNH & IMEI TỰ SINH
// ENGLISH: OPEN ADD MODAL WITH DEFAULT VALUES & AUTO-GENERATED SAMPLE IMEI
// ============================================================================================
const openAddModal = () => {
  closeAllPriceDropdowns();
  isEditMode.value = false;
  currentEditId.value = null;
  formData.value = {
    TenDienThoai: '',
    hangSanXuat: 'APPLE',
    SoIMEI_Serial: '35' + Math.floor(1000000000000 + Math.random() * 9000000000000),
    giaThueNgay: 250000,
    tienCocYeuCau: 12000000,
    Chipset: 'Apple A17 Pro',
    RAM_ROM: '8GB / 256GB',
    TinhTrangMay: 'SAN_SANG',
    MacDinh: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
    moTa: 'Máy nguyên zin 100%, ngoại quan 99%, pin 100%.'
  };
  giaThueDisplay.value = formatCurrency(250000);
  tienCocDisplay.value = formatCurrency(12000000);
  isModalOpen.value = true;
};

// ============================================================================================
// VIETNAMESE: MỞ MODAL CHỈNH SỬA VỚI DỮ LIỆU ĐIỆN THOẠI HIỆN TẠI
// ENGLISH: OPEN EDIT MODAL POPULATED WITH EXISTING PHONE DATA
// ============================================================================================
const openEditModal = (phone) => {
  closeAllPriceDropdowns();
  isEditMode.value = true;
  currentEditId.value = phone.maDienThoai;
  formData.value = {
    TenDienThoai: phone.TenDienThoai,
    hangSanXuat: phone.hangSanXuat,
    SoIMEI_Serial: phone.SoIMEI_Serial,
    giaThueNgay: phone.giaThueNgay,
    tienCocYeuCau: phone.tienCocYeuCau,
    Chipset: phone.cauHinh?.Chipset || '',
    RAM_ROM: phone.cauHinh?.RAM_ROM || '',
    TinhTrangMay: phone.TinhTrangMay,
    MacDinh: phone.MacDinh,
    moTa: phone.moTa || ''
  };
  giaThueDisplay.value = formatCurrency(phone.giaThueNgay);
  tienCocDisplay.value = formatCurrency(phone.tienCocYeuCau);
  isModalOpen.value = true;
};

// ============================================================================================
// VIETNAMESE: LƯU THIẾT BỊ (THÊM MỚI HOẶC CẬP NHẬT)
// ENGLISH: SAVE PHONE RECORD (INSERT OR UPDATE IN PHONE STORE)
// ERD: INSERT INTO DienThoai ... / UPDATE DienThoai SET ...
// ============================================================================================
const savePhone = async () => {
  const payload = {
    TenDienThoai: formData.value.TenDienThoai,
    hangSanXuat: formData.value.hangSanXuat,
    category: formData.value.hangSanXuat,
    SoIMEI_Serial: formData.value.SoIMEI_Serial,
    giaThueNgay: Number(formData.value.giaThueNgay) || 250000,
    tienCocYeuCau: Number(formData.value.tienCocYeuCau) || 12000000,
    TinhTrangMay: formData.value.TinhTrangMay || 'SAN_SANG',
    SoLuong: 5,
    isFeatured: true,
    isHot: true,
    MacDinh: formData.value.MacDinh || 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
    hinhAnh: [formData.value.MacDinh || 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png'],
    moTa: formData.value.moTa || 'Máy nguyên zin 100%, ngoại quan 99%, pin 100%.',
    cauHinh: {
      Chipset: formData.value.Chipset || 'Apple A17 Pro',
      RAM_ROM: formData.value.RAM_ROM || '8GB / 256GB',
      HeDieuHanh: formData.value.hangSanXuat === 'APPLE' ? 'iOS' : 'Android',
      KichThuocManHinh: '6.7 inch OLED',
      DungLuongPin: '5000 mAh'
    }
  };

  if (isEditMode.value) {
    await phoneStore.updatePhone(currentEditId.value, payload);
    Swal.fire({
      icon: 'success',
      title: 'Đã cập nhật thiết bị!',
      text: 'Thông tin điện thoại đã được lưu và cập nhật đồng bộ toàn hệ thống.',
      timer: 2000,
      showConfirmButton: false
    });
  } else {
    await phoneStore.addPhone(payload);
    Swal.fire({
      icon: 'success',
      title: 'Thêm thiết bị thành công!',
      text: 'Thiết bị mới đã được lưu vào kho và lập tức hiển thị ngoài trang chủ cho khách thuê!',
      timer: 2200,
      showConfirmButton: false
    });
  }

  isModalOpen.value = false;
};

// ============================================================================================
// VIETNAMESE: XÓA THIẾT BỊ KHỎI KHO KÈM CẢNH BÁO XÁC NHẬN
// ENGLISH: DELETE PHONE FROM INVENTORY WITH CONFIRMATION PROMPT
// ERD: DELETE FROM DienThoai WHERE MaDienThoai = ?
// ============================================================================================
const handleDelete = (phone) => {
  Swal.fire({
    title: 'Xóa thiết bị?',
    text: `Bạn có chắc chắn muốn xóa ${phone.TenDienThoai} (IMEI: ${phone.SoIMEI_Serial}) khỏi danh sách?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Đồng ý xóa',
    cancelButtonText: 'Hủy'
  }).then(async (res) => {
    if (res.isConfirmed) {
      await phoneStore.deletePhone(phone.maDienThoai);
      Swal.fire('Đã xóa', 'Thiết bị đã được xóa khỏi hệ thống CSDL.', 'success');
    }
  });
};

// ============================================================================================
// VIETNAMESE: QUẢN TRỊ ADMIN - THÊM HÃNG ĐIỆN THOẠI MỚI VÀO HỆ THỐNG
// ENGLISH: SUBMIT ADD BRAND CATEGORY TO SYSTEM
// ============================================================================================
const submitAddCategory = () => {
  try {
    const added = phoneStore.addCategory({
      name: newCategoryForm.value.name,
      id: newCategoryForm.value.id,
      icon: newCategoryForm.value.icon,
      description: newCategoryForm.value.description
    });

    Swal.fire({
      icon: 'success',
      title: 'Thêm Hãng Thành Công!',
      text: `Hãng "${added.name}" đã được thêm vào hệ thống và lập tức hiển thị trên thanh menu trang chủ!`,
      timer: 2000,
      showConfirmButton: false
    });

    // Reset form
    newCategoryForm.value = {
      name: '',
      id: '',
      icon: 'fa-mobile',
      description: ''
    };
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Không thể thêm hãng',
      text: err.message
    });
  }
};

// ============================================================================================
// VIETNAMESE: QUẢN TRỊ ADMIN - XÓA HÃNG ĐIỆN THOẠI
// ENGLISH: DELETE BRAND CATEGORY FROM SYSTEM
// ============================================================================================
const handleDeleteCategory = (cat) => {
  Swal.fire({
    title: `Xóa hãng ${cat.name}?`,
    text: `Hãng "${cat.name}" sẽ bị xóa khỏi thanh menu và bộ lọc toàn hệ thống.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Đồng ý xóa',
    cancelButtonText: 'Hủy'
  }).then((res) => {
    if (res.isConfirmed) {
      try {
        phoneStore.deleteCategory(cat.id);
        Swal.fire('Đã xóa', `Hãng "${cat.name}" đã được xóa khỏi hệ thống.`, 'success');
      } catch (err) {
        Swal.fire('Lỗi', err.message, 'error');
      }
    }
  });
};
</script>

<style scoped>
/* ============================================================================================ */
/* VIETNAMESE: CSS TÙY CHỈNH CHO TRANG QUẢN LÝ THIẾT BỊ ADMIN                                  */
/* ENGLISH: CUSTOM SCOPED STYLES FOR ADMIN PHONE INVENTORY MANAGEMENT                          */
/* ============================================================================================ */
.phone-admin-thumb {
  width: 48px;
  height: 48px;
  object-fit: contain;
  background-color: #f8f9fa;
}

.cursor-pointer {
  cursor: pointer;
}

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.scanner-laser {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #38bdf8;
  box-shadow: 0 0 10px #38bdf8, 0 0 20px #38bdf8;
  animation: laserScan 2s linear infinite alternate;
}

@keyframes laserScan {
  0% { top: 5%; }
  100% { top: 95%; }
}

.scanner-frame {
  position: relative;
  width: 270px;
  height: 130px;
  border: 1px dashed rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.scanner-frame.detected {
  border: 2px solid #198754;
  box-shadow: 0 0 25px rgba(25, 135, 84, 0.8);
}

.scanner-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #38bdf8;
  border-style: solid;
}

.corner-tl { top: -2px; left: -2px; border-width: 3px 0 0 3px; border-top-left-radius: 8px; }
.corner-tr { top: -2px; right: -2px; border-width: 3px 3px 0 0; border-top-right-radius: 8px; }
.corner-bl { bottom: -2px; left: -2px; border-width: 0 0 3px 3px; border-bottom-left-radius: 8px; }
.corner-br { bottom: -2px; right: -2px; border-width: 0 3px 3px 0; border-bottom-right-radius: 8px; }

.scanner-frame.detected .scanner-corner {
  border-color: #198754;
}
</style>