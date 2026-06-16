import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  bannerImage?: string;
  headDoctor?: mongoose.Types.ObjectId;
  shortDescription?: string;
  treatmentsList?: string[];
  faq?: { question: string; answer: string }[];
  seoTitle?: string;
  seoKeywords?: string;
  enquiryCount?: number;
  appointmentCount?: number;
  isActive: boolean;
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  bannerImage: { type: String },
  headDoctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
  shortDescription: { type: String },
  treatmentsList: [{ type: String }],
  faq: [{ question: String, answer: String }],
  seoTitle: { type: String },
  seoKeywords: { type: String },
  enquiryCount: { type: Number, default: 0 },
  appointmentCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IDepartment>("Department", DepartmentSchema);
