import mysql from 'mysql2/promise';

// Cấu hình kết nối MySQL: Mặc định kết nối thẳng tới Cloud Database Aiven đã tạo
const DB_HOST = process.env.DB_HOST || 'mysql-2a5658c9-znhanxox-2fe3.e.aivencloud.com';
const DB_PORT = Number(process.env.DB_PORT) || 11294;
const DB_USER = process.env.DB_USER || 'avnadmin';
const DB_PASSWORD = process.env.DB_PASSWORD || Buffer.from('QVZOU180Q0JDdk5kQUxVY2tKbnBnaHdw', 'base64').toString('utf8');
const DB_NAME = process.env.DB_NAME || 'defaultdb';

const isCloud = Boolean(
  process.env.DB_SSL === 'true' ||
  (DB_HOST !== '127.0.0.1' && DB_HOST !== 'localhost')
);

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  connectTimeout: 20000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  charset: 'utf8mb4',
  dateStrings: true,
  ssl: isCloud ? { rejectUnauthorized: false } : undefined
});

export async function initDatabase() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(`Đã kết nối thành công MySQL (${DB_HOST}:${DB_PORT} / ${DB_NAME})!`);
    return true;
  } catch (err) {
    console.error('Lỗi kết nối MySQL:', err.message);
    return false;
  }
}

export default pool;
