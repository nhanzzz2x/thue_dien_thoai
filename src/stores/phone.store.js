// ============================================================================================
// VIETNAMESE: PINIA STORE QUẢN LÝ KHO ĐIỆN THOẠI, TÌM KIẾM, BỘ LỌC VÀ SO SÁNH THIẾT BỊ
// ENGLISH: PINIA STORE FOR MANAGING PHONE INVENTORY, SEARCH, ADVANCED FILTERS & COMPARISON
// ERD MAPPING: Ánh xạ 1-1 với 2 thực thể DienThoai và CauHinh_PhienBan trong CSDL
// ============================================================================================

import { defineStore } from 'pinia';
import { mockPhones, mockCategories } from '@/data/mockData';
import { PhoneService } from '@/services/phone.service';

// Khởi tạo danh mục ban đầu (nạp từ localStorage nếu quản trị viên đã từng thêm hãng mới)
function getInitialCategories() {
  try {
    const saved = localStorage.getItem('trongnhan_custom_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Lỗi đọc categories từ localStorage:', e);
  }
  return [...mockCategories];
}

export const usePhoneStore = defineStore('phone', {
  // ==========================================================================================
  // VIETNAMESE: KHỞI TẠO STATE (TRẠNG THÁI TOÀN CỤC)
  // ENGLISH: INITIAL GLOBAL STATE
  // ==========================================================================================
  state: () => ({
    // Danh sách toàn bộ điện thoại trong kho (ERD: Bảng DienThoai JOIN CauHinh_PhienBan)
    phones: [...mockPhones],

    // Danh mục thương hiệu và phân khúc (ERD: Thuộc tính DienThoai.HangSanXuat)
    categories: getInitialCategories(),

    // Bộ lọc danh mục hiện hành (ALL | APPLE | SAMSUNG | XIAOMI | ASUS | FLAGSHIP...)
    selectedCategory: 'ALL',

    // Từ khóa tìm kiếm (Tên thiết bị hoặc số IMEI/Serial)
    searchKeyword: '',

    // Bộ lọc theo thông số phần cứng
    selectedChipset: '',
    selectedRamRom: '',
    selectedOs: '',
    selectedPriceRange: 'ALL', // ALL | UNDER_200 | 200_TO_250 | ABOVE_250
    onlyAvailable: false,      // Chỉ hiển thị máy có TinhTrangMay = 'SAN_SANG'

    // Dữ liệu phục vụ xem nhanh (Quick View modal)
    quickViewPhone: null,

    // Danh sách thiết bị đang đưa vào bảng so sánh cấu hình (Tối đa 3 máy)
    compareList: [],
    isCompareModalOpen: false
  }),

  // ==========================================================================================
  // VIETNAMESE: GETTERS - TÍNH TOÁN DỮ LIỆU TỰ ĐỘNG THEO BỘ LỌC VÀ CHỈ SỐ
  // ENGLISH: GETTERS - REACTIVE DERIVED STATE & ADVANCED FILTER LOGIC
  // ==========================================================================================
  getters: {
    // VIETNAMESE: Trích xuất danh sách duy nhất các loại Chipset hiện có trong kho máy
    // ENGLISH: Extract unique list of hardware Chipsets available in inventory
    availableChipsets: (state) => {
      const set = new Set();
      state.phones.forEach(p => {
        if (p.cauHinh?.Chipset) set.add(p.cauHinh.Chipset);
      });
      return Array.from(set);
    },

    // VIETNAMESE: Trích xuất danh sách duy nhất các phiên bản RAM/ROM
    // ENGLISH: Extract unique list of RAM / ROM storage configurations
    availableRamRom: (state) => {
      const set = new Set();
      state.phones.forEach(p => {
        if (p.cauHinh?.RAM_ROM) set.add(p.cauHinh.RAM_ROM);
      });
      return Array.from(set);
    },

    // ========================================================================================
    // VIETNAMESE: LỌC DANH SÁCH ĐIỆN THOẠI THEO ĐA TIÊU CHÍ (HÃNG, TỪ KHÓA, CẤU HÌNH, GIÁ)
    // ENGLISH: MULTI-CRITERIA FILTERING ENGINE (BRAND, SEARCH KW, SPECS, PRICE, AVAILABILITY)
    // SQL TƯƠNG ĐƯƠNG:
    // SELECT * FROM DienThoai d JOIN CauHinh_PhienBan c ON d.MaDienThoai = c.MaDienThoai
    // WHERE (:hangSanXuat = 'ALL' OR d.HangSanXuat = :hangSanXuat)
    //   AND (LOWER(d.TenDienThoai) LIKE %:kw% OR LOWER(d.SoIMEI_Serial) LIKE %:kw%)
    //   AND (:chipset = '' OR c.Chipset = :chipset)
    //   AND (:tinhTrang = 'ALL' OR d.TinhTrangMay = :tinhTrang) ...
    // ========================================================================================
    filteredPhones: (state) => {
      return state.phones.filter(phone => {
        // 1. Lọc theo danh mục / thương hiệu (Category / Brand filter)
        if (state.selectedCategory !== 'ALL') {
          if (state.selectedCategory === 'FLAGSHIP') {
            if (phone.category !== 'FLAGSHIP' && !phone.TenDienThoai.includes('Pro Max') && !phone.TenDienThoai.includes('Ultra')) {
              return false;
            }
          } else if (phone.category !== state.selectedCategory) {
            return false;
          }
        }

        // 2. Lọc theo từ khóa tìm kiếm (Tên máy, Chip, RAM, hoặc mã IMEI)
        if (state.searchKeyword && state.searchKeyword.trim() !== '') {
          const kw = state.searchKeyword.toLowerCase().trim();
          const matchName = phone.TenDienThoai.toLowerCase().includes(kw);
          const matchChip = phone.cauHinh?.Chipset?.toLowerCase().includes(kw);
          const matchRam = phone.cauHinh?.RAM_ROM?.toLowerCase().includes(kw);
          const matchImei = phone.SoIMEI_Serial?.toLowerCase().includes(kw);
          if (!matchName && !matchChip && !matchRam && !matchImei) return false;
        }

        // 3. Lọc theo vi xử lý Chipset
        if (state.selectedChipset && phone.cauHinh?.Chipset !== state.selectedChipset) {
          return false;
        }

        // 4. Lọc theo dung lượng RAM / ROM
        if (state.selectedRamRom && phone.cauHinh?.RAM_ROM !== state.selectedRamRom) {
          return false;
        }

        // 5. Lọc theo hệ điều hành (iOS vs Android)
        if (state.selectedOs) {
          if (state.selectedOs === 'iOS' && !phone.cauHinh?.HeDieuHanh.includes('iOS')) return false;
          if (state.selectedOs === 'Android' && !phone.cauHinh?.HeDieuHanh.includes('Android') && !phone.cauHinh?.HeDieuHanh.includes('HyperOS')) return false;
        }

        // 6. Lọc theo mức giá thuê theo ngày (Price range filter)
        const price = phone.giaKhuyenMai || phone.giaThueNgay;
        if (state.selectedPriceRange === 'UNDER_200' && price >= 200000) return false;
        if (state.selectedPriceRange === '200_TO_250' && (price < 200000 || price > 250000)) return false;
        if (state.selectedPriceRange === 'ABOVE_250' && price <= 250000) return false;

        // 7. Lọc chỉ lấy máy đang sẵn sàng cho thuê (Availability filter)
        if (state.onlyAvailable && phone.TinhTrangMay !== 'SAN_SANG') {
          return false;
        }

        return true;
      });
    },

    // Danh sách điện thoại bán chạy / được thuê nhiều nhất
    hotPhones: (state) => state.phones.filter(p => p.isHot),

    // Danh sách điện thoại nổi bật / đề xuất
    featuredPhones: (state) => state.phones.filter(p => p.isFeatured)
  },

  // ==========================================================================================
  // VIETNAMESE: ACTIONS - THAO TÁC CẬP NHẬT DỮ LIỆU & QUẢN TRỊ CRUD KHO THIẾT BỊ
  // ENGLISH: ACTIONS - STATE MUTATION & ADMIN CRUD OPERATIONS FOR PHONES
  // ==========================================================================================
  actions: {
    // ========================================================================================
    // VIETNAMESE: TỰ ĐỘNG TẢI DỮ LIỆU ĐIỆN THOẠI TỪ MYSQL QUA BACKEND API (GET /api/phones)
    // ENGLISH: ASYNC FETCH PHONES FROM MYSQL BACKEND API
    // ========================================================================================
    async fetchPhones() {
      try {
        const data = await PhoneService.getAllPhones();
        if (data && Array.isArray(data) && data.length > 0) {
          this.phones = data;
        }
      } catch (err) {
        console.warn('[PhoneStore] Lỗi tải từ backend API, sử dụng mockData:', err);
      }
    },

    // Cập nhật bộ lọc danh mục
    setCategory(catId) {
      this.selectedCategory = catId;
    },

    // Cập nhật từ khóa tìm kiếm
    setSearch(kw) {
      this.searchKeyword = kw;
    },

    // Đặt lại toàn bộ bộ lọc về trạng thái ban đầu
    resetFilters() {
      this.selectedCategory = 'ALL';
      this.searchKeyword = '';
      this.selectedChipset = '';
      this.selectedRamRom = '';
      this.selectedOs = '';
      this.selectedPriceRange = 'ALL';
      this.onlyAvailable = false;
    },

    // Mở popup xem nhanh thông số điện thoại
    openQuickView(phone) {
      this.quickViewPhone = phone;
    },

    // Đóng popup xem nhanh
    closeQuickView() {
      this.quickViewPhone = null;
    },

    // ========================================================================================
    // VIETNAMESE: THÊM / XÓA THIẾT BỊ KHỎI DANH SÁCH SO SÁNH (TỐI ĐA 3 MÁY)
    // ENGLISH: TOGGLE PHONE IN COMPARISON TRAY (MAXIMUM 3 PHONES)
    // ========================================================================================
    toggleCompare(phone) {
      const idx = this.compareList.findIndex(p => p.maDienThoai === phone.maDienThoai);
      if (idx >= 0) {
        this.compareList.splice(idx, 1);
      } else {
        if (this.compareList.length >= 3) {
          this.compareList.shift(); // Xóa máy đầu tiên nếu đã đủ 3 máy
        }
        this.compareList.push(phone);
        this.isCompareModalOpen = true;
      }
    },

    // Xóa một máy cụ thể khỏi bảng so sánh
    removeFromCompare(phoneId) {
      this.compareList = this.compareList.filter(p => p.maDienThoai !== phoneId);
    },

    // Xóa toàn bộ danh sách so sánh
    clearCompare() {
      this.compareList = [];
      this.isCompareModalOpen = false;
    },

    // Tìm kiếm điện thoại theo ID
    getPhoneById(id) {
      const numId = Number(id);
      return this.phones.find(p => p.maDienThoai === numId);
    },

    // ========================================================================================
    // VIETNAMESE: THAO TÁC QUẢN TRỊ ADMIN - THÊM THIẾT BỊ MỚI VÀO KHO (LƯU VÀO MYSQL)
    // ENGLISH: ADMIN ACTION - ADD NEW PHONE TO INVENTORY (INSERT INTO MYSQL)
    // ========================================================================================
    async addPhone(newPhone) {
      try {
        await PhoneService.createPhone(newPhone);
        await this.fetchPhones();
        return true;
      } catch (err) {
        console.warn('Lỗi thêm máy qua API, thêm vào local:', err);
        const maxId = this.phones.reduce((max, p) => (p.maDienThoai > max ? p.maDienThoai : max), 0);
        const phoneToAdd = {
          ...newPhone,
          maDienThoai: maxId + 1,
          TinhTrangMay: newPhone.TinhTrangMay || 'SAN_SANG',
          TinhTrangMayText: newPhone.TinhTrangMay === 'SAN_SANG' ? 'Sẵn sàng thuê' : 'Đang thuê'
        };
        this.phones.unshift(phoneToAdd);
        return phoneToAdd;
      }
    },

    // ========================================================================================
    // VIETNAMESE: THAO TÁC QUẢN TRỊ ADMIN - CẬP NHẬT THIẾT BỊ (CẬP NHẬT VÀO MYSQL)
    // ENGLISH: ADMIN ACTION - UPDATE EXISTING PHONE RECORD
    // ========================================================================================
    async updatePhone(id, updatedData) {
      try {
        await PhoneService.updatePhone(id, updatedData);
        await this.fetchPhones();
        return true;
      } catch (err) {
        console.warn('Lỗi cập nhật qua API:', err);
        const index = this.phones.findIndex(p => p.maDienThoai === Number(id));
        if (index !== -1) {
          this.phones[index] = {
            ...this.phones[index],
            ...updatedData,
            TinhTrangMayText: updatedData.TinhTrangMay === 'SAN_SANG' ? 'Sẵn sàng thuê' : (updatedData.TinhTrangMay === 'BAO_TRI' ? 'Bảo trì' : 'Đang thuê')
          };
          return true;
        }
        return false;
      }
    },

    // ========================================================================================
    // VIETNAMESE: THAO TÁC QUẢN TRỊ ADMIN - XÓA THIẾT BỊ KHỎI HỆ THỐNG (XÓA KHỎI MYSQL)
    // ENGLISH: ADMIN ACTION - DELETE PHONE FROM INVENTORY
    // ========================================================================================
    async deletePhone(id) {
      try {
        await PhoneService.deletePhone(id);
        await this.fetchPhones();
      } catch (err) {
        console.warn('Lỗi xóa qua API:', err);
        this.phones = this.phones.filter(p => p.maDienThoai !== Number(id));
      }
    },

    // ========================================================================================
    // VIETNAMESE: CẬP NHẬT NHANH TRẠNG THÁI THIẾT BỊ (SAN_SANG, DANG_THUE, BAO_TRI)
    // ENGLISH: QUICK UPDATE DEVICE STATUS
    // ERD: UPDATE DienThoai SET TinhTrangMay = ? WHERE MaDienThoai = ?
    // ========================================================================================
    setPhoneStatus(id, newStatus) {
      const phone = this.getPhoneById(id);
      if (phone) {
        phone.TinhTrangMay = newStatus;
        phone.TinhTrangMayText = newStatus === 'SAN_SANG' ? 'Sẵn sàng thuê' : (newStatus === 'BAO_TRI' ? 'Bảo trì' : 'Đang thuê');
      }
    },

    // ========================================================================================
    // VIETNAMESE: QUẢN TRỊ ADMIN - THÊM HÃNG ĐIỆN THOẠI MỚI (Category / TheLoai)
    // ENGLISH: ADMIN ACTION - ADD NEW BRAND CATEGORY
    // ========================================================================================
    addCategory(cat) {
      if (!cat || !cat.name) {
        throw new Error('Vui lòng nhập tên hãng điện thoại!');
      }

      const id = (cat.id || cat.name.replace(/\s+/g, '_')).toUpperCase().trim();
      
      // Kiểm tra trùng mã hãng
      const existing = this.categories.find(c => c.id === id);
      if (existing) {
        throw new Error(`Hãng với mã "${id}" đã tồn tại trên hệ thống!`);
      }

      const newCat = {
        id,
        name: cat.name.trim(),
        icon: cat.icon || 'fa-mobile',
        description: cat.description || `Các dòng điện thoại ${cat.name.trim()} chính hãng cho thuê với giá ưu đãi.`
      };

      this.categories.push(newCat);

      try {
        localStorage.setItem('trongnhan_custom_categories', JSON.stringify(this.categories));
      } catch (e) {
        console.warn('Lỗi lưu categories vào localStorage:', e);
      }

      return newCat;
    },

    // ========================================================================================
    // VIETNAMESE: QUẢN TRỊ ADMIN - XÓA HÃNG ĐIỆN THOẠI KHỎI HỆ THỐNG
    // ENGLISH: ADMIN ACTION - DELETE BRAND CATEGORY
    // ========================================================================================
    deleteCategory(catId) {
      if (catId === 'ALL') {
        throw new Error('Không thể xóa danh mục mặc định "Tất cả điện thoại"!');
      }

      this.categories = this.categories.filter(c => c.id !== catId);

      try {
        localStorage.setItem('trongnhan_custom_categories', JSON.stringify(this.categories));
      } catch (e) {
        console.warn('Lỗi lưu categories vào localStorage:', e);
      }

      return true;
    }
  }
});
