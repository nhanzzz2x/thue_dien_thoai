// server/controllers/promotion.controller.js
// Xử lý logic truy vấn chương trình khuyến mãi và voucher giảm giá

import pool from '../db.js';

export async function getPromotions(req, res) {
  try {
    const [promos] = await pool.query('SELECT * FROM khuyenmai');
    const [vouchers] = await pool.query('SELECT * FROM phieukhuyenmai');
    res.json({ promotions: promos, vouchers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
