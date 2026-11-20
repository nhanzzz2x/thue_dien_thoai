// server/controllers/rental.controller.js
// Xử lý toàn bộ logic nghiệp vụ đơn thuê, hợp đồng giao nhận, đặt cọc và chuyển đổi trạng thái

import pool from '../db.js';
import { mapMethodText, buildStatusTimeline } from '../helpers/rental.helper.js';
import { ensureAuthLookups } from '../helpers/auth.helper.js';

// 1. Lấy toàn bộ danh sách đơn thuê
export async function getAllRentals(req, res) {
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
        datCoc: {
          maChiTiet: o.MaChiTiet,
          phuongThuc: o.PhuongThuc,
          soTienCoc: cashDeposit,
          tinhTrangCoc: o.TinhTrangCoc,
          trangThai: o.trangThaiCoc,
          transactionId: o.TransactionId
        },
        hopDong: {
          maHopDong: o.MaHopDong,
          maPhieuGiaoNhan: o.maPhieuGiaoNhan,
          ngayKy: o.NgayKy,
          dieuKhoan: o.DieuKhoanBaoHanh || o.DieuKhoanHopDong,
          tinhTrangLucGiao: o.TinhTrangLucGiao,
          tinhTrangLucTra: o.TinhTrangLucTra,
          ngayTra: o.NgayTra,
          quaHan: Number(o.QuaHan || 0),
          phuThu: Number(o.phuThu || 0)
        }
      };
    });

    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 2. Tra cứu chi tiết hợp đồng điện tử theo mã đơn
export async function getContractById(req, res) {
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
}

// 3. Đặt đơn thuê thiết bị mới (Transaction ACID đa bảng)
export async function createRental(req, res) {
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
}

// 4. Cập nhật trạng thái đơn thuê, tiền cọc và biên bản bàn giao (Admin)
export async function updateRentalStatus(req, res) {
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
}
