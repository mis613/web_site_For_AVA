import { Router } from 'express';
import multer from 'multer';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { uploadBuffer } from '../services/cloudinaryService.js';

const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args);
};

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const imageMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const videoMimeTypes = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

router.post('/', protect, adminOnly, (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.error('[media upload] Multer error:', err.code, err.message);
        return res.status(400).json({
          success: false,
          message: err.code === 'LIMIT_FILE_SIZE' ? 'File is too large.' : 'Upload rejected by the server.',
          code: err.code
        });
      }

      console.error('[media upload] Validation error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'Unsupported file type.',
        code: 'INVALID_FILE_TYPE'
      });
    }

    try {
      const file = req.file;
      const resourceType = String(req.body.resourceType || 'image').toLowerCase();
      if (!file) {
        return res.status(400).json({ success: false, message: 'File is required', code: 'FILE_REQUIRED' });
      }

      devLog('[media upload] started:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        resourceType
      });

      if (resourceType === 'video' && !videoMimeTypes.has(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Only MP4, WebM, and MOV videos are allowed',
          code: 'INVALID_FILE_TYPE'
        });
      }

      if (resourceType !== 'video' && !imageMimeTypes.has(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Only JPG, JPEG, PNG, and WebP images are allowed',
          code: 'INVALID_FILE_TYPE'
        });
      }

      const folder = resourceType === 'video' ? 'ava/homepage-videos' : 'ava/uploads';
      const result = await uploadBuffer({
        buffer: file.buffer,
        resourceType,
        folder
      });

      devLog('[media upload] success:', {
        resourceType,
        publicId: result.public_id,
        secureUrl: result.secure_url
      });

      res.status(201).json({
        success: true,
        url: result.secure_url,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        data: {
          url: result.secure_url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type
        }
      });
    } catch (uploadError) {
      console.error('[media upload] failed:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Cloudinary upload failed',
        code: 'UPLOAD_FAILED'
      });
    }
  });
});

export default router;
