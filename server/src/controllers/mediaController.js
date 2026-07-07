import asyncHandler from 'express-async-handler';
import Media from '../models/Media.js';
import cloudinary from '../config/cloudinary.js';

export const getHomeVideo = asyncHandler(async (req, res) => {
  const media = await Media.findOne({ type: 'home_video' }).lean();

  if (!media) {
    return res.status(404).json({
      message: 'Home video is not configured in the media collection',
      code: 'HOME_VIDEO_NOT_CONFIGURED'
    });
  }

  res.json({ videoUrl: media.videoUrl, publicId: media.publicId || '' });
});

export const upsertHomeVideo = asyncHandler(async (req, res) => {
  const { videoUrl, publicId } = req.body;

  if (!videoUrl) {
    return res.status(400).json({
      message: 'videoUrl is required',
      code: 'VIDEO_URL_REQUIRED'
    });
  }

  const existing = await Media.findOne({ type: 'home_video' }).lean();

  if (existing?.publicId && publicId && existing.publicId !== publicId) {
    try {
      console.log('[home-video] deleting previous Cloudinary asset:', existing.publicId);
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'video' });
      console.log('[home-video] deleted previous Cloudinary asset:', existing.publicId);
    } catch (error) {
      console.error('[home-video] failed to delete previous Cloudinary asset:', existing.publicId, error);
    }
  }

  const media = await Media.findOneAndUpdate(
    { type: 'home_video' },
    {
      type: 'home_video',
      videoUrl,
      publicId: publicId || existing?.publicId || '',
      resourceType: 'video'
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  res.status(200).json({
    message: 'Home video saved successfully',
    data: media
  });
});
