import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_thue_dien_thoai',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 15,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  charset: 'utf8mb4',
  dateStrings: true
});

export async function initDatabase() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Đã kết nối ổn định MySQL WampServer (127.0.0.1:3306 / db_thue_dien_thoai)!');
    return true;
  } catch (err) {
    console.error('Lỗi kết nối MySQL WampServer:', err.message);
    return false;
  }
}

export default pool;
