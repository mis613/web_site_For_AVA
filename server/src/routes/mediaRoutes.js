import { Router } from 'express';
import { getHomeVideo, upsertHomeVideo } from '../controllers/mediaController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/home-video', getHomeVideo);
router.post('/home-video', protect, adminOnly, upsertHomeVideo);

export default router;
