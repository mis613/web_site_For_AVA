import asyncHandler from 'express-async-handler';
import SitePage from '../models/SitePage.js';

function normalizeSitePagePayload(payload = {}) {
  return {
    ...payload,
    slug: String(payload.slug || '').trim().toLowerCase(),
    eyebrow: String(payload.eyebrow || '').trim(),
    title: String(payload.title || '').trim(),
    subtitle: String(payload.subtitle || '').trim(),
    seoTitle: String(payload.seoTitle || '').trim(),
    seoDescription: String(payload.seoDescription || '').trim(),
    body: String(payload.body || '').trim(),
    secondaryBody: String(payload.secondaryBody || '').trim(),
    jsonData: String(payload.jsonData || '[]'),
    published: typeof payload.published === 'boolean' ? payload.published : String(payload.published).toLowerCase() === 'true'
  };
}

function validateSitePagePayload(payload) {
  if (!payload.slug) return 'Slug is required';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) return 'Slug may only contain lowercase letters, numbers, and hyphens';
  if (!payload.title) return 'Title is required';
  return '';
}

export const getSitePages = asyncHandler(async (req, res) => {
  const pages = await SitePage.find({ published: true }).sort({ slug: 1 });
  res.json({ data: pages });
});

export const getAllSitePages = asyncHandler(async (req, res) => {
  const pages = await SitePage.find().sort({ slug: 1 });
  res.json({ data: pages });
});

export const getSitePageBySlug = asyncHandler(async (req, res) => {
  const page = await SitePage.findOne({ slug: req.params.slug, published: true });
  if (!page) return res.status(404).json({ message: 'Page not found' });
  res.json({ data: page });
});

export const getSitePageBySlugAdmin = asyncHandler(async (req, res) => {
  const page = await SitePage.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ message: 'Page not found' });
  res.json({ data: page });
});

export const upsertSitePageBySlugAdmin = (slug) => asyncHandler(async (req, res) => {
  const payload = normalizeSitePagePayload({ ...req.body, slug });
  const message = validateSitePagePayload(payload);
  if (message) return res.status(400).json({ message });
  if (!(await ensureSitePageSlugAvailable(payload.slug, req.params.id || null))) {
    const existing = await SitePage.findOne({ slug });
    if (existing && String(existing._id) !== String(req.params.id || existing._id)) {
      return res.status(400).json({ message: 'Slug already exists' });
    }
  }

  const page = await SitePage.findOneAndUpdate(
    { slug },
    payload,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.json({ data: page });
});

async function ensureSitePageSlugAvailable(slug, excludeId = null) {
  const query = { slug };
  if (excludeId) query._id = { $ne: excludeId };
  const exists = await SitePage.exists(query);
  return !exists;
}

export const createSitePage = asyncHandler(async (req, res) => {
  const payload = normalizeSitePagePayload(req.body);
  const message = validateSitePagePayload(payload);
  if (message) return res.status(400).json({ message });
  if (!(await ensureSitePageSlugAvailable(payload.slug))) {
    return res.status(400).json({ message: 'Slug already exists' });
  }
  const page = await SitePage.create(payload);
  res.status(201).json({ data: page });
});

export const updateSitePage = asyncHandler(async (req, res) => {
  const payload = normalizeSitePagePayload(req.body);
  const message = validateSitePagePayload(payload);
  if (message) return res.status(400).json({ message });
  if (!(await ensureSitePageSlugAvailable(payload.slug, req.params.id))) {
    return res.status(400).json({ message: 'Slug already exists' });
  }
  const page = await SitePage.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!page) return res.status(404).json({ message: 'Page not found' });
  res.json({ data: page });
});

export const deleteSitePage = asyncHandler(async (req, res) => {
  await SitePage.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
