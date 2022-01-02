import catchAsyncErr from "../utils/catchAsyncErr.js";
import Query from "../utils/query.js";
import Job from "./../Models/jobSchema.js";
/******** GET ALL JOBS *******/
export const getAllJobs = catchAsyncErr(async (req, res, next) => {
		const features = new Query(Job.find(), req.query)
			.filter()
			.sort()
			.select()
			.load()
		const jobs = await features.query
		res.status(200).json({
			status: 'success',
			result: jobs.length,
			jobs
		})
});
/******** DELETE ALL JOBS *******/
export const deleteAllJobs = catchAsyncErr(async (req, res, next)=>{
		await Job.deleteMany()
		res.status('200').json({
			status: 'success',
			message: 'You successfully posted the job!',
		});
})

/******** POST A JOB *******/
export const postJob = catchAsyncErr(async (req, res, next) => {
		await Job.create(req.body)
		res.status('200').json({
			status: 'success',
			message: 'You successfully posted the job!',
		})	
});

/******** GET A JOB *******/
export const getAJob = catchAsyncErr(async (req, res, next)=>{
		const job = await Job.findById(req.params.id)
		res.status('200').json({
			status: 'success',
			job
		});
})
/******** UPDATE A JOB  *******/
export const updateAJob = catchAsyncErr(async (req, res, next)=>{
		const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})
		res.status('200').json({
			status: 'success',
			updatedJob
		});
})
/******** DELETE A JOB *******/
export const deleteAJob = catchAsyncErr(async (req, res, next)=>{
		await Job.findByIdAndDelete(req.params.id)
		res.status('200').json({
			status: 'success',
			message: 'You successfully deleted the job!',
		});
})