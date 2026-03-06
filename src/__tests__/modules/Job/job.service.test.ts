import httpStatus from "http-status";
import AppError from "../../../app/errors/AppError";
import { JobService } from "../../../app/modules/Job/job.service";
import { Job } from "../../../app/modules/Job/job.model";
import { Application } from "../../../app/modules/Application/application.model";
import { JobCategory, JobType } from "../../../app/modules/Job/job.interface";

jest.mock("../../../app/modules/Job/job.model");
jest.mock("../../../app/modules/Application/application.model");

const mockJobData = {
  _id: "507f1f77bcf86cd799439011",
  title: "Software Engineer",
  company: "Tech Corp",
  location: "New York, USA",
  category: JobCategory.TECHNOLOGY,
  type: JobType.FULL_TIME,
  description: "A great opportunity to build scalable systems.",
  requirements: ["Node.js", "TypeScript", "MongoDB"],
  salary: "$100,000 - $130,000",
};

/** Helper: returns a Mongoose-like chainable query object */
const mockFindQuery = (resolveValue: unknown) => ({
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(resolveValue),
});

describe("JobService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  // createJob
  // ──────────────────────────────────────────────────────────
  describe("createJob", () => {
    it("should create and return a new job", async () => {
      (Job.create as jest.Mock).mockResolvedValue(mockJobData);

      const result = await JobService.createJob(
        mockJobData as Record<string, unknown>,
      );

      expect(Job.create).toHaveBeenCalledWith(mockJobData);
      expect(result).toEqual(mockJobData);
    });
  });

  // ──────────────────────────────────────────────────────────
  // getAllJobs
  // ──────────────────────────────────────────────────────────
  describe("getAllJobs", () => {
    it("should return paginated jobs with meta", async () => {
      (Job.find as jest.Mock).mockReturnValue(mockFindQuery([mockJobData]));
      (Job.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await JobService.getAllJobs({}, { page: 1, limit: 10 });

      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPage: 1,
      });
      expect(result.data).toEqual([mockJobData]);
    });

    it("should use default pagination (page=1, limit=10) when options omitted", async () => {
      (Job.find as jest.Mock).mockReturnValue(mockFindQuery([mockJobData]));
      (Job.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await JobService.getAllJobs({}, {});

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it("should calculate totalPage correctly for multiple pages", async () => {
      (Job.find as jest.Mock).mockReturnValue(
        mockFindQuery(Array(10).fill(mockJobData)),
      );
      (Job.countDocuments as jest.Mock).mockResolvedValue(25);

      const result = await JobService.getAllJobs({}, { page: 1, limit: 10 });

      expect(result.meta.totalPage).toBe(3);
    });

    it("should return empty data when no jobs match", async () => {
      (Job.find as jest.Mock).mockReturnValue(mockFindQuery([]));
      (Job.countDocuments as jest.Mock).mockResolvedValue(0);

      const result = await JobService.getAllJobs({}, {});

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it("should build $or query when searchTerm is provided", async () => {
      (Job.find as jest.Mock).mockReturnValue(mockFindQuery([mockJobData]));
      (Job.countDocuments as jest.Mock).mockResolvedValue(1);

      await JobService.getAllJobs(
        { searchTerm: "engineer" },
        { page: 1, limit: 10 },
      );

      const calledWith = (Job.find as jest.Mock).mock.calls[0][0];
      expect(calledWith).toHaveProperty("$and");
      const orClause = calledWith.$and.find(
        (c: Record<string, unknown>) => "$or" in c,
      );
      expect(orClause).toBeDefined();
      expect(orClause.$or).toHaveLength(4); // title, company, location, description
    });

    it("should build $and filter when category is provided", async () => {
      (Job.find as jest.Mock).mockReturnValue(mockFindQuery([mockJobData]));
      (Job.countDocuments as jest.Mock).mockResolvedValue(1);

      await JobService.getAllJobs(
        { category: "Technology" },
        { page: 1, limit: 10 },
      );

      const calledWith = (Job.find as jest.Mock).mock.calls[0][0];
      expect(calledWith).toHaveProperty("$and");
    });

    it("should apply both searchTerm and filter together", async () => {
      (Job.find as jest.Mock).mockReturnValue(mockFindQuery([mockJobData]));
      (Job.countDocuments as jest.Mock).mockResolvedValue(1);

      await JobService.getAllJobs(
        { searchTerm: "engineer", category: "Technology" },
        { page: 1, limit: 10 },
      );

      const calledWith = (Job.find as jest.Mock).mock.calls[0][0];
      expect(calledWith.$and).toHaveLength(2);
    });

    it("should apply sortBy and sortOrder correctly", async () => {
      const query = mockFindQuery([mockJobData]);
      (Job.find as jest.Mock).mockReturnValue(query);
      (Job.countDocuments as jest.Mock).mockResolvedValue(1);

      await JobService.getAllJobs(
        {},
        { page: 1, limit: 10, sortBy: "title", sortOrder: "asc" },
      );

      expect(query.sort).toHaveBeenCalledWith({ title: "asc" });
    });

    it("should skip correct number of records for page 2", async () => {
      const query = mockFindQuery([mockJobData]);
      (Job.find as jest.Mock).mockReturnValue(query);
      (Job.countDocuments as jest.Mock).mockResolvedValue(20);

      await JobService.getAllJobs({}, { page: 2, limit: 5 });

      expect(query.skip).toHaveBeenCalledWith(5);
      expect(query.limit).toHaveBeenCalledWith(5);
    });

    it("should pass empty query when no filters are set", async () => {
      (Job.find as jest.Mock).mockReturnValue(mockFindQuery([]));
      (Job.countDocuments as jest.Mock).mockResolvedValue(0);

      await JobService.getAllJobs({}, {});

      expect(Job.find).toHaveBeenCalledWith({});
    });
  });

  // ──────────────────────────────────────────────────────────
  // getJobById
  // ──────────────────────────────────────────────────────────
  describe("getJobById", () => {
    it("should return the job when found", async () => {
      (Job.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockJobData),
      });

      const result = await JobService.getJobById("507f1f77bcf86cd799439011");

      expect(Job.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(result).toEqual(mockJobData);
    });

    it("should throw NOT_FOUND when job does not exist", async () => {
      (Job.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        JobService.getJobById("507f1f77bcf86cd799439099"),
      ).rejects.toThrow(new AppError(httpStatus.NOT_FOUND, "Job not found"));
    });
  });

  // ──────────────────────────────────────────────────────────
  // deleteJob
  // ──────────────────────────────────────────────────────────
  describe("deleteJob", () => {
    it("should delete the job and all its applications", async () => {
      (Job.findById as jest.Mock).mockResolvedValue(mockJobData);
      (Application.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 3,
      });
      (Job.findByIdAndDelete as jest.Mock).mockResolvedValue(mockJobData);

      const result = await JobService.deleteJob("507f1f77bcf86cd799439011");

      expect(Job.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(Application.deleteMany).toHaveBeenCalledWith({
        jobId: "507f1f77bcf86cd799439011",
      });
      expect(Job.findByIdAndDelete).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011",
      );
      expect(result).toEqual(mockJobData);
    });

    it("should throw NOT_FOUND when job does not exist", async () => {
      (Job.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        JobService.deleteJob("507f1f77bcf86cd799439099"),
      ).rejects.toThrow(new AppError(httpStatus.NOT_FOUND, "Job not found"));
    });

    it("should not delete applications when job is not found", async () => {
      (Job.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        JobService.deleteJob("507f1f77bcf86cd799439099"),
      ).rejects.toThrow();

      expect(Application.deleteMany).not.toHaveBeenCalled();
      expect(Job.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("should delete job even when it has zero applications", async () => {
      (Job.findById as jest.Mock).mockResolvedValue(mockJobData);
      (Application.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });
      (Job.findByIdAndDelete as jest.Mock).mockResolvedValue(mockJobData);

      const result = await JobService.deleteJob("507f1f77bcf86cd799439011");

      expect(Application.deleteMany).toHaveBeenCalled();
      expect(result).toEqual(mockJobData);
    });
  });
});
