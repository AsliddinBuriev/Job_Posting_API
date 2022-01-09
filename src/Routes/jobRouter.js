import { Router } from 'express';
import { protect } from '../Controllers/authController.js';
import {
  callNextRoute,
  deleteAJob,
  getAJob,
  getAllJobs,
  getMyPostedJobs,
  postJob,
  restrict,
  updateAJob,
} from '../Controllers/jobController.js';

const router = Router({ mergeParams: true });
//unprotected routes
router.route('/').get(callNextRoute, getAllJobs).post(protect, postJob);
router.route('/:jobId').get(callNextRoute, getAJob);

//protected routes
router.get('/', protect, getMyPostedJobs, getAllJobs);
router.use('/:jobId', protect, restrict);

router.route('/:jobId').get(getAJob).patch(updateAJob).delete(deleteAJob);
export default router;
