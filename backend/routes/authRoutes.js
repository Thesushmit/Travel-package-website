import { Router } from 'express';
import { register, login, logout, getMe, updateProfile, checkAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.get('/me/admin', protect, checkAdmin);

export default router;

