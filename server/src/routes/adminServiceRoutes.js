import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { createService, deleteService, getServices, updateService } from '../controllers/serviceController.js';
import { adminWriteLimiter } from '../middleware/adminWriteLimiter.js';

const router = Router();

router.get('/', protect, adminOnly, getServices);
router.post('/', protect, adminOnly, adminWriteLimiter, createService);
router.put('/:id', protect, adminOnly, adminWriteLimiter, updateService);
router.delete('/:id', protect, adminOnly, adminWriteLimiter, deleteService);

export default router;
