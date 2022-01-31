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
  getMyPersonalAccount,
  getUserProfile,
  multipleFileUpload,
} from '../Controllers/userController.js';
import {
  deleteAJob,
  getAJob,
  getAllJobs,
  getMyPostedJobs,
  restrict,
  updateAJob,
  singleFileUpload,
} from '../Controllers/jobController.js';

const router = Router();

//nested routes => user/poseted-jobs
router.get('/posted-jobs', protect, getMyPostedJobs, getAllJobs);
router.use('/posted-jobs/:jobId', protect, restrict);
router
  .route('/posted-jobs/:jobId')
  .get(getAJob)
  .patch(singleFileUpload, updateAJob)
  .delete(deleteAJob);

//sign up route
router.post('/signup', signup);

router.post('/login', login);

//forget password
router.post('/forgot-password', forgotPassword);

//reset password
router.patch('/reset-password/:token', resetPassword);

//update password
router.patch('/update-password', protect, updateMyPassword);

//protected routes => user account
router.use('/account', protect);
router
  .route('/account')
  .get(getMyPersonalAccount)
  .patch(multipleFileUpload, editMyProfile)
  .delete(deleteMyAccount);

//get public profile
router.get('/:userId', getUserProfile);

export default router;
