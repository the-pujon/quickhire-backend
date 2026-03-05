import { Schema, model } from "mongoose";
import { IJob, IJobModel, JobCategory, JobType } from "./job.interface";

const jobSchema = new Schema<IJob, IJobModel>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: Object.values(JobCategory),
      index: true,
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: Object.values(JobType),
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for application count
jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
  count: true,
});

// Text index for search
jobSchema.index({ title: "text", company: "text", description: "text" });

export const Job = model<IJob, IJobModel>("Job", jobSchema);
