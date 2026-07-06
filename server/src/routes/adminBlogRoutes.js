import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { createBlog, deleteBlog, getAllBlogs, getBlogByIdAdmin, updateBlog } from '../controllers/blogController.js';
import { adminWriteLimiter } from '../middleware/adminWriteLimiter.js';

const router = Router();

router.get('/', protect, adminOnly, getAllBlogs);
router.get('/:id', protect, adminOnly, getBlogByIdAdmin);
router.post('/', protect, adminOnly, adminWriteLimiter, createBlog);
router.put('/:id', protect, adminOnly, adminWriteLimiter, updateBlog);
router.delete('/:id', protect, adminOnly, adminWriteLimiter, deleteBlog);

export default router;
