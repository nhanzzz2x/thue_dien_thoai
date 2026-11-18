// MOCK DỮ LIỆU ĐÁNH GIÁ & NHẬN XÉT SẢN PHẨM (REVIEWS & RATINGS)
// ERD MAPPING: Ánh xạ thực thể DanhGia_NhanXet (MaDanhGia, MaDienThoai, MaNguoiDung, SoSao, NoiDung, NgayDanhGia)

export const defaultMockReviews = [
  // iPhone 16 Pro Max (maDienThoai = 1)
  {
    id: 'rev_1_1',
    maDienThoai: 1,
    reviewerName: 'Nguyễn Hoàng Nam',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NamNguyen',
    rating: 5,
    rentalPurpose: 'Đi du lịch / Chụp ảnh sự kiện',
    rentalDuration: '3 ngày',
    date: '12/11/2026',
    comment: 'Máy còn như mới 99%, pin 100%. Mình thuê 3 ngày đi Đà Lạt chụp ảnh ngoại cảnh camera tele 5x với nút Camera Control mới chụp siêu nét! Cọc bằng CCCD gắn chip thủ tục nhanh chỉ mất 5 phút.',
    likes: 18,
    isVerified: true
  },
  {
    id: 'rev_1_2',
    maDienThoai: 1,
    reviewerName: 'Lê Thị Thu Thảo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThaoLe',
    rating: 5,
    rentalPurpose: 'Quay video sự kiện đám cưới',
    rentalDuration: '2 ngày',
    date: '08/11/2026',
    comment: 'Cực kỳ hài lòng! Máy có sẵn ốp lưng chống sốc và dán cường lực xịn, tặng kèm củ sạc nhanh 30W và cáp bện dù C-to-C. Nhân viên tư vấn nhiệt tình, giao nhận máy tận nơi tại STU.',
    likes: 12,
    isVerified: true
  },
  {
    id: 'rev_1_3',
    maDienThoai: 1,
    reviewerName: 'Võ Minh Đức',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DucVo',
    rating: 4,
    rentalPurpose: 'Trải nghiệm trước khi quyết định mua',
    rentalDuration: '5 ngày',
    date: '02/11/2026',
    comment: 'Chip A18 Pro chơi Genshin Impact mượt mà, khung Titan nhẹ hơn hẳn 14 Pro Max cũ của mình. Giá thuê hợp lý, trả máy được hoàn cọc ngay qua chuyển khoản trong 2 phút.',
    likes: 7,
    isVerified: true
  },

  // Samsung Galaxy S24 Ultra (maDienThoai = 2)
  {
    id: 'rev_2_1',
    maDienThoai: 2,
    reviewerName: 'Đặng Tuấn Anh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TuanAnh',
    rating: 5,
    rentalPurpose: 'Đu concert ca nhạc Idol',
    rentalDuration: '2 ngày',
    date: '10/11/2026',
    comment: 'Camera Zoom 100x của S24 Ultra đúng là chân ái đi concert! Ngồi tuốt khán đài xa tít mà quay rõ mặt ca sĩ luôn. Tính năng khoanh tròn tìm kiếm Galaxy AI dịch tài liệu cũng rất tiện lợi.',
    likes: 24,
    isVerified: true
  },
  {
    id: 'rev_2_2',
    maDienThoai: 2,
    reviewerName: 'Phạm Quỳnh Như',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NhuPham',
    rating: 5,
    rentalPurpose: 'Công tác & Ghi chú họp',
    rentalDuration: '4 ngày',
    date: '05/11/2026',
    comment: 'Bút S-Pen tiện lợi vô cùng khi ký tài liệu hợp đồng số. Máy sạch sẽ, reset trắng tinh, không dính tài khoản Samsung hay Google nào. 5 sao cho dịch vụ Trọng Nhân Mobile!',
    likes: 9,
    isVerified: true
  },

  // iPhone 15 Pro (maDienThoai = 3)
  {
    id: 'rev_3_1',
    maDienThoai: 3,
    reviewerName: 'Trần Văn Hưng',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HungTran',
    rating: 5,
    rentalPurpose: 'Test ứng dụng iOS & Đi chơi cuối tuần',
    rentalDuration: '3 ngày',
    date: '09/11/2026',
    comment: 'Nhỏ gọn vừa tay, màn hình 120Hz mượt mà. Đội ngũ giao máy đúng giờ, kiểm tra ngoại quan và ký biên bản điện tử rất chuyên nghiệp.',
    likes: 6,
    isVerified: true
  },

  // Samsung Galaxy Z Fold6 (maDienThoai = 4)
  {
    id: 'rev_4_1',
    maDienThoai: 4,
    reviewerName: 'Hoàng Quốc Bảo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BaoHoang',
    rating: 5,
    rentalPurpose: 'Trải nghiệm màn hình gập cao cấp',
    rentalDuration: '7 ngày',
    date: '04/11/2026',
    comment: 'Màn hình mở ra 7.6 inch đọc báo cáo và mở 3 app song song cực đỉnh. Thuê 7 ngày được giảm giá 25% tiết kiệm được cả triệu tiền thuê. Sẽ ủng hộ shop dài dài!',
    likes: 15,
    isVerified: true
  },

  // ASUS ROG Phone 8 Pro (maDienThoai = 5)
  {
    id: 'rev_5_1',
    maDienThoai: 5,
    reviewerName: 'Phan Quốc Đạt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DatPhan',
    rating: 5,
    rentalPurpose: 'Thi đấu giải Liên Quân & PUBG Mobile',
    rentalDuration: '2 ngày',
    date: '11/11/2026',
    comment: 'Quái vật gaming! Màn hình 165Hz siêu nhạy, nút AirTrigger cảm ứng 2 bên gán bắn súng không khác gì tay cầm cầm tay. Shop cho mượn kèm quạt tản nhiệt AeroActive Cooler mát rượi.',
    likes: 21,
    isVerified: true
  },

  // Samsung Galaxy Z Flip6 (maDienThoai = 6)
  {
    id: 'rev_6_1',
    maDienThoai: 6,
    reviewerName: 'Nguyễn Mai Phương',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MaiPhuong',
    rating: 5,
    rentalPurpose: 'Chụp ảnh sống ảo & TikToker',
    rentalDuration: '3 ngày',
    date: '13/11/2026',
    comment: 'Màu sắc cực xinh, gập máy 90 độ đặt lên bàn tự chụp không cần chân tripod! Màn hình phụ FlexWindow xem trước ảnh tiện lợi. Cảm ơn Trọng Nhân Mobile đã chuẩn bị máy rất chu đáo.',
    likes: 14,
    isVerified: true
  },

  // Nubia RedMagic 9 Pro (maDienThoai = 7)
  {
    id: 'rev_7_1',
    maDienThoai: 7,
    reviewerName: 'Trịnh Thế Khang',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KhangTrinh',
    rating: 5,
    rentalPurpose: 'Cày rank Genshin Impact & Wuthering Waves',
    rentalDuration: '4 ngày',
    date: '07/11/2026',
    comment: 'Pin trâu 6500 mAh chơi game cả ngày không lo hết pin. Quạt tản nhiệt RGB tích hợp bên trong máy nhìn ngầu đét. Mặt lưng phẳng lì cầm không bị cấn camera.',
    likes: 11,
    isVerified: true
  },

  // Xiaomi 14 Ultra (maDienThoai = 8)
  {
    id: 'rev_8_1',
    maDienThoai: 8,
    reviewerName: 'Vũ Hải Long',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LongVu',
    rating: 5,
    rentalPurpose: 'Nhiếp ảnh đường phố phong cách Leica',
    rentalDuration: '3 ngày',
    date: '03/11/2026',
    comment: 'Chất màu Leica Authentic và Leica Vibrant chụp ra ảnh có chiều sâu và cảm xúc lạ kỳ, cảm biến 1-inch xóa phông tự nhiên không bị giả. Dịch vụ thuê máy rất tốt!',
    likes: 16,
    isVerified: true
  },

  // iPhone 16 Plus (maDienThoai = 10)
  {
    id: 'rev_10_1',
    maDienThoai: 10,
    reviewerName: 'Trần Mỹ Duyên',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DuyenTran',
    rating: 5,
    rentalPurpose: 'Du lịch biển Phú Quốc',
    rentalDuration: '3 ngày',
    date: '14/11/2026',
    comment: 'Màu xanh mòng két ở ngoài đẹp hơn trên ảnh nhiều. Pin siêu trâu dùng từ sáng tới tối muộn vẫn còn 35%. Thủ tục giao máy tận nơi nhanh gọn.',
    likes: 8,
    isVerified: true
  },

  // Xiaomi 14T Pro (maDienThoai = 11)
  {
    id: 'rev_11_1',
    maDienThoai: 11,
    reviewerName: 'Đỗ Tuấn Kiệt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KietDo',
    rating: 5,
    rentalPurpose: 'Trải nghiệm chụp ảnh đêm Leica & Sạc nhanh 120W',
    rentalDuration: '2 ngày',
    date: '15/11/2026',
    comment: 'Sạc 120W cắm có 19 phút là đầy 100% pin, quá kinh khủng! Ống kính Leica Summilux chụp đêm bắt sáng cực tốt. Giá thuê 170k/ngày quá hời cho một chiếc máy cận cao cấp thế này.',
    likes: 10,
    isVerified: true
  }
];

const LOCAL_STORAGE_KEY = 'trongnhan_product_reviews';

/**
 * Lấy toàn bộ danh sách đánh giá cho một thiết bị theo ID (ghép mock + localStorage)
 */
export function getProductReviews(maDienThoai) {
  const targetId = Number(maDienThoai);
  const baseReviews = defaultMockReviews.filter(r => Number(r.maDienThoai) === targetId);

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const userReviews = JSON.parse(stored);
      const filteredUser = userReviews.filter(r => Number(r.maDienThoai) === targetId);
      return [...filteredUser, ...baseReviews];
    }
  } catch (e) {
    console.error('Lỗi khi đọc reviews từ localStorage:', e);
  }

  return baseReviews;
}

/**
 * Lưu một đánh giá mới vào localStorage
 */
export function saveProductReview(reviewData) {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    const newReview = {
      id: 'rev_' + Date.now(),
      maDienThoai: Number(reviewData.maDienThoai),
      reviewerName: reviewData.reviewerName || 'Khách Hàng',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(reviewData.reviewerName || 'User')}`,
      rating: Number(reviewData.rating) || 5,
      rentalPurpose: reviewData.rentalPurpose || 'Trải nghiệm máy',
      rentalDuration: reviewData.rentalDuration || '1 ngày',
      date: new Date().toLocaleDateString('vi-VN'),
      comment: reviewData.comment || '',
      likes: 0,
      isVerified: true
    };
    existing.unshift(newReview);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    return newReview;
  } catch (e) {
    console.error('Lỗi khi lưu review vào localStorage:', e);
    return null;
  }
}

/**
 * Lấy điểm số trung bình và số lượng review cho điện thoại (dùng hiển thị card, list)
 */
export function getProductRatingSummary(maDienThoai) {
  const reviews = getProductReviews(maDienThoai);
  if (!reviews || !reviews.length) {
    return { score: '5.0', count: 1 };
  }
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
  return {
    score: (sum / reviews.length).toFixed(1),
    count: reviews.length
  };
}
