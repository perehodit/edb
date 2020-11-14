import mongoose from 'mongoose';

const Slide = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model('slides', Slide);
