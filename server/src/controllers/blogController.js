import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog.js';
import { sanitizeRichHtml } from '../utils/sanitizeHtml.js';
import { deleteCloudinaryAsset } from '../services/cloudinaryService.js';

const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args);
};

function normalizeBlogPayload(payload) {
  const next = { ...payload };
  next.title = String(next.title || '').trim();
  next.slug = String(next.slug || '').trim().toLowerCase();
  next.author = String(next.author || 'Editorial Team').trim() || 'Editorial Team';
  next.excerpt = String(next.excerpt || '').trim();
  next.content = sanitizeRichHtml(String(next.content || '').trim());
  next.category = String(next.category || '').trim();
  next.seoTitle = String(next.seoTitle || '').trim();
  next.seoDescription = String(next.seoDescription || '').trim();
  next.published = typeof next.published === 'boolean' ? next.published : String(next.published).toLowerCase() === 'true';
  next.status = next.published ? 'Published' : 'Draft';
  if (!next.featuredImage && next.coverImage) {
    next.featuredImage = next.coverImage;
  }
  if (!next.featuredImagePublicId && next.coverImagePublicId) {
    next.featuredImagePublicId = next.coverImagePublicId;
  }
  delete next.coverImage;
  delete next.coverImagePublicId;
  return next;
}

function validateBlogPayload(payload) {
  if (!payload.title) return 'Title is required';
  if (!payload.slug) return 'Slug is required';
  if (payload.title.length < 3) return 'Blog title must be at least 3 characters';
  if (payload.excerpt.length < 20) return 'Excerpt must be at least 20 characters';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) return 'Slug may only contain lowercase letters, numbers, and hyphens';
  if (!payload.excerpt) return 'Excerpt is required';
  if (!payload.content) return 'Content is required';
  return '';
}

export const getPublishedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
  res.json({ data: blogs });
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ data: blogs });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, published: true });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ data: blog });
});

async function ensureBlogSlugAvailable(slug, excludeId = null) {
  const query = { slug };
  if (excludeId) query._id = { $ne: excludeId };
  const exists = await Blog.exists(query);
  return !exists;
}

export const createBlog = asyncHandler(async (req, res) => {
  const payload = normalizeBlogPayload(req.body);
  const message = validateBlogPayload(payload);
  if (message) return res.status(400).json({ message });
  if (!(await ensureBlogSlugAvailable(payload.slug))) {
    return res.status(400).json({ message: 'Slug already exists' });
  }
  const blog = await Blog.create(payload);
  res.status(201).json({ data: blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const existing = await Blog.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Blog not found' });
  const payload = normalizeBlogPayload(req.body);
  const message = validateBlogPayload(payload);
  if (message) return res.status(400).json({ message });
  if (!(await ensureBlogSlugAvailable(payload.slug, req.params.id))) {
    return res.status(400).json({ message: 'Slug already exists' });
  }
  if (existing.featuredImagePublicId && payload.featuredImagePublicId && existing.featuredImagePublicId !== payload.featuredImagePublicId) {
    try {
      devLog('[blog] deleting previous Cloudinary asset:', existing.featuredImagePublicId);
      await deleteCloudinaryAsset(existing.featuredImagePublicId, 'image');
      devLog('[blog] deleted previous Cloudinary asset:', existing.featuredImagePublicId);
    } catch (error) {
      console.error('[blog] failed to delete previous Cloudinary asset:', existing.featuredImagePublicId, error);
    }
  }
  const blog = await Blog.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  res.json({ data: blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const existing = await Blog.findById(req.params.id);
  if (existing?.featuredImagePublicId) {
    try {
      devLog('[blog] deleting Cloudinary asset on delete:', existing.featuredImagePublicId);
      await deleteCloudinaryAsset(existing.featuredImagePublicId, 'image');
      devLog('[blog] deleted Cloudinary asset on delete:', existing.featuredImagePublicId);
    } catch (error) {
      console.error('[blog] failed to delete Cloudinary asset on delete:', existing.featuredImagePublicId, error);
    }
  }
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, published: true });

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  res.json({ data: blog });
});

export const getBlogByIdAdmin = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ data: blog });
});
