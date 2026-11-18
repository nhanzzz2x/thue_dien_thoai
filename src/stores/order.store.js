// PINIA STORE QUẢN LÝ ĐƠN THUÊ THIẾT BỊ (RENTAL ORDER STORE)
// Ánh xạ ERD: Thực thể `DonThue`, `ChiTietDonThue`, `DatCoc`, `TrangThai`
// Tích hợp: localStorage ('trongnhan_orders') & OrderService API (MySQL)

import { defineStore } from 'pinia';
import { mockPhones } from '@/data/mockData';
import { OrderService } from '@/services/order.service';

const STORAGE_KEY = 'trongnhan_orders';

// Danh sách các đơn thuê mẫu ban đầu (Initial mock rental orders)
const defaultMockOrders = [
  {
    maDonThue: 'DT-20261028-001',                               // ERD: DonThue.ma_don_thue (Mã đơn thuê duy nhất)
    ngayTao: '2026-10-28 09:30',                                // Thời điểm tạo đơn (Created timestamp)
    khachHang: {                                                // ERD: NguoiDung (Khách hàng thuê máy)
      hoTen: 'Trần Trong Nhân',                                  // tenNguoiDung
      sdt: '0987654321',                                        // Sdt
      email: 'trongnhan@trongnhanmobile.vn',                    // email
      cccd: '079201008899',                                     // CCCD (Căn cước công dân định danh)
      diaChi: '195/9 Nguyễn Văn Thương, P.25, Bình Thạnh, TP.HCM' // DiaChi
    },
    danhSachMay: [                                              // ERD: ChiTietDonThue / ChiTietThue (Danh sách thiết bị)
      {
        maDienThoai: 1,                                         // maDienThoai
        TenDienThoai: 'iPhone 16 Pro Max 256GB - Titan Tự Nhiên', // TenDienThoai
        MacDinh: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
        SoIMEI_Serial: '354892049182741',                       // SoIMEI_Serial (Số IMEI duy nhất)
        RAM_ROM: '8GB / 256GB',                                 // cauHinh.RAM_ROM
        giaThueNgay: 249000,                                    // giaThueNgay
        tienCocYeuCau: 15000000,                                // tienCocYeuCau
        quantity: 1                                             // SoLuong
      }
    ],
    ngayBatDauThue: '2026-10-29',                               // ERD: DonThue.NgayBatDauThue
    ngayKetThucThue: '2026-11-03',                              // ERD: DonThue.NgayKetThucThue
    soNgayThue: 5,                                              // Số ngày thuê (5 ngày)
    hinhThucCoc: 'GIAY_TO_TUY_THAN',                            // ERD: DatCoc.phuong_thuc (Giữ CCCD)
    hinhThucCocText: 'CCCD gắn chip + Cọc tiền mặt 15%',
    tienCocThucTe: 2250000,                                     // ERD: DatCoc.so_tien / DonThue.the_chan (15% của 15 triệu)
    tienThueGoc: 1245000,                                       // Tiền thuê gốc (249.000đ x 5 ngày)
    tienGiamGia: 186750,                                        // ERD: KhuyenMai.phanTramGiam (Giảm 15% khi thuê >= 3 ngày)
    tongTienThue: 1058250,                                      // ERD: DonThue.TongTien = 1.245.000 - 186.750
    tongThanhToanBanDau: 3308250,                               // Tổng thanh toán ban đầu = Tiền thuê + Tiền cọc
    trangThai: 'DANG_THUE',                                     // ERD: TrangThai.trang_thai (Đang thuê)
    ghiChuKiemTraMay: 'Máy mới 99%, đầy đủ cáp sạc USB-C, ốp lưng chống sốc.',
    lichSuTrangThai: [                                          // Lịch sử tiến trình State Machine
      { time: '2026-10-28 09:30', title: 'Đặt đơn thuê thành công', desc: 'Khách hàng hoàn tất đăng ký đơn thuê qua hệ thống' },
      { time: '2026-10-28 10:15', title: 'Đã xác nhận cọc', desc: 'Đã nhận giữ CCCD và nhận cọc 2.250.000đ qua VNPay' },
      { time: '2026-10-29 08:30', title: 'Đã bàn giao máy', desc: 'Bàn giao máy iPhone 16 Pro Max (IMEI: 354892049182741) cho khách' }
    ]
  },
  {
    maDonThue: 'DT-20261029-002',
    ngayTao: '2026-10-29 14:10',
    khachHang: {
      hoTen: 'Nguyễn Hoài Thịnh',
      sdt: '0912345678',
      email: 'hoaithinh.stu@gmail.com',
      cccd: '080200112233',
      diaChi: '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM'
    },
    danhSachMay: [
      {
        maDienThoai: 2,
        TenDienThoai: 'Samsung Galaxy S24 Ultra 5G 12GB/512GB',
        MacDinh: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png',
        SoIMEI_Serial: '359872109847123',
        RAM_ROM: '12GB / 512GB',
        giaThueNgay: 220000,
        tienCocYeuCau: 14000000,
        quantity: 1
      }
    ],
    ngayBatDauThue: '2026-10-31',
    ngayKetThucThue: '2026-11-07',
    soNgayThue: 7,
    hinhThucCoc: 'CHUYEN_KHOAN',                                // Cọc 100% bằng chuyển khoản ngân hàng
    hinhThucCocText: 'Chuyển khoản 100% qua Ngân hàng (MB Bank)',
    tienCocThucTe: 14000000,
    tienThueGoc: 1540000,
    tienGiamGia: 385000,                                        // Giảm 25% khi thuê từ 7 ngày trở lên
    tongTienThue: 1155000,
    tongThanhToanBanDau: 15155000,
    trangThai: 'CHO_DUYET',                                     // Đơn đang chờ admin duyệt cọc
    ghiChuKiemTraMay: 'Khách yêu cầu kèm bút S-Pen và sạc nhanh 45W.',
    lichSuTrangThai: [
      { time: '2026-10-29 14:10', title: 'Đặt đơn thuê thành công', desc: 'Đơn chờ nhân viên cửa hàng gọi điện xác nhận cọc' }
    ]
  },
  {
    maDonThue: 'DT-20261025-003',
    ngayTao: '2026-10-25 11:00',
    khachHang: {
      hoTen: 'Lê Hoàng Long',
      sdt: '0903987654',
      email: 'hoanglong.media@gmail.com',
      cccd: '079200334455',
      diaChi: 'Tòa nhà Landmark 81, Vinhomes Central Park, Bình Thạnh'
    },
    danhSachMay: [
      {
        maDienThoai: 5,
        TenDienThoai: 'ASUS ROG Phone 8 Pro 16GB/512GB',
        MacDinh: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/a/s/asus-rog-phone-8_1.png',
        SoIMEI_Serial: '357891234567890',
        RAM_ROM: '16GB / 512GB',
        giaThueNgay: 230000,
        tienCocYeuCau: 12000000,
        quantity: 1
      }
    ],
    ngayBatDauThue: '2026-10-25',
    ngayKetThucThue: '2026-10-28',
    soNgayThue: 3,
    hinhThucCoc: 'MAY_ANH_MAY_TINH',                            // Thế chân tài sản máy tính
    hinhThucCocText: 'Thế chân máy tính Laptop Dell XPS 15',
    tienCocThucTe: 0,                                           // Tiền cọc mặt = 0đ (giữ tài sản)
    tienThueGoc: 690000,
    tienGiamGia: 103500,
    tongTienThue: 586500,
    tongThanhToanBanDau: 586500,
    trangThai: 'HOAN_TAT_TRA_COC',                              // Đã hoàn tất trả máy và trả lại Laptop
    ghiChuKiemTraMay: 'Khách trả máy đúng hạn, máy không trầy xước, đã hoàn trả lại Laptop thế chân.',
    lichSuTrangThai: [
      { time: '2026-10-25 11:00', title: 'Đặt đơn thuê thành công', desc: 'Đăng ký thuê tham gia giải đấu Gaming' },
      { time: '2026-10-25 11:30', title: 'Đã nhận tài sản thế chân', desc: 'Niêm phong Laptop Dell XPS 15 tại két bảo mật' },
      { time: '2026-10-25 11:35', title: 'Đã giao máy ROG Phone', desc: 'Bàn giao kèm quạt tản nhiệt AeroActive Cooler' },
      { time: '2026-10-28 17:00', title: 'Khách đã hoàn trả máy', desc: 'Kỹ thuật kiểm tra ngoại quan máy nguyên vẹn 100%' },
      { time: '2026-10-28 17:15', title: 'Hoàn tất trả cọc & tài sản', desc: 'Bàn giao lại Laptop thế chân cho khách, kết thúc hợp đồng thuê' }
    ]
  }
];

// Hàm khởi tạo danh sách đơn từ localStorage (hoặc nạp mặc định nếu chưa có)
function getInitialOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc orders từ localStorage:', e);
  }
  // Nếu chưa có, ghi danh sách mặc định vào localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMockOrders));
  } catch (e) {}
  return [...defaultMockOrders];
}

// Lưu mảng đơn hàng vào localStorage
function persistOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Lỗi ghi orders vào localStorage:', e);
  }
}

export const useOrderStore = defineStore('order', {
  // STATE: Nơi lưu trữ danh sách các đơn thuê và bộ lọc tìm kiếm
  state: () => ({
    // Danh sách các đơn thuê (Nạp từ localStorage để đồng bộ giữa các tab và sau khi F5)
    orders: getInitialOrders(),
    selectedStatusFilter: 'ALL',                                     // Bộ lọc trạng thái đang chọn
    searchKeyword: ''                                                // Từ khóa tìm kiếm
  }),

  // GETTERS: Các hàm tính toán dẫn xuất tự động re-compute khi state thay đổi
  getters: {
    // 1. Tổng số lượng đơn thuê (Total orders count)
    totalOrders: (state) => state.orders.length,

    // 2. Danh sách các đơn đang chờ duyệt cọc (Pending deposit orders)
    pendingOrders: (state) => state.orders.filter(o => o.trangThai === 'CHO_DUYET'),

    // 3. Danh sách các đơn đang có hiệu lực thuê (Active rentals)
    activeRentals: (state) => state.orders.filter(o => o.trangThai === 'DANG_THUE'),

    // 4. Danh sách các đơn đã hoàn tất (Completed rentals)
    completedRentals: (state) => state.orders.filter(o => o.trangThai === 'HOAN_TAT_TRA_COC'),

    // 5. Tổng tiền cọc đang giữ tại két an toàn (Total deposit currently held)
    // Phục vụ thống kê KPI trên Admin Dashboard
    totalDepositHolding: (state) => {
      return state.orders
        .filter(o => o.trangThai === 'DA_XAC_NHAN_COC' || o.trangThai === 'DANG_THUE')
        .reduce((sum, o) => sum + (o.tienCocThucTe || 0), 0);
    },

    // 6. Tổng doanh thu tiền thuê máy đã và đang thực hiện (Total rental revenue)
    totalRevenueRental: (state) => {
      return state.orders
        .filter(o => o.trangThai !== 'DA_HUY')
        .reduce((sum, o) => sum + (o.tongTienThue || 0), 0);
    },

    // 7. Danh sách đơn thuê sau khi lọc theo từ khóa và trạng thái (Filtered orders)
    filteredOrders: (state) => {
      return state.orders.filter(order => {
        // Lọc theo trạng thái đơn
        if (state.selectedStatusFilter !== 'ALL' && order.trangThai !== state.selectedStatusFilter) {
          return false;
        }

        // Lọc theo từ khóa tìm kiếm (Mã đơn, Tên khách, SĐT, Số IMEI)
        if (state.searchKeyword && state.searchKeyword.trim() !== '') {
          const kw = state.searchKeyword.toLowerCase().trim();
          const matchCode = order.maDonThue?.toLowerCase().includes(kw);
          const matchName = order.khachHang?.hoTen?.toLowerCase().includes(kw);
          const matchPhone = order.khachHang?.sdt?.includes(kw);
          const matchImei = order.danhSachMay?.some(m => m.SoIMEI_Serial?.toLowerCase().includes(kw));
          if (!matchCode && !matchName && !matchPhone && !matchImei) return false;
        }

        return true;
      });
    }
  },

  // ACTIONS: Các hàm nghiệp vụ thay đổi trạng thái (Business actions)
  actions: {
    // HÀM: ĐỒNG BỘ DỮ LIỆU TỪ LOCALSTORAGE (SYNC FROM STORAGE)
    syncFromStorage() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            this.orders = parsed;
          }
        }
      } catch (e) {
        console.warn('Lỗi syncFromStorage:', e);
      }
    },

    // HÀM: TẢI & ĐỒNG BỘ ĐƠN THUÊ TRỰC TIẾP TỪ MYSQL WAMPSERVER (GET /api/rentals)
    async fetchOrders() {
      try {
        const data = await OrderService.getAllOrders();
        if (Array.isArray(data) && data.length > 0) {
          if (JSON.stringify(this.orders) !== JSON.stringify(data)) {
            this.orders = data;
            persistOrders(this.orders);
          }
        } else {
          this.syncFromStorage();
        }
      } catch (err) {
        this.syncFromStorage();
      }
    },

    // HÀM: TẠO ĐƠN THUÊ MỚI TỪ GIỎ HÀNG (CREATE RENTAL ORDER)
    // Tham số: payload từ CartDrawer / ContractConfirmModal
    taoDonThue(payload) {
      // 1. Tự sinh mã đơn duy nhất định dạng: DT-YYYYMMDD-RandomID
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomId = Math.floor(100 + Math.random() * 900);
      const maDonThue = `DT-${dateStr}-${randomId}`;

      // 2. Lấy thời gian hiện tại làm ngày tạo đơn
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // 3. Khởi tạo đối tượng đơn thuê khớp chuẩn ERD
      const newOrder = {
        maDonThue,
        ngayTao: timeStr,
        khachHang: {
          hoTen: payload.hoTen,
          sdt: payload.sdt,
          email: payload.email,
          cccd: payload.cccd,
          diaChi: payload.diaChi
        },
        danhSachMay: payload.items.map(item => ({
          maDienThoai: item.phone.maDienThoai,
          TenDienThoai: item.phone.TenDienThoai,
          MacDinh: item.phone.MacDinh,
          SoIMEI_Serial: item.phone.SoIMEI_Serial,
          RAM_ROM: item.phone.cauHinh?.RAM_ROM,
          giaThueNgay: item.phone.giaKhuyenMai || item.phone.giaThueNgay,
          tienCocYeuCau: item.phone.tienCocYeuCau,
          quantity: item.quantity
        })),
        ngayBatDauThue: payload.startDate,
        ngayKetThucThue: payload.endDate,
        soNgayThue: payload.rentalDays,
        hinhThucCoc: payload.depositMethod,
        hinhThucCocText: payload.depositMethodText,
        tienCocThucTe: payload.cashDeposit,
        tienThueGoc: payload.subTotalRental,
        tienGiamGia: payload.discountAmount,
        tongTienThue: payload.finalTotalRental,
        tongThanhToanBanDau: payload.finalTotalRental + payload.cashDeposit,
        anhCccdMatTruoc: payload.anhCccdMatTruoc || null,
        anhCccdMatSau: payload.anhCccdMatSau || null,
        maGiaoDichQr: payload.maGiaoDichQr || null,
        ghiChuTheChan: payload.ghiChuTheChan || null,
        trangThai: 'CHO_DUYET',                                       // Khởi đầu ở trạng thái Chờ duyệt cọc
        ghiChuKiemTraMay: payload.note || 'Đơn thuê mới từ khách hàng website.',
        lichSuTrangThai: [
          {
            time: timeStr,
            title: 'Khách hàng đặt đơn thuê thành công',
            desc: `Đã chọn ${payload.items.length} thiết bị, hình thức cọc: ${payload.depositMethodText}`
          }
        ]
      };

      // Đưa đơn mới lên đầu danh sách (Unshift to orders list)
      this.orders.unshift(newOrder);

      // Lưu ngay vào localStorage để duy trì qua các tab và sau reload
      persistOrders(this.orders);

      // Gửi ngầm tới backend MySQL (nếu có server đang chạy)
      OrderService.createOrder(newOrder).catch(err => {
        console.warn('Lưu đơn vào MySQL backend offline, đã lưu trữ cục bộ:', err);
      });

      return newOrder;
    },

    // HÀM: QUẢN TRỊ VIÊN CẬP NHẬT TRẠNG THÁI ĐƠN (ADMIN UPDATE ORDER STATUS)
    // Điều hướng vòng đời State Machine từ Chờ duyệt -> Xác nhận cọc -> Đang thuê -> Hoàn tất
    capNhatTrangThai(maDonThue, trangThaiMoi, ghiChuMoi = '') {
      const order = this.orders.find(o => o.maDonThue === maDonThue);
      if (!order) return false;

      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Cập nhật trường trạng thái
      order.trangThai = trangThaiMoi;

      let title = '';
      let desc = ghiChuMoi;

      switch (trangThaiMoi) {
        case 'DA_XAC_NHAN_COC':
          title = 'Đã xác nhận nhận cọc / tài sản thế chân';
          desc = desc || 'Nhân viên đã xác nhận đủ điều kiện đặt cọc';
          break;
        case 'DANG_THUE':
          title = 'Đã giao máy cho khách (Bắt đầu tính thời gian thuê)';
          desc = desc || 'Khách đã nhận máy nguyên tem, kèm phụ kiện đầy đủ';
          break;
        case 'DA_TRA_MAY':
          title = 'Khách đã mang máy đến trả tại cửa hàng';
          desc = desc || 'Đang thực hiện kiểm tra ngoại quan máy và số IMEI';
          break;
        case 'HOAN_TAT_TRA_COC':
          title = 'Hoàn tất đơn & Trả lại tiền cọc / tài sản thế chân';
          desc = desc || 'Máy nguyên vẹn 100%, đã hoàn trả đầy đủ tiền cọc cho khách hàng';
          break;
        case 'DA_HUY':
          title = 'Đơn thuê đã hủy';
          desc = desc || 'Đơn thuê bị hủy theo yêu cầu của khách hoặc vi phạm chính sách';
          break;
      }

      // Thêm một mốc vào nhật ký lịch sử tiến trình đơn (Push log)
      order.lichSuTrangThai.push({
        time: timeStr,
        title,
        desc
      });

      // Lưu trạng thái cập nhật vào localStorage
      persistOrders(this.orders);

      // Đồng bộ tới backend MySQL
      OrderService.updateOrderStatus(maDonThue, trangThaiMoi, ghiChuMoi).catch(err => {
        console.warn('Cập nhật trạng thái tới MySQL backend offline:', err);
      });

      return true;
    },

    // HÀM: TÌM ĐƠN THUÊ THEO MÃ ĐƠN (GET ORDER BY ID)
    getOrderById(maDonThue) {
      return this.orders.find(o => o.maDonThue === maDonThue);
    },

    // HÀM: KHÔI PHỤC DANH SÁCH ĐƠN MẶC ĐỊNH (RESET TO DEFAULT ORDERS)
    resetToDefaultOrders() {
      this.orders = JSON.parse(JSON.stringify(defaultMockOrders));
      persistOrders(this.orders);
    }
  }
});

// Lắng nghe sự kiện lưu trữ giữa các tab trong trình duyệt để đồng bộ dữ liệu thời gian thực
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const store = useOrderStore();
        store.syncFromStorage();
      } catch (err) {
        // Tránh lỗi khi Pinia chưa mount
      }
    }
  });
}
