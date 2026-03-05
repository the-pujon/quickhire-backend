import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Job } from "../Job/job.model";
import { Application } from "./application.model";

const createApplication = async (payload: {
  jobId: string;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
}) => {
  // Verify job exists
  const job = await Job.findById(payload.jobId);
  if (!job) {
    throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  }

  // Check for duplicate application (same email + same job)
  const existingApplication = await Application.findOne({
    jobId: payload.jobId,
    email: payload.email,
  });

  if (existingApplication) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already applied for this job",
    );
  }

  const application = await Application.create(payload);
  return application;
};

const getApplicationsByJobId = async (jobId: string) => {
  const applications = await Application.find({ jobId })
    .sort({ createdAt: -1 })
    .lean();

  return applications;
};

const getAllApplications = async () => {
  const applications = await Application.find()
    .populate("jobId", "title company location")
    .sort({ createdAt: -1 })
    .lean();

  return applications;
};

export const ApplicationService = {
  createApplication,
  getApplicationsByJobId,
  getAllApplications,
};
