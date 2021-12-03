import express from 'express';

import { 
    getRecentlyViewed,
} from '../controllers/recently_viewed.js'

const router = express.Router();

router.get('/', getRecentlyViewed);

export default router;
