import express from 'express';

import {
    createInvoice,
    updateInvoice,
    getInvoice,
    getInvoiceByID,
    getAllInvoice,
    cancelInvoice,
} from '../controllers/invoice.js'

import authMiddleware from '../middlewares/auth.middleware.js';
import Authorization from '../middlewares/Authorization.js'

const router = express.Router();

router.post('/create',authMiddleware, Authorization, createInvoice);
router.post('/update/:id',authMiddleware, Authorization, updateInvoice);
router.post('/cancel/:id', authMiddleware, Authorization, cancelInvoice)
router.get('/getall',authMiddleware, Authorization,  getAllInvoice)
router.get('/user',authMiddleware, Authorization, getInvoice);
router.get('/:id', authMiddleware, Authorization, getInvoiceByID)

export default router;