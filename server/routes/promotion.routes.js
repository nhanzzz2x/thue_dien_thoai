// server/routes/promotion.routes.js
// Định tuyến API danh sách chương trình khuyến mãi và voucher giảm giá

import express from 'express';
import * as promotionController from '../controllers/promotion.controller.js';

const router = express.Router();

router.get('/', promotionController.getPromotions);

export default router;
