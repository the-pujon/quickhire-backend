import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ApplicationService } from "./application.service";

const createApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplicationService.createApplication(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Application submitted successfully",
    data: result,
  });
});

const getApplicationsByJobId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ApplicationService.getApplicationsByJobId(
      req.params.jobId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Applications retrieved successfully",
      data: result,
    });
  },
);

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplicationService.getAllApplications();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All applications retrieved successfully",
    data: result,
  });
});

export const ApplicationController = {
  createApplication,
  getApplicationsByJobId,
  getAllApplications,
};
