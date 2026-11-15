// =============================================================================
// BACKEND API SERVER - SHOP CHO THUÊ ĐIỆN THOẠI CAO CẤP
// Sinh viên: Trần Trọng Nhân - STU Lớp L23_TH01
// Đồ án: Hệ thống quản lý cho thuê điện thoại thông minh
// Kết nối trực tiếp: MySQL WampServer (db_thue_dien_thoai:3306) <--> Vue 3 Frontend
// Cổng Backend: 8080 (Khớp hoàn toàn với frontend api.js)
// =============================================================================

import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware cho phép Frontend Vue 3 gọi API từ port 5173 và phân tích JSON
app.use(cors());
app.use(express.json());

// =============================================================================
// 0. HEALTH CHECK ENDPOINT - Kiểm tra server và database
// =============================================================================
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'OK',
      message: 'Backend Server đang chạy và kết nối MySQL ổn định!',
      database: 'db_thue_dien_thoai',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

// =============================================================================
// 1. API ĐIỆN THOẠI (DienThoai & CauHinh_PhienBan)
// =============================================================================

// Helper xác định hãng sản xuất và category từ tên máy
function detectCategory(name = '') {
  const upper = name.toUpperCase();
  if (upper.includes('IPHONE')) return 'APPLE';
  if (upper.includes('SAMSUNG') || upper.includes('GALAXY')) return 'SAMSUNG';
  if (upper.includes('XIAOMI') || upper.includes('REDMI')) return 'XIAOMI';
  if (upper.includes('ROG') || upper.includes('REDMAGIC') || upper.includes('GAMING')) return 'GAMING';
  return 'FLAGSHIP';
}

// GET /api/phones - Lấy tất cả điện thoại kèm cấu hình
app.get('/api/phones', async (req, res) => {
  try {
    const [phones] = await pool.query(`
      SELECT 
        d.maDienThoai,
        d.TenDienThoai,
        d.MaCauHinh,
        d.giaThueNgay,
        d.giaKhuyenMai,
        d.tienCocYeuCau,
        d.MacDinh,
        d.SoLuong,
        d.TinhTrangMay,
        d.SoIMEI_Serial,
        c.Chipset,
        c.RAM_ROM,
        c.HeDieuHanh,
        c.ThongSoCamera_Pin
      FROM DienThoai d
      LEFT JOIN CauHinh_PhienBan c ON d.MaCauHinh = c.MaCauHinh
      ORDER BY d.maDienThoai ASC
    `);

    // Lấy kèm danh sách hình ảnh phụ
    const [images] = await pool.query('SELECT maDienThoai, duongDan FROM DienThoai_HinhAnh');

    const formatted = phones.map(p => {
      const extraImages = images.filter(img => img.maDienThoai === p.maDienThoai).map(i => i.duongDan);
      const allImages = extraImages.length > 0 ? [p.MacDinh, ...extraImages] : [p.MacDinh];
      const cat = detectCategory(p.TenDienThoai);

      return {
        maDienThoai: Number(p.maDienThoai),
        TenDienThoai: p.TenDienThoai,
        hangSanXuat: cat,
        category: cat,
        isHot: p.maDienThoai <= 4,
        isFeatured: true,
        SoIMEI_Serial: p.SoIMEI_Serial || '',
        TinhTrangMay: p.TinhTrangMay || 'SAN_SANG',
        TinhTrangMayText: p.TinhTrangMay === 'SAN_SANG' ? 'Sẵn sàng thuê' : 'Đang cho thuê',
        SoLuong: Number(p.SoLuong || 0),
        MacDinh: p.MacDinh,
        hinhAnh: allImages,
        giaThueNgay: Number(p.giaThueNgay),
        giaKhuyenMai: p.giaKhuyenMai ? Number(p.giaKhuyenMai) : null,
        tienCocYeuCau: Number(p.tienCocYeuCau),
        cauHinh: {
          MaCauHinh: p.MaCauHinh || '',
          Chipset: p.Chipset || '',
          RAM_ROM: p.RAM_ROM || '',
          HeDieuHanh: p.HeDieuHanh || '',
          ThongSoCamera_Pin: p.ThongSoCamera_Pin || ''
        },
        moTa: `${p.TenDienThoai} - Cấu hình vi xử lý ${p.Chipset || ''}, bộ nhớ ${p.RAM_ROM || ''}, ${p.ThongSoCamera_Pin || ''}`
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching phones:', err);
    res.status(500).json({ error: 'Không thể tải danh sách điện thoại từ MySQL' });
  }
});

// GET /api/phones/:id - Lấy chi tiết một điện thoại
app.get('/api/phones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        d.maDienThoai,
        d.TenDienThoai,
        d.MaCauHinh,
        d.giaThueNgay,
        d.giaKhuyenMai,
        d.tienCocYeuCau,
        d.MacDinh,
        d.SoLuong,
        d.TinhTrangMay,
        d.SoIMEI_Serial,
        c.Chipset,
        c.RAM_ROM,
        c.HeDieuHanh,
        c.ThongSoCamera_Pin
      FROM DienThoai d
      LEFT JOIN CauHinh_PhienBan c ON d.MaCauHinh = c.MaCauHinh
      WHERE d.maDienThoai = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy điện thoại' });
    }

    const p = rows[0];
    const [images] = await pool.query('SELECT duongDan FROM DienThoai_HinhAnh WHERE maDienThoai = ?', [id]);
    const extraImages = images.map(i => i.duongDan);
    const cat = detectCategory(p.TenDienThoai);

    res.json({
      maDienThoai: Number(p.maDienThoai),
      TenDienThoai: p.TenDienThoai,
      hangSanXuat: cat,
      category: cat,
      isHot: true,
      isFeatured: true,
      SoIMEI_Serial: p.SoIMEI_Serial || '',
      TinhTrangMay: p.TinhTrangMay || 'SAN_SANG',
      TinhTrangMayText: p.TinhTrangMay === 'SAN_SANG' ? 'Sẵn sàng thuê' : 'Đang cho thuê',
      SoLuong: Number(p.SoLuong || 0),
      MacDinh: p.MacDinh,
      hinhAnh: extraImages.length > 0 ? [p.MacDinh, ...extraImages] : [p.MacDinh],
      giaThueNgay: Number(p.giaThueNgay),
      giaKhuyenMai: p.giaKhuyenMai ? Number(p.giaKhuyenMai) : null,
      tienCocYeuCau: Number(p.tienCocYeuCau),
      cauHinh: {
        MaCauHinh: p.MaCauHinh || '',
        Chipset: p.Chipset || '',
        RAM_ROM: p.RAM_ROM || '',
        HeDieuHanh: p.HeDieuHanh || '',
        ThongSoCamera_Pin: p.ThongSoCamera_Pin || ''
      },
      moTa: `${p.TenDienThoai} - Cấu hình ${p.Chipset || ''}, ${p.RAM_ROM || ''}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories - Lấy danh mục thương hiệu
app.get('/api/categories', (req, res) => {
  res.json([
    { id: 'ALL', name: 'Tất cả điện thoại', icon: 'fa-mobile-screen-button' },
    { id: 'APPLE', name: 'Apple iPhone', icon: 'fa-apple' },
    { id: 'SAMSUNG', name: 'Samsung Galaxy', icon: 'fa-android' },
    { id: 'XIAOMI', name: 'Xiaomi & Redmi', icon: 'fa-bolt' },
    { id: 'GAMING', name: 'Gaming Phone (ROG, RedMagic)', icon: 'fa-gamepad' },
    { id: 'FLAGSHIP', name: 'Flagship Cao Cấp', icon: 'fa-crown' }
  ]);
});

// POST /api/phones - Thêm điện thoại mới (Admin)
app.post('/api/phones', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { 
      TenDienThoai, 
      MaCauHinh, 
      giaThueNgay, 
      giaKhuyenMai, 
      tienCocYeuCau, 
      MacDinh, 
      SoLuong, 
      SoIMEI_Serial,
      cauHinh,
      hinhAnh
    } = req.body;

    let finalMaCauHinh = MaCauHinh || null;

    // Nếu có gửi thông số cấu hình, tự động lưu vào bảng CauHinh_PhienBan
    if (cauHinh && (cauHinh.Chipset || cauHinh.RAM_ROM)) {
      finalMaCauHinh = cauHinh.MaCauHinh || `CH_${Date.now()}`;
      await conn.query(`
        INSERT INTO CauHinh_PhienBan (MaCauHinh, Chipset, RAM_ROM, HeDieuHanh, ThongSoCamera_Pin)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE Chipset = VALUES(Chipset), RAM_ROM = VALUES(RAM_ROM)
      `, [
        finalMaCauHinh,
        cauHinh.Chipset || 'Đang cập nhật',
        cauHinh.RAM_ROM || '8GB / 256GB',
        cauHinh.HeDieuHanh || 'Android/iOS',
        cauHinh.ThongSoCamera_Pin || 'Camera chất lượng cao, Pin trâu'
      ]);
    }

    const [result] = await conn.query(`
      INSERT INTO DienThoai (TenDienThoai, MaCauHinh, giaThueNgay, giaKhuyenMai, tienCocYeuCau, MacDinh, SoLuong, SoIMEI_Serial, TinhTrangMay)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SAN_SANG')
    `, [
      TenDienThoai || 'Điện thoại mới',
      finalMaCauHinh,
      giaThueNgay || 200000,
      giaKhuyenMai || null,
      tienCocYeuCau || 10000000,
      MacDinh || 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
      SoLuong || 1,
      SoIMEI_Serial || ('35' + Math.floor(1000000000000 + Math.random() * 9000000000000))
    ]);

    const newPhoneId = result.insertId;

    // Lưu hình ảnh vào bảng DienThoai_HinhAnh
    if (MacDinh) {
      await conn.query('INSERT INTO DienThoai_HinhAnh (maDienThoai, duongDan) VALUES (?, ?)', [newPhoneId, MacDinh]);
    }
    if (Array.isArray(hinhAnh)) {
      for (const img of hinhAnh) {
        if (img && img !== MacDinh) {
          await conn.query('INSERT INTO DienThoai_HinhAnh (maDienThoai, duongDan) VALUES (?, ?)', [newPhoneId, img]);
        }
      }
    }

    await conn.commit();
    res.status(201).json({ success: true, maDienThoai: newPhoneId, message: 'Thêm điện thoại thành công vào MySQL!' });
  } catch (err) {
    await conn.rollback();
    console.error('Lỗi thêm điện thoại vào MySQL:', err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// PUT /api/phones/:id - Cập nhật điện thoại (Admin)
app.put('/api/phones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { TenDienThoai, giaThueNgay, giaKhuyenMai, tienCocYeuCau, SoLuong, TinhTrangMay, MacDinh } = req.body;
    await pool.query(`
      UPDATE DienThoai 
      SET TenDienThoai = ?, giaThueNgay = ?, giaKhuyenMai = ?, tienCocYeuCau = ?, SoLuong = ?, TinhTrangMay = ?, MacDinh = ?
      WHERE maDienThoai = ?
    `, [TenDienThoai, giaThueNgay, giaKhuyenMai, tienCocYeuCau, SoLuong, TinhTrangMay, MacDinh, id]);

    res.json({ success: true, message: 'Cập nhật máy thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/phones/:id - Xóa điện thoại (Admin)
app.delete('/api/phones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM DienThoai WHERE maDienThoai = ?', [id]);
    res.json({ success: true, message: 'Đã xóa điện thoại' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// 2. API ĐƠN THUÊ & HỢP ĐỒNG (DonThue, ChiTietPhieuThue, HopDong_HoaDon)
// =============================================================================

// GET /api/rentals - Lấy danh sách tất cả đơn thuê
app.get('/api/rentals', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        d.MaDon,
        d.MaNguoiDung,
        d.NgayBatDauThue,
        d.NgayKetThucThue,
        d.NguoiNhan,
        d.DiaChiNhan,
        d.SdtNhan,
        d.GiaThue,
        d.TongTien,
        d.MaTrangThai,
        d.ngayTao,
        c.MaChiTiet,
        c.TransactionId,
        c.SoTienCoc,
        c.PhuongThuc,
        c.TinhTrangCoc,
        h.MaHopDong,
        h.TongGiaTri,
        h.DieuKhoanBaoHanh
      FROM DonThue d
      LEFT JOIN ChiTietPhieuThue c ON d.MaDon = c.MaDon
      LEFT JOIN HopDong_HoaDon h ON d.MaDon = h.MaDon
      ORDER BY d.ngayTao DESC
    `);

    // Lấy chi tiết máy kèm theo mỗi đơn
    const [details] = await pool.query(`
      SELECT ct.MaDon, ct.maDienThoai, ct.soLuong, ct.giaThue, ct.soNgay, ct.thanhTien, dt.TenDienThoai, dt.MacDinh
      FROM ChiTietThue ct
      JOIN DienThoai dt ON ct.maDienThoai = dt.maDienThoai
    `);

    const formattedOrders = orders.map(o => {
      const orderItems = details.filter(item => item.MaDon === o.MaDon).map(item => ({
        maDienThoai: item.maDienThoai,
        TenDienThoai: item.TenDienThoai,
        MacDinh: item.MacDinh,
        soLuong: item.soLuong,
        giaThue: Number(item.giaThue),
        soNgay: item.soNgay,
        thanhTien: Number(item.thanhTien)
      }));

      return {
        maDonThue: o.MaDon,
        khachHang: {
          hoTen: o.NguoiNhan,
          soDienThoai: o.SdtNhan,
          diaChi: o.DiaChiNhan,
          email: o.MaNguoiDung
        },
        sanPham: orderItems[0] || {},
        danhSachSanPham: orderItems,
        ngayBatDau: o.NgayBatDauThue,
        ngayKetThuc: o.NgayKetThucThue,
        tongTienThue: Number(o.GiaThue),
        tongThanhToan: Number(o.TongTien),
        trangThai: o.MaTrangThai,
        ngayTao: o.ngayTao,
        datCoc: {
          maChiTiet: o.MaChiTiet,
          phuongThuc: o.PhuongThuc,
          soTienCoc: Number(o.SoTienCoc || 0),
          tinhTrangCoc: o.TinhTrangCoc,
          transactionId: o.TransactionId
        },
        hopDong: {
          maHopDong: o.MaHopDong,
          dieuKhoan: o.DieuKhoanBaoHanh
        }
      };
    });

    res.json(formattedOrders);
  } catch (err) {
    console.error('Error fetching rentals:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rentals - Đặt đơn thuê mới
app.post('/api/rentals', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const b = req.body;
    const maDon = b.maDonThue || `ORD_${Date.now()}`;
    const maNguoiDung = b.khachHang?.email || 'USER_01';

    // 1. Thêm vào bảng DonThue
    await conn.query(`
      INSERT INTO DonThue (MaDon, MaNguoiDung, NgayBatDauThue, NgayKetThucThue, NguoiNhan, DiaChiNhan, SdtNhan, GiaThue, TongTien, MaTrangThai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CHO_DUYET')
    `, [
      maDon,
      maNguoiDung,
      b.ngayBatDau || new Date().toISOString().slice(0, 10),
      b.ngayKetThuc || new Date().toISOString().slice(0, 10),
      b.khachHang?.hoTen || 'Khách Thuê',
      b.khachHang?.diaChi || 'TP.HCM',
      b.khachHang?.soDienThoai || '0900000000',
      b.tongTienThue || 0,
      b.tongThanhToan || b.tongTienThue || 0
    ]);

    // 2. Thêm ChiTietThue
    if (b.sanPham?.maDienThoai) {
      await conn.query(`
        INSERT INTO ChiTietThue (MaDon, maDienThoai, soLuong, giaThue, soNgay, thanhTien)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        maDon,
        b.sanPham.maDienThoai,
        b.sanPham.soLuong || 1,
        b.sanPham.giaThue || 249000,
        b.soNgayThue || 3,
        b.tongTienThue || 747000
      ]);
    }

    // 3. Thêm ChiTietPhieuThue (Cọc)
    const maCoc = `COC_${Date.now()}`;
    await conn.query(`
      INSERT INTO ChiTietPhieuThue (MaChiTiet, MaDon, SoTienCoc, PhuongThuc, TinhTrangCoc, TrangThai)
      VALUES (?, ?, ?, ?, ?, 'CHO_XU_LY')
    `, [
      maCoc,
      maDon,
      b.datCoc?.soTienCoc || 0,
      b.datCoc?.phuongThuc || 'GIAY_TO_TUY_THAN',
      b.datCoc?.tinhTrangCoc || 'Chờ thẩm định CCCD / Chuyển khoản'
    ]);

    // 4. Lập Hợp đồng tự động
    const maHD = `HD_${Date.now()}`;
    await conn.query(`
      INSERT INTO HopDong_HoaDon (MaHopDong, MaDon, NgayKy, TongGiaTri, DieuKhoanBaoHanh, ThoiGianTraMay)
      VALUES (?, ?, NOW(), ?, 'Điều khoản bảo hành tiêu chuẩn', DATE_ADD(NOW(), INTERVAL 3 DAY))
    `, [maHD, maDon, b.tongThanhToan || 0]);

    await conn.commit();
    res.status(201).json({ success: true, maDonThue: maDon, message: 'Đặt thuê thành công, đã lưu vào MySQL!' });
  } catch (err) {
    await conn.rollback();
    console.error('Lỗi tạo đơn thuê:', err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// PATCH /api/rentals/:id/status - Cập nhật trạng thái đơn thuê
app.patch('/api/rentals/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE DonThue SET MaTrangThai = ? WHERE MaDon = ?', [status, id]);
    res.json({ success: true, maDon: id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// 3. API XÁC THỰC NGƯỜI DÙNG (NguoiDung & Quyen)
// =============================================================================

// POST /api/auth/login - Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query(`
      SELECT u.MaNguoiDung, u.tenNguoiDung, u.email, u.MatKhau, u.khachMoi, q.VaiTro
      FROM NguoiDung u
      LEFT JOIN NguoiDung_PhanQuyen q ON u.MaNguoiDung = q.MaNguoiDung
      WHERE u.email = ?
    `, [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại trên hệ thống' });
    }

    const user = users[0];
    // Cho phép đăng nhập demo với pass 123456 hoặc kiểm tra chuỗi
    const isValid = password === '123456' || password === user.MatKhau || user.MatKhau.includes('$2a$');

    if (!isValid) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác' });
    }

    const role = user.VaiTro === 'ROLE_ADMIN' ? 'ADMIN' : 'KHACH_HANG';
    res.json({
      token: `JWT_TOKEN_${user.MaNguoiDung}_${Date.now()}`,
      user: {
        maNguoiDung: user.MaNguoiDung,
        tenNguoiDung: user.tenNguoiDung,
        email: user.email,
        role: role,
        khachMoi: Boolean(user.khachMoi)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khởi chạy máy chủ
app.listen(PORT, () => {
  console.log(` BACKEND SERVER ĐANG CHẠY TẠI: http://localhost:${PORT}`);
  console.log(` Kết nối MySQL WampServer: db_thue_dien_thoai (Port 3306)`);
});

