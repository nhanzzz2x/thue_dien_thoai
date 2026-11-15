import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'db_thue_dien_thoai',
      port: 3306
    });
    console.log(' KẾT NỐI MYSQL THÀNH CÔNG RỰC RỠ!');
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM dienthoai');
    console.log(' Số lượng điện thoại trong bảng dienthoai:', rows[0].count);
    
    const [users] = await conn.query('SELECT MaNguoiDung, tenNguoiDung, email FROM nguoidung');
    console.log(' Danh sách người dùng trong bảng nguoidung:');
    users.forEach(u => console.log(`   - [${u.MaNguoiDung}] ${u.tenNguoiDung} (${u.email})`));
    
    await conn.end();
  } catch (err) {
    console.error(' LỖI KẾT NỐI MYSQL:', err.message);
  }
}

testConnection();

