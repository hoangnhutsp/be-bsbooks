import express from 'express';
import { auth } from 'google-auth-library';
import {
    getProduct, 
    createProduct, 
    getProductByID, 
    updateProduct, 
    suggestionProduct,
    getProductByCategoryLimit,
    deleteProductByID,
} from '../controllers/product.js';

import { updateRecentlyViewed } from '../controllers/recently_viewed.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import Authorization from '../middlewares/Authorization.js'

const router = express.Router();

// user
router.get('/search/suggestion', suggestionProduct)
router.get('/', getProduct);
router.get('/category', getProductByCategoryLimit)
router.get('/:id', updateRecentlyViewed, getProductByID);

// admin
router.post('/update', authMiddleware, Authorization, updateProduct);
router.post('/', authMiddleware, Authorization,createProduct)
router.delete('/:_id', authMiddleware, Authorization, deleteProductByID)


export default router;



