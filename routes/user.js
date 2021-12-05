import express from 'express';

import { 
    addUser, 
    Login, 
    Logout, 
    getProfileUser,
    updateUser,
    loginFacebook,
    forgotPassWord,
    resetPassWord,
    googleLogin,
    changePassword
} from '../controllers/user.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import Authorization from '../middlewares/Authorization.js'


const router = express.Router();

router.post('/signup', addUser);
router.post('/login', Login);
router.get('/logout', authMiddleware, Logout)
router.post('/login-facebook', loginFacebook);
router.post('/forgot-password', forgotPassWord);
router.post('/reset-password/:token', resetPassWord);
router.post('/login-google', googleLogin);


router.get('/profile', authMiddleware, Authorization, getProfileUser);
router.post('/update',authMiddleware, Authorization, updateUser);
router.post('/change-password', authMiddleware, Authorization, changePassword)

export default router;
