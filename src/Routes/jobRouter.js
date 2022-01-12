import { Router } from 'express';
import { protect } from '../Controllers/authController.js';
import applicationRouter from './applicationRouter.js';
import { getAJob, getAllJobs, postJob } from '../Controllers/jobController.js';

const router = Router({ mergeParams: true });

//if /:jobId/apply => direct to applicationRouter
router.use('/:jobId/apply', applicationRouter);

//unprotected routes
router.route('/').get(getAllJobs).post(protect, postJob);
router.route('/:jobId').get(getAJob);

export default router;
