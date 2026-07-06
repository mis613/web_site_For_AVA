import asyncHandler from 'express-async-handler';
import ContactInquiry from '../models/ContactInquiry.js';

function validateContact(payload) {
  if (!payload.name || String(payload.name).trim().length < 2) return 'Name is required';
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) return 'Valid email is required';
  if (!payload.message || String(payload.message).trim().length < 10) return 'Message must be at least 10 characters';
  if (String(payload.phone || '').trim().length > 0 && String(payload.phone).replace(/[^\d+()-\s]/g, '').length < 7) return 'Valid phone number is required';
  return '';
}

export const submitContact = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone || req.body.mobile || '',
    subject: req.body.subject || '',
    message: req.body.message,
    status: 'new'
  };
  const message = validateContact(payload);
  if (message) return res.status(400).json({ message });
  const inquiry = await ContactInquiry.create(payload);
  res.status(201).json({ data: inquiry, message: 'Inquiry saved' });
});

export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await ContactInquiry.find().sort({ createdAt: -1 });
  res.json({ data: contacts });
});

export const updateContact = asyncHandler(async (req, res) => {
  const inquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  res.json({ data: inquiry });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
  res.json({ message: 'Deleted' });
});
