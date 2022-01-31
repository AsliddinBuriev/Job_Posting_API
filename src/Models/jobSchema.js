import mongoose from 'mongoose';
import Application from './applicationSchema.js';
import { deleteFileFromS3 } from '../utils/fileUpload.js';
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'A post should include the company name!'],
    },
    logo: {
      type: String,
      default:
        'https://dev-jobs-api.s3.ap-northeast-2.amazonaws.com/job/default-logo.jpeg',
    },
    position: {
      type: String,
      required: [true, 'A job must have a position!'],
    },
    postedAt: {
      type: Date,
      default: Date.now(),
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A job must have a creator!'],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);
//mongoose virtual => get applicants
jobSchema.virtual('applicants', {
  ref: 'Application',
  foreignField: 'jobId',
  localField: '_id',
});

//delete applicants, s3 logo, before deleting job
jobSchema.post(/delete/gi, async function (doc) {
  await Application.deleteMany({ job: doc._id });
  if (!doc.logo.endsWith('default-logo.jpeg'))
    await deleteFileFromS3({
      Objects: [{ Key: `job/logo-${doc._id}` }],
      Quiet: false,
    });
});

export default mongoose.model('Job', jobSchema);
