import asyncHandler from 'express-async-handler';
import Media from '../models/Media.js';
import { uploadBuffer } from '../services/cloudinaryService.js';

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
      const result = await uploadBuffer({
        buffer: file.buffer,
        resourceType: 'video',
        folder: 'ava/homepage-videos'
      });

    console.log('[home-video upload] success:', {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      resourceType: result.resource_type
    });

    console.log('[home-video upload] persisting uploaded URL to database:', {
      videoUrl: result.secure_url,
      publicId: result.public_id
    });

    const savedMedia = await Media.findOneAndUpdate(
      { type: 'home_video' },
      {
        type: 'home_video',
        videoUrl: result.secure_url,
        publicId: result.public_id,
        videoPublicId: result.public_id,
        resourceType: result.resource_type || 'video'
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    console.log('[home-video upload] database save complete:', {
      videoUrl: savedMedia.videoUrl,
      publicId: savedMedia.publicId || '',
      updatedAt: savedMedia.updatedAt
    });

    res.status(201).json({
      success: true,
      url: result.secure_url,
      videoUrl: result.secure_url,
      publicId: result.public_id,
      videoPublicId: result.public_id,
      resourceType: result.resource_type,
      secureUrl: result.secure_url,
      data: {
        videoUrl: savedMedia.videoUrl,
        publicId: savedMedia.publicId || '',
        secureUrl: result.secure_url,
        updatedAt: savedMedia.updatedAt
      }
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
