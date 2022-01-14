import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: [true, 'An application must belong to a job.'],
    },
    applicant: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An application must belong to an applicant.'],
    },
    appliedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

export default mongoose.model('Application', applicationSchema);
