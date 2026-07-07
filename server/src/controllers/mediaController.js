import asyncHandler from 'express-async-handler';
import Media from '../models/Media.js';
import { deleteCloudinaryAsset } from '../services/cloudinaryService.js';

const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args);
};

export const getHomeVideo = asyncHandler(async (req, res) => {
  const media = await Media.findOne({ type: 'home_video' }).lean();

  if (!media) {
    return res.status(404).json({
      message: 'Home video is not configured in the media collection',
      code: 'HOME_VIDEO_NOT_CONFIGURED'
    });
  }

  devLog('[home-video] get response:', {
    videoUrl: media.videoUrl,
    publicId: media.publicId || '',
    updatedAt: media.updatedAt
  });

  res.set('Cache-Control', 'no-store');
  res.json({
    videoUrl: media.videoUrl,
    publicId: media.publicId || '',
    videoPublicId: media.videoPublicId || media.publicId || '',
    secureUrl: media.videoUrl,
    updatedAt: media.updatedAt
  });
});

export const upsertHomeVideo = asyncHandler(async (req, res) => {
  const videoUrl = req.body.videoUrl || req.body.secureUrl || req.body.url || '';
  const publicId = req.body.publicId || req.body.public_id || '';

  if (!videoUrl) {
    return res.status(400).json({
      message: 'videoUrl is required',
      code: 'VIDEO_URL_REQUIRED'
    });
  }

  const existing = await Media.findOne({ type: 'home_video' }).lean();

  if (existing?.publicId && publicId && existing.publicId !== publicId) {
    try {
      devLog('[home-video] deleting previous Cloudinary asset:', existing.publicId);
      await deleteCloudinaryAsset(existing.publicId, 'video');
      devLog('[home-video] deleted previous Cloudinary asset:', existing.publicId);
    } catch (error) {
      console.error('[home-video] failed to delete previous Cloudinary asset:', existing.publicId, error);
    }
  }

  devLog('[home-video] saving payload:', {
    videoUrl,
    publicId,
    existingVideoUrl: existing?.videoUrl || '',
    existingPublicId: existing?.publicId || ''
  });

  const media = await Media.findOneAndUpdate(
    { type: 'home_video' },
    {
      type: 'home_video',
      videoUrl,
      publicId: publicId || existing?.publicId || '',
      videoPublicId: publicId || existing?.videoPublicId || existing?.publicId || '',
      resourceType: 'video'
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  devLog('[home-video] saved media:', {
    videoUrl: media.videoUrl,
    publicId: media.publicId || '',
    updatedAt: media.updatedAt
  });

  res.status(200).json({
    message: 'Home video saved successfully',
    data: {
      videoUrl: media.videoUrl,
      publicId: media.publicId || '',
      videoPublicId: media.videoPublicId || media.publicId || '',
      secureUrl: media.videoUrl,
      updatedAt: media.updatedAt
    }
  });
});
