// server/routes/category.routes.js
// Định tuyến API danh mục phân loại điện thoại và thương hiệu

import express from 'express';
import * as categoryController from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', categoryController.getCategories);

export default router;
