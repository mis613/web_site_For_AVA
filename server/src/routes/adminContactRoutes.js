import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { deleteContact, getContacts, updateContact } from '../controllers/contactController.js';
import { adminWriteLimiter } from '../middleware/adminWriteLimiter.js';

const router = Router();

router.get('/', protect, adminOnly, getContacts);
router.put('/:id', protect, adminOnly, adminWriteLimiter, updateContact);
router.delete('/:id', protect, adminOnly, adminWriteLimiter, deleteContact);

export default router;
