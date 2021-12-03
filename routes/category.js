import express from 'express';

import {
    getCategory, 
    getCategoryByID,
} from '../controllers/category.js'

const router = express.Router();

router.get('/:id', getCategoryByID);
router.get('/', getCategory);

export default router;