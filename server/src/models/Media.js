import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true },
    videoUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);

