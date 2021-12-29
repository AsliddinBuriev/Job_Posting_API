import express from "express";
import { postJob } from "../Controllers/jobController.js";

const router = express.Router()

router
  .route('/')
  .post(postJob)


export default router
