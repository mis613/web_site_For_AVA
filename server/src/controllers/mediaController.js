import asyncHandler from 'express-async-handler';
import Media from '../models/Media.js';

export const getHomeVideo = asyncHandler(async (req, res) => {
  const media = await Media.findOne({ type: 'home_video' }).lean();

  if (!media) {
    return res.status(404).json({
      message: 'Home video is not configured in the media collection',
      code: 'HOME_VIDEO_NOT_CONFIGURED'
    });
  }

  res.json({ videoUrl: media.videoUrl });
});

export const upsertHomeVideo = asyncHandler(async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({
      message: 'videoUrl is required',
      code: 'VIDEO_URL_REQUIRED'
    });
  }

  const media = await Media.findOneAndUpdate(
    { type: 'home_video' },
    { type: 'home_video', videoUrl },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  res.status(200).json({
    message: 'Home video saved successfully',
    data: media
  });
});
