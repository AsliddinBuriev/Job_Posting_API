import bcrypt from 'bcryptjs';
import e from 'express';
import mongoose from 'mongoose';
import validator from 'validator';
const userSchema = new mongoose.Schema({
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
  //check if the password and passwordConfirm are equal
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
  lastPwChanged: Date,
});

//bcrypt password
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//isPasswordCorrect
userSchema.methods.isPasswordCorrect = async (candidatePw, userPw) =>
  await bcrypt.compare(candidatePw, userPw);

//isPaswordChanged
userSchema.methods.isPasswordChanged = function (iat) {
  if (this.lastPwChanged)
    return iat < parseInt(Date.parse(this.lastPwChanged) / 1000, 10);

  return false;
};

export default mongoose.model('User', userSchema);
