import catchAsyncErr from "../utils/catchAsyncErr.js";
import User from "./../Models/userSchema.js";
export const getAllUsers = catchAsyncErr(async (req, res, next)=>{
  const users = await User.find()
  res.status(200).json({
    status: 'success',
    users
  })
})