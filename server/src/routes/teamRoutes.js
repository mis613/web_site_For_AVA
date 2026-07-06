import { Router } from 'express';
import { getPublicTeam } from '../controllers/teamController.js';

const router = Router();
router.get('/', getPublicTeam);
export default router;
