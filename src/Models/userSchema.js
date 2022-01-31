import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import Application from './applicationSchema.js';
import Job from './jobSchema.js';
import { deleteFileFromS3 } from '../utils/fileUpload.js';
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'A user must have a  firstname'],
    },
    lastName: {
      type: String,
      required: [true, 'A user must have a last name'],
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    about: String,
    resume: {
      type: String,
    },
    photo: {
      type: String,
      default:
        'https://dev-jobs-api.s3.ap-northeast-2.amazonaws.com/user/images/avatar.jpeg',
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8,
      select: false,
    },
    lastPwChanged: {
      type: Date,
      select: false,
    },
    pwResetToken: String,
    pwResetTokenExpire: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);
//mongoose virtual => get postedJobs field from child document
userSchema.virtual('postedJobs', {
  ref: 'Job',
  foreignField: 'postedBy',
  localField: '_id',
});

//mongoose middleware => bcrypt password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//mongoose middleware => update lastPwChanged value
userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew)
    this.lastPwChanged = Date.now();
  next();
});
//delete applications, s3 photo, resume, and postedJobs before deleting user
userSchema.post(/delete/gi, async function (doc) {
  const postedJobs = await Job.find({ postedBy: doc._id });
  postedJobs.forEach(async (job) => {
    await Job.findByIdAndDelete(job._id);
  });
  await Application.deleteMany({ applicant: doc._id });
  await deleteFileFromS3({
    Objects: [
      { Key: `user/image/${doc._id}` },
      { Key: `user/resume/${doc._id}` },
    ],
    Quiet: false,
  });
});

//mongoose methods => isPasswordCorrect compare with bcrypt
userSchema.methods.isPasswordCorrect = async (candidatePw, userPw) =>
  await bcrypt.compare(candidatePw, userPw);

//mongoose methods => isPaswordChanged before log in
userSchema.methods.isPasswordChanged = function (iat) {
  //if password changed
  if (this.lastPwChanged)
    return iat < parseInt(Date.parse(this.lastPwChanged) / 1000, 10);
  //default
  return false;
};

//mongoose methods => generateResetPwToken
userSchema.methods.generateResetPwToken = async function () {
  //generate token
  const pwResetToken = await new Promise((res, rej) => {
    crypto.randomBytes(32, (err, buf) => {
      if (err) rej(err);
      res(buf.toString('hex'));
    });
  });
  //encrypt token
  this.pwResetToken = crypto
    .createHash('sha256')
    .update(pwResetToken)
    .digest('hex');
  this.pwResetTokenExpire = Date.now() + 10 * 60 * 1000;
  return pwResetToken;
};

export default mongoose.model('User', userSchema);
