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

const allowedMimeTypes = new Set(['image/jpeg', 'image/png']);

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'file'));
    }

    cb(null, true);
  }
});

const router = Router();

router.post('/', protect, adminOnly, upload.single('file'), uploadFile);

export default router;
