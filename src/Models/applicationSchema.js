import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: [true, 'An application must belong to a job.'],
    },
    applicantId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An application must belong to an applicant.'],
    },
    resume: String,
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
//1. user applies job/jobId/apply
//=> get user id from logged use(req.user._id)
//=> get job id from req.params.jobId
