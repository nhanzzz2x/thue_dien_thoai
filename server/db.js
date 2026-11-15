// =============================================================================
// KẾT NỐI CƠ SỞ DỮ LIỆU MYSQL TRÊN WAMPSERVER (PHPMYADMIN)
// Database: db_thue_dien_thoai (Port: 3306)
// =============================================================================

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // WampServer mặc định không có mật khẩu
  database: process.env.DB_NAME || 'db_thue_dien_thoai',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

const pool = mysql.createPool(dbConfig);

// Kiểm tra kết nối khi khởi động
pool.getConnection()
  .then(conn => {
    console.log(' Đã kết nối thành công vào MySQL CSDL db_thue_dien_thoai trên WampServer (Port 3306)!');
    conn.release();
  })
  .catch(err => {
    console.error(' Lỗi kết nối MySQL:', err.message);
    console.warn(' Bạn hãy đảm bảo WampServer đang chạy và icon chuyển sang màu Xanh Lá!');
  });

export default pool;

