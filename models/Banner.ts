import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  title: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  order: number;
  isActive: boolean;
}

const BannerSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  desktopImage: { type: String, required: true },
  mobileImage: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IBanner>("Banner", BannerSchema);
