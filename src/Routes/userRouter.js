import { Router } from 'express';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updateMyPassword,
} from '../Controllers/authController.js';
import {
  deleteMyAccount,
  editMyProfile,
  getUserProfile,
} from '../Controllers/userController.js';
import {
  deleteAJob,
  getAJob,
  getAllJobs,
  getMyPostedJobs,
  restrict,
  updateAJob,
} from '../Controllers/jobController.js';
import { getApplicants } from '../Controllers/applicationController.js';

const router = Router();

//nested routes => user/poseted-jobs
router.get('/posted-jobs', protect, getMyPostedJobs, getAllJobs);
router.use('/posted-jobs/:jobId', protect, restrict);
router
  .route('/posted-jobs/:jobId')
  .get(getAJob)
  .patch(updateAJob)
  .delete(deleteAJob);

router.get('/posted-jobs/:jobId/applications', getApplicants);

//applied jobs
// router.get('/applied-jobs', )

//sign up route
router.post('/signup', signup);

router.post('/login', login);

//forget password
router.post('/forgot-password', forgotPassword);

//reset password
router.patch('/reset-password/:token', resetPassword);

//update password
router.patch('/update-password', protect, updateMyPassword);

//get public profile
router.get('/:username', getUserProfile);

//protected routes => user account
router.use(protect);
router.route('/account').patch(editMyProfile).delete(deleteMyAccount);

export default router;
