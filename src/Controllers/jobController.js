import catchAsyncErr from '../utils/catchAsyncErr.js';
import MakeError from '../utils/MakeError.js';
import Job from './../Models/jobSchema.js';
import Application from './../Models/applicationSchema.js';
import Query from '../utils/query.js';
import sendResponse from '../utils/sendResponse.js';
import { multerFileUpload, uploadFileToS3 } from '../utils/fileUpload.js';
import sharp from 'sharp';

/******** GET ALL JOBS *******/
export const getAllJobs = catchAsyncErr(async (req, res, next) => {
	const features = new Query(Job.find(), req.query)
		.filter()
		.sort()
		.select()
		.load();
	const jobs = await features.query;
	sendResponse(res, { statusCode: 200, data: jobs, message: 'All jobs' });
});

/******** GET A JOB *******/
export const getAJob = catchAsyncErr(async (req, res, next) => {
	let job = await Job.findById(req.params.jobId);
	if (!job) return next(new MakeError('The job does not exist!', 404));
	job = { ...job._doc };
	//2. find application for the job
	job.applications = await Application.find({
		job: req.params.jobId,
	})
		.populate('applicant')
		.select('-_id -job -__v');
	//send response
	sendResponse(res, { statusCode: 200, data: job, message: 'Job' });
});

/******** UPLOAD FILE TO SERVER*******/
export const singleFileUpload = multerFileUpload.single('logo');

/******** POST A JOB *******/
export const postJob = catchAsyncErr(async (req, res, next) => {
	req.body.postedBy = req.user._id;
	let newJob = new Job(req.body);
	//save logo on s3 bucket
	if (req.file) {
		const image = await sharp(req.file.buffer).resize(500, 500).toBuffer();
		const storedLogo = await uploadFileToS3(
			image,
			`job/logo-${newJob._id}`
		);
		newJob.logo = storedLogo.Location;
	} else {
		newJob.logo =
			'https://dev-jobs-api.s3.ap-northeast-2.amazonaws.com/job/default-logo.jpeg';
	}
	newJob = await newJob.save();
	//send response
	sendResponse(res, {
		statusCode: 201,
		data: newJob,
		message: 'Job created!',
	});
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
		return next(
			new MakeError('You do not have access to this route!', 403)
		);
	next();
});

/******** UPDATE A JOB  *******/
export const updateAJob = catchAsyncErr(async (req, res, next) => {
	const job = await Job.findById(req.params.jobId);
	if (req.file) {
		const image = await sharp(req.file.buffer).resize(500, 500).toBuffer();
		const storedLogo = await uploadFileToS3(image, `job/logo-${job._id}`);
		req.body.logo = storedLogo.Location;
	}
	if (req.body.logo === 'undefined' || req.body.logo === 'null')
		req.body.logo =
			'https://dev-jobs-api.s3.ap-northeast-2.amazonaws.com/job/default-logo.jpeg';

	const fieldsToUpdate = Object.keys(req.body);
	fieldsToUpdate.forEach((el) => {
		job[el] = req.body[el];
	});
	if (req.body.logo === 'undefined' || req.body.logo === 'null')
		job.logo =
			'https://dev-jobs-api.s3.ap-northeast-2.amazonaws.com/job/default-logo.jpeg';
	const updatedJob = await job.save();
	//send response
	sendResponse(res, {
		statusCode: 200,
		data: updatedJob,
		message: 'Job updated!',
	});
});

/******** DELETE A JOB *******/
export const deleteAJob = catchAsyncErr(async (req, res, next) => {
	const deletedJob = await Job.findByIdAndDelete(req.params.jobId);
	sendResponse(res, { statusCode: 200, data: null, message: 'Job deleted!' });
});
