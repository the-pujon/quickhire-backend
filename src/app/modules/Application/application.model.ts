import { Schema, model } from "mongoose";
import { IApplication, IApplicationModel } from "./application.interface";

const applicationSchema = new Schema<IApplication, IApplicationModel>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    resumeLink: {
      type: String,
      required: [true, "Resume link is required"],
      trim: true,
    },
    coverNote: {
      type: String,
      required: [true, "Cover note is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Populate job details when querying
applicationSchema.virtual("job", {
  ref: "Job",
  localField: "jobId",
  foreignField: "_id",
  justOne: true,
});

export const Application = model<IApplication, IApplicationModel>(
  "Application",
  applicationSchema,
);
