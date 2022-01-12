import catchAsyncErr from '../utils/catchAsyncErr.js';
import MakeError from '../utils/MakeError.js';
import User from './../Models/userSchema.js';

/******** GET USER PROFILE *******/
export const getUserProfile = catchAsyncErr(async (req, res, next) => {
  //get current user
  const user = await User.findOne({ name: req.params.username });
  res.status(200).json({
    status: 'success',
    message: 'Successfully got your account data!',
    data: { user },
  });
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
  res.status(200).json({
    status: 'success',
    message: 'Successfully updated you account!',
    data: { updatedUser },
  });
});

/******** DELETE PERSONAL ACCOUNT  *******/
export const deleteMyAccount = catchAsyncErr(async (req, res, next) => {
  //1. find and delete user
  await User.findByIdAndDelete(req.user._id);
  res.status(204).json({
    status: 'success',
    message: 'Successfully deleted your account!',
  });
});
