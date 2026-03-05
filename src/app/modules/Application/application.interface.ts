import { Model, Types } from "mongoose";

export interface IApplication {
  _id?: Types.ObjectId;
  jobId: Types.ObjectId;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IApplicationModel extends Model<IApplication> {}
