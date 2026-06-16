import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  patientName: string;
  departmentOrDoctor?: string;
  rating: number;
  comment: string;
  source: "google" | "website";
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
}

const ReviewSchema: Schema = new Schema({
  patientName: { type: String, required: true },
  departmentOrDoctor: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  source: { type: String, enum: ["google", "website"], default: "website" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
