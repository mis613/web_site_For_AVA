import { Router } from 'express';
import { uploadFile, uploadsDir } from '../controllers/uploadController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import fs from 'fs';

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/webm',
  'video/quicktime'
]);

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('Unsupported file type. Please upload a JPG, PNG, MP4, WebM, or MOV file.'));
    }

    cb(null, true);
  }
});

const router = Router();

router.post('/', protect, adminOnly, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.error('[upload] Multer error:', err.code, err.message);
        return res.status(400).json({
          message:
            err.code === 'LIMIT_FILE_SIZE'
              ? 'File is too large. Maximum size is 5 MB.'
              : 'Upload rejected by the server.',
          code: err.code
        });
      }

      console.error('[upload] Validation error:', err.message);
      return res.status(400).json({
        message: err.message || 'Unsupported file type.',
        code: 'INVALID_FILE_TYPE'
      });
    }

    next();
  });
}, uploadFile);

export default router;
