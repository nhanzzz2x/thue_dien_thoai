// Mock data strictly matching the ERD entities:
// DienThoai, CauHinh_PhienBan, KhuyenMai, PhieuKhuyenMai, TrangThai

export const mockCategories = [
  { id: 'ALL', name: 'Tất cả điện thoại', icon: 'fa-mobile' },
  { id: 'APPLE', name: 'Apple iPhone', icon: 'fa-apple' },
  { id: 'SAMSUNG', name: 'Samsung Galaxy', icon: 'fa-android' },
  { id: 'XIAOMI', name: 'Xiaomi & Redmi', icon: 'fa-bolt' },
  { id: 'GAMING', name: 'Gaming Phone (ROG, RedMagic)', icon: 'fa-gamepad' },
 // { id: 'FLAGSHIP', name: 'Flagship Cao Cấp', icon: 'fa-crown' }
];

export const mockPhones = [
  {
    maDienThoai: 1,
    TenDienThoai: "iPhone 16 Pro Max 256GB - Titan Tự Nhiên",
    hangSanXuat: "APPLE",
    category: "APPLE",
    isHot: true,
    isFeatured: true,
    SoIMEI_Serial: "354892049182741",
    TinhTrangMay: "SAN_SANG", // SAN_SANG | DANG_THUE | BAO_TRI
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 6,
    MacDinh: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
    hinhAnh: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
    ],
    giaThueNgay: 290000,
    giaKhuyenMai: 249000,
    tienCocYeuCau: 15000000,
    cauHinh: {
      MaCauHinh: "CH_IP16PM_256",
      Chipset: "Apple A18 Pro (3nm)",
      RAM_ROM: "8GB / 256GB",
      RAM: "8GB",
      ROM: "256GB",
      HeDieuHanh: "iOS 18",
      ThongSoCamera_Pin: "Camera 48MP Zoom 5x, Pin 4685 mAh, Màn hình 6.9\" OLED 120Hz Promotion",
      KichThuocManHinh: "6.9 inch Super Retina XDR",
      DungLuongPin: "4685 mAh (Sạc nhanh 30W)"
    },
    moTa: "Flagship mới nhất của Apple với chip A18 Pro cực mạnh, nút Camera Control chuyên nghiệp, khung viền Titan siêu nhẹ, camera telephoto tiềm vọng 5x đỉnh cao."
  },
  {
    maDienThoai: 2,
    TenDienThoai: "Samsung Galaxy S24 Ultra 5G 12GB/512GB",
    hangSanXuat: "SAMSUNG",
    category: "SAMSUNG",
    isHot: true,
    isFeatured: true,
    SoIMEI_Serial: "359872109847123",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 4,
    MacDinh: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
    hinhAnh: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png"
    ],
    giaThueNgay: 270000,
    giaKhuyenMai: 220000,
    tienCocYeuCau: 14000000,
    cauHinh: {
      MaCauHinh: "CH_S24U_512",
      Chipset: "Snapdragon 8 Gen 3 for Galaxy",
      RAM_ROM: "12GB / 512GB",
      RAM: "12GB",
      ROM: "512GB",
      HeDieuHanh: "Android 14 (One UI 6.1 - Galaxy AI)",
      ThongSoCamera_Pin: "Camera 200MP Zoom 100x AI, Pin 5000 mAh, Màn hình Dynamic AMOLED 2X phẳng",
      KichThuocManHinh: "6.8 inch QHD+ 120Hz",
      DungLuongPin: "5000 mAh (Sạc 45W)"
    },
    moTa: "Điện thoại quyền năng tích hợp Galaxy AI thông minh, bút S-Pen tiện ích, camera siêu zoom 200MP bắt trọn concert và du lịch."
  },
  {
    maDienThoai: 3,
    TenDienThoai: "iPhone 15 Pro Max 256GB - Titan Xanh",
    hangSanXuat: "APPLE",
    category: "APPLE",
    isHot: true,
    isFeatured: true,
    SoIMEI_Serial: "352345678912345",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 8,
    MacDinh: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    hinhAnh: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
    ],
    giaThueNgay: 230000,
    giaKhuyenMai: 199000,
    tienCocYeuCau: 12000000,
    cauHinh: {
      MaCauHinh: "CH_IP15PM_256",
      Chipset: "Apple A17 Pro (3nm)",
      RAM_ROM: "8GB / 256GB",
      RAM: "8GB",
      ROM: "256GB",
      HeDieuHanh: "iOS 17",
      ThongSoCamera_Pin: "Camera 48MP Zoom quang 5x, Pin 4422 mAh, Cổng USB-C tốc độ cao",
      KichThuocManHinh: "6.7 inch OLED 120Hz",
      DungLuongPin: "4422 mAh (Sạc 27W)"
    },
    moTa: "Mẫu máy được thuê nhiều nhất cho nhu cầu chụp kỷ yếu, đi du lịch, quay TikTok/Reels với chất lượng màu sắc chuẩn điện ảnh."
  },
  {
    maDienThoai: 4,
    TenDienThoai: "Samsung Galaxy Z Fold6 5G 12GB/256GB",
    hangSanXuat: "SAMSUNG",
    category: "FLAGSHIP",
    isHot: true,
    isFeatured: true,
    SoIMEI_Serial: "358765432109876",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 3,
    MacDinh: "https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-xam-1-1.jpg",
    hinhAnh: [
      "https://cdn.tgdd.vn/Products/Images/42/320721/samsung-galaxy-z-fold6-xam-1-1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-z-fold-6_2.jpg"
    ],
    giaThueNgay: 320000,
    giaKhuyenMai: 280000,
    tienCocYeuCau: 18000000,
    cauHinh: {
      MaCauHinh: "CH_ZFOLD6_256",
      Chipset: "Snapdragon 8 Gen 3 for Galaxy",
      RAM_ROM: "12GB / 256GB",
      RAM: "12GB",
      ROM: "256GB",
      HeDieuHanh: "Android 14 (One UI 6.1.1)",
      ThongSoCamera_Pin: "Màn hình gập 7.6\" 120Hz, Camera 50MP OIS, Pin 4400 mAh",
      KichThuocManHinh: "Chính 7.6\" + Phụ 6.3\" Dynamic AMOLED 2X",
      DungLuongPin: "4400 mAh"
    },
    moTa: "Siêu phẩm màn hình gập mỏng nhẹ nhất dòng Fold, mở ra không gian đa nhiệm rộng lớn như máy tính bảng cho doanh nhân và sự kiện."
  },
  {
    maDienThoai: 5,
    TenDienThoai: "ASUS ROG Phone 8 Pro 16GB/512GB",
    hangSanXuat: "ASUS",
    category: "GAMING",
    isHot: false,
    isFeatured: true,
    SoIMEI_Serial: "351234987654321",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 5,
    MacDinh: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/r/o/rog-phone-8-pro_1.png",
    hinhAnh: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/r/o/rog-phone-8-pro_1.png"
    ],
    giaThueNgay: 250000,
    giaKhuyenMai: 210000,
    tienCocYeuCau: 13000000,
    cauHinh: {
      MaCauHinh: "CH_ROG8_512",
      Chipset: "Snapdragon 8 Gen 3 (3.3GHz)",
      RAM_ROM: "16GB / 512GB",
      RAM: "16GB",
      ROM: "512GB",
      HeDieuHanh: "Android 14 (ROG UI)",
      ThongSoCamera_Pin: "Màn hình 165Hz AMOLED, Nút AirTrigger cảm ứng, Pin 5500 mAh Sạc 65W",
      KichThuocManHinh: "6.78 inch FHD+ 165Hz LTPO",
      DungLuongPin: "5500 mAh (Sạc 65W)"
    },
    moTa: "Quái thú gaming đích thực cho giải đấu eSports, livestream, chơi Genshin Impact mượt mà ở 60-120fps không tụt khung hình."
  },
  {
    maDienThoai: 6,
    TenDienThoai: "Xiaomi 14 Ultra 5G 16GB/512GB (Leica)",
    hangSanXuat: "XIAOMI",
    category: "XIAOMI",
    isHot: true,
    isFeatured: false,
    SoIMEI_Serial: "356789012345678",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 3,
    MacDinh: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_1.png",
    hinhAnh: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_1.png"
    ],
    giaThueNgay: 260000,
    giaKhuyenMai: 220000,
    tienCocYeuCau: 13500000,
    cauHinh: {
      MaCauHinh: "CH_MI14U_512",
      Chipset: "Snapdragon 8 Gen 3",
      RAM_ROM: "16GB / 512GB",
      RAM: "16GB",
      ROM: "512GB",
      HeDieuHanh: "Xiaomi HyperOS (Android 14)",
      ThongSoCamera_Pin: "Cụm 4 Camera Leica 50MP cảm biến 1-inch Sony LYT-900, Pin 5000 mAh Sạc 90W",
      KichThuocManHinh: "6.73 inch 2K+ LTPO AMOLED 120Hz",
      DungLuongPin: "5000 mAh (Sạc nhanh 90W, Không dây 80W)"
    },
    moTa: "Đỉnh cao nhiếp ảnh di động đồng chế tác cùng Leica, trang bị cảm biến 1-inch và khẩu độ thay đổi liên tục vô cấp f/1.63 - f/4.0."
  },
  {
    maDienThoai: 7,
    TenDienThoai: "iPhone 16 128GB - Hồng Pastel",
    hangSanXuat: "APPLE",
    category: "APPLE",
    isHot: false,
    isFeatured: true,
    SoIMEI_Serial: "354567890123456",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 10,
    MacDinh: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1.png",
    hinhAnh: [
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-1.png"
    ],
    giaThueNgay: 170000,
    giaKhuyenMai: 145000,
    tienCocYeuCau: 9500000,
    cauHinh: {
      MaCauHinh: "CH_IP16_128",
      Chipset: "Apple A18 (3nm)",
      RAM_ROM: "8GB / 128GB",
      RAM: "8GB",
      ROM: "128GB",
      HeDieuHanh: "iOS 18",
      ThongSoCamera_Pin: "Camera kép 48MP Fushion, Nút Camera Control & Action Button, Pin 3561 mAh",
      KichThuocManHinh: "6.1 inch Super Retina XDR",
      DungLuongPin: "3561 mAh"
    },
    moTa: "Màu sắc trẻ trung bắt mắt, giá thuê mềm phù hợp cho học sinh, sinh viên test app, đi show âm nhạc hoặc quay vlog ngắn."
  },
  {
    maDienThoai: 8,
    TenDienThoai: "Samsung Galaxy Z Flip6 5G 12GB/256GB",
    hangSanXuat: "SAMSUNG",
    category: "SAMSUNG",
    isHot: false,
    isFeatured: true,
    SoIMEI_Serial: "359012345678901",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 4,
    MacDinh: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip6-1.jpg",
    hinhAnh: [
      "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip6-1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e3/%E4%B8%89%E6%98%9FGalaxy_Z_Flip6.png",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_166_3.png"
    ],
    giaThueNgay: 210000,
    giaKhuyenMai: 179000,
    tienCocYeuCau: 11000000,
    cauHinh: {
      MaCauHinh: "CH_ZFLIP6_256",
      Chipset: "Snapdragon 8 Gen 3 for Galaxy",
      RAM_ROM: "12GB / 256GB",
      RAM: "12GB",
      ROM: "256GB",
      HeDieuHanh: "Android 14 (One UI 6.1)",
      ThongSoCamera_Pin: "Màn hình gập FlexCam 50MP, Flex Window 3.4\", Pin 4000 mAh",
      KichThuocManHinh: "6.7\" FHD+ 120Hz + Phụ 3.4\"",
      DungLuongPin: "4000 mAh"
    },
    moTa: "Thiết kế gập vỏ sò sành điệu, gập mở tự đứng chụp ảnh không cần tripod, phụ kiện thời trang hoàn hảo cho sự kiện và tiệc cưới."
  },
  {
    maDienThoai: 9,
    TenDienThoai: "Nubia RedMagic 9 Pro 16GB/512GB",
    hangSanXuat: "NUBIA",
    category: "GAMING",
    isHot: false,
    isFeatured: false,
    SoIMEI_Serial: "357890123456789",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 3,
    MacDinh: "https://fdn2.gsmarena.com/vv/pics/zte/zte-nubia-red-magic-9-pro-1.jpg",
    hinhAnh: [
      "https://fdn2.gsmarena.com/vv/pics/zte/zte-nubia-red-magic-9-pro-1.jpg",
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-nubia-red-magic-9-pro_1.png"
    ],
    giaThueNgay: 240000,
    giaKhuyenMai: 200000,
    tienCocYeuCau: 12500000,
    cauHinh: {
      MaCauHinh: "CH_REDMAGIC9_512",
      Chipset: "Snapdragon 8 Gen 3",
      RAM_ROM: "16GB / 512GB",
      RAM: "16GB",
      ROM: "512GB",
      HeDieuHanh: "RedMagic OS 9.0 (Android 14)",
      ThongSoCamera_Pin: "Màn hình tràn viền không khiếm khuyết, Quạt tản nhiệt cơ học RGB 22.000 rpm, Pin 6500 mAh",
      KichThuocManHinh: "6.8 inch AMOLED 120Hz",
      DungLuongPin: "6500 mAh (Sạc nhanh 80W)"
    },
    moTa: "Màn hình vô khuyết camera ẩn dưới màn hình, pin khủng 6500mAh cày game cả ngày dài."
  },
  {
    maDienThoai: 10,
    TenDienThoai: "iPhone 16 Plus 128GB - Xanh Mòng Két",
    hangSanXuat: "APPLE",
    category: "APPLE",
    isHot: true,
    isFeatured: true,
    SoIMEI_Serial: "354991122334455",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 5,
    MacDinh: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-plus-1.jpg",
    hinhAnh: [
      "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-plus-1.jpg"
    ],
    giaThueNgay: 200000,
    giaKhuyenMai: 169000,
    tienCocYeuCau: 10500000,
    cauHinh: {
      MaCauHinh: "CH_IP16P_128",
      Chipset: "Apple A18 (3nm)",
      RAM_ROM: "8GB / 128GB",
      RAM: "8GB",
      ROM: "128GB",
      HeDieuHanh: "iOS 18",
      ThongSoCamera_Pin: "Camera kép 48MP Fushion, Nút Camera Control & Action Button, Pin 4674 mAh cực trâu",
      KichThuocManHinh: "6.7 inch Super Retina XDR",
      DungLuongPin: "4674 mAh"
    },
    moTa: "Màn hình lớn 6.7 inch trải nghiệm phim ảnh sắc nét, thời lượng pin trâu nhất lịch sử các dòng iPhone tiêu chuẩn."
  },
  {
    maDienThoai: 11,
    TenDienThoai: "Xiaomi 14T Pro 5G 12GB/512GB (Leica)",
    hangSanXuat: "XIAOMI",
    category: "XIAOMI",
    isHot: false,
    isFeatured: true,
    SoIMEI_Serial: "356611223344556",
    TinhTrangMay: "SAN_SANG",
    TinhTrangMayText: "Sẵn sàng thuê",
    SoLuong: 4,
    MacDinh: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14t-pro-1.jpg",
    hinhAnh: [
      "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14t-pro-1.jpg"
    ],
    giaThueNgay: 210000,
    giaKhuyenMai: 175000,
    tienCocYeuCau: 11500000,
    cauHinh: {
      MaCauHinh: "CH_MI14TP_512",
      Chipset: "MediaTek Dimensity 9300+ (4nm)",
      RAM_ROM: "12GB / 512GB",
      RAM: "12GB",
      ROM: "512GB",
      HeDieuHanh: "Xiaomi HyperOS (Android 14)",
      ThongSoCamera_Pin: "Hệ thống ống kính quang học Leica Summilux, Cảm biến Light Fusion 900, Pin 5000 mAh Sạc 120W",
      KichThuocManHinh: "6.67 inch CrystalRes 144Hz AI",
      DungLuongPin: "5000 mAh (HyperCharge 120W)"
    },
    moTa: "Ống kính quang học Leica thế hệ mới, sạc thần tốc 120W chỉ 19 phút đầy 100%, chip Dimensity 9300+ chạm đỉnh hiệu năng."
  }
];

export const mockPromotions = [
  {
    MaKM: "KM_THUE_DAI_HAN",
    TenKM: "Ưu đãi thuê dài ngày: Thuê từ 3 ngày giảm ngay 15%",
    PhanTramGiam: 15,
    SoLuongToiThieu: 3,
    MoTa: "Tự động áp dụng khi chọn thuê từ 3 ngày trở lên (NgayKetThucThue - NgayBatDauThue >= 3)."
  },
  {
    MaKM: "KM_THUE_TUAN",
    TenKM: "Thuê theo tuần: Giảm trực tiếp 25% tổng tiền thuê",
    PhanTramGiam: 25,
    SoLuongToiThieu: 7,
    MoTa: "Tự động giảm 25% khi đặt đơn thuê từ 7 ngày."
  }
];

export const mockVouchers = [
  {
    MaPhieu: "VOUCHER_KHACH_MOI",
    Code: "KHACHMOI50K",
    GiaTriGiam: 50000,
    GiaToiThieu: 300000,
    MoTa: "Giảm 50.000₫ cho khách hàng mới (khachMoi = true)."
  },
  {
    MaPhieu: "VOUCHER_FLAGSHIP",
    Code: "FLAGSHIP100K",
    GiaTriGiam: 100000,
    GiaToiThieu: 800000,
    MoTa: "Giảm 100.000₫ khi thuê dòng máy Pro Max hoặc Ultra."
  },
  {
    MaPhieu: "VOUCHER_FLAGSHIP1TR",
    Code: "FLAGSHIP1TR",
    GiaTriGiam: 200000,
    GiaToiThieu: 10000000,
    MoTa: "Giảm 1TR khi thuê dòng máy Pro Max hoặc Ultra."
  }
];

export const depositMethods = [
  {
    id: "GIAY_TO_TUY_THAN",
    title: "Căn Cước Công Dân (CCCD)",
    icon: "fa-id-card",
    badge: "Phổ biến nhất",
    description: "Giữ CCCD gắn chip gốc kèm giấy phép lái xe/hộ chiếu. Giảm 70% tiền cọc mặt.",
    depositRate: "Chỉ cọc từ 10% - 20% giá trị máy",
    documents: "CCCD gắn chip chính chủ + Giấy tờ xe / Bằng lái"
  },
  {
    id: "CHUYEN_KHOAN",
    title: "Chuyển khoản Ngân hàng / VNPay",
    icon: "fa-credit-card",
    badge: "Bảo đảm 100%",
    description: "Cọc bằng tiền chuyển khoản qua tài khoản công ty. Tự động lưu TransactionId.",
    depositRate: "Hoàn cọc 100% trong 5 phút khi trả máy nguyên vẹn tem niêm phong",
    documents: "Biên lai chuyển khoản / Xác nhận mã GD"
  },
  {
    id: "MAY_ANH_MAY_TINH",
    title: "Laptop / iPad / Máy ảnh",
    icon: "fa-laptop",
    badge: "Thế chân tài sản công nghệ",
    description: "Sử dụng Laptop (MacBook, Dell, Asus...) hoặc máy ảnh/iPad tương đương để thế chân.",
    depositRate: "Miễn 100% cọc tiền mặt",
    documents: "Biên nhận định giá niêm phong thiết bị tại quầy"
  }
];
