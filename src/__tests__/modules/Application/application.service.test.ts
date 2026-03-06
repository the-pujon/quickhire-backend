import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../../app/errors/AppError";
import { ApplicationService } from "../../../app/modules/Application/application.service";
import { Application } from "../../../app/modules/Application/application.model";
import { Job } from "../../../app/modules/Job/job.model";

jest.mock("../../../app/modules/Application/application.model");
jest.mock("../../../app/modules/Job/job.model");

const mockJobId = new Types.ObjectId("507f1f77bcf86cd799439011");

const mockJobData = {
  _id: mockJobId,
  title: "Software Engineer",
  company: "Tech Corp",
  location: "New York, USA",
};

const mockPayload = {
  jobId: mockJobId.toString(),
  name: "John Doe",
  email: "john@example.com",
  resumeLink: "https://example.com/john-resume.pdf",
  coverNote:
    "I am very excited about this opportunity and believe I am a great fit.",
};

const mockApplicationData = {
  _id: new Types.ObjectId(),
  ...mockPayload,
  jobId: mockJobId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ApplicationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  // createApplication
  // ──────────────────────────────────────────────────────────
  describe("createApplication", () => {
    it("should create an application successfully", async () => {
      (Job.findById as jest.Mock).mockResolvedValue(mockJobData);
      (Application.findOne as jest.Mock).mockResolvedValue(null);
      (Application.create as jest.Mock).mockResolvedValue(mockApplicationData);

      const result = await ApplicationService.createApplication(mockPayload);

      expect(Job.findById).toHaveBeenCalledWith(mockPayload.jobId);
      expect(Application.findOne).toHaveBeenCalledWith({
        jobId: mockPayload.jobId,
        email: mockPayload.email,
      });
      expect(Application.create).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual(mockApplicationData);
    });

    it("should throw NOT_FOUND when job does not exist", async () => {
      (Job.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ApplicationService.createApplication(mockPayload),
      ).rejects.toThrow(new AppError(httpStatus.NOT_FOUND, "Job not found"));

      expect(Application.findOne).not.toHaveBeenCalled();
      expect(Application.create).not.toHaveBeenCalled();
    });

    it("should throw CONFLICT when applicant has already applied for the job", async () => {
      (Job.findById as jest.Mock).mockResolvedValue(mockJobData);
      (Application.findOne as jest.Mock).mockResolvedValue(mockApplicationData);

      await expect(
        ApplicationService.createApplication(mockPayload),
      ).rejects.toThrow(
        new AppError(
          httpStatus.CONFLICT,
          "You have already applied for this job",
        ),
      );

      expect(Application.create).not.toHaveBeenCalled();
    });

    it("should allow different applicants to apply for the same job", async () => {
      const anotherPayload = { ...mockPayload, email: "jane@example.com" };

      (Job.findById as jest.Mock).mockResolvedValue(mockJobData);
      (Application.findOne as jest.Mock).mockResolvedValue(null);
      (Application.create as jest.Mock).mockResolvedValue({
        ...mockApplicationData,
        email: "jane@example.com",
      });

      const result = await ApplicationService.createApplication(anotherPayload);

      expect(Application.create).toHaveBeenCalledWith(anotherPayload);
      expect(result.email).toBe("jane@example.com");
    });

    it("should allow the same applicant to apply for different jobs", async () => {
      const anotherJobId = new Types.ObjectId().toString();
      const anotherPayload = { ...mockPayload, jobId: anotherJobId };

      (Job.findById as jest.Mock).mockResolvedValue(mockJobData);
      (Application.findOne as jest.Mock).mockResolvedValue(null);
      (Application.create as jest.Mock).mockResolvedValue({
        ...mockApplicationData,
        jobId: new Types.ObjectId(anotherJobId),
      });

      const result = await ApplicationService.createApplication(anotherPayload);

      expect(Application.findOne).toHaveBeenCalledWith({
        jobId: anotherJobId,
        email: mockPayload.email,
      });
      expect(Application.create).toHaveBeenCalledWith(anotherPayload);
    });
  });

  // ──────────────────────────────────────────────────────────
  // getApplicationsByJobId
  // ──────────────────────────────────────────────────────────
  describe("getApplicationsByJobId", () => {
    const buildFindQuery = (resolveValue: unknown) => ({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(resolveValue),
    });

    it("should return all applications for a given job", async () => {
      const mockQuery = buildFindQuery([mockApplicationData]);
      (Application.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await ApplicationService.getApplicationsByJobId(
        mockJobId.toString(),
      );

      expect(Application.find).toHaveBeenCalledWith({
        jobId: mockJobId.toString(),
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual([mockApplicationData]);
    });

    it("should return empty array when no applications exist for the job", async () => {
      const mockQuery = buildFindQuery([]);
      (Application.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await ApplicationService.getApplicationsByJobId(
        mockJobId.toString(),
      );

      expect(result).toEqual([]);
    });

    it("should return multiple applications sorted by newest first", async () => {
      const olderApp = {
        ...mockApplicationData,
        _id: new Types.ObjectId(),
        createdAt: new Date("2025-01-01"),
      };
      const newerApp = {
        ...mockApplicationData,
        _id: new Types.ObjectId(),
        createdAt: new Date("2025-06-01"),
      };
      const mockQuery = buildFindQuery([newerApp, olderApp]);
      (Application.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await ApplicationService.getApplicationsByJobId(
        mockJobId.toString(),
      );

      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toHaveLength(2);
      // Ordering is delegated to the DB via sort({ createdAt: -1 })
      expect(result[0]!._id.toString()).toBe(newerApp._id.toString());
    });
  });

  // ──────────────────────────────────────────────────────────
  // getAllApplications
  // ──────────────────────────────────────────────────────────
  describe("getAllApplications", () => {
    const buildFindQuery = (resolveValue: unknown) => ({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(resolveValue),
    });

    it("should return all applications with populated job details", async () => {
      const populatedApp = {
        ...mockApplicationData,
        jobId: mockJobData, // populated job object
      };
      const mockQuery = buildFindQuery([populatedApp]);
      (Application.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await ApplicationService.getAllApplications();

      expect(Application.find).toHaveBeenCalledWith();
      expect(mockQuery.populate).toHaveBeenCalledWith(
        "jobId",
        "title company location",
      );
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual([populatedApp]);
    });

    it("should return empty array when no applications exist", async () => {
      const mockQuery = buildFindQuery([]);
      (Application.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await ApplicationService.getAllApplications();

      expect(result).toEqual([]);
    });

    it("should return multiple applications sorted by newest first", async () => {
      const app1 = {
        ...mockApplicationData,
        _id: new Types.ObjectId(),
        createdAt: new Date("2025-01-01"),
      };
      const app2 = {
        ...mockApplicationData,
        _id: new Types.ObjectId(),
        createdAt: new Date("2025-06-01"),
      };
      const mockQuery = buildFindQuery([app2, app1]);
      (Application.find as jest.Mock).mockReturnValue(mockQuery);

      const result = await ApplicationService.getAllApplications();

      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toHaveLength(2);
    });

    it("should always call populate with correct fields", async () => {
      const mockQuery = buildFindQuery([]);
      (Application.find as jest.Mock).mockReturnValue(mockQuery);

      await ApplicationService.getAllApplications();

      expect(mockQuery.populate).toHaveBeenCalledWith(
        "jobId",
        "title company location",
      );
    });
  });
});
