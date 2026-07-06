import { Router } from 'express';
import {
  getSitePageBySlug,
  getSitePages
} from '../controllers/sitePageController.js';

const router = Router();

router.get('/', getSitePages);
router.get('/:slug', getSitePageBySlug);

export default router;
