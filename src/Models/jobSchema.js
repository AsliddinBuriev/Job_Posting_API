import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'A post should include the company name!'],
    },
    logo: String,
    position: {
      type: String,
      required: [true, 'A job must have a position!'],
    },
    postedAt: {
      type: Date,
      default: Date.now(),
    },
    closeAt: {
      type: Date,
      required: [true, 'A post must have closing date!'],
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A job must have a creator!'],
      select: false,
    },
    applicants: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
      ],
      select: false,
    },
    contract: {
      type: String,
      required: [true, 'A job must have contract type.'],
    },
    location: {
      type: String,
      required: [true, 'A job must have a location.'],
    },
    website: String,
    description: String,
    requirements: Object,
    role: Object,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

export default mongoose.model('Job', jobSchema);
