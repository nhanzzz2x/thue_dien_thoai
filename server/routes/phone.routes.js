// server/routes/phone.routes.js
// Định tuyến API kho điện thoại, phiên bản cấu hình và album hình ảnh

import express from 'express';
import * as phoneController from '../controllers/phone.controller.js';

const router = express.Router();

router.get('/', phoneController.getAllPhones);
router.get('/:id', phoneController.getPhoneById);
router.post('/', phoneController.createPhone);
router.put('/:id', phoneController.updatePhone);
router.delete('/:id', phoneController.deletePhone);

export default router;
