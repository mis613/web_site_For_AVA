import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';

function normalizeService(payload = {}) {
  return {
    title: payload.title ?? payload.serviceName ?? '',
    description: payload.description ?? payload.shortDescription ?? '',
    icon: payload.icon || 'briefcase',
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
  const payload = normalizeService(req.body);
  const message = validateService(payload);
  if (message) return res.status(400).json({ message });
  const service = await Service.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  res.json({ data: service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  res.json({ message: 'Deleted' });
});
