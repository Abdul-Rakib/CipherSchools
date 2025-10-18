import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { updateUserProfile, getUserProfile } from '../controllers/user.js';

const router = express.Router();

router.get('/user-profile', verifyToken, getUserProfile);
router.post('/update-user-profile', verifyToken, updateUserProfile);

export default router;