import { Router } from "express";
import { ApplicationController } from "./application.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ApplicationValidation } from "./application.validation";
import { auth } from "../../middlewares/auth";

const router = Router();

// Submit application (public)
router.post(
  "/",
  validateRequest(ApplicationValidation.createApplicationValidation),
  ApplicationController.createApplication,
);

// Get all applications (admin)
router.get("/", auth("admin"), ApplicationController.getAllApplications);

// Get applications for a specific job (admin)
router.get(
  "/job/:jobId",
  auth("admin"),
  ApplicationController.getApplicationsByJobId,
);

export const ApplicationRoutes = router;
