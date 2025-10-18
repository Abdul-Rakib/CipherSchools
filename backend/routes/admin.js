import express from 'express';
import { getAllUsers, getUserById, updateUserDetails} from '../controllers/admin.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/user/all-users', verifyToken, getAllUsers);
router.get('/user/:userId', verifyToken, getUserById);
router.post('/user/update-user-details', verifyToken, updateUserDetails);

export default router;