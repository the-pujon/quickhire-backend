import { z } from "zod";
import { JobCategory, JobType } from "./job.interface";

const createJobValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(200, { message: "Title must not exceed 200 characters" }),
    company: z
      .string()
      .min(2, { message: "Company must be at least 2 characters" })
      .max(100, { message: "Company must not exceed 100 characters" }),
    location: z
      .string()
      .min(2, { message: "Location must be at least 2 characters" }),
    category: z.enum(Object.values(JobCategory) as [string, ...string[]], {
      message: "Invalid category",
    }),
    type: z.enum(Object.values(JobType) as [string, ...string[]], {
      message: "Invalid job type",
    }),
    description: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" }),
    requirements: z.array(z.string()).optional().default([]),
    salary: z.string().optional(),
  }),
});

export const JobValidation = {
  createJobValidation,
};
