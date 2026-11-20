// PINIA STORE QUẢN LÝ KHO ĐIỆN THOẠI, TÌM KIẾM, BỘ LỌC VÀ SO SÁNH THIẾT BỊ
// ERD MAPPING: Ánh xạ 1-1 với 2 thực thể DienThoai và CauHinh_PhienBan trong CSDL

import { defineStore } from 'pinia';
import { mockPhones, mockCategories } from '@/data/mockData';
import { PhoneService } from '@/services/phone.service';

const PHONES_STORAGE_KEY = 'trongnhan_custom_phones';
const CATEGORIES_STORAGE_KEY = 'trongnhan_custom_categories';

// Khởi tạo danh sách điện thoại ban đầu (nạp từ localStorage nếu đã từng thêm/sửa máy)
function getInitialPhones() {
  try {
    const saved = localStorage.getItem(PHONES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Tự động kiểm tra và vá lại ảnh mới nhất từ mockPhones cho các máy mặc định nếu link cũ bị chết
        const mockMap = new Map(mockPhones.map(m => [m.maDienThoai, m]));
        let hasChanges = false;
        parsed.forEach(p => {
          const mock = mockMap.get(p.maDienThoai);
          if (mock) {
            // Kiểm tra các link ảnh bị lỗi hoặc thiếu
            if (
              !p.MacDinh ||
              p.MacDinh.includes('gsmarena.com') ||
              p.MacDinh.includes('rog-phone-8-pro') ||
              p.MacDinh.includes('samsung-galaxy-z-flip-6-xanh-mint_1.png') ||
              p.MacDinh.includes('nubia-red-magic-9-pro-plus-den_1.png') ||
              p.MacDinh.includes('samsung-galaxy-z-fold-6-xam_1.png') ||
              p.MacDinh.includes('cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-flip-6')
            ) {
              p.MacDinh = mock.MacDinh;
              p.hinhAnh = mock.hinhAnh;
              hasChanges = true;
            }
          }
        });

        if (hasChanges) {
          localStorage.setItem(PHONES_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc phones từ localStorage:', e);
  }
  // Nếu chưa có, ghi mockPhones mặc định vào localStorage
  try {
    localStorage.setItem(PHONES_STORAGE_KEY, JSON.stringify(mockPhones));
  } catch (e) {}
  return [...mockPhones];
}

// Lưu danh sách điện thoại vào localStorage
function persistPhones(phones) {
  try {
    localStorage.setItem(PHONES_STORAGE_KEY, JSON.stringify(phones));
  } catch (e) {
    console.warn('Lỗi ghi phones vào localStorage:', e);
  }
}

// Khởi tạo danh mục ban đầu (nạp từ localStorage và tự động gộp các hãng mới như OPPO, Vivo...)
function getInitialCategories() {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map(c => c.id));
        let changed = false;
        for (const cat of mockCategories) {
          if (!existingIds.has(cat.id)) {
            parsed.push(cat);
            existingIds.add(cat.id);
            changed = true;
          }
        }
        if (changed) {
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc categories từ localStorage:', e);
  }
  return [...mockCategories];
}

export const usePhoneStore = defineStore('phone', {
  state: () => ({
    // Danh sách toàn bộ điện thoại trong kho (Nạp từ localStorage bền vững)
    phones: getInitialPhones(),

    // Danh mục thương hiệu và phân khúc
    categories: getInitialCategories(),

    // Bộ lọc danh mục hiện hành
    selectedCategory: 'ALL',

    // Từ khóa tìm kiếm
    searchKeyword: '',

    // Bộ lọc theo thông số phần cứng
    selectedChipset: '',
    selectedRamRom: '',
    selectedOs: '',
    selectedPriceRange: 'ALL',
    onlyAvailable: false,

    // Dữ liệu phục vụ xem nhanh
    quickViewPhone: null,

    // Danh sách thiết bị đang đưa vào bảng so sánh cấu hình (Tối đa 3 máy)
    compareList: [],
    isCompareModalOpen: false,
    isMysqlConnected: false
  }),

  getters: {
    availableChipsets: (state) => {
      const set = new Set();
      state.phones.forEach(p => {
        if (p.cauHinh?.Chipset) set.add(p.cauHinh.Chipset);
      });
      return Array.from(set);
    },

    availableRamRom: (state) => {
      const set = new Set();
      state.phones.forEach(p => {
        if (p.cauHinh?.RAM_ROM) set.add(p.cauHinh.RAM_ROM);
      });
      return Array.from(set);
    },

    filteredPhones: (state) => {
      return state.phones.filter(phone => {
        // 1. Lọc theo danh mục / thương hiệu
        if (state.selectedCategory !== 'ALL') {
          if (state.selectedCategory === 'FLAGSHIP') {
            if (phone.category !== 'FLAGSHIP' && !phone.TenDienThoai?.includes('Pro Max') && !phone.TenDienThoai?.includes('Ultra')) {
              return false;
            }
          } else if (phone.category !== state.selectedCategory && phone.hangSanXuat !== state.selectedCategory) {
            return false;
          }
        }

        // 2. Lọc theo từ khóa tìm kiếm
        if (state.searchKeyword && state.searchKeyword.trim() !== '') {
          const kw = state.searchKeyword.toLowerCase().trim();
          const matchName = phone.TenDienThoai?.toLowerCase().includes(kw);
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

        // 5. Lọc theo hệ điều hành
        if (state.selectedOs) {
          if (state.selectedOs === 'iOS' && !phone.cauHinh?.HeDieuHanh?.includes('iOS')) return false;
          if (state.selectedOs === 'Android' && !phone.cauHinh?.HeDieuHanh?.includes('Android') && !phone.cauHinh?.HeDieuHanh?.includes('HyperOS')) return false;
        }

        // 6. Lọc theo mức giá thuê theo ngày
        const price = phone.giaKhuyenMai || phone.giaThueNgay;
        if (state.selectedPriceRange === 'UNDER_200' && price >= 200000) return false;
        if (state.selectedPriceRange === '200_TO_250' && (price < 200000 || price > 250000)) return false;
        if (state.selectedPriceRange === 'ABOVE_250' && price <= 250000) return false;

        // 7. Lọc chỉ lấy máy đang sẵn sàng cho thuê
        if (state.onlyAvailable && phone.TinhTrangMay !== 'SAN_SANG') {
          return false;
        }

        return true;
      });
    },

    hotPhones: (state) => state.phones.filter(p => p.isHot),
    featuredPhones: (state) => state.phones.filter(p => p.isFeatured)
  },

  actions: {
    // Đồng bộ lại danh sách máy từ localStorage (chỉ dùng khi Backend MySQL chưa bật)
    syncFromStorage() {
      if (this.isMysqlConnected) return;
      try {
        const saved = localStorage.getItem(PHONES_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            this.phones = parsed;
            return;
          }
        }
      } catch (e) {
        console.warn('Lỗi syncFromStorage phones:', e);
      }
      this.phones = [...mockPhones];
    },

    // Tự động tải & đồng bộ thời gian thực từ MySQL WampServer / Cloud Aiven
    async fetchPhones() {
      try {
        const data = await PhoneService.getAllPhones();
        if (Array.isArray(data)) {
          this.isMysqlConnected = true;
          const currentMap = new Map(this.phones.map(p => [p.maDienThoai, p]));
          const normalized = data.map(p => {
            const cur = currentMap.get(p.maDienThoai);
            let brand = (p.hangSanXuat || p.category || '').toUpperCase();
            if ((!brand || brand === 'FLAGSHIP' || brand === 'ALL') && cur && cur.hangSanXuat && cur.hangSanXuat !== 'FLAGSHIP') {
              brand = cur.hangSanXuat;
            }
            if (!brand || brand === 'FLAGSHIP' || brand === 'ALL') {
              const upper = String(p.TenDienThoai || '').toUpperCase();
              if (upper.includes('OPPO') || upper.includes('FIND') || upper.includes('RENO')) brand = 'OPPO';
              else if (upper.includes('IPHONE') || upper.includes('APPLE')) brand = 'APPLE';
              else if (upper.includes('SAMSUNG') || upper.includes('GALAXY')) brand = 'SAMSUNG';
              else if (upper.includes('XIAOMI') || upper.includes('REDMI')) brand = 'XIAOMI';
              else if (upper.includes('VIVO')) brand = 'VIVO';
              else if (upper.includes('REALME')) brand = 'REALME';
              else brand = 'OTHER';
            }
            return {
              ...p,
              hangSanXuat: brand,
              category: brand
            };
          });
          this.phones = normalized;
          persistPhones(this.phones);
        } else {
          this.isMysqlConnected = false;
          this.syncFromStorage();
        }
      } catch (err) {
        this.isMysqlConnected = false;
        this.syncFromStorage();
      }
    },

    setCategory(catId) {
      this.selectedCategory = catId;
    },

    setSearch(kw) {
      this.searchKeyword = kw;
    },

    resetFilters() {
      this.selectedCategory = 'ALL';
      this.searchKeyword = '';
      this.selectedChipset = '';
      this.selectedRamRom = '';
      this.selectedOs = '';
      this.selectedPriceRange = 'ALL';
      this.onlyAvailable = false;
    },

    openQuickView(phone) {
      this.quickViewPhone = phone;
    },

    closeQuickView() {
      this.quickViewPhone = null;
    },

    toggleCompare(phone) {
      const idx = this.compareList.findIndex(p => p.maDienThoai === phone.maDienThoai);
      if (idx >= 0) {
        this.compareList.splice(idx, 1);
      } else {
        if (this.compareList.length >= 3) {
          this.compareList.shift();
        }
        this.compareList.push(phone);
        this.isCompareModalOpen = true;
      }
    },

    removeFromCompare(phoneId) {
      this.compareList = this.compareList.filter(p => p.maDienThoai !== phoneId);
    },

    clearCompare() {
      this.compareList = [];
      this.isCompareModalOpen = false;
    },

    getPhoneById(id) {
      const numId = Number(id);
      return this.phones.find(p => p.maDienThoai === numId);
    },

    // Thao tác Admin: Thêm thiết bị mới
    async addPhone(newPhone) {
      const brand = (newPhone.hangSanXuat || newPhone.category || 'OPPO').toUpperCase();
      const maxId = this.phones.reduce((max, p) => (p.maDienThoai > max ? p.maDienThoai : max), 0);
      const phoneToAdd = {
        ...newPhone,
        maDienThoai: maxId + 1,
        hangSanXuat: brand,
        category: brand,
        isHot: newPhone.isHot ?? false,
        isFeatured: newPhone.isFeatured ?? true,
        SoLuong: newPhone.SoLuong ?? 5,
        TinhTrangMay: newPhone.TinhTrangMay || 'SAN_SANG',
        TinhTrangMayText: newPhone.TinhTrangMay === 'SAN_SANG' ? 'Sẵn sàng thuê' : (newPhone.TinhTrangMay === 'BAO_TRI' ? 'Bảo trì' : 'Đang thuê')
      };

      // Đưa máy mới lên đầu danh sách
      this.phones.unshift(phoneToAdd);

      // Lưu ngay vào localStorage
      persistPhones(this.phones);

      // Gửi đồng bộ tới backend MySQL (nếu có server chạy) và đồng bộ lại ID tự tăng của MySQL
      try {
        const created = await PhoneService.createPhone(phoneToAdd);
        if (created && created.maDienThoai) {
          phoneToAdd.maDienThoai = Number(created.maDienThoai);
          if (created.hangSanXuat) {
            phoneToAdd.hangSanXuat = created.hangSanXuat;
            phoneToAdd.category = created.hangSanXuat;
          }
          persistPhones(this.phones);
        }
      } catch (err) {
        console.warn('Backend offline, đã lưu máy mới vào localStorage:', err);
      }

      return phoneToAdd;
    },

    // Thao tác Admin: Cập nhật thiết bị
    async updatePhone(id, updatedData) {
      const numId = Number(id);
      const brand = (updatedData.hangSanXuat || updatedData.category || '').toUpperCase();
      const index = this.phones.findIndex(p => p.maDienThoai === numId);
      if (index !== -1) {
        this.phones[index] = {
          ...this.phones[index],
          ...updatedData,
          hangSanXuat: brand || this.phones[index].hangSanXuat,
          category: brand || this.phones[index].category,
          TinhTrangMayText: updatedData.TinhTrangMay === 'SAN_SANG' ? 'Sẵn sàng thuê' : (updatedData.TinhTrangMay === 'BAO_TRI' ? 'Bảo trì' : 'Đang thuê')
        };
        persistPhones(this.phones);
      }

      try {
        await PhoneService.updatePhone(id, updatedData);
      } catch (err) {
        console.warn('Backend offline, đã cập nhật máy vào localStorage:', err);
      }

      return true;
    },

    // Thao tác Admin: Xóa thiết bị
    async deletePhone(id) {
      const numId = Number(id);
      this.phones = this.phones.filter(p => p.maDienThoai !== numId);
      persistPhones(this.phones);

      try {
        await PhoneService.deletePhone(id);
      } catch (err) {
        console.warn('Backend offline, đã xóa máy khỏi localStorage:', err);
      }
    },

    // Cập nhật trạng thái máy
    setPhoneStatus(id, newStatus) {
      const phone = this.getPhoneById(id);
      if (phone) {
        phone.TinhTrangMay = newStatus;
        phone.TinhTrangMayText = newStatus === 'SAN_SANG' ? 'Sẵn sàng thuê' : (newStatus === 'BAO_TRI' ? 'Bảo trì' : 'Đang thuê');
        persistPhones(this.phones);
      }
    },

    // Thao tác Admin: Thêm hãng điện thoại mới
    addCategory(cat) {
      if (!cat || !cat.name) {
        throw new Error('Vui lòng nhập tên hãng điện thoại!');
      }

      const id = (cat.id || cat.name.replace(/\s+/g, '_')).toUpperCase().trim();
      
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
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(this.categories));
      } catch (e) {
        console.warn('Lỗi lưu categories vào localStorage:', e);
      }

      return newCat;
    },

    // Thao tác Admin: Xóa hãng điện thoại
    deleteCategory(catId) {
      if (catId === 'ALL') {
        throw new Error('Không thể xóa danh mục mặc định "Tất cả điện thoại"!');
      }

      this.categories = this.categories.filter(c => c.id !== catId);

      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(this.categories));
      } catch (e) {
        console.warn('Lỗi lưu categories vào localStorage:', e);
      }

      return true;
    },

    // Khôi phục danh sách máy về mặc định
    resetToDefaultPhones() {
      this.phones = JSON.parse(JSON.stringify(mockPhones));
      persistPhones(this.phones);
    }
  }
});

// Lắng nghe sự kiện storage giữa các tab để đồng bộ kho máy thời gian thực
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === PHONES_STORAGE_KEY && event.newValue) {
      try {
        const store = usePhoneStore();
        store.syncFromStorage();
      } catch (err) {}
    }
  });
}
