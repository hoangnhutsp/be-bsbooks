import express from 'express'
import { 
    addAddress, 
    getAddressById, 
    getAddressByIdUser, 
    updateAddress, 
    setAddressDefaul, 
    deleteAddress 
} from '../controllers/address.js'

import authMiddleware from '../middlewares/auth.middleware.js'
import Authorization from '../middlewares/Authorization.js'

const router = express.Router()

router.get('/user', authMiddleware, Authorization, getAddressByIdUser);            //oke
router.post('/update/:id', authMiddleware, Authorization, updateAddress);
router.post('/default/:id', authMiddleware, Authorization, setAddressDefaul)
router.delete('/delete/:id', authMiddleware, Authorization, deleteAddress)
router.get('/:id', authMiddleware, Authorization, getAddressById);
router.post('/', authMiddleware, Authorization, addAddress);                       //oke

export default router;