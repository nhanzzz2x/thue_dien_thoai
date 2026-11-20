// server/routes/auth.routes.js
// Định tuyến API xác thực tài khoản, phân quyền RBAC và phiên làm việc JWT

import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/oauth', authController.oauthLogin);
router.post('/logout', authController.logout);

export default router;
