// server/index.js
// Máy chủ Express Backend - Dự án Website Quản lý & Cho thuê Điện thoại Thông minh Cao Cấp
// Hệ thống định tuyến RESTful API module hóa

import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';

// Import các router module độc lập
import healthRoutes from './routes/health.routes.js';
import phoneRoutes from './routes/phone.routes.js';
import categoryRoutes from './routes/category.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import authRoutes from './routes/auth.routes.js';
import promotionRoutes from './routes/promotion.routes.js';

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// Cấu hình Middleware toàn cục
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Tắt cache HTTP để dữ liệu mới trong MySQL WampServer hiển thị ngay lập tức lên Web
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  next();
});

// Gắn kết (Mount) các router module độc lập
app.use('/api/health', healthRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/promotions', promotionRoutes);

// Khởi động máy chủ và kết nối CSDL MySQL
async function startServer() {
  await initDatabase();
  const HOST = process.env.HOST || '0.0.0.0';
  const server = app.listen(PORT, HOST, () => {
    console.log('====================================================');
    console.log(`BACKEND SERVER ĐANG CHẠY TẠI: http://${HOST}:${PORT}`);
    console.log(`CSDL MySQL: ${process.env.DB_NAME || 'defaultdb'} (Aiven Cloud)`);
    console.log('Cấu trúc server đã được module hóa thành các router độc lập:');
    console.log(' - /api/health      -> routes/health.routes.js');
    console.log(' - /api/phones      -> routes/phone.routes.js');
    console.log(' - /api/categories  -> routes/category.routes.js');
    console.log(' - /api/rentals     -> routes/rental.routes.js');
    console.log(' - /api/auth        -> routes/auth.routes.js');
    console.log(' - /api/promotions  -> routes/promotion.routes.js');
    console.log('====================================================');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Cổng ${PORT} đã có Backend Server đang hoạt động sẵn.`);
    } else {
      console.error('Lỗi khởi chạy Express Server:', err);
    }
  });
}

// Khởi chạy server khi chạy độc lập (Node.js/Render/Local), không lắng nghe cổng trên môi trường serverless Vercel
if (!process.env.VERCEL) {
  startServer();
}

export default app;
