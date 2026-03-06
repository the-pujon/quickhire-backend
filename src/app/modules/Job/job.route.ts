import { Router } from "express";
import { JobController } from "./job.controller";
import validateRequest from "../../middlewares/validateRequest";
import { JobValidation } from "./job.validation";
import { auth } from "../../middlewares/auth";

const router = Router();

// Public routes
router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);

// Admin routes (no auth middleware for simplicity — can add later)
router.post(
  "/",
  auth("admin"),
  validateRequest(JobValidation.createJobValidation),
  JobController.createJob,
);
router.delete("/:id", auth("admin"), JobController.deleteJob);

export const JobRoutes = router;
