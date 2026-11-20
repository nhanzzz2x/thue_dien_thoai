// server/controllers/health.controller.js
// Xử lý kiểm tra tình trạng kết nối máy chủ và CSDL MySQL

import pool from '../db.js';

export async function checkHealth(req, res) {
  try {
    const [[tCount]] = await pool.query(
      'SELECT COUNT(*) AS totalTables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()'
    );
    const [[pCount]] = await pool.query('SELECT COUNT(*) AS totalPhones FROM dienthoai');
    const [[oCount]] = await pool.query('SELECT COUNT(*) AS totalOrders FROM donthue');

    res.json({
      status: 'OK',
      database: 'db_thue_dien_thoai',
      totalTables: tCount.totalTables,
      totalPhones: pCount.totalPhones,
      totalOrders: oCount.totalOrders
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
}
