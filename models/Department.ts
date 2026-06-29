import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  bannerImage?: string;
  headDoctor?: mongoose.Types.ObjectId;
  shortDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  appointmentCount?: number;
  status: "ACTIVE" | "INACTIVE";
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  bannerImage: { type: String },
  headDoctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
  shortDescription: { type: String },
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: { type: String },
  appointmentCount: { type: Number, default: 0 },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
}, { timestamps: true });

export default mongoose.model<IDepartment>("Department", DepartmentSchema);
