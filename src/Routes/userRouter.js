import { Router } from "express";
import { login, signup } from "../Controllers/authController.js";
import { getAllUsers } from "../Controllers/userController.js";
const router = Router()


//sign up route 
router.route('/signup').post(signup)

//log in route 
router.route('/login').post(login)
export default router

router.route('/').get(getAllUsers)