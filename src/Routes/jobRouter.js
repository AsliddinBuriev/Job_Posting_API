import express from "express";
import { protect } from "../Controllers/authController.js";
import {
  deleteAJob,
  deleteAllJobs,
  getAJob,
  getAllJobs,
  postJob,
  updateAJob,
} from "../Controllers/jobController.js";

const router = express.Router();

router.route("/").get(protect, getAllJobs).post(postJob).delete(deleteAllJobs);

router.route("/:id").get(getAJob).patch(updateAJob).delete(deleteAJob);
export default router;
