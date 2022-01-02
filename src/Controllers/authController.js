import catchAsyncErr from '../utils/catchAsyncErr.js';
import User from './../Models/userSchema.js';
import { sign, verify } from '../utils/jwt.js';
import MakeError from './../utils/MakeError.js';

/******** SIGN UP *******/
export const signup = catchAsyncErr(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    lastPwChanged: req.body.lastPwChanged,
  });
  //create token
  const token = await sign({ id: newUser._id });
  //send response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

/********  LOG IN *******/
export const login = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body;
  //1. check if the password and email is posted
  if (!email || !password)
    return next(new MakeError('Please provide your email and password!', 400));

  //2. check if the user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return next(new MakeError('Email or password is wrong!', 401));

  //3. create token
  const token = await sign({ id: user._id });
  //4. send response
  res.status(201).json({
    status: 'success',
    token,
  });
});

/******** PROTECT *******/
export const protect = catchAsyncErr(async (req, res, next) => {
  //1.check if token exists in req.headers
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer'))
    token = authorization.split(' ')[1];
  if (!token) next(new MakeError('You are not logged in.', 401));

  //2. verify jwt token
  const decoded = await verify(token);

  //3. check if user still exists
  const loggedUser = await User.findById(decoded.id);
  if (!loggedUser)
    return next(new MakeError('The user no longer exists.', 401));

  //4. check if the user changed password
  if (loggedUser.isPasswordChanged(decoded.iat))
    return next(
      new MakeError('Password has been changed. Please log in again.', 401)
    );
  req.user = loggedUser;
  next();
});
