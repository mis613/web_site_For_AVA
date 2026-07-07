import asyncHandler from 'express-async-handler';
import Achievement from '../models/Achievement.js';
import { deleteCloudinaryAsset } from '../services/cloudinaryService.js';

const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args);
};

function normalizeAchievement(payload = {}) {
  return {
    title: payload.title?.trim() || '',
    description: payload.description?.trim() || '',
    image: payload.image || payload.achievementImage || '',
    imagePublicId: payload.imagePublicId || payload.achievementImagePublicId || '',
    year: Number(payload.year),
    displayOrder: Number(payload.displayOrder ?? 0),
    status: payload.status === 'Inactive' ? 'Inactive' : 'Active'
  };
}

export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find().sort({ displayOrder: 1, year: -1, createdAt: -1 });
  res.json({ data: achievements });
});

export const getPublicAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ status: 'Active' }).sort({ displayOrder: 1, year: -1, createdAt: -1 });
  res.json({ data: achievements });
});

export const createAchievement = asyncHandler(async (req, res) => {
  const payload = normalizeAchievement(req.body);
  if (!payload.title || !payload.description || !payload.year) {
    return res.status(400).json({ message: 'Title, Description, and Year are required' });
  }
  const achievement = await Achievement.create(payload);
  res.status(201).json({ data: achievement });
});

export const updateAchievement = asyncHandler(async (req, res) => {
  const existing = await Achievement.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Achievement not found' });
  }
  const payload = normalizeAchievement(req.body);
  if (!payload.title || !payload.description || !payload.year) {
    return res.status(400).json({ message: 'Title, Description, and Year are required' });
  }
  if (existing.imagePublicId && payload.imagePublicId && existing.imagePublicId !== payload.imagePublicId) {
    try {
      devLog('[achievement] deleting previous Cloudinary asset:', existing.imagePublicId);
      await deleteCloudinaryAsset(existing.imagePublicId, 'image');
      devLog('[achievement] deleted previous Cloudinary asset:', existing.imagePublicId);
    } catch (error) {
      console.error('[achievement] failed to delete previous Cloudinary asset:', existing.imagePublicId, error);
    }
  }
  const achievement = await Achievement.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  res.json({ data: achievement });
});

export const deleteAchievement = asyncHandler(async (req, res) => {
  const existing = await Achievement.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Achievement not found' });
  }
  if (existing.imagePublicId) {
    try {
      devLog('[achievement] deleting Cloudinary asset on delete:', existing.imagePublicId);
      await deleteCloudinaryAsset(existing.imagePublicId, 'image');
      devLog('[achievement] deleted Cloudinary asset on delete:', existing.imagePublicId);
    } catch (error) {
      console.error('[achievement] failed to delete Cloudinary asset on delete:', existing.imagePublicId, error);
    }
  }
  await Achievement.findByIdAndDelete(req.params.id);

  res.json({ message: 'Deleted' });
});
