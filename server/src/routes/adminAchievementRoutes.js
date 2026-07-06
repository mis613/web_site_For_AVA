import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { createAchievement, deleteAchievement, getAchievements, updateAchievement } from '../controllers/achievementController.js';
import { adminWriteLimiter } from '../middleware/adminWriteLimiter.js';

const router = Router();

router.get('/', protect, adminOnly, getAchievements);
router.post('/', protect, adminOnly, adminWriteLimiter, createAchievement);
router.put('/:id', protect, adminOnly, adminWriteLimiter, updateAchievement);
router.delete('/:id', protect, adminOnly, adminWriteLimiter, deleteAchievement);

export default router;
