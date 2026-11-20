// server/routes/rental.routes.js
// Định tuyến API đơn thuê, chi tiết máy thuê, tiền cọc và hợp đồng bàn giao

import express from 'express';
import * as rentalController from '../controllers/rental.controller.js';

const router = express.Router();

router.get('/', rentalController.getAllRentals);
router.get('/:id/contract', rentalController.getContractById);
router.post('/', rentalController.createRental);
router.patch('/:id/status', rentalController.updateRentalStatus);

export default router;
