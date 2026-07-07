import { Router } from 'express';
import multer from 'multer';
import { getHomeVideo, upsertHomeVideo } from '../controllers/mediaController.js';
import { uploadHomeVideo } from '../controllers/uploadController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

router.get('/home-video', getHomeVideo);
router.post('/home-video', protect, adminOnly, upsertHomeVideo);
router.post('/home-video/upload', protect, adminOnly, (req, res, next) => {
  videoUpload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.error('[home-video upload] Multer error:', err.code, err.message);
        return res.status(400).json({
          success: false,
          message:
            err.code === 'LIMIT_FILE_SIZE'
              ? 'File is too large. Maximum size is 50 MB.'
              : 'Upload rejected by the server.',
          code: err.code
        });
      }

      console.error('[home-video upload] Validation error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'Unsupported file type.',
        code: 'INVALID_FILE_TYPE'
      });
    }

    next();
  });
}, uploadHomeVideo);

export default router;
