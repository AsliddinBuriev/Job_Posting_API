import catchAsyncErr from '../utils/catchAsyncErr.js';
import MakeError from '../utils/MakeError.js';
import Query from '../utils/query.js';
import Job from './../Models/jobSchema.js';
import User from './../Models/userSchema.js';

/******** GET ALL JOBS *******/
export const getAllJobs = catchAsyncErr(async (req, res, next) => {
  const features = new Query(Job.find(), req.query)
    .filter()
    .sort()
    .select()
    .load();
  const jobs = await features.query;
  res.status(200).json({
    status: 'success',
    message: 'You successfully got all the job!',
    result: jobs.length,
    data: { jobs },
  });
});

/******** CALL PROTECTED ROUTE *******/
export const callNextRoute = (req, res, next) => {
  if (req.baseUrl === '/api/v1/user/account/jobs') return next('route');
  next();
};

/******** RESTRICT  *******/
export const restrict = catchAsyncErr(async (req, res, next) => {
  //1. check if logged in user created the requested job
  const job = await Job.findById(req.params.jobId).select('+postedBy');
  if (!job) return next(new MakeError('The job does not exist!', 404));
  if (job.postedBy.toString() !== req.user._id.toString())
    return next(new MakeError('The job was not posted by you!', 403));
  next();
});
/******** GET MY POSTED JOBS *******/
export const getMyPostedJobs = (req, res, next) => {
  req.query.postedBy = req.user._id;
  next();
};

/******** POST A JOB *******/
export const postJob = catchAsyncErr(async (req, res, next) => {
  req.body.postedBy = req.user._id;
  const job = await Job.create(req.body);
  res.status('200').json({
    status: 'success',
    message: 'You successfully posted the job!',
    data: { job },
  });
});

/******** GET A JOB *******/
export const getAJob = catchAsyncErr(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return next(new MakeError('The does not exist!', 404));
  res.status('200').json({
    status: 'success',
    message: 'You successfully got the job!',
    data: { job },
  });
});

/******** UPDATE A JOB  *******/
export const updateAJob = catchAsyncErr(async (req, res, next) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status('200').json({
    status: 'success',
    updatedJob,
  });
});
/******** DELETE A JOB *******/
export const deleteAJob = catchAsyncErr(async (req, res, next) => {
  await Job.findByIdAndDelete(req.params.jobId);
  res.status('200').json({
    status: 'success',
    message: 'You successfully deleted the job!',
  });
});
