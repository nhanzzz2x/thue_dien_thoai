import pool, { initDatabase } from './db.js';

async function testConnection() {
  const ok = await initDatabase();
  if (!ok) process.exit(1);
  try {
    const [tables] = await pool.query('SHOW TABLES');
    console.log(`Tổng số bảng trong db_thue_dien_thoai: ${tables.length}`);
    const [phones] = await pool.query('SELECT COUNT(*) AS count FROM dienthoai');
    console.log('Số lượng điện thoại:', phones[0].count);
    const [orders] = await pool.query('SELECT COUNT(*) AS count FROM donthue');
    console.log('Số lượng đơn thuê:', orders[0].count);
  } finally {
    await pool.end();
  }
}

testConnection();
