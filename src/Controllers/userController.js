import catchAsyncErr from '../utils/catchAsyncErr.js';
import MakeError from '../utils/MakeError.js';
import User from './../Models/userSchema.js';
import Application from './../Models/applicationSchema.js';
import sendResponse from '../utils/sendResponse.js';

/******** GET USER PROFILE *******/
export const getUserProfile = catchAsyncErr(async (req, res, next) => {
  //get current user
  const user = await User.findOne({ name: req.params.userId });
  if (!user) return next(new MakeError('Requested user does not exist!'));
  //send response
  sendResponse(res, 200, user);
});

/******** GET PERSONAL ACCOUNT *******/
export const getMyPersonalAccount = catchAsyncErr(async (req, res, next) => {
  //1.find current user by id && populate postedjobs
  let user = await User.findById(req.user._id).populate('postedJobs');
  user = JSON.stringify(user);
  user = JSON.parse(user);
  user.appliedJobs = await Application.find({
    applicant: req.user._id,
  })
    .populate('job')
    .select('-_id -applicant -__v');

  //send response
  sendResponse(res, 200, user);
});

/******** UPDATE PERSONAL ACCOUNT *******/
export const editMyProfile = catchAsyncErr(async (req, res, next) => {
  //1. filter before update
  const dataToUpdate = (objToFilter, ...allowedFields) => {
    const filteredObj = {};
    allowedFields.forEach((el) => {
      if (objToFilter[el]) filteredObj[el] = objToFilter[el];
    });
    return filteredObj;
  };
  //2. update user data
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    dataToUpdate(req.body, 'name', 'email'),
    { new: true, runValidators: true }
  );
  //send response
  sendResponse(res, 200, updatedUser);
});

/******** DELETE PERSONAL ACCOUNT  *******/
export const deleteMyAccount = catchAsyncErr(async (req, res, next) => {
  //1. find and delete user
  await User.findByIdAndDelete(req.user._id);
  //send response
  sendResponse(res, 204);
});
