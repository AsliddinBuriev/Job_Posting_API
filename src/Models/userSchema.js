import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    resume: {
      type: String,
      // required: [true, 'A user must have a resume']
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password must be confirmed'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'The passwords are not the same!',
      },
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

//mongoose virtual => gets appliedJobs field from child document

//mongoose middleware => bcrypt password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//mongoose middleware => update lastPwChanged value
userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew)
    this.lastPwChanged = Date.now();
  next();
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
