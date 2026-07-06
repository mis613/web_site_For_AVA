import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { createTeamMember, deleteTeamMember, getTeam, updateTeamMember } from '../controllers/teamController.js';
import { adminWriteLimiter } from '../middleware/adminWriteLimiter.js';

const router = Router();

router.get('/', protect, adminOnly, getTeam);
router.post('/', protect, adminOnly, adminWriteLimiter, createTeamMember);
router.put('/:id', protect, adminOnly, adminWriteLimiter, updateTeamMember);
router.delete('/:id', protect, adminOnly, adminWriteLimiter, deleteTeamMember);

export default router;
