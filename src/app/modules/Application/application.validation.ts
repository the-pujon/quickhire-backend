import { z } from "zod";

const createApplicationValidation = z.object({
  body: z.object({
    jobId: z
      .string({ error: "Job ID is required" })
      .min(1, { message: "Job ID is required" }),
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name must not exceed 100 characters" }),
    email: z.string().email({ message: "Must be a valid email address" }),
    resumeLink: z.string().url({ message: "Resume link must be a valid URL" }),
    coverNote: z
      .string()
      .min(10, { message: "Cover note must be at least 10 characters" })
      .max(2000, { message: "Cover note must not exceed 2000 characters" }),
  }),
});

export const ApplicationValidation = {
  createApplicationValidation,
};
