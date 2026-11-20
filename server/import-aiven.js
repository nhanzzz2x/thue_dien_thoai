// server/import-aiven.js
// Tool hỗ trợ nạp dữ liệu từ file SQL lên Cloud MySQL (Aiven, TiDB, Clever Cloud, Railway...)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runImport() {
  console.log('====================================================');
  console.log('   CÔNG CỤ NẠP DỮ LIỆU TỰ ĐỘNG LÊN CLOUD MYSQL      ');
  console.log('====================================================');

  // Lấy đường dẫn file SQL
  const sqlFilePath = path.resolve(__dirname, '../db_thue_dien_thoai.sql');
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`Không tìm thấy file SQL tại: ${sqlFilePath}`);
    process.exit(1);
  }

  // Lấy cấu hình kết nối từ tham số dòng lệnh hoặc biến môi trường
  // Cách 1: node server/import-aiven.js "mysql://avnadmin:pass@host:port/dbname?ssl-mode=REQUIRED"
  // Cách 2: node server/import-aiven.js <host> <port> <user> <password> <database>
  const args = process.argv.slice(2);
  let connectionConfig = {};

  if (args[0] && args[0].startsWith('mysql://')) {
    const uri = new URL(args[0]);
    connectionConfig = {
      host: uri.hostname,
      port: Number(uri.port) || 3306,
      user: decodeURIComponent(uri.username),
      password: decodeURIComponent(uri.password),
      database: uri.pathname.replace(/^\//, '') || 'defaultdb',
      ssl: { rejectUnauthorized: false },
      multipleStatements: true
    };
  } else if (args.length >= 4) {
    connectionConfig = {
      host: args[0],
      port: Number(args[1]) || 3306,
      user: args[2],
      password: args[3],
      database: args[4] || 'defaultdb',
      ssl: { rejectUnauthorized: false },
      multipleStatements: true
    };
  } else if (process.env.DB_HOST) {
    connectionConfig = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'avnadmin',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'defaultdb',
      ssl: { rejectUnauthorized: false },
      multipleStatements: true
    };
  } else {
    console.log('\n HƯỚNG DẪN SỬ DỤNG:');
    console.log('Trong Aiven Console, bấm vào dịch vụ MySQL của bạn.');
    console.log('Sao chép Service URI (dạng mysql://avnadmin:xxxx@mysql-...aivencloud.com:port/defaultdb?ssl-mode=REQUIRED)\n');
    console.log('Sau đó chạy lệnh:');
    console.log('  node server/import-aiven.js "SERVICE_URI_CỦA_BẠN"\n');
    console.log('Hoặc chạy với từng tham số:');
    console.log('  node server/import-aiven.js <host> <port> <user> <password> <database>\n');
    process.exit(0);
  }

  console.log(` Đang kết nối tới Cloud MySQL: ${connectionConfig.host}:${connectionConfig.port}...`);
  console.log(` Cơ sở dữ liệu: ${connectionConfig.database}`);

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log(' Kết nối thành công tới máy chủ MySQL Cloud!');

    console.log(` Đang đọc nội dung file: ${sqlFilePath}...`);
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log(' SQL tạo bảng và thêm dữ liệu mẫu...');
    await connection.query(sqlContent);

    // Kiểm tra kết quả
    const [tables] = await connection.query('SHOW TABLES');
    console.log('====================================================');
    console.log(` NẠP DỮ LIỆU THÀNH CÔNG!`);
    console.log(` Tổng số bảng đã tạo: ${tables.length}`);
    tables.forEach((row, idx) => {
      const tableName = Object.values(row)[0];
      console.log(`  ${idx + 1}. ${tableName}`);
    });

    try {
      const [phones] = await connection.query('SELECT COUNT(*) AS count FROM dienthoai');
      console.log(` Dữ liệu điện thoại: ${phones[0].count} sản phẩm.`);
    } catch (_) {}

    console.log('====================================================');
    console.log(' Database trên Aiven đã sẵn sàng hoạt động 100%!');
  } catch (error) {
    console.error(' Lỗi nạp dữ liệu:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runImport();
