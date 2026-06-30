import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  patientName: string;
  rating: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  patientName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
