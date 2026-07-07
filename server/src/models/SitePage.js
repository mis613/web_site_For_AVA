import mongoose from 'mongoose';

const sitePageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    body: { type: String, default: '' },
    secondaryBody: { type: String, default: '' },
    heroImageUrl: { type: String, default: '' },
    heroImagePublicId: { type: String, default: '' },
    sectionImageUrl: { type: String, default: '' },
    sectionImagePublicId: { type: String, default: '' },
    jsonData: { type: String, default: '[]' },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('SitePage', sitePageSchema);
