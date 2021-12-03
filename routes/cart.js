import express from 'express';

import {
    addToCart, 
    getCartItem, 
    updateCart,
} from '../controllers/cart.js'
import authMiddleware from '../middlewares/auth.middleware.js';
import Authorization from '../middlewares/Authorization.js'

const router = express.Router();

router.post('/update', authMiddleware, Authorization, updateCart);
router.post('/', authMiddleware, Authorization, addToCart);
router.get('/', authMiddleware, Authorization, getCartItem)

export default router;