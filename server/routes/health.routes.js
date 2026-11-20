// server/routes/health.routes.js
// Định tuyến API kiểm tra tình trạng kết nối máy chủ

import express from 'express';
import * as healthController from '../controllers/health.controller.js';

const router = express.Router();

router.get('/', healthController.checkHealth);

export default router;
