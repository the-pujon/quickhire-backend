import { Router } from "express";
import { JobController } from "./job.controller";
import validateRequest from "../../middlewares/validateRequest";
import { JobValidation } from "./job.validation";

const router = Router();

// Public routes
router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);

// Admin routes (no auth middleware for simplicity — can add later)
router.post(
  "/",
  validateRequest(JobValidation.createJobValidation),
  JobController.createJob,
);
router.delete("/:id", JobController.deleteJob);

export const JobRoutes = router;
