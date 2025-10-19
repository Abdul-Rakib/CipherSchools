import express from 'express';
import { googleAuth, sendOtp, logout, registerNewUser, testLogin } from '../controllers/auth.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post("/google", googleAuth);
router.post("/register", registerNewUser);
router.post("/send-otp", sendOtp);
router.post("/logout", verifyToken, logout);
router.post("/login", testLogin);

export default router;