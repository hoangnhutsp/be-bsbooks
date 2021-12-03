import express from 'express';
import { 
    addEvaluate, 
    getEvaluateToProduct, 
    updateEvaluateToStar, 
    updateEvaluateToComment 
} from '../controllers/evaluate.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import Authorization from '../middlewares/Authorization.js'

const router = express.Router();

//oke
router.post('/', authMiddleware, Authorization, addEvaluate);

router.get('/:idProduct', getEvaluateToProduct);


// TO DO
router.post('/update-star/:idProduct', authMiddleware, Authorization, updateEvaluateToStar);
router.post('/update-comment/:idProduct', authMiddleware,Authorization, updateEvaluateToComment);

export default router;