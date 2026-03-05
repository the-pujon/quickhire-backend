import { Model, Types } from "mongoose";

export enum JobCategory {
  TECHNOLOGY = "Technology",
  MARKETING = "Marketing",
  DESIGN = "Design",
  BUSINESS = "Business",
  FINANCE = "Finance",
  HUMAN_RESOURCE = "Human Resource",
  ENGINEERING = "Engineering",
  SALES = "Sales",
}

export enum JobType {
  FULL_TIME = "Full-Time",
  PART_TIME = "Part-Time",
  CONTRACT = "Contract",
  INTERNSHIP = "Internship",
  REMOTE = "Remote",
}

export interface IJob {
  _id?: Types.ObjectId;
  title: string;
  company: string;
  location: string;
  category: JobCategory;
  type: JobType;
  description: string;
  requirements: string[];
  salary?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJobModel extends Model<IJob> {}

export interface IJobFilters {
  searchTerm?: string;
  category?: string;
  location?: string;
  type?: string;
}
