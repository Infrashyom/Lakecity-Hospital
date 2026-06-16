import mongoose, { Schema, Document } from "mongoose";

export interface IAnalyticsClick extends Document {
  type: "whatsapp" | "phone";
  sourcePage?: string;
}

const AnalyticsClickSchema: Schema = new Schema({
  type: { type: String, enum: ["whatsapp", "phone"], required: true },
  sourcePage: { type: String },
}, { timestamps: true });

export default mongoose.model<IAnalyticsClick>("AnalyticsClick", AnalyticsClickSchema);
