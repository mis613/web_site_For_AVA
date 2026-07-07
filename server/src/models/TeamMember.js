import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  qualification: { type: String, default: '', trim: true },
  experience: { type: String, default: '', trim: true },
  photo: { type: String, required: true },
  photoPublicId: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  expertise: { type: String, default: '', trim: true },
  bio: { type: String, default: '', trim: true }
}, { timestamps: true });

export default mongoose.model('TeamMember', teamMemberSchema);
