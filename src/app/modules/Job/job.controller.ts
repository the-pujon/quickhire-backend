import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JobService } from "./job.service";
import queryFilter from "../../utils/queryFilter";

const createJob = catchAsync(async (req: Request, res: Response) => {
  const result = await JobService.createJob(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const filters = queryFilter(req.query, JobService.jobFilterableFields);
  const paginationOptions = queryFilter(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const result = await JobService.getAllJobs(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Jobs retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getJobById = catchAsync(async (req: Request, res: Response) => {
  const result = await JobService.getJobById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job retrieved successfully",
    data: result,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const result = await JobService.deleteJob(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job deleted successfully",
    data: result,
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
};
