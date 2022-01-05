import { Router } from 'express';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from '../Controllers/authController.js';
import { getAllUsers } from '../Controllers/userController.js';
const router = Router();

//sign up route
router.post('/signup', signup);

//log in route
router.post('/login', login);

//update password
router.patch('/update-password', protect, updatePassword);

//forget password
router.post('/forgot-password', forgotPassword);

//reset password
router.patch('/reset-password/:token', resetPassword);

router.route('/').get(getAllUsers);
export default router;
