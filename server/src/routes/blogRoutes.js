import { Router } from 'express';
import { getBlogBySlug, getBlogById, getPublishedBlogs } from '../controllers/blogController.js';

const router = Router();
router.get('/', getPublishedBlogs);
router.get('/id/:id', getBlogById);
router.get('/:slug', getBlogBySlug);
export default router;
