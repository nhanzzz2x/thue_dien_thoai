import express from 'express';
import cors from 'cors';
import pool, { initDatabase } from './db.js';

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const FALLBACK_IMG = 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Tắt cache HTTP để dữ liệu mới trong MySQL WampServer hiển thị ngay lên Web
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  next();
});

// --- CÁC HÀM HỖ TRỢ ĐỊNH DẠNG DỮ LIỆU ---
function detectCategory(name = '') {
  const upper = String(name).toUpperCase();
  if (upper.includes('IPHONE') || upper.includes('APPLE')) return 'APPLE';
  if (upper.includes('SAMSUNG') || upper.includes('GALAXY')) return 'SAMSUNG';
  if (upper.includes('XIAOMI') || upper.includes('REDMI')) return 'XIAOMI';
  if (upper.includes('ROG') || upper.includes('REDMAGIC') || upper.includes('NUBIA') || upper.includes('GAMING')) return 'GAMING';
  return 'FLAGSHIP';
}

function formatPhoneRow(p, extraUrls = []) {
  const coverUrl = (p.MacDinh && String(p.MacDinh).trim()) ? p.MacDinh : FALLBACK_IMG;
  const uniqueAlbum = Array.from(new Set([coverUrl, ...extraUrls].filter(Boolean)));
  const cat = detectCategory(p.TenDienThoai);
  const upperName = String(p.TenDienThoai || '').toUpperCase();
  const brand = cat === 'GAMING' && upperName.includes('ASUS') ? 'ASUS' : (cat === 'GAMING' && upperName.includes('NUBIA') ? 'NUBIA' : cat);

  return {
    maDienThoai: Number(p.maDienThoai),
    TenDienThoai: p.TenDienThoai,
    hangSanXuat: brand,
    category: cat,
    isHot: Number(p.maDienThoai) > 11 || Number(p.maDienThoai) <= 4 || Number(p.maDienThoai) === 10,
    isFeatured: true,
    SoIMEI_Serial: p.SoIMEI_Serial || '',
    TinhTrangMay: p.TinhTrangMay || 'SAN_SANG',
    TinhTrangMayText: p.TinhTrangMay === 'SAN_SANG' ? 'Sẵn sàng thuê' : (p.TinhTrangMay === 'BAO_TRI' ? 'Bảo trì' : 'Đang cho thuê'),
    SoLuong: Number(p.SoLuong ?? 1),
    MacDinh: coverUrl,
    hinhAnh: uniqueAlbum,
    giaThueNgay: Number(p.giaThueNgay),
    giaKhuyenMai: p.giaKhuyenMai ? Number(p.giaKhuyenMai) : null,
    tienCocYeuCau: Number(p.tienCocYeuCau),
    cauHinh: {
      MaCauHinh: p.MaCauHinh || '',
      Chipset: p.Chipset || 'Đang cập nhật',
      RAM_ROM: p.RAM_ROM || '8GB / 256GB',
      HeDieuHanh: p.HeDieuHanh || 'iOS / Android',
      ThongSoCamera_Pin: p.ThongSoCamera_Pin || ''
    },
    moTa: p.ThongSoCamera_Pin || `${p.TenDienThoai} - ${p.Chipset || ''}, ${p.RAM_ROM || ''}`
  };
}

function mapMethodText(method, rawText) {
  if (rawText) return rawText;
  if (method === 'CHUYEN_KHOAN') return 'Chuyển khoản 100% qua Ngân hàng';
  if (method === 'MAY_ANH_MAY_TINH') return 'Thế chân thiết bị công nghệ (Laptop / iPad)';
  return 'CCCD gắn chip + Cọc tiền mặt 15%';
}

function buildStatusTimeline(o) {
  const createdStr = String(o.ngayTao || '').slice(0, 16);
  const st = o.MaTrangThai;
  const logs = [{ time: createdStr, title: 'Đặt đơn thuê thành công', desc: `Hình thức thế chân: ${o.TinhTrangCoc || 'CCCD gắn chip'}` }];

  if (['DA_XAC_NHAN_COC', 'DANG_THUE', 'DA_TRA_MAY', 'HOAN_TAT_TRA_COC'].includes(st)) {
    logs.push({ time: createdStr, title: 'Đã xác nhận hồ sơ đặt cọc', desc: `Mã phiếu cọc: ${o.MaChiTiet || 'N/A'} (${Number(o.SoTienCoc || 0).toLocaleString('vi-VN')} ₫)` });
  }
  if (['DANG_THUE', 'DA_TRA_MAY', 'HOAN_TAT_TRA_COC'].includes(st)) {
    logs.push({ time: createdStr, title: 'Đã bàn giao máy cho khách thuê', desc: o.TinhTrangLucGiao || 'Máy nguyên tem niêm phong, đầy đủ phụ kiện' });
  }
  if (['DA_TRA_MAY', 'HOAN_TAT_TRA_COC'].includes(st)) {
    logs.push({ time: o.NgayTra ? String(o.NgayTra).slice(0, 16) : createdStr, title: 'Khách đã mang trả thiết bị', desc: o.TinhTrangLucTra || 'Đang thẩm định ngoại quan và kiểm tra IMEI' });
  }
  if (st === 'HOAN_TAT_TRA_COC') {
    logs.push({ time: o.NgayTra ? String(o.NgayTra).slice(0, 16) : createdStr, title: 'Hoàn tất thanh lý Hợp đồng & Hoàn trả cọc', desc: 'Đã hoàn trả đầy đủ tiền cọc / tài sản thế chân' });
  }
  if (st === 'DA_HUY') {
    logs.push({ time: createdStr, title: 'Đơn thuê đã hủy', desc: o.TinhTrangLucTra || 'Đơn thuê đã bị hủy trên hệ thống' });
  }
  return logs;
}

async function ensureAuthLookups(conn) {
  await conn.query("INSERT IGNORE INTO taikhoanlienket (maNhaCungCap, tenNhaCungCap) VALUES ('LOCAL', 'Tài khoản mật khẩu nội bộ'), ('GOOGLE', 'Google OAuth 2.0'), ('FACEBOOK', 'Facebook Login')");
  await conn.query("INSERT IGNORE INTO phanquyen (VaiTro, MoTa) VALUES ('ROLE_USER', 'Khách hàng thuê máy'), ('ROLE_ADMIN', 'Quản trị viên hệ thống')");
}

async function issueTokensForUser(conn, maNguoiDung) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const accessToken = `JWT_${maNguoiDung}_${Date.now()}_${rand}`;
  const refreshToken = `RT_${maNguoiDung}_${Date.now()}_${rand}`;
  try {
    await conn.query('INSERT INTO usertoken (Token, MaNguoiDung, thoiGianKichHoat, thoiGianHetHan) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))', [accessToken, maNguoiDung]);
    await conn.query('DELETE FROM refreshtoken WHERE MaNguoiDung = ?', [maNguoiDung]);
    await conn.query('INSERT INTO refreshtoken (Token, MaNguoiDung, thoiGianHetHan) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))', [refreshToken, maNguoiDung]);
  } catch (e) {
    console.warn('Token log warning:', e.message);
  }
  return { accessToken, refreshToken };
}

// --- 0. KIỂM TRA TRẠNG THÁI SERVER & CSDL ---
app.get('/api/health', async (req, res) => {
  try {
    const [[tCount]] = await pool.query('SELECT COUNT(*) AS totalTables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()');
    const [[pCount]] = await pool.query('SELECT COUNT(*) AS totalPhones FROM dienthoai');
    const [[oCount]] = await pool.query('SELECT COUNT(*) AS totalOrders FROM donthue');
    res.json({ status: 'OK', database: 'db_thue_dien_thoai', totalTables: tCount.totalTables, totalPhones: pCount.totalPhones, totalOrders: oCount.totalOrders, port: PORT });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

// --- 1. API KHO ĐIỆN THOẠI (DienThoai, CauHinh_PhienBan, DienThoai_HinhAnh) ---
app.get('/api/phones', async (req, res) => {
  try {
    const [phones] = await pool.query(`
      SELECT d.*, c.Chipset, c.RAM_ROM, c.HeDieuHanh, c.ThongSoCamera_Pin
      FROM dienthoai d
      LEFT JOIN cauhinh_phienban c ON d.MaCauHinh = c.MaCauHinh
      ORDER BY CASE WHEN d.maDienThoai > 11 THEN 0 ELSE 1 END,
               CASE WHEN d.maDienThoai > 11 THEN -d.maDienThoai ELSE d.maDienThoai END ASC
    `);
    const [images] = await pool.query('SELECT maDienThoai, duongDan FROM dienthoai_hinhanh ORDER BY id ASC');
    res.json(phones.map((p) => formatPhoneRow(p, images.filter((i) => Number(i.maDienThoai) === Number(p.maDienThoai)).map((i) => i.duongDan))));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/phones/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT d.*, c.Chipset, c.RAM_ROM, c.HeDieuHanh, c.ThongSoCamera_Pin FROM dienthoai d LEFT JOIN cauhinh_phienban c ON d.MaCauHinh = c.MaCauHinh WHERE d.maDienThoai = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy điện thoại' });
    const [images] = await pool.query('SELECT duongDan FROM dienthoai_hinhanh WHERE maDienThoai = ? ORDER BY id ASC', [req.params.id]);
    res.json(formatPhoneRow(rows[0], images.map((i) => i.duongDan)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.post('/api/phones', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { TenDienThoai, MaCauHinh, giaThueNgay, giaKhuyenMai, tienCocYeuCau, MacDinh, SoLuong, TinhTrangMay, SoIMEI_Serial, cauHinh, Chipset, RAM_ROM, moTa, hinhAnh } = req.body;

    const finalMaCauHinh = cauHinh?.MaCauHinh || MaCauHinh || `CH_${Date.now()}`;
    const osVal = cauHinh?.HeDieuHanh || (String(TenDienThoai || '').toUpperCase().includes('IPHONE') ? 'iOS 18' : 'Android 14');
    await conn.query(
      `INSERT INTO cauhinh_phienban (MaCauHinh, Chipset, RAM_ROM, HeDieuHanh, ThongSoCamera_Pin) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE Chipset = VALUES(Chipset), RAM_ROM = VALUES(RAM_ROM), HeDieuHanh = VALUES(HeDieuHanh), ThongSoCamera_Pin = VALUES(ThongSoCamera_Pin)`,
      [finalMaCauHinh, cauHinh?.Chipset || Chipset || 'Apple / Snapdragon', cauHinh?.RAM_ROM || RAM_ROM || '8GB / 256GB', osVal, cauHinh?.ThongSoCamera_Pin || moTa || 'Máy nguyên zin 99%, đầy đủ sạc cáp.']
    );

    const coverImg = MacDinh || (Array.isArray(hinhAnh) && hinhAnh[0]) || FALLBACK_IMG;
    const [result] = await conn.query(
      'INSERT INTO dienthoai (TenDienThoai, MaCauHinh, giaThueNgay, giaKhuyenMai, tienCocYeuCau, MacDinh, SoLuong, SoIMEI_Serial, TinhTrangMay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [TenDienThoai || 'Điện thoại mới', finalMaCauHinh, Number(giaThueNgay || 200000), giaKhuyenMai ? Number(giaKhuyenMai) : null, Number(tienCocYeuCau || 10000000), coverImg, Number(SoLuong ?? 5), SoIMEI_Serial || ('35' + Math.floor(1000000000000 + Math.random() * 9000000000000)), TinhTrangMay || 'SAN_SANG']
    );

    const newPhoneId = result.insertId;
    const allImgs = Array.from(new Set([coverImg, ...(Array.isArray(hinhAnh) ? hinhAnh : [])].filter(Boolean)));
    for (const imgUrl of allImgs) {
      await conn.query('INSERT INTO dienthoai_hinhanh (maDienThoai, duongDan) VALUES (?, ?)', [newPhoneId, imgUrl]);
    }

    await conn.commit();
    res.status(201).json({ success: true, maDienThoai: newPhoneId, hinhAnh: allImgs });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.put('/api/phones/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id } = req.params;
    const { TenDienThoai, giaThueNgay, giaKhuyenMai, tienCocYeuCau, SoLuong, TinhTrangMay, SoIMEI_Serial, MacDinh, hinhAnh, cauHinh, Chipset, RAM_ROM, moTa } = req.body;

    const [existing] = await conn.query('SELECT * FROM dienthoai WHERE maDienThoai = ?', [id]);
    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Không tìm thấy thiết bị' });
    }
    const cur = existing[0];
    const maCauHinh = cur.MaCauHinh || `CH_${id}`;

    if (cauHinh || Chipset || RAM_ROM || moTa) {
      await conn.query(
        `INSERT INTO cauhinh_phienban (MaCauHinh, Chipset, RAM_ROM, HeDieuHanh, ThongSoCamera_Pin) VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE Chipset = VALUES(Chipset), RAM_ROM = VALUES(RAM_ROM), ThongSoCamera_Pin = VALUES(ThongSoCamera_Pin)`,
        [maCauHinh, cauHinh?.Chipset || Chipset || 'Snapdragon / Apple', cauHinh?.RAM_ROM || RAM_ROM || '8GB / 256GB', cauHinh?.HeDieuHanh || 'iOS / Android', cauHinh?.ThongSoCamera_Pin || moTa || 'Máy nguyên bản 99%']
      );
    }

    const coverImg = MacDinh || (Array.isArray(hinhAnh) && hinhAnh[0]) || cur.MacDinh;
    await conn.query(
      'UPDATE dienthoai SET TenDienThoai = ?, MaCauHinh = ?, giaThueNgay = ?, giaKhuyenMai = ?, tienCocYeuCau = ?, SoLuong = ?, TinhTrangMay = ?, SoIMEI_Serial = ?, MacDinh = ? WHERE maDienThoai = ?',
      [TenDienThoai ?? cur.TenDienThoai, maCauHinh, giaThueNgay ?? cur.giaThueNgay, giaKhuyenMai !== undefined ? giaKhuyenMai : cur.giaKhuyenMai, tienCocYeuCau ?? cur.tienCocYeuCau, SoLuong ?? cur.SoLuong, TinhTrangMay ?? cur.TinhTrangMay, SoIMEI_Serial ?? cur.SoIMEI_Serial, coverImg, id]
    );

    if (Array.isArray(hinhAnh) && hinhAnh.length > 0) {
      const uniqueImgs = Array.from(new Set([coverImg, ...hinhAnh].filter(Boolean)));
      await conn.query('DELETE FROM dienthoai_hinhanh WHERE maDienThoai = ?', [id]);
      for (const imgUrl of uniqueImgs) {
        await conn.query('INSERT INTO dienthoai_hinhanh (maDienThoai, duongDan) VALUES (?, ?)', [id, imgUrl]);
      }
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.delete('/api/phones/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM dienthoai WHERE maDienThoai = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. API ĐƠN THUÊ, ĐẶT CỌC & HỢP ĐỒNG (DonThue, ChiTietThue, ChiTietPhieuThue, HopDong_GiaoNhan, HopDong_HoaDon) ---
app.get('/api/rentals', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT d.*, u.email AS userEmail, u.CCCD AS userCccd,
             cp.MaChiTiet, cp.TransactionId, cp.SoTienCoc, cp.PhuongThuc, cp.TinhTrangCoc, cp.TrangThai AS trangThaiCoc,
             gn.MaPhieu AS maPhieuGiaoNhan, gn.DieuKhoanHopDong, gn.TinhTrangLucGiao, gn.NgayTra, gn.TinhTrangLucTra, gn.QuaHan, gn.phuThu,
             hd.MaHopDong, hd.NgayKy, hd.TongGiaTri, hd.DieuKhoanBaoHanh, hd.ThoiGianTraMay
      FROM donthue d
      LEFT JOIN nguoidung u ON d.MaNguoiDung = u.MaNguoiDung
      LEFT JOIN chitietphieuthue cp ON d.MaDon = cp.MaDon
      LEFT JOIN hopdong_giaonhan gn ON d.MaDon = gn.MaDon
      LEFT JOIN hopdong_hoadon hd ON d.MaDon = hd.MaDon
      ORDER BY d.ngayTao DESC
    `);

    const [details] = await pool.query(`
      SELECT ct.*, dt.TenDienThoai, dt.MacDinh, dt.SoIMEI_Serial, dt.tienCocYeuCau, ch.RAM_ROM
      FROM chitietthue ct
      JOIN dienthoai dt ON ct.maDienThoai = dt.maDienThoai
      LEFT JOIN cauhinh_phienban ch ON dt.MaCauHinh = ch.MaCauHinh
    `);

    const formattedOrders = orders.map((o) => {
      const items = details.filter((i) => i.MaDon === o.MaDon).map((i) => ({
        maDienThoai: Number(i.maDienThoai),
        TenDienThoai: i.TenDienThoai,
        MacDinh: i.MacDinh,
        SoIMEI_Serial: i.SoIMEI_Serial || '350000000000000',
        RAM_ROM: i.RAM_ROM || '8GB / 256GB',
        giaThueNgay: Number(i.giaThue),
        tienCocYeuCau: Number(i.tienCocYeuCau || 10000000),
        quantity: Number(i.soLuong || 1),
        soNgay: Number(i.soNgay || 1),
        thanhTien: Number(i.thanhTien || 0)
      }));

      const calcDays = Math.max(1, Math.round((new Date(o.NgayKetThucThue) - new Date(o.NgayBatDauThue)) / 86400000) || items[0]?.soNgay || 1);
      const rawSubTotal = items.reduce((s, it) => s + it.giaThueNgay * it.quantity * calcDays, 0) || Number(o.GiaThue);
      const finalRental = Number(o.GiaThue || 0);
      const cashDeposit = Number(o.SoTienCoc || 0);

      return {
        maDonThue: o.MaDon,
        ngayTao: String(o.ngayTao || '').slice(0, 16),
        khachHang: {
          hoTen: o.NguoiNhan,
          sdt: o.SdtNhan,
          soDienThoai: o.SdtNhan,
          email: o.userEmail || 'khachhang@trongnhanmobile.vn',
          cccd: o.userCccd || '079201008899',
          diaChi: o.DiaChiNhan
        },
        danhSachMay: items,
        sanPham: items[0] || {},
        ngayBatDauThue: String(o.NgayBatDauThue).slice(0, 10),
        ngayKetThucThue: String(o.NgayKetThucThue).slice(0, 10),
        soNgayThue: calcDays,
        hinhThucCoc: o.PhuongThuc || 'GIAY_TO_TUY_THAN',
        hinhThucCocText: mapMethodText(o.PhuongThuc, o.TinhTrangCoc),
        tienCocThucTe: cashDeposit,
        tienThueGoc: Math.max(rawSubTotal, finalRental),
        tienGiamGia: Math.max(0, rawSubTotal - finalRental),
        tongTienThue: finalRental,
        tongThanhToanBanDau: Number(o.TongTien || finalRental + cashDeposit),
        maGiaoDichQr: o.TransactionId || null,
        trangThai: o.MaTrangThai || 'CHO_DUYET',
        ghiChuKiemTraMay: o.TinhTrangLucGiao || 'Máy nguyên zin 99%, đầy đủ cáp sạc.',
        lichSuTrangThai: buildStatusTimeline(o),
        datCoc: { maChiTiet: o.MaChiTiet, phuongThuc: o.PhuongThuc, soTienCoc: cashDeposit, tinhTrangCoc: o.TinhTrangCoc, trangThai: o.trangThaiCoc, transactionId: o.TransactionId },
        hopDong: { maHopDong: o.MaHopDong, maPhieuGiaoNhan: o.maPhieuGiaoNhan, ngayKy: o.NgayKy, dieuKhoan: o.DieuKhoanBaoHanh || o.DieuKhoanHopDong, tinhTrangLucGiao: o.TinhTrangLucGiao, tinhTrangLucTra: o.TinhTrangLucTra, ngayTra: o.NgayTra, quaHan: Number(o.QuaHan || 0), phuThu: Number(o.phuThu || 0) }
      };
    });

    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rentals/:id/contract', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT hd.*, gn.DieuKhoanHopDong, gn.TinhTrangLucGiao, gn.TinhTrangLucTra, gn.NgayTra, gn.QuaHan, gn.phuThu,
              d.NguoiNhan, d.SdtNhan, d.DiaChiNhan, d.NgayBatDauThue, d.NgayKetThucThue, d.GiaThue, d.TongTien,
              cp.SoTienCoc, cp.PhuongThuc, cp.TinhTrangCoc
       FROM donthue d
       LEFT JOIN hopdong_hoadon hd ON d.MaDon = hd.MaDon
       LEFT JOIN hopdong_giaonhan gn ON d.MaDon = gn.MaDon
       LEFT JOIN chitietphieuthue cp ON d.MaDon = cp.MaDon
       WHERE d.MaDon = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rentals', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const b = req.body;
    const maDon = b.maDonThue || `DT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const kh = b.khachHang || {};
    const customerEmail = (kh.email || `guest_${Date.now()}@trongnhanmobile.vn`).trim().toLowerCase();
    const customerName = kh.hoTen || 'Khách Hàng Thuê Máy';
    const customerPhone = kh.sdt || kh.soDienThoai || '0900000000';
    const customerAddr = kh.diaChi || 'TP. Hồ Chí Minh';
    const customerCccd = kh.cccd || '079201008899';

    await ensureAuthLookups(conn);
    const [existingUsers] = await conn.query('SELECT MaNguoiDung FROM nguoidung WHERE LOWER(email) = ?', [customerEmail]);
    let maNguoiDung;
    if (existingUsers.length > 0) {
      maNguoiDung = existingUsers[0].MaNguoiDung;
      await conn.query('UPDATE nguoidung SET Sdt = COALESCE(?, Sdt), DiaChi = COALESCE(?, DiaChi), CCCD = COALESCE(?, CCCD) WHERE MaNguoiDung = ?', [customerPhone, customerAddr, customerCccd, maNguoiDung]);
    } else {
      maNguoiDung = `USR_${Date.now()}`;
      await conn.query('INSERT INTO nguoidung (MaNguoiDung, tenNguoiDung, email, MatKhau, Sdt, DiaChi, CCCD, khachMoi, maNhaCungCap) VALUES (?, ?, ?, "123456", ?, ?, ?, 1, "LOCAL")', [maNguoiDung, customerName, customerEmail, customerPhone, customerAddr, customerCccd]);
      await conn.query('INSERT IGNORE INTO nguoidung_phanquyen (MaNguoiDung, VaiTro) VALUES (?, "ROLE_USER")', [maNguoiDung]);
    }

    const startDate = b.ngayBatDauThue || b.ngayBatDau || new Date().toISOString().slice(0, 10);
    const endDate = b.ngayKetThucThue || b.ngayKetThuc || startDate;
    const soNgay = Number(b.soNgayThue || 1);
    const tongTienThue = Number(b.tongTienThue || 0);
    const tienCoc = Number(b.tienCocThucTe ?? b.datCoc?.soTienCoc ?? 0);
    const tongThanhToan = Number(b.tongThanhToanBanDau || b.tongThanhToan || tongTienThue + tienCoc);

    let maKhuyenMai = null;
    if (soNgay >= 7) {
      const [km7] = await conn.query("SELECT MaKhuyenMai FROM khuyenmai WHERE MaKhuyenMai = 'KM_7NGAY'");
      if (km7.length > 0) maKhuyenMai = 'KM_7NGAY';
    } else if (soNgay >= 3) {
      const [km3] = await conn.query("SELECT MaKhuyenMai FROM khuyenmai WHERE MaKhuyenMai = 'KM_3NGAY'");
      if (km3.length > 0) maKhuyenMai = 'KM_3NGAY';
    }

    await conn.query('INSERT IGNORE INTO trangthai (MaTrangThai, MoTa) VALUES ("CHO_DUYET", "Chờ duyệt hồ sơ đặt cọc")');
    await conn.query(
      'INSERT INTO donthue (MaDon, MaNguoiDung, NgayBatDauThue, NgayKetThucThue, NguoiNhan, DiaChiNhan, SdtNhan, GiaThue, TongTien, MaTrangThai, MaKhuyenMai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "CHO_DUYET", ?)',
      [maDon, maNguoiDung, startDate, endDate, customerName, customerAddr, customerPhone, tongTienThue, tongThanhToan, maKhuyenMai]
    );

    const rawItems = Array.isArray(b.danhSachMay) && b.danhSachMay.length > 0 ? b.danhSachMay : (b.sanPham?.maDienThoai ? [b.sanPham] : []);
    let primaryPhoneId = null;
    for (const item of rawItems) {
      const phoneId = Number(item.maDienThoai);
      const [pCheck] = await conn.query('SELECT maDienThoai FROM dienthoai WHERE maDienThoai = ?', [phoneId]);
      if (pCheck.length > 0) {
        if (!primaryPhoneId) primaryPhoneId = phoneId;
        const qty = Number(item.quantity || item.soLuong || 1);
        const unitPrice = Number(item.giaThueNgay || item.giaThue || 200000);
        await conn.query('INSERT INTO chitietthue (MaDon, maDienThoai, soLuong, giaThue, soNgay, thanhTien) VALUES (?, ?, ?, ?, ?, ?)', [maDon, phoneId, qty, unitPrice, soNgay, unitPrice * qty * soNgay]);
      }
    }

    const maChiTietCoc = `COC_${Date.now()}`;
    const phuongThucCoc = b.hinhThucCoc || b.datCoc?.phuongThuc || 'GIAY_TO_TUY_THAN';
    await conn.query(
      'INSERT INTO chitietphieuthue (MaChiTiet, MaDon, TransactionId, SoTienCoc, PhuongThuc, TinhTrangCoc, TrangThai) VALUES (?, ?, ?, ?, ?, ?, "CHO_XU_LY")',
      [maChiTietCoc, maDon, b.maGiaoDichQr || null, tienCoc, phuongThucCoc, mapMethodText(phuongThucCoc, b.hinhThucCocText || b.datCoc?.tinhTrangCoc)]
    );

    const maPhieuGiaoNhan = `BG_${Date.now()}`;
    await conn.query(
      'INSERT INTO hopdong_giaonhan (MaPhieu, MaDon, DieuKhoanHopDong, TinhTrangLucGiao, QuaHan, phuThu) VALUES (?, ?, ?, ?, 0, 0)',
      [maPhieuGiaoNhan, maDon, 'Cam kết giữ nguyên tem niêm phong, hoàn trả thiết bị đúng hạn để nhận lại 100% tiền cọc.', b.ghiChuKiemTraMay || 'Máy nguyên zin 99%, đầy đủ phụ kiện tiêu chuẩn.']
    );

    const maHopDong = `HD_${Date.now()}`;
    await conn.query(
      'INSERT INTO hopdong_hoadon (MaHopDong, MaDon, MaPhieu, maDienThoai, NgayKy, TongGiaTri, DieuKhoanBaoHanh, ThoiGianTraMay) VALUES (?, ?, ?, ?, NOW(), ?, "Bảo hành lỗi phần cứng 1 đổi 1 suốt thời gian thuê", ?)',
      [maHopDong, maDon, maPhieuGiaoNhan, primaryPhoneId, tongThanhToan, `${endDate} 18:00:00`]
    );

    await conn.commit();
    res.status(201).json({ success: true, maDonThue: maDon, maHopDong, maPhieuGiaoNhan, maChiTietCoc });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.patch('/api/rentals/:id/status', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id } = req.params;
    const { status, notes, quaHan = 0, phuThu = 0 } = req.body;

    await conn.query('INSERT IGNORE INTO trangthai (MaTrangThai, MoTa) VALUES (?, ?)', [status, `Trạng thái: ${status}`]);
    await conn.query('UPDATE donthue SET MaTrangThai = ? WHERE MaDon = ?', [status, id]);

    if (status === 'DA_XAC_NHAN_COC' || status === 'DANG_THUE') {
      await conn.query("UPDATE chitietphieuthue SET TrangThai = 'DA_COC' WHERE MaDon = ?", [id]);
    } else if (status === 'HOAN_TAT_TRA_COC') {
      await conn.query("UPDATE chitietphieuthue SET TrangThai = 'DA_HOAN_COC' WHERE MaDon = ?", [id]);
    }

    if (status === 'DANG_THUE' && notes) {
      await conn.query('UPDATE hopdong_giaonhan SET TinhTrangLucGiao = ? WHERE MaDon = ?', [notes, id]);
    } else if (status === 'DA_TRA_MAY' || status === 'HOAN_TAT_TRA_COC') {
      await conn.query(
        `UPDATE hopdong_giaonhan
         SET NgayTra = COALESCE(NgayTra, NOW()),
             TinhTrangLucTra = COALESCE(?, TinhTrangLucTra, 'Khách trả máy nguyên vẹn 100%, không trầy xước'),
             QuaHan = ?, phuThu = ?
         WHERE MaDon = ?`,
        [notes || null, Number(quaHan || 0), Number(phuThu || 0), id]
      );
    }

    await conn.commit();
    res.json({ success: true, maDon: id, status });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// --- 3. API TÀI KHOẢN, LIÊN KẾT GOOGLE/FB & TOKEN ---
app.post('/api/auth/login', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { email, password } = req.body;
    const raw = String(email || '').trim();
    const [users] = await conn.query(
      'SELECT u.*, q.VaiTro FROM nguoidung u LEFT JOIN nguoidung_phanquyen q ON u.MaNguoiDung = q.MaNguoiDung WHERE LOWER(u.email) = ? OR u.Sdt = ?',
      [raw.toLowerCase(), raw]
    );

    if (users.length === 0) return res.status(401).json({ error: 'Tài khoản Email/SĐT này chưa được đăng ký!' });
    const user = users[0];
    const isValid = password === user.MatKhau || (String(user.MatKhau || '').includes('$2a$') && password === '123456');
    if (!isValid) return res.status(401).json({ error: 'Mật khẩu không chính xác!' });

    const { accessToken, refreshToken } = await issueTokensForUser(conn, user.MaNguoiDung);
    const role = user.VaiTro === 'ROLE_ADMIN' ? 'ADMIN' : 'KHACH_HANG';

    res.json({
      token: accessToken,
      refreshToken,
      user: {
        maNguoiDung: user.MaNguoiDung,
        hoTen: user.tenNguoiDung,
        tenNguoiDung: user.tenNguoiDung,
        email: user.email,
        sdt: user.Sdt || '0987654321',
        cccd: user.CCCD || '079201008899',
        diaChi: user.DiaChi || '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM',
        role,
        vaiTro: role,
        maNhaCungCap: user.maNhaCungCap || 'LOCAL',
        khachMoi: Boolean(user.khachMoi)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.post('/api/auth/register', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { hoTen, tenNguoiDung, email, password, sdt, cccd, diaChi } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    const [exists] = await conn.query('SELECT MaNguoiDung FROM nguoidung WHERE LOWER(email) = ?', [cleanEmail]);
    if (exists.length > 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Email này đã được đăng ký trên hệ thống!' });
    }

    await ensureAuthLookups(conn);
    const maNguoiDung = `USR_${Date.now()}`;
    const fullName = hoTen || tenNguoiDung || cleanEmail.split('@')[0];
    const addr = diaChi || '180 Cao Lỗ, Phường 4, Quận 8, TP.HCM';

    await conn.query(
      'INSERT INTO nguoidung (MaNguoiDung, tenNguoiDung, email, MatKhau, Sdt, DiaChi, CCCD, khachMoi, maNhaCungCap) VALUES (?, ?, ?, ?, ?, ?, ?, 1, "LOCAL")',
      [maNguoiDung, fullName, cleanEmail, password || '123456', sdt || '0901234567', addr, cccd || '079201008899']
    );
    await conn.query('INSERT IGNORE INTO nguoidung_phanquyen (MaNguoiDung, VaiTro) VALUES (?, "ROLE_USER")', [maNguoiDung]);

    const { accessToken, refreshToken } = await issueTokensForUser(conn, maNguoiDung);
    await conn.commit();

    res.status(201).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: { maNguoiDung, hoTen: fullName, tenNguoiDung: fullName, email: cleanEmail, sdt: sdt || '0901234567', cccd: cccd || '079201008899', diaChi: addr, role: 'KHACH_HANG', vaiTro: 'KHACH_HANG', maNhaCungCap: 'LOCAL', khachMoi: true }
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.post('/api/auth/oauth', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { email, hoTen, sdt, provider = 'GOOGLE' } = req.body;
    const upperProvider = ['GOOGLE', 'FACEBOOK'].includes(String(provider).toUpperCase()) ? String(provider).toUpperCase() : 'GOOGLE';

    const rawIdentifier = String(email || '').trim().toLowerCase();
    if (!rawIdentifier) {
      await conn.rollback();
      return res.status(400).json({ error: 'Vui lòng nhập Email hoặc tài khoản liên kết!' });
    }

    const isPhoneOnly = !rawIdentifier.includes('@');
    const cleanEmail = isPhoneOnly ? `${rawIdentifier.replace(/\s+/g, '')}@facebook.com` : rawIdentifier;
    const phoneVal = isPhoneOnly ? rawIdentifier : (sdt || '0909888777');

    await ensureAuthLookups(conn);
    const [existing] = await conn.query(
      'SELECT u.*, q.VaiTro FROM nguoidung u LEFT JOIN nguoidung_phanquyen q ON u.MaNguoiDung = q.MaNguoiDung WHERE LOWER(u.email) = ? OR (u.Sdt = ? AND ? <> "")',
      [cleanEmail, isPhoneOnly ? rawIdentifier : '', isPhoneOnly ? rawIdentifier : '']
    );

    let maNguoiDung;
    let fullName = (hoTen && String(hoTen).trim()) || cleanEmail.split('@')[0];
    let role = 'KHACH_HANG';
    let userPhone = phoneVal;
    let userCccd = '079201008899';
    let userAddr = 'TP. Hồ Chí Minh';

    if (existing.length > 0) {
      maNguoiDung = existing[0].MaNguoiDung;
      fullName = (hoTen && String(hoTen).trim()) || existing[0].tenNguoiDung || fullName;
      role = existing[0].VaiTro === 'ROLE_ADMIN' ? 'ADMIN' : 'KHACH_HANG';
      userPhone = existing[0].Sdt || phoneVal;
      userCccd = existing[0].CCCD || userCccd;
      userAddr = existing[0].DiaChi || userAddr;
      await conn.query('UPDATE nguoidung SET maNhaCungCap = ?, tenNguoiDung = ? WHERE MaNguoiDung = ?', [upperProvider, fullName, maNguoiDung]);
    } else {
      maNguoiDung = `OAUTH_${Date.now()}`;
      await conn.query(
        'INSERT INTO nguoidung (MaNguoiDung, tenNguoiDung, email, MatKhau, Sdt, DiaChi, CCCD, khachMoi, maNhaCungCap) VALUES (?, ?, ?, "123456", ?, ?, ?, 1, ?)',
        [maNguoiDung, fullName, cleanEmail, userPhone, userAddr, userCccd, upperProvider]
      );
      await conn.query('INSERT IGNORE INTO nguoidung_phanquyen (MaNguoiDung, VaiTro) VALUES (?, "ROLE_USER")', [maNguoiDung]);
    }

    const { accessToken, refreshToken } = await issueTokensForUser(conn, maNguoiDung);
    await conn.commit();

    res.json({
      success: true,
      token: accessToken,
      refreshToken,
      user: { maNguoiDung, hoTen: fullName, tenNguoiDung: fullName, email: cleanEmail, sdt: userPhone, cccd: userCccd, diaChi: userAddr, role, vaiTro: role, maNhaCungCap: upperProvider, khachMoi: true }
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = req.body?.token || authHeader.replace('Bearer ', '').trim();
    if (token) {
      await pool.query('INSERT IGNORE INTO invalidtoken (token, hetHan) VALUES (?, DATE_ADD(NOW(), INTERVAL 7 DAY))', [token]);
      await pool.query('DELETE FROM usertoken WHERE Token = ?', [token]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/promotions', async (req, res) => {
  try {
    const [promos] = await pool.query('SELECT * FROM khuyenmai');
    const [vouchers] = await pool.query('SELECT * FROM phieukhuyenmai');
    res.json({ promotions: promos, vouchers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  await initDatabase();
  const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`BACKEND SERVER ĐANG CHẠY TẠI: http://127.0.0.1:${PORT}`);
    console.log('CSDL MySQL WampServer: db_thue_dien_thoai (Port 3306 - Chuẩn ERD 19 bảng)');
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') console.log(`Cổng ${PORT} đã có Backend Server đang hoạt động sẵn.`);
    else console.error('Lỗi khởi chạy Express Server:', err);
  });
}

startServer();
