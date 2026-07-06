import asyncHandler from 'express-async-handler';
import TeamMember from '../models/TeamMember.js';

function normalizeTeamMember(payload = {}) {
  return {
    name: payload.name?.trim() || '',
    designation: payload.designation?.trim() || '',
    qualification: payload.qualification?.trim() || '',
    experience: payload.experience?.trim() || '',
    photo: payload.photo || '',
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
  const payload = normalizeTeamMember(req.body);
  const message = validateTeamMember(payload);
  if (message) return res.status(400).json({ message });
  const member = await TeamMember.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!member) {
    return res.status(404).json({ message: 'Team member not found' });
  }
  res.json({ data: member });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) {
    return res.status(404).json({ message: 'Team member not found' });
  }
  res.json({ message: 'Deleted' });
});
