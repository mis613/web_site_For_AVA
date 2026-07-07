import { Router } from 'express';
import { getMe, login } from '../controllers/authController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/login', login);
router.get('/me', protect, adminOnly, getMe);
export default router;
