import express from 'express';

import { uploadImage } from '../controllers/upload_image.js'

const router = express.Router();

router.post('/', uploadImage);

export default router;
