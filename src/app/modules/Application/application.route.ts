import { Router } from "express";
import { ApplicationController } from "./application.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ApplicationValidation } from "./application.validation";

const router = Router();

// Submit application (public)
router.post(
  "/",
  validateRequest(ApplicationValidation.createApplicationValidation),
  ApplicationController.createApplication,
);

// Get all applications (admin)
router.get("/", ApplicationController.getAllApplications);

// Get applications for a specific job (admin)
router.get("/job/:jobId", ApplicationController.getApplicationsByJobId);

export const ApplicationRoutes = router;
