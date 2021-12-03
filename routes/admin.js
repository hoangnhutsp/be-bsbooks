import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import Authorization from '../middlewares/Authorization.js'

import { 
    getAllUser, 
    getProfileUserById,
    addAdmin
} from '../controllers/admin.js'

const router = express.Router();

router.get('/user', authMiddleware, Authorization, getAllUser);
router.get('/one_user', authMiddleware, Authorization, getProfileUserById);
router.post('/add-admin', authMiddleware, Authorization, addAdmin);

export default router;