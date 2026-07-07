import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, '../../uploads');

const ensureUploadsDir = () => {
  fs.mkdirSync(uploadsDir, { recursive: true });
};

export const uploadFile = asyncHandler(async (req, res) => {
  const file = req.file;
  const resourceType = req.body.resourceType === 'video' ? 'video' : 'image';
  const allowedMimeTypes =
    resourceType === 'video'
      ? new Set(['video/mp4', 'video/webm', 'video/quicktime'])
      : new Set(['image/jpeg', 'image/png']);

  if (!file) {
    return res.status(400).json({
      message: 'File is required',
      code: 'FILE_REQUIRED'
    });
  }

  console.log('[upload] incoming file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    resourceType
  });

  if (!allowedMimeTypes.has(file.mimetype)) {
    if (file?.path) {
      try {
        fs.unlinkSync(file.path);
      } catch {
        // ignore cleanup errors
      }
    }

    return res.status(400).json({
      message: resourceType === 'video'
        ? 'Only MP4, WebM, and MOV videos are allowed'
        : 'Only JPG and PNG images are allowed',
      code: 'INVALID_FILE_TYPE'
    });
  }

  try {
    ensureUploadsDir();
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    console.log('[upload] success:', {
      filename: file.filename,
      publicUrl,
      resourceType
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      data: {
        url: publicUrl,
        secureUrl: publicUrl,
        filename: file.filename,
        mimetype: file.mimetype,
        resourceType
      }
    });
  } catch (error) {
    console.error('[upload] failed:', error);
    if (file?.path) {
      try {
        fs.unlinkSync(file.path);
      } catch {
        // ignore cleanup errors
      }
    }
    res.status(500).json({
      message: 'Upload failed',
      code: 'UPLOAD_FAILED'
    });
  }
});
