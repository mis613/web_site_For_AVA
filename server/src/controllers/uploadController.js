import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const allowedVideoMimeTypes = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

export const uploadHomeVideo = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'File is required',
      code: 'FILE_REQUIRED'
    });
  }

  console.log('[home-video upload] started:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  if (!allowedVideoMimeTypes.has(file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Only MP4, WebM, and MOV videos are allowed',
      code: 'INVALID_FILE_TYPE'
    });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'ava/homepage-videos'
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(uploadResult);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    console.log('[home-video upload] success:', {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      resourceType: result.resource_type
    });

    res.status(201).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      secureUrl: result.secure_url
    });
  } catch (error) {
    console.error('[home-video upload] failed:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary upload failed',
      code: 'UPLOAD_FAILED'
    });
  }
});
