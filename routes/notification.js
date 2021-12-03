import express from 'express'

import { addNotification,
         getNotificationByIdUser,
         updateStatus,
         deleteNotification,
} from '../controllers/notification.js'

import authMiddleware from '../middlewares/auth.middleware.js';
import Authorization from '../middlewares/Authorization.js'


const router = express.Router();

router.post('/', authMiddleware, Authorization, addNotification);
router.get('/', authMiddleware, Authorization, getNotificationByIdUser);
router.post('/status', authMiddleware, Authorization, updateStatus);
router.delete('/:id', authMiddleware, Authorization, deleteNotification)

export default router;