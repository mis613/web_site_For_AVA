import { Router } from 'express';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { getSitePageBySlugAdmin, upsertSitePageBySlugAdmin } from '../controllers/sitePageController.js';
import { adminWriteLimiter } from '../middleware/adminWriteLimiter.js';

function createAliasRouter(slug) {
  const router = Router();
  router.get('/', protect, adminOnly, (req, res, next) => {
    req.params.slug = slug;
    return getSitePageBySlugAdmin(req, res, next);
  });
  router.put('/', protect, adminOnly, adminWriteLimiter, upsertSitePageBySlugAdmin(slug));
  return router;
}

export const aboutAdminRouter = createAliasRouter('about');
export const careersAdminRouter = createAliasRouter('careers');
export const galleryAdminRouter = createAliasRouter('gallery');
export const privacyPolicyAdminRouter = createAliasRouter('privacy-policy');
export const contactPageAdminRouter = createAliasRouter('contact');
