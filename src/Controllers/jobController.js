import catchAsyncErr from '../utils/catchAsyncErr.js';
import MakeError from '../utils/MakeError.js';
import Job from './../Models/jobSchema.js';
import Application from './../Models/applicationSchema.js';
import Query from '../utils/query.js';
import sendResponse from '../utils/sendResponse.js';
/******** GET ALL JOBS *******/
export const getAllJobs = catchAsyncErr(async (req, res, next) => {
  const features = new Query(Job.find(), req.query)
    .filter()
    .sort()
    .select()
    .load();
  const jobs = await features.query;

  //send response
  sendResponse(res, 200, jobs);
});

/******** GET A JOB *******/
export const getAJob = catchAsyncErr(async (req, res, next) => {
  let job = await Job.findById(req.params.jobId);
  //1.check if the job exists
  if (!job) return next(new MakeError('The job does not exist!', 404));
  job = { ...job._doc };
  //2. find application for the job
  job.applications = await Application.find({
    job: req.params.jobId,
  })
    .populate('applicant')
    .select('-_id -job -__v');

  //send response
  sendResponse(res, 200, job);
});

/******** POST A JOB *******/
export const postJob = catchAsyncErr(async (req, res, next) => {
  req.body.postedBy = req.user._id;
  const newJob = await Job.create(req.body);

  //send response
  sendResponse(res, 201, newJob);
});

/******** GET MY POSTED JOBS *******/
export const getMyPostedJobs = (req, res, next) => {
  req.query.postedBy = req.user._id;
  next();
};

/******** RESTRICT ACCESS TO...*******/
export const restrict = catchAsyncErr(async (req, res, next) => {
  const job = await Job.findById(req.params.jobId);
  //check if job exists
  if (!job) return next(new MakeError('The job does not exist!', 404));
  //check if the posted by current user
  if (job.postedBy.toString() !== req.user._id.toString())
    return next(new MakeError('You do not have access to this route!', 403));
  next();
});

/******** UPDATE A JOB  *******/
export const updateAJob = catchAsyncErr(async (req, res, next) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
    new: true,
    runValidators: true,
  });

  //send response
  sendResponse(res, 200, updatedJob);
});
/******** DELETE A JOB *******/
export const deleteAJob = catchAsyncErr(async (req, res, next) => {
  await Job.findByIdAndDelete(req.params.jobId);

  //send response
  sendResponse(res, 200);
});
