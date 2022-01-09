import { Router } from 'express';
import jobRouter from './../Routes/jobRouter.js';
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
const router = Router();
//nested routes => redirect to jobRouter
router.use('/account/jobs', jobRouter);
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
