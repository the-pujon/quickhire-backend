import { SortOrder } from "mongoose";
import { IJobFilters } from "./job.interface";
import { Job } from "./job.model";
import { paginetionHelpers } from "../../helpers/paginationHelpers";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Application } from "../Application/application.model";

// Searchable fields for text-based search
const jobSearchableFields = ["title", "company", "location", "description"];

// Filterable fields for exact-match filtering
const jobFilterableFields = ["searchTerm", "category", "location", "type"];

const createJob = async (payload: Record<string, unknown>) => {
  const job = await Job.create(payload);
  return job;
};

const getAllJobs = async (
  filters: IJobFilters,
  paginationOptions: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
  },
) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginetionHelpers.calculatePaginetion(paginationOptions);

  const andConditions: Record<string, unknown>[] = [];

  // Search across multiple fields
  if (searchTerm) {
    andConditions.push({
      $or: jobSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Exact-match filters (category, location, type)
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: { $regex: `^${value}$`, $options: "i" },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Job.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Job.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getJobById = async (id: string) => {
  const job = await Job.findById(id).lean();
  if (!job) {
    throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  }
  return job;
};

const deleteJob = async (id: string) => {
  const job = await Job.findById(id);
  if (!job) {
    throw new AppError(httpStatus.NOT_FOUND, "Job not found");
  }

  // Also delete all applications for this job
  await Application.deleteMany({ jobId: id });
  await Job.findByIdAndDelete(id);

  return job;
};

export const JobService = {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  jobFilterableFields,
};
