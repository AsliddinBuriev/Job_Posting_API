import catchAsyncErr from '../utils/catchAsyncErr.js';
import MakeError from '../utils/MakeError.js';
import Application from './../Models/applicationSchema.js';
import Job from './../Models/jobSchema.js';

/******** APPLY FOR A JOB  *******/
export const applyForJob = catchAsyncErr(async (req, res, next) => {
  //check if the job exists
  const job = await Job.findById(req.params.jobId);
  if (!job)
    return next(new MakeError('The you want to apply does not exist!', 400));
  if (job.closeAt < Date.now())
    return next(
      new MakeError('Application period for this job is closed!', 400)
    );
  req.body.jobId = req.params.jobId;
  req.body.applicantId = req.user._id;
  const application = await Application.create(req.body);
  res.status('200').json({
    status: 'success',
    message: 'You successfully applied for the job!',
    data: null,
  });
});

/******** GET APPLICATIONS *******/
export const getApplicants = catchAsyncErr(async (req, res, next) => {
  const applications = await Application.find({
    jobId: req.params.jobId,
  })
    .populate('applicantId')
    .select('-_id -jobId -__v');
  res.status(200).json({
    status: 'success',
    message: 'You successfully got list of applicants for the job.',
    data: { applications },
  });
});

/******** GET APPLIED JOBS *******/
