import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';
import { deleteCloudinaryAsset } from '../services/cloudinaryService.js';

const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args);
};

function normalizeService(payload = {}) {
  return {
    title: payload.title ?? payload.serviceName ?? '',
    description: payload.description ?? payload.shortDescription ?? '',
    icon: payload.icon || 'briefcase',
    imageUrl: payload.imageUrl || payload.image || '',
    imagePublicId: payload.imagePublicId || payload.image_public_id || '',
    displayOrder: Number(payload.displayOrder ?? 0),
    status: payload.status === 'Inactive' ? 'Inactive' : 'Active',
    benefits: Array.isArray(payload.benefits)
      ? payload.benefits
      : String(payload.benefits || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
    featured: Boolean(payload.featured)
  };
}

function validateService(payload) {
  if (!payload.title || String(payload.title).trim().length < 3) return 'Service title is required';
  return '';
}

export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
  res.json({ data: services });
});

export const getPublicServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ status: 'Active' }).sort({ displayOrder: 1, createdAt: -1 });
  res.json({ data: services });
});

export const createService = asyncHandler(async (req, res) => {
  const payload = normalizeService(req.body);
  const message = validateService(payload);
  if (message) return res.status(400).json({ message });
  const service = await Service.create(payload);
  res.status(201).json({ data: service });
});

export const updateService = asyncHandler(async (req, res) => {
  const existing = await Service.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Service not found' });
  }
  const payload = normalizeService(req.body);
  const message = validateService(payload);
  if (message) return res.status(400).json({ message });

  if (existing.imagePublicId && payload.imagePublicId && existing.imagePublicId !== payload.imagePublicId) {
    try {
      devLog('[service] deleting previous Cloudinary asset:', existing.imagePublicId);
      await deleteCloudinaryAsset(existing.imagePublicId, 'image');
      devLog('[service] deleted previous Cloudinary asset:', existing.imagePublicId);
    } catch (error) {
      console.error('[service] failed to delete previous Cloudinary asset:', existing.imagePublicId, error);
    }
  }
  const service = await Service.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  res.json({ data: service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  res.json({ message: 'Deleted' });
});
