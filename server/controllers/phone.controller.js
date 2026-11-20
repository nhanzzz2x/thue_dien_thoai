// server/controllers/phone.controller.js
// Xử lý toàn bộ logic nghiệp vụ kho điện thoại, cấu hình phần cứng và album ảnh

import pool from '../db.js';
import { formatPhoneRow, detectCategory, FALLBACK_IMG } from '../helpers/phone.helper.js';

// 1. Lấy toàn bộ danh sách điện thoại trong kho
export async function getAllPhones(req, res) {
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
}

// 2. Lấy thông tin chi tiết 1 máy theo mã ID
export async function getPhoneById(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT d.*, c.Chipset, c.RAM_ROM, c.HeDieuHanh, c.ThongSoCamera_Pin FROM dienthoai d LEFT JOIN cauhinh_phienban c ON d.MaCauHinh = c.MaCauHinh WHERE d.maDienThoai = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy điện thoại' });
    const [images] = await pool.query('SELECT duongDan FROM dienthoai_hinhanh WHERE maDienThoai = ? ORDER BY id ASC', [req.params.id]);
    res.json(formatPhoneRow(rows[0], images.map((i) => i.duongDan)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// 3. Thêm điện thoại mới vào kho (Admin)
export async function createPhone(req, res) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const {
      TenDienThoai,
      hangSanXuat,
      category,
      MaCauHinh,
      giaThueNgay,
      giaKhuyenMai,
      tienCocYeuCau,
      MacDinh,
      SoLuong,
      TinhTrangMay,
      SoIMEI_Serial,
      cauHinh,
      Chipset,
      RAM_ROM,
      moTa,
      hinhAnh
    } = req.body;

    const brand = (hangSanXuat || category || detectCategory(TenDienThoai)).toUpperCase();
    const finalMaCauHinh = cauHinh?.MaCauHinh || MaCauHinh || `CH_${Date.now()}`;
    const osVal = cauHinh?.HeDieuHanh || (brand.includes('APPLE') ? 'iOS 18' : 'Android 14');
    await conn.query(
      `INSERT INTO cauhinh_phienban (MaCauHinh, Chipset, RAM_ROM, HeDieuHanh, ThongSoCamera_Pin) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE Chipset = VALUES(Chipset), RAM_ROM = VALUES(RAM_ROM), HeDieuHanh = VALUES(HeDieuHanh), ThongSoCamera_Pin = VALUES(ThongSoCamera_Pin)`,
      [
        finalMaCauHinh,
        cauHinh?.Chipset || Chipset || 'Snapdragon / Dimensity / Apple',
        cauHinh?.RAM_ROM || RAM_ROM || '8GB / 256GB',
        osVal,
        cauHinh?.ThongSoCamera_Pin || moTa || 'Máy nguyên zin 99%, đầy đủ sạc cáp.'
      ]
    );

    const coverImg = MacDinh || (Array.isArray(hinhAnh) && hinhAnh[0]) || FALLBACK_IMG;
    const [result] = await conn.query(
      'INSERT INTO dienthoai (TenDienThoai, hangSanXuat, MaCauHinh, giaThueNgay, giaKhuyenMai, tienCocYeuCau, MacDinh, SoLuong, SoIMEI_Serial, TinhTrangMay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        TenDienThoai || 'Điện thoại mới',
        brand,
        finalMaCauHinh,
        Number(giaThueNgay || 200000),
        giaKhuyenMai ? Number(giaKhuyenMai) : null,
        Number(tienCocYeuCau || 10000000),
        coverImg,
        Number(SoLuong ?? 5),
        SoIMEI_Serial || ('35' + Math.floor(1000000000000 + Math.random() * 9000000000000)),
        TinhTrangMay || 'SAN_SANG'
      ]
    );

    const newPhoneId = result.insertId;
    const allImgs = Array.from(new Set([coverImg, ...(Array.isArray(hinhAnh) ? hinhAnh : [])].filter(Boolean)));
    for (const imgUrl of allImgs) {
      await conn.query('INSERT INTO dienthoai_hinhanh (maDienThoai, duongDan) VALUES (?, ?)', [newPhoneId, imgUrl]);
    }

    await conn.commit();
    res.status(201).json({ success: true, maDienThoai: newPhoneId, hangSanXuat: brand, hinhAnh: allImgs });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
}

// 4. Cập nhật thông tin điện thoại (Admin)
export async function updatePhone(req, res) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id } = req.params;
    const {
      TenDienThoai,
      hangSanXuat,
      category,
      giaThueNgay,
      giaKhuyenMai,
      tienCocYeuCau,
      SoLuong,
      TinhTrangMay,
      SoIMEI_Serial,
      MacDinh,
      hinhAnh,
      cauHinh,
      Chipset,
      RAM_ROM,
      moTa
    } = req.body;

    const [existing] = await conn.query('SELECT * FROM dienthoai WHERE maDienThoai = ?', [id]);
    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Không tìm thấy thiết bị' });
    }
    const cur = existing[0];
    const maCauHinh = cur.MaCauHinh || `CH_${id}`;
    const brand = (hangSanXuat || category || cur.hangSanXuat || detectCategory(TenDienThoai || cur.TenDienThoai)).toUpperCase();

    if (cauHinh || Chipset || RAM_ROM || moTa) {
      await conn.query(
        `INSERT INTO cauhinh_phienban (MaCauHinh, Chipset, RAM_ROM, HeDieuHanh, ThongSoCamera_Pin) VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE Chipset = VALUES(Chipset), RAM_ROM = VALUES(RAM_ROM), ThongSoCamera_Pin = VALUES(ThongSoCamera_Pin)`,
        [
          maCauHinh,
          cauHinh?.Chipset || Chipset || 'Snapdragon / Dimensity / Apple',
          cauHinh?.RAM_ROM || RAM_ROM || '8GB / 256GB',
          cauHinh?.HeDieuHanh || (brand.includes('APPLE') ? 'iOS' : 'Android'),
          cauHinh?.ThongSoCamera_Pin || moTa || 'Máy nguyên bản 99%'
        ]
      );
    }

    const coverImg = MacDinh || (Array.isArray(hinhAnh) && hinhAnh[0]) || cur.MacDinh;
    await conn.query(
      'UPDATE dienthoai SET TenDienThoai = ?, hangSanXuat = ?, MaCauHinh = ?, giaThueNgay = ?, giaKhuyenMai = ?, tienCocYeuCau = ?, SoLuong = ?, TinhTrangMay = ?, SoIMEI_Serial = ?, MacDinh = ? WHERE maDienThoai = ?',
      [
        TenDienThoai ?? cur.TenDienThoai,
        brand,
        maCauHinh,
        giaThueNgay ?? cur.giaThueNgay,
        giaKhuyenMai !== undefined ? giaKhuyenMai : cur.giaKhuyenMai,
        tienCocYeuCau ?? cur.tienCocYeuCau,
        SoLuong ?? cur.SoLuong,
        TinhTrangMay ?? cur.TinhTrangMay,
        SoIMEI_Serial ?? cur.SoIMEI_Serial,
        coverImg,
        id
      ]
    );

    if (Array.isArray(hinhAnh) && hinhAnh.length > 0) {
      const uniqueImgs = Array.from(new Set([coverImg, ...hinhAnh].filter(Boolean)));
      await conn.query('DELETE FROM dienthoai_hinhanh WHERE maDienThoai = ?', [id]);
      for (const imgUrl of uniqueImgs) {
        await conn.query('INSERT INTO dienthoai_hinhanh (maDienThoai, duongDan) VALUES (?, ?)', [id, imgUrl]);
      }
    }

    await conn.commit();
    res.json({ success: true, hangSanXuat: brand });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
}

// 5. Xóa điện thoại khỏi kho (Admin)
export async function deletePhone(req, res) {
  try {
    await pool.query('DELETE FROM dienthoai WHERE maDienThoai = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
