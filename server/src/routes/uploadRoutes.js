import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const allowedImageMimeTypes = new Set(['image/jpeg', 'image/png']);

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      return cb(new Error('Unsupported file type. Please upload a JPG or PNG image.'));
    }

    cb(null, true);
  }
});

const router = Router();

router.post('/', protect, adminOnly, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.error('[image upload] Multer error:', err.code, err.message);
        return res.status(400).json({
          message:
            err.code === 'LIMIT_FILE_SIZE'
              ? 'File is too large. Maximum size is 5 MB.'
              : 'Upload rejected by the server.',
          code: err.code
        });
      }

      console.error('[image upload] Validation error:', err.message);
      return res.status(400).json({
        message: err.message || 'Unsupported file type.',
        code: 'INVALID_FILE_TYPE'
      });
    }

    next();
  });
});

export default router;
