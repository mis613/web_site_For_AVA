import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  author: { type: String, default: 'Editorial Team', trim: true },
  featuredImage: { type: String, default: '' },
  featuredImagePublicId: { type: String, default: '' },
  excerpt: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  category: { type: String, default: '', trim: true },
  tags: [{ type: String }],
  seoTitle: { type: String, default: '', trim: true },
  seoDescription: { type: String, default: '', trim: true },
  publishDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
