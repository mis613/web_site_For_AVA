import asyncHandler from 'express-async-handler';
import TeamMember from '../models/TeamMember.js';
import { deleteCloudinaryAsset } from '../services/cloudinaryService.js';

const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args);
};

function normalizeTeamMember(payload = {}) {
  return {
    name: payload.name?.trim() || '',
    designation: payload.designation?.trim() || '',
    qualification: payload.qualification?.trim() || '',
    experience: payload.experience?.trim() || '',
    photo: payload.photo || '',
    photoPublicId: payload.photoPublicId || '',
    displayOrder: Number(payload.displayOrder ?? 0),
    status: payload.status === 'Inactive' ? 'Inactive' : 'Active',
    expertise: payload.expertise?.trim() || '',
    bio: payload.bio?.trim() || ''
  };
}

function validateTeamMember(payload) {
  if (!payload.name || String(payload.name).trim().length < 2) return 'Name is required';
  if (!payload.designation || String(payload.designation).trim().length < 2) return 'Designation is required';
  if (!payload.photo) return 'Profile Image is required';
  return '';
}

export const getTeam = asyncHandler(async (req, res) => {
  const team = await TeamMember.find().sort({ displayOrder: 1, createdAt: -1 });
  res.json({ data: team });
});

export const getPublicTeam = asyncHandler(async (req, res) => {
  const team = await TeamMember.find({ status: 'Active' }).sort({ displayOrder: 1, createdAt: -1 });
  res.json({ data: team });
});

export const createTeamMember = asyncHandler(async (req, res) => {
  const payload = normalizeTeamMember(req.body);
  const message = validateTeamMember(payload);
  if (message) return res.status(400).json({ message });
  const member = await TeamMember.create(payload);
  res.status(201).json({ data: member });
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const existing = await TeamMember.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Team member not found' });
  }
  const payload = normalizeTeamMember(req.body);
  const message = validateTeamMember(payload);
  if (message) return res.status(400).json({ message });

  if (existing.photoPublicId && payload.photoPublicId && existing.photoPublicId !== payload.photoPublicId) {
    try {
      devLog('[team] deleting previous Cloudinary asset:', existing.photoPublicId);
      await deleteCloudinaryAsset(existing.photoPublicId, 'image');
      devLog('[team] deleted previous Cloudinary asset:', existing.photoPublicId);
    } catch (error) {
      console.error('[team] failed to delete previous Cloudinary asset:', existing.photoPublicId, error);
    }
  }

  const member = await TeamMember.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  res.json({ data: member });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ message: 'Team member not found' });
  }
  if (member.photoPublicId) {
    try {
      devLog('[team] deleting Cloudinary asset on delete:', member.photoPublicId);
      await deleteCloudinaryAsset(member.photoPublicId, 'image');
      devLog('[team] deleted Cloudinary asset on delete:', member.photoPublicId);
    } catch (error) {
      console.error('[team] failed to delete Cloudinary asset on delete:', member.photoPublicId, error);
    }
  }
  await TeamMember.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
