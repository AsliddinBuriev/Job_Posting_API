import { Router } from 'express';
import { protect } from '../Controllers/authController.js';
import { applyForJob } from '../Controllers/applicationController.js';

const router = Router({ mergeParams: true });

//apply for a job route

router.post('/', protect, applyForJob);

export default router;
