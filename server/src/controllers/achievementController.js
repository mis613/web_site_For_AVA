import asyncHandler from 'express-async-handler';
import Achievement from '../models/Achievement.js';

function normalizeAchievement(payload = {}) {
  return {
    title: payload.title?.trim() || '',
    description: payload.description?.trim() || '',
    image: payload.image || payload.achievementImage || '',
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
  const payload = normalizeAchievement(req.body);
  if (!payload.title || !payload.description || !payload.year) {
    return res.status(400).json({ message: 'Title, Description, and Year are required' });
  }
  const achievement = await Achievement.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!achievement) {
    return res.status(404).json({ message: 'Achievement not found' });
  }

  res.json({ data: achievement });
});

export const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findByIdAndDelete(req.params.id);

  if (!achievement) {
    return res.status(404).json({ message: 'Achievement not found' });
  }

  res.json({ message: 'Deleted' });
});
