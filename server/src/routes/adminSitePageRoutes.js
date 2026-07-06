import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { createSitePage, deleteSitePage, getAllSitePages, getSitePageBySlugAdmin, updateSitePage } from '../controllers/sitePageController.js';
import { adminWriteLimiter } from '../middleware/adminWriteLimiter.js';

const router = Router();

router.get('/', protect, adminOnly, getAllSitePages);
router.get('/:slug', protect, adminOnly, getSitePageBySlugAdmin);
router.post('/', protect, adminOnly, adminWriteLimiter, createSitePage);
router.put('/:id', protect, adminOnly, adminWriteLimiter, updateSitePage);
router.delete('/:id', protect, adminOnly, adminWriteLimiter, deleteSitePage);

export default router;
