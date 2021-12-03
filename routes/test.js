import express from 'express';
import { auth } from 'google-auth-library';
import {
    getProduct, 
} from '../controllers/test.js';

const router = express.Router();

// user
router.get('/product', getProduct);

// admin

export default router;



